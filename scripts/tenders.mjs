#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import {createHash,randomUUID} from 'node:crypto';
import {pathToFileURL} from 'node:url';
import {getDb,REPO_ROOT} from './lib/db.mjs';
import {table} from './lib/format.mjs';
import {parseCsv} from './lib/csv.mjs';
import {page,table as htmlTable,writeOut} from './lib/render.mjs';

export const specs={
 bids:[], 'bid-triage':[], requirements:[], library:[], 'review-queue':[], 'response-queue':[],
 'submission-readiness':[], workload:[], 'reuse-impact':[], 'missing-sources':[], 'overdue-questions':[],
 'unassigned-questions':[], attention:[], compliance:[], activity:[],
 bid:['bid'], question:['question'], entry:['entry'], search:['text'], 'weekly-review':[],
 'add-bid':['name','customer','owner','due','privacy-review','retention','actor'],
 'add-question':['bid','question','section','owner','due','actor'],
 assign:['question','owner','due','actor'],
 answer:['question','answer','source','actor'],
 'approve-answer':['question','actor'],
 'add-entry':['title','question','answer','category','owner','source','review-due','actor'],
 'revise-entry':['entry','answer','source','review-due','actor'],
 'approve-entry':['entry','actor'],
 'use-library':['question','entry','actor'],
 'review-data':['bid','privacy-review','retention','actor'],
 'record-submission':['bid','receipt','actor'],
 'record-outcome':['bid','outcome','note','actor'],
 log:['bid','note','actor'],
 'draft-response':['bid'], 'draft-follow-up':['bid'],
 import:['bid','file','actor','question-column','answer-column','section-column','id-column','dry-run'],
 export:['file'], help:[]
};
export function parseArgs(args){
 const [cmd='help',...rest]=args; if(!specs[cmd])throw Error(`Unknown command ${cmd}; use help`);
 const o={},pos=[];
 for(let i=0;i<rest.length;i++){
  const s=rest[i];if(!s.startsWith('--')){pos.push(s);continue;}
  const at=s.indexOf('=');const k=s.slice(2,at<0?undefined:at);
  if(![...specs[cmd],'json'].includes(k))throw Error(`Unknown flag --${k} for ${cmd}`);
  if(k in o)throw Error(`Duplicate flag --${k}`);
  if(['json','dry-run'].includes(k)){if(at>=0)throw Error(`--${k} is a switch without a value`);o[k]=true;}
  else {const v=at>=0?s.slice(at+1):rest[++i];if(v===undefined||v.startsWith('--'))throw Error(`Required value --${k}`);o[k]=v;}
 }
 if(pos.length&&(cmd!=='import'||pos.length!==1||pos[0]!=='autorfp'))throw Error('Only import autorfp accepts a positional argument');
 if(cmd==='import'&&pos[0]!=='autorfp')throw Error('Use import autorfp');
 return {cmd,o};
}
const req=(o,k)=>{if(typeof o[k]!=='string'||!o[k].trim())throw Error(`Required --${k}`);return o[k].trim();};
const date=(s)=>{if(!/^\d{4}-\d{2}-\d{2}$/.test(s)||Number.isNaN(Date.parse(s))||new Date(s).toISOString().slice(0,10)!==s)throw Error('Use a real YYYY-MM-DD date');return s;};
const tables={bids:'name',requirements:'question',library:'title'};
async function resolve(db,t,value){
 const label=tables[t];if(!label)throw Error('Unsupported lookup');
 const rows=await db.query(`select * from ${t} where lower(${label})=lower($1) or id::text=$1 order by ${label},id`,[value]);
 const found=rows.length?rows:await db.query(`select * from ${t} where strpos(lower(${label}),lower($1))>0 or starts_with(id::text,lower($1)) order by ${label},id`,[value]);
 if(found.length!==1)throw Error(`${t}: ${found.length?'ambiguous':'no match'}. Candidates: ${found.map(r=>`${r.id} ${r[label]}`).join('; ')||'(none)'}`);
 // Writes all run inside one transaction, and lock their selected record.
 return (await db.query(`select * from ${t} where id=$1 for update`,[found[0].id]))[0];
}
async function audit(db,entity,before,after,action,actor,note=''){
 await db.query('insert into activity(entity,entity_id,action,actor,before_data,after_data,note) values($1,$2,$3,$4,$5::jsonb,$6::jsonb,$7)',[entity,(after||before).id,action,actor,before?JSON.stringify(before):null,after?JSON.stringify(after):null,note]);
}
async function patch(db,t,before,fields,action,actor,note=''){
 const keys=Object.keys(fields),params=Object.values(fields);params.push(before.id);
 const [after]=await db.query(`update ${t} set ${keys.map((k,i)=>`${k}=$${i+1}`).join(',')} where id=$${params.length} returning *`,params);
 await audit(db,t,before,after,action,actor,note);return [after];
}
async function insert(db,t,fields,actor){
 const keys=Object.keys(fields);const [r]=await db.query(`insert into ${t}(${keys.join(',')}) values(${keys.map((_,i)=>`$${i+1}`).join(',')}) returning *`,Object.values(fields));
 await audit(db,t,null,r,'add',actor);return [r];
}
async function openBid(db,id){const [b]=await db.query('select * from bids where id=$1 for update',[id]);if(!b||b.status!=='open')throw Error('Bid is not open');return b;}
async function freshLibrary(db,l){const [ok]=await db.query('select $1::date >= current_date as fresh',[l.review_due]);if(!l.approved_by||!ok.fresh)throw Error('Library entry needs current independent approval and an unexpired review date');}
const cleared={approved_by:null,approved_at:null};

const reads={
 bids:'select id,name,customer,owner,due,status from bids order by due,name',
 'bid-triage':'select name,customer,owner,due,questions,blocked,decision from bid_readiness where status=\'open\' order by due,name',
 requirements:'select id,bid,section,question,owner,state from response_queue order by bid,section,question',
 library:'select id,title,category,owner,version,review_due,approved_by from library order by title',
 'review-queue':'select title,owner,version,review_due,reason from review_queue order by review_due,title',
 'response-queue':"select bid,question,owner,due,state from response_queue where state<>'approved' order by due,question",
 'submission-readiness':'select name,due,status,questions,approved,blocked,decision from bid_readiness order by due,name',
 workload:'select * from workload order by unfinished desc,owner',
 'reuse-impact':"select l.title,q.bid,q.question,q.library_version,l.version as current_version,q.state from response_queue q join library l on l.id=q.library_id order by l.title,q.bid",
 'missing-sources':"select bid,question,owner from response_queue where trim(source)='' order by bid,question",
 'overdue-questions':"select q.bid,q.question,q.owner,q.due,q.state from response_queue q join bids b on b.id=q.bid_id where b.status='open' and q.state<>'approved' and q.due<current_date order by q.due",
 'unassigned-questions':"select bid,question,due,state from response_queue where trim(owner)='' order by due",
 activity:'select entity,entity_id,action,actor,note,created_at from activity order by created_at,id'
};
async function compliance(db){return db.query(`
 select 'IPP9-review' as rule,name as item,'Review contact-data purpose and retention' as action from bids where trim(retention_note)='' or privacy_review_due<current_date
 union all select 'INTERNAL-response-evidence',bid||': '||question,'Record a source and review the answer' from response_queue where state in ('missing source','unanswered')
 union all select 'INTERNAL-library-review',title,'Review accuracy and approve the current answer' from review_queue
 order by rule,item`);}
async function attention(db){return db.query(`
 select 'late bid' as reason,name as item,owner,due from bids where status='open' and due<current_date
 union all select 'overdue response',q.bid||': '||q.question,q.owner,q.due from response_queue q join bids b on b.id=q.bid_id where b.status='open' and q.state<>'approved' and q.due<current_date
 union all select 'library review',title,owner,review_due from review_queue order by due,item`);}
async function executeInner(db,cmd,o){
 if(reads[cmd])return db.query(reads[cmd]);
 if(cmd==='help')return Object.entries(specs).map(([command,flags])=>({command,flags:flags.map(x=>`--${x}`).join(' ')}));
 if(cmd==='compliance')return compliance(db);
 if(cmd==='attention')return attention(db);
 if(cmd==='weekly-review')return {readiness:await db.query(reads['bid-triage']),attention:await attention(db),workload:await db.query(reads.workload)};
 if(cmd==='search'){const text=req(o,'text');return db.query("select id,title,question,answer,approved_by,review_due from library where strpos(lower(title||' '||question||' '||answer),lower($1))>0 order by title",[text]);}
 if(['bid','question','entry'].includes(cmd)){
  const t={bid:'bids',question:'requirements',entry:'library'}[cmd],r=await resolve(db,t,req(o,cmd));
  return {record:r,history:await db.query('select * from activity where entity_id=$1 order by created_at,id',[r.id]),...(cmd==='bid'?{questions:await db.query('select * from response_queue where bid_id=$1 order by section,question',[r.id])}:{})};
 }
 if(cmd==='export'){
  const out={format:'tender-responses-v1',exported_at:new Date().toISOString()};
  for(const t of ['bids','library','requirements','activity'])out[t]=await db.query(`select * from ${t} order by id`);
  const f=path.resolve(req(o,'file'));fs.mkdirSync(path.dirname(f),{recursive:true});fs.writeFileSync(f,JSON.stringify(out,null,2)+'\n',{flag:'wx',mode:0o600});return [{file:f,...Object.fromEntries(['bids','library','requirements','activity'].map(t=>[t,out[t].length]))}];
 }
 if(cmd.startsWith('draft-')){
  const b=await resolve(db,'bids',req(o,'bid'));const readiness=await db.query('select * from bid_readiness where id=$1',[b.id]);
  const rows=await db.query(`select section,question,owner,answer,source,state from response_queue where bid_id=$1 ${cmd==='draft-follow-up'?"and state<>'approved'":''} order by section,question`,[b.id]);
  const file=writeOut('drafts',`${cmd}-${b.id}-${randomUUID()}`,page({title:cmd==='draft-response'?'DRAFT tender response':'DRAFT reviewer follow-up',subtitle:b.name,sections:[{title:'Human review required',note:'This draft has not been submitted. Verify the customer format, permissions and every claim before sharing.',html:htmlTable(readiness)},{title:'Responses',html:htmlTable(rows)}]}));return [{file}];
 }
 const actor=req(o,'actor');
 if(cmd==='add-bid')return insert(db,'bids',{name:req(o,'name'),customer:req(o,'customer'),owner:req(o,'owner'),due:date(req(o,'due')),privacy_review_due:date(req(o,'privacy-review')),retention_note:req(o,'retention')},actor);
 if(cmd==='add-entry')return insert(db,'library',{title:req(o,'title'),question:req(o,'question'),answer:req(o,'answer'),category:o.category||'',owner:req(o,'owner'),source:req(o,'source'),review_due:date(req(o,'review-due')),author:actor},actor);
 if(['revise-entry','approve-entry'].includes(cmd)){
  const l=await resolve(db,'library',req(o,'entry'));
  if(cmd==='revise-entry')return patch(db,'library',l,{answer:req(o,'answer'),source:req(o,'source'),review_due:date(req(o,'review-due')),version:l.version+1,author:actor,...cleared},cmd,actor);
  if(actor.toLowerCase()===l.author.toLowerCase())throw Error('An independent reviewer must approve');
  if(!l.answer.trim()||!l.source.trim())throw Error('Answer and evidence source required');
  const [fresh]=await db.query('select $1::date>=current_date as ok',[l.review_due]);if(!fresh.ok)throw Error('Review date expired');
  return patch(db,'library',l,{approved_by:actor,approved_at:new Date().toISOString()},cmd,actor);
 }
 if(['assign','answer','approve-answer','use-library'].includes(cmd)){
  const r=await resolve(db,'requirements',req(o,'question'));await openBid(db,r.bid_id);
  if(cmd==='assign')return patch(db,'requirements',r,{owner:req(o,'owner'),due:date(req(o,'due'))},cmd,actor);
  if(cmd==='answer')return patch(db,'requirements',r,{answer:req(o,'answer'),source:req(o,'source'),author:actor,version:r.version+1,library_id:null,library_version:null,...cleared},cmd,actor);
  if(cmd==='use-library'){
   const l=await resolve(db,'library',req(o,'entry'));await freshLibrary(db,l);
   return patch(db,'requirements',r,{answer:l.answer,source:l.source,author:actor,version:r.version+1,library_id:l.id,library_version:l.version,...cleared},cmd,actor);
  }
  if(!r.answer.trim()||!r.source.trim())throw Error('Answer and evidence source required');
  if(actor.toLowerCase()===r.author.toLowerCase())throw Error('An independent reviewer must approve');
  if(r.library_id){const l=await resolve(db,'library',r.library_id);await freshLibrary(db,l);if(l.version!==r.library_version)throw Error('Refresh the changed library answer first');}
  return patch(db,'requirements',r,{approved_by:actor,approved_at:new Date().toISOString()},cmd,actor);
 }
 const b=await resolve(db,'bids',req(o,'bid'));
 if(cmd==='record-outcome'){
  const outcome=req(o,'outcome');if(!['won','lost','no-bid'].includes(outcome))throw Error('Outcome must be won, lost or no-bid');
  if(outcome==='no-bid'?b.status!=='open':b.status!=='submitted')throw Error('No-bid needs an open bid; won/lost needs a recorded submission');
  return patch(db,'bids',b,{status:outcome,decision_note:req(o,'note')},cmd,actor);
 }
 if(cmd==='review-data')return patch(db,'bids',b,{privacy_review_due:date(req(o,'privacy-review')),retention_note:req(o,'retention')},cmd,actor);
 if(cmd==='log'){await audit(db,'bids',b,b,'log',actor,req(o,'note'));return [{logged:true,bid:b.name}];}
 await openBid(db,b.id);
 if(cmd==='add-question')return insert(db,'requirements',{bid_id:b.id,question:req(o,'question'),section:o.section||'',owner:req(o,'owner'),due:date(req(o,'due'))},actor);
 if(cmd==='record-submission'){
  const [r]=await db.query('select * from bid_readiness where id=$1',[b.id]);if(r.decision!=='ready for human review')throw Error(`Submission record refused: ${r.decision}`);
  return patch(db,'bids',b,{status:'submitted',receipt:req(o,'receipt')},cmd,actor,'Operator records an external submission; this command sends nothing');
 }
 if(cmd==='import')return importCsv(db,b,o,actor);
 throw Error(`Unimplemented ${cmd}`);
}
async function importCsv(db,b,o,actor){
 const rows=parseCsv(fs.readFileSync(req(o,'file'),'utf8'));if(!rows.length)throw Error('CSV contains no records');
 const headers=Object.keys(rows[0]);
 const column=(flag,def,optional=false)=>{const want=o[flag]||def;const key=headers.find(h=>h.toLowerCase()===want.toLowerCase());if(!key&&(!optional||o[flag]))throw Error(`Missing column ${want}; use --${flag} to map it`);return key;};
 const qc=column('question-column','Requirement'),ac=column('answer-column','Response'),sc=column('section-column','Section',true),ic=o['id-column']?column('id-column','ID'):null;
 const seen=new Set();let inserted=0,updated=0,unchanged=0;
 for(const [i,row] of rows.entries()){
  const question=row[qc].trim();if(!question)throw Error(`Row ${i+2}: empty requirement`);
  const section=sc?row[sc].trim():'';
  const key=ic?row[ic].trim():createHash('sha256').update(JSON.stringify([section,question])).digest('hex');
  if(!key||seen.has(key))throw Error(`Row ${i+2}: missing or duplicate import identity`);seen.add(key);
  const [old]=await db.query('select * from requirements where bid_id=$1 and external_key=$2 for update',[b.id,key]);
  const data={bid_id:b.id,external_key:key,section,question,answer:row[ac],source_data:row};
  if(old&&old.section===section&&old.question===question&&old.answer===row[ac]&&JSON.stringify(old.source_data)===JSON.stringify(row)){unchanged++;continue;}
  // JSONB sorts keys, so compare original columns independent of key order.
  if(old&&old.section===section&&old.question===question&&old.answer===row[ac]&&Object.keys(row).length===Object.keys(old.source_data).length&&Object.entries(row).every(([k,v])=>old.source_data[k]===v)){unchanged++;continue;}
  if(old){await patch(db,'requirements',old,{...data,source_data:JSON.stringify(row),source:'',author:actor,version:old.version+1,library_id:null,library_version:null,...cleared},'import-update',actor);updated++;}
  else{await insert(db,'requirements',{...data,source_data:JSON.stringify(row),owner:b.owner,due:b.due,author:actor},actor);inserted++;}
 }
 return [{rows:rows.length,inserted,updated,unchanged,dry_run:Boolean(o['dry-run']),approval:'Imported answers require a source and local review'}];
}
export async function execute(db,args){
 const {cmd,o}=parseArgs(args);await db.exec('begin');
 try{const result=await executeInner(db,cmd,o);await db.exec(o['dry-run']?'rollback':'commit');return result;}
 catch(e){await db.exec('rollback');throw e;}
}
export function format(result){
 if(Array.isArray(result)){if(!result.length)return '  (none)';return table(result,Object.keys(result[0]).map(key=>({key,label:key,width:['answer','question','item','note'].includes(key)?72:undefined,format:v=>typeof v==='object'?JSON.stringify(v):String(v??'')})));}
 return Object.entries(result).map(([k,v])=>`${k}\n${Array.isArray(v)?format(v):JSON.stringify(v,null,2)}`).join('\n\n');
}
if(process.argv[1]&&import.meta.url===pathToFileURL(path.resolve(process.argv[1])).href){
 let db;try{const args=process.argv.slice(2);parseArgs(args);db=await getDb();const result=await execute(db,args);console.log(args.includes('--json')?JSON.stringify(result,null,2):format(result));}
 catch(e){console.error(e.message);process.exitCode=1;}finally{if(db)await db.close();}
}

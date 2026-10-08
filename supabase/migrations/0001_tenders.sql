create function touch_updated() returns trigger language plpgsql as $$ begin new.updated_at=now(); return new; end $$;
create function immutable_record() returns trigger language plpgsql as $$ begin raise exception 'History is append-only'; end $$;
create table bids (
 id uuid primary key default gen_random_uuid(), name text not null check(length(trim(name))>0), customer text not null, owner text not null,
 due date not null, status text not null default 'open' check(status in ('open','submitted','won','lost','no-bid')),
 retention_note text not null default '', privacy_review_due date not null, decision_note text not null default '', receipt text,
 created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table library (
 id uuid primary key default gen_random_uuid(), title text not null, question text not null, answer text not null, category text not null default '',
 owner text not null, source text not null, review_due date not null, version integer not null default 1 check(version>0),
 author text not null, approved_by text, approved_at timestamptz,
 created_at timestamptz not null default now(), updated_at timestamptz not null default now(),
 check(approved_by is null or (approved_by<>author and length(trim(answer))>0 and length(trim(source))>0))
);
create table requirements (
 id uuid primary key default gen_random_uuid(), bid_id uuid not null references bids(id), external_key text,
 section text not null default '', question text not null check(length(trim(question))>0), owner text not null default '',
 due date not null, answer text not null default '', source text not null default '', author text not null default '',
 version integer not null default 1 check(version>0), approved_by text, approved_at timestamptz,
 library_id uuid references library(id), library_version integer, source_data jsonb not null default '{}',
 created_at timestamptz not null default now(), updated_at timestamptz not null default now(), unique(bid_id,external_key),
 check(approved_by is null or (approved_by<>author and length(trim(answer))>0 and length(trim(source))>0))
);
create table activity (
 id uuid primary key default gen_random_uuid(), entity text not null, entity_id uuid not null,
 action text not null, actor text not null, before_data jsonb, after_data jsonb, note text not null default '',
 created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create trigger activity_immutable before update or delete on activity for each row execute function immutable_record();
do $$ declare t text; begin foreach t in array array['bids','library','requirements'] loop
 execute format('create trigger touch before update on %I for each row execute function touch_updated()',t);
 end loop;
 foreach t in array array['bids','library','requirements','activity'] loop
 execute format('alter table %I enable row level security',t); execute format('revoke all on %I from public',t);
 end loop; end $$;
create index requirements_bid on requirements(bid_id);
create index activity_entity on activity(entity_id,created_at);
create view response_queue as
 select r.id,r.bid_id,b.name as bid,r.section,r.question,r.owner,r.due,r.version,
 case when trim(r.answer)='' then 'unanswered' when trim(r.source)='' then 'missing source'
 when r.library_id is not null and (l.version<>r.library_version or l.approved_by is null or l.review_due<current_date) then 'stale library'
 when r.approved_by is null then 'needs approval' else 'approved' end as state,
 r.answer,r.source,r.approved_by,r.library_id,r.library_version
 from requirements r join bids b on b.id=r.bid_id left join library l on l.id=r.library_id;
create view bid_readiness as
 select b.id,b.name,b.customer,b.owner,b.due,b.status,count(q.id)::int as questions,
 count(q.id) filter(where q.state='approved')::int as approved,
 count(q.id) filter(where q.state<>'approved')::int as blocked,
 case when count(q.id)=0 then 'hold: no questions'
 when count(q.id) filter(where q.state<>'approved')>0 then 'hold: responses'
 when trim(b.retention_note)='' or b.privacy_review_due<current_date then 'hold: privacy review'
 else 'ready for human review' end as decision
 from bids b left join response_queue q on q.bid_id=b.id group by b.id;
create view review_queue as
 select id,title,owner,version,review_due,case when approved_by is null then 'unapproved' else 'expired review' end as reason
 from library where approved_by is null or review_due<current_date;
create view workload as
 select q.owner,count(*)::int as unfinished,count(*) filter(where q.due<current_date)::int as overdue
 from response_queue q join bids b on b.id=q.bid_id where b.status='open' and q.state<>'approved' group by q.owner;
revoke all on response_queue,bid_readiness,review_queue,workload from public;

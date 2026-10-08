insert into bids(id,name,customer,owner,due,privacy_review_due,retention_note) values
 ('10000000-0000-0000-0000-000000000001','Harbour support tender','Fictional Harbour Cooperative','Mere',current_date+7,current_date+90,'Review bid contact details after the procurement ends'),
 ('10000000-0000-0000-0000-000000000002','Hill regional questionnaire','Fictional Hill Services','Ari',current_date-2,current_date-1,'') on conflict do nothing;
insert into library(id,title,question,answer,category,owner,source,review_due,author,approved_by,approved_at) values
 ('20000000-0000-0000-0000-000000000001','Service hours','When is support available?','Weekday support is staffed from 8am to 6pm NZ time.','Service','Mere','demo:service-handbook-v3',current_date+90,'Ari','Mere',now()),
 ('20000000-0000-0000-0000-000000000002','Recovery procedure','How are recovery exercises recorded?','Quarterly exercises have a dated record and an owner.','Continuity','Ari','demo:exercise-register',current_date-14,'Mere','Ari',now()),
 ('20000000-0000-0000-0000-000000000003','Reference permission','May the reference customer be contacted?','Permission must be recorded before contact details are shared.','Privacy','Mere','demo:reference-policy',current_date+30,'Ari',null,null) on conflict do nothing;
insert into requirements(id,bid_id,section,question,owner,due,answer,source,author,approved_by,approved_at,library_id,library_version) values
 ('30000000-0000-0000-0000-000000000001','10000000-0000-0000-0000-000000000001','Support','When is support available?','Ari',current_date+3,'Weekday support is staffed from 8am to 6pm NZ time.','demo:service-handbook-v3','Ari','Mere',now(),'20000000-0000-0000-0000-000000000001',1),
 ('30000000-0000-0000-0000-000000000002','10000000-0000-0000-0000-000000000001','Continuity','How are recovery exercises recorded?','Mere',current_date-1,'Quarterly exercises have a dated record and an owner.','demo:exercise-register','Mere','Ari',now(),'20000000-0000-0000-0000-000000000002',1),
 ('30000000-0000-0000-0000-000000000003','10000000-0000-0000-0000-000000000001','Privacy','Who approves sharing a customer reference?','Ari',current_date+2,'','','',null,null,null,null),
 ('30000000-0000-0000-0000-000000000004','10000000-0000-0000-0000-000000000002','Implementation','Who owns the transition plan?','',current_date-3,'','','',null,null,null,null) on conflict do nothing;

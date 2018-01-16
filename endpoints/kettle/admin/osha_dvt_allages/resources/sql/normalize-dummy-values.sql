
-- EU as Country
insert into Country(Id, Description,Leader) values ('EU','European Union',0);

-- Link from DB system
UPDATE Factors SET Factor = concat(Factor, " <a ui-sref=\'approaches-map\' id=\'approaches-map\' href=\'#/approaches-map\'>Approaches map</a>") where Factors.Id = 6;

DROP TABLE IF EXISTS `Fact_table1`;
create table Fact_table1 as (

select

-- Dimensions

-- country
c.Id as CountryId,
c.Description as Country,
c.leader,

-- approach
a.Id as approachId,
a.approach,

-- Year
ff.Y as Year,

-- Gender
ff.Criteria as Criteria,
ff.YSelected as YSelected,

-- factor
f.Id as factorId,
f.Factor as factor,

-- PSP
p.id as PSPId,
p.PSP as PSP,

-- Indicator
i.Id as indicatorId,
i.Indicator,

-- Measures
ff.Measure as Value

from Country c
 LEFT JOIN FactsFigures ff ON c.Id=ff.Country -- OK
 LEFT JOIN Indicators i ON ff.ID=i.Id -- OK
 LEFT JOIN Approach a on c.ApproachID = a.id -- OK
 LEFT JOIN Factors f on  a.id = f.ApproachID -- Factors sin informar
 LEFT JOIN PSP p on c.id = p.CountryID -- RO OK
)
;

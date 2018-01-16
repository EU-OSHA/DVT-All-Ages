-- =========================================
--  Database
-- =========================================
drop database IF EXISTS osha_dvt_allages;
create database osha_dvt_allages character set "utf8";
use osha_dvt_allages;

-- =========================================
--  Tables
-- =========================================
DROP TABLE IF EXISTS `Approach`;
CREATE TABLE `Approach`
 (
    `Id`            int,
    `Approach`            varchar (510),
    `ShortD`            text (255),
    `LongD`            text (255),
    `Type`            varchar (510)
);

DROP TABLE IF EXISTS `Country`;
CREATE TABLE `Country`
 (
    `Id`            varchar (510),
    `Description`   varchar (510),
    `ApproachID`     int,
    `Leader`         char NOT NULL,
    `Ch1`            text (255),
    `Ch2`            text (255),
    `Ch3`            text (255),
    `Ch4`            text (255),
    `Ch5`            text (255),
    `Ci1`            text (255),
    `Ci2`            text (255),
    `Ci3`            text (255),
    `Ci4`            text (255),
    `Ci5`            text (255),
    `SS`             text (255),
    `OSHwiki`	     text(255),
    `Report`	     text(255)
);

DROP TABLE IF EXISTS `Factors`;
CREATE TABLE `Factors`
 (
    `Id`            int,
    `ApproachID`            int,
    `Factor`            varchar (1024),
    `FactorBlock`            varchar (510),
    `ShortD`            text (255),
    `LongD`            text (255),
    `IndicatorID`            int,
    `Driver`            char NOT NULL,
    `Result`            char NOT NULL
);

DROP TABLE IF EXISTS `FactsFigures`;
CREATE TABLE `FactsFigures`
 (
    `ID`            int,
    `Y`             int,
    `Criteria`      varchar (510),
    `YSelected`     char NOT NULL default 0,
    `EU`            float,
    `BE`            float,
    `BG`            float,
    `CZ`            float,
    `DK`            float,
    `DE`            float,
    `EE`            float,
    `IE`            float,
    `GR`            float,
    `ES`            float,
    `FR`            float,
    `HR`            float,
    `IT`            float,
    `CY`            float,
    `LV`            float,
    `LT`            float,
    `LU`            float,
    `HU`            float,
    `MT`            float,
    `NL`            float,
    `AT`            float,
    `PL`            float,
    `PT`            float,
    `RO`            float,
    `SI`            float,
    `SK`            float,
    `FI`            float,
    `SE`            float,
    `GB`            float,
    `IS`            float,
    `NO`            float,
    `CH`            float,
    ShortCriteria   varchar(255)
);

DROP TABLE IF EXISTS `Indicators`;
CREATE TABLE `Indicators`
 (
    `Id`                int,
    `Indicator`         varchar (255),
    `ShortD`            varchar (255),
    `LongD`             varchar (1500),
    Note	 	varchar(1500),
    `Main`              char NOT NULL,
    `MainInStory`       int,
    `StoryD`            varchar (1500),
    `Contextual`        char NOT NULL,
    `InStory1`          char NOT NULL,
    `InStory2`          char NOT NULL,
    `InStory3`          char NOT NULL,
    `InStory4`          char NOT NULL,
    `InStory5`          char NOT NULL,
    `InStory6`          char NOT NULL,
    `InEvolution`       char NOT NULL,
    `InEvolutionMain`   char NOT NULL,
    `InCountrycard`     char NOT NULL,
     InMap              char NOT NULL,
    `Percentage`        char NOT NULL,
    `Source`            varchar (255),
    `EUComment`         varchar (255),
    OfName 	            varchar(255),
    LeyendYear 		    varchar(255)
);


DROP TABLE IF EXISTS `PSP`;
CREATE TABLE PSP
(
  Id int
, PSP varchar(510)
, CountryID varchar(510)
, ShortD varchar(2048)
, LongD varchar (2048)
, URL varchar (255)
, Year INT
, `OGovernment` varchar (510)
, OSH char not null default 0
, Rehab char not null default 0
, Subject varchar (255)
, Main char not null default 0
, CSName varchar (255)
, CSURL varchar (510)
, InMap char not null default 0
, `OSocialPartners` varchar (510)
, `OOthers` varchar (510)
)
;



DROP TABLE IF EXISTS `Resources`;
CREATE TABLE `Resources`
 (
    `CountryID`            varchar (510),
    `ResourceN`            int,
    `IndicatorID`            int,
    `Comments`            varchar (510)
);


DROP TABLE IF EXISTS `Glossary`;
CREATE TABLE `Glossary`
(
    TermID INT,
    Term varchar (255),
    Description varchar (1024)
);


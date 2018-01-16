drop table if exists `Norm_FactsFigures`;

CREATE TABLE `Norm_FactsFigures` (
  `ID` int(11) not null,
  `Y` int(11) not null,
  `Criteria` varchar(510) DEFAULT NULL,
  `ShortCriteria` varchar(510) DEFAULT NULL,
  `Country` varchar(2) not null,
  `YSelected` char(1) NOT NULL default 0,
   `Measure` float NOT NULL default 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

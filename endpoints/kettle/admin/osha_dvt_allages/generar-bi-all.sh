#!/bin/bash

PENTAHO_HOME=~/bin/servicios/osha
PENTAHO_BI_HOME=$PENTAHO_HOME/data-integration
BI_HOME=/home/iru/src/osha-bi/trunk/endpoints/kettle/admin/osha_dvt_allages

$PENTAHO_BI_HOME/kitchen.sh -file=$BI_HOME/osha_dvt_allages_all.kjb \
-level=Detailed >> $BI_HOME/logs/etl_load.log

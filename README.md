Authors
========
Data Visualisation Tool (DVT) for EU-OSHA
2016 by Zylk.net + Bilbomatica


Setup
========

1. pentaho 6 installation

2. pentaho 6 extension
add all resources in /resources-ext/pentaho-610-extension within the pentaho 6 installation, as an extension or override

3. solution link to filesystem
link source folder to pentaho solution as 'all-ages' (case-sensitive)
ln -s ${src}/all-ages/ ${biserver}/pentaho-solutions/system/all-ages

4. database

database creation 'osha_dvt_allages', import and association in the server with the name 'jdbcEuOshaAllAges'
> create database osha_dvt_allages character set uf8;
> source /all-ages/resources-ext/dbdump/osha_dvt_allages.sql

OR

link to osha.zylk.net environment (intranet only)

5. change env to localhost
${src}all-ages/static/custom/modules/horizontal/config/environment.json
If "pentaho" variable is set as "local" no further change is needed.

5.
Check the gulp tasks:
 Maybe automated with yeoman on near future.

 - This two tasks must be triggered, before see the dashboard with styles
    * dvt-sass
    * bootstrap-sass

 - This two tasks generate & show ngdoc documentation, the second build it up on 8083 port.
    * documentation
    * documentation_connect

 - This two tasks clean & minify the source of the project. our code not pentaho's code. Only use it, if on environment.json packed is true.
    * clean-min
    * package

 - ** Under development ** Generate $templateCache template for better performance, the task generate the code but not linked to dashboard yet.
    * html-horizontal-templates
    * html-vertical-templates

________________

Local Development Environment

# init
$ ant -f jenkins_build.xml local-prepare

# seo
$ gulp seo --seo "true"
$ gulp seo-clean



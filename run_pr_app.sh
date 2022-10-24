pr_app_name=$1
heroku config -s -a stosyk-api-dev > envvars.txt
cat envvars.txt | tr '\n' ' ' | xargs heroku config:set -a $pr_app_name
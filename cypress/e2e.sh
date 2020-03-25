#!/usr/bin/env bash

# Boilerplate generated with create-bash-script (c) 2019 Nikita Skobov
# Available https://github.com/nikita-skobov/create-bash-script

function usage()
{
  local just_help=$1
  local missing_required=$2
  local invalid_argument=$3
  local invalid_option=$4

  local help="Usage: e2e.sh [OPTIONS]

Intended to serve as an interaction wrapper around Cypress. Ensure that you run from within the project.

Example: ./e2e.sh -u nemofin -p password123 -v true -h http://www.minds.com/

Options (* indicates it is required):"
  local help_options="
   *\-p ,\--password \<Parameter>\ The password of the user. 
    \-h ,\--url \<Parameter>\ The URL of the host e.g. https://www.minds.com/ - defaults to use localhost. 
    \-u ,\--username \<Parameter>\ The username - defaults to cypress_e2e_test.
    \-pu ,\--pro_username \<Parameter>\ The pro users username.
    \-pp ,\--pro_password \<Parameter>\ The pro users password
    \-v ,\---video \<Parameter>\ true if you want video providing.
    \-e, \--env \<Parameter>\ add additional env variables e.g. production=true
"

  if [ "$missing_required" != "" ]
  then
    echo "Missing required argument: $missing_required"
  fi

  if [ "$invalid_option" != "" ] && [ "$invalid_value" = "" ]
  then
    echo "Invalid option: $invalid_option"
  elif [ "$invalid_value" != "" ]
  then
    echo "Invalid value: $invalid_value for option: --$invalid_option"
  fi

  echo -e "
"
  echo "$help"
  echo "$help_options" | column -t -s'\'
  return
}
function init_args()
{
REQ_ARGS=( "password" )

# get command line arguments
POSITIONAL=()

# set default arguments
url="http://localhost"
username="minds_cypress_tests"
pro_username="minds_pro_cypress_tests"
pro_password=""
captcha_bypass_key="testing"
env=""
_video=false
while [[ $# -gt 0 ]]
do
key="$1"

case $key in
	-h|--url)
		url="$2"
		shift 2
		;;
	-u|--username)
		username="$2"
		shift 2
		;;
	-p|--password)
		password="$2"
		shift 2
		;;
	-v|--video)
		_video="$2"
		shift 2
		;;
	-pu|--pro-username)
		pro_username="$2"
		shift 2
		;;
	-pp|--pro-password)
		pro_password="$2"
		shift 2
		;;
	-e|--env)
		env=",$2"
		shift 2
		;;
	*)
		POSITIONAL+=("$1") # saves unknown option in array
		shift
		;;
esac
done



for i in "${REQ_ARGS[@]}"; do
  # $i is the string of the variable name
  # ${!i} is a parameter expression to get the value
  # of the variable whose name is i.
  req_var=${!i}
  if [ "$req_var" = "" ]
  then
    usage "" "--$i"
    exit
  fi
done
}
init_args $@

# cd to project root.
while [[ $PWD != '/' && ${PWD##*/} != 'front' ]]; do cd ..; done

#run cypress with args.
echo $(npm bin)/cypress open --config baseUrl=$url,video=$_video --env username=$username,password=$password,pro_username=$pro_username,pro_password=$pro_password,captcha_bypass_key=$captcha_bypass_key$env $POSITIONAL
$(npm bin)/cypress open --config baseUrl=$url,video=$_video --env username=$username,password=$password,pro_username=$pro_username,pro_password=$pro_password,captcha_bypass_key=$captcha_bypass_key$env $POSITIONAL 

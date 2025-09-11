#!/bin/bash

input_file=$1

while IFS= read -r line
do
  var_name="${line%%=*}"
  var_value="${!var_name}"
  echo "$var_name=$var_value" >> .env
done < "$input_file"

if [ -n "$line" ]
then
  var_name="${line%%=*}"
  var_value="${!var_name}"
  echo "$var_name=$var_value" >> .env
fi
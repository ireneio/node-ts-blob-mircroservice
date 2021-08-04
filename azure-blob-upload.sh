#!/bin/bash

# $1 = file path
# $2 = file name
# $3 = account name
# $4 = account key

az storage blob upload -f .$1 -c $5 -n $2 --account-name $3 --account-key $4

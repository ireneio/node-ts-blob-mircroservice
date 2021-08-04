#!/bin/bash

if [ "$1" = "all" ]; then
  for file in static/$5/*; do
    ./azure-blob-upload.sh /"$file" "$file" $3 $4 $2
  done
fi

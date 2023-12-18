#!/bin/sh
export DB_USER=
export DB_NAME=
export DB_PASS=
export DB_HOST=
export DATABASE_URL=
export NODE_ENV=
export PGSSLMODE=

# replace with your seed
yarn init:db:seed --debug --seed 20220331000001-add-past-event-to-review.js

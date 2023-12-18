#!/bin/sh
export DB_USER=
export DB_NAME=
export DB_PASS=
export DB_HOST=
export DATABASE_URL=
export NODE_ENV=
export PGSSLMODE=

yarn init:db:seed:all --debug

#run only one
#db:seed --seed 20210925123455-add_a_player.js

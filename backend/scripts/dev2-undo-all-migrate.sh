#!/bin/sh

export DB_USER=
export DB_NAME=
export DB_PASS=
export DB_HOST=
export DATABASE_URL=
export NODE_ENV=
export PGSSLMODE=

yarn init:db:migrate:undo:all --debug

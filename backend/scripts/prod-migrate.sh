#!/bin/sh
export DB_NAME=
export DB_USER=
export DB_PASS=
export DB_HOST=
export DATABASE_URL=
export NODE_ENV=
export PGSSLMODE=
yarn init:db:migrate:status --debug

# yarn init:db:migrate --debug
#--to 20220209103044-create_review_rating.js
# npx sequelize-cli \
# --debug --config ../config/connection.js \
# db:seed:all
#run only one
#db:seed --seed 20210925123455-add_a_player.js


#!/bin/sh
export GOOGLE_CLIENT_ID_W=
export JWT_SECRET=
export MESSAGE_SERVICE_ID=

export SENDGRID_API_KEY=
export SENDGRID_EMAIL=
export SMS_VERIFY_SERVICE_ID=
export STRIPE_CALLBACK=
export STRIPE_CANCEL_CALLBACK=
export TWILIO_ACCOUNT_SID=
export TWILIO_AUTH_TOKEN=
export TWILIO_MOBILE_NUMBER=

export REACT_APP_API=
export DB_NAME=
export DB_USER=
export DB_PASS=
export DB_HOST=
export DATABASE_URL=
export NODE_ENV=
export PGSSLMODE=

./node_modules/.bin/ts-node ./scripts/send-reset-password-to-bcrypt-users.ts

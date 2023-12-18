#!/bin/sh

git add .;git commit -m "Checkin before release" ; git push origin
git fetch
git checkout main
git pull
git branch -D deploy
git branch -D PRERELEASE ; git push origin --delete PRERELEASE;git checkout -b PRERELEASE
git push --set-upstream origin PRERELEASE


cd backend;
yarn install --frozen-lockfile;
yarn compile-ts-to-js-for-db;
cd ../client;
rm .env.development
rm .env.test
rm .env.staging

export $(xargs< .env.production)    #This will set all production env variables for the react build
export REACT_APP_NODE_ENV=production
export NODE_ENV=production
yarn install --frozen-lockfile
yarn build; yarn postBuild; 
cd .. ; 
git add . ;
git commit -m "Build for deploy";
git push --set-upstream origin PRERELEASE;
git subtree split --prefix backend -b deploy ;
git push heroku-production deploy:main --force;
git checkout main

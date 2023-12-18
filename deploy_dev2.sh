#!/bin/sh
git add .;git commit -m "Checkin before release" ; git push origin --force

git branch -D deploy
git branch -D PRERELEASE ;
git push development2 --delete PRERELEASE --force

git checkout -b PRERELEASE
git push --set-upstream development2 PRERELEASE --force

cd backend;
yarn install --frozen-lockfile;
yarn compile-ts-to-js-for-db;
cd ../client;
export $(xargs< .env.dev2)    #This will set all staging env variables for the react build
yarn install --frozen-lockfile;
yarn build;
yarn postBuild;
cd ../backend
yarn
cd .. ; git add . ; git commit -m "Build for deploy";

git push --set-upstream development2 PRERELEASE --force
git subtree split --prefix backend -b deploy ; 
git push development2 deploy:main --force;

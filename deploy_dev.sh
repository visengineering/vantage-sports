#!/bin/sh

if [ "$GITHUB_ACTIONS" != "" ]
then
   echo "Running deploy using GitHub Actions"
else
   git add .;git commit -m "Checkin before release" ; git push origin --force
fi

git branch -D deploy &>/dev/null || true
git branch -D PRERELEASE &>/dev/null || true
git push development --delete PRERELEASE --force &>/dev/null || true

git checkout -b PRERELEASE
git push --set-upstream development PRERELEASE --force

cd backend;
yarn install --frozen-lockfile;
yarn compile-ts-to-js-for-db;
cd ../client;
export $(xargs< .env.staging)    #This will set all staging env variables for the react build
yarn install --frozen-lockfile;
yarn build;
yarn postBuild;
cd ../backend
yarn install
cd .. ; git add . ; git commit -m "Build for deploy";

git push --set-upstream development PRERELEASE --force
git subtree split --prefix backend -b deploy ; 
git push development deploy:main --force;

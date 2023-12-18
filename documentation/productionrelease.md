# Production Release Procedure

0. Make sure you have all of the necessary remotes and you are logged in with Heroku.

```
git remote -v
heroku login
```

in case you dont have remotes you will need to add them:

```
git remote add development https://git.heroku.com/vantage-dev.git
git remote add development2 https://git.heroku.com/vantage-dev2.git
git remote add heroku-production https://git.heroku.com/vantage-production.git
git remote add production https://git.heroku.com/vantage-production.git
```

1. Checkout to `main` branch on local git repository and fetch all recent changes and pull them.

```
git checkout main
git fetch
git pull
```

2. Create a copy of this branch for yourself in case any hotfixes in the future will be needed. Push the branch so anyone can takeover in case you are on vacation or absent. Go back to main branch after that.

```
git checkout -b prod-main-06-15-2022
git push --set-upstream origin prod-main-06-15-2022
git checkout main
```

3. Create production database backup. [Follow procedure outlined in this documentation file](./database.md).

4. Upload newly created backup file to some secure online storage.

5. Check migrations status by running:

```
cd backend
yarn compile-ts-to-js-for-db
sh scripts/prod-migrate.sh
```

6. Carefully review which migrations are "down" and will need to be run before production release. Be careful with that, review every single migration file and assess the impact. Check migrations line by line and understand what is going on. When confident, proceed to the next step.

7. If any migration is down and you have confirmed it is safe to run particular migration, then before releasing the new code run the migrations. Edit file `scripts/prod-migrate.sh` and replace:

```
yarn init:db:migrate:status --debug
```

with

```
yarn init:db:migrate --debug
```

Save the file, then run the migration in terminal window:

```
sh scripts/prod-migrate.sh
```

8. Undo changes in file `scripts/prod-migrate.sh`. Recheck migrations status by running:

```
sh scripts/prod-migrate.sh
```

Confirm all migrations are now "up".

9. Now we can proceed to release the code bundle. Login to heroku and choose production node.

10. In Visual Studio Code / Terminal: Go to root project directory and execute:

```
sh deploy.sh
```

Watch the script. It should run for about 5-10mins. If any error pops up immediatelly halt the script by pressing `ctrl+c` or `cmd+c` on your keyboard.

11. When final line shows that the bundle is compressed and successfully deployed. Wait 30 seconds and navigate to [https://www.vantagesports.com/](https://www.vantagesports.com/). Warning: precisely navigate to the mentioned link, do not use the printed heroku sub address link, that one will not work properly. Check that website is behaving properly.

12. Write summary to the team if release is successful. If release failed rollback in Heroku to previous build using this panel [https://dashboard.heroku.com/apps/vantage-production/activity](https://dashboard.heroku.com/apps/vantage-production/activity).

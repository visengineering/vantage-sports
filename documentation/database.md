# Backup Database

Please follow steps below to backup Database with pgAdmin 4.

1. ![DB bcp 1](./assets/pgAdmin4-backup-1.png "DB bcp 1")
2. ![DB bcp 2](./assets/pgAdmin4-backup-2.png "DB bcp 2")

# Restore Database

Please follow steps below to restore Database with pgAdmin 4.

1. ![DB restore 1](./assets/pgAdmin4-restore-1.png "DB restore 1")
2. ![DB restore 2](./assets/pgAdmin4-restore-2.png "DB restore 2")
3. ![DB restore 3](./assets/pgAdmin4-restore-3.png "DB restore 3")
4. ![DB restore 4](./assets/pgAdmin4-restore-4.png "DB restore 4")
5. Optional caveat that might happen to your procedure: If your backup is coming from other user you might need to create exactly the same user with privileges as from the original database you have backed up. So you might need a user on top of "vantage" or "postgres" to make it work.

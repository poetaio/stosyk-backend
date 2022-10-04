## Setup
1. You must have Docker installed in order to create DB and Redis instances
2. Create `.env` file, ask your colleagues for it
3. To create DB & Redis instance run `npm run docker`, this will create PostgreSQL database and Redis instance
4. Run `npm run dev`

## GraphQL endpoint flow
1. Create your endpoint in one of Queries/Mutations/Subscriptions files (e.g `graphql/lesson/lessonMutations`)
2. If your endpoint requires token do the following:
   1. Use `resolveAuthMiddleware` for validating & extracting token in Mutation/Query
   2. Use `subscribeAuthMiddleware` for validating & extracting token in Subscription
   3. Use `resolveAuthMiddlewareUnverified` to extract token in Mutation/Query
   4. Use `subscribeAuthMiddlewareUnverified` to extract token in Subscription
3. Add your return types & args types in the same folder via `/types` path
4. Implement resolve function & create controller method (see other endpoints)

## Migrations
1. Run `migration.sh migration-name`, you will see migration file generated in `db/migration` folder with following format: `20220730112944_migration-name.js`
   1. Note: if you are on windows use Git Bash
2. Add folder to `db/schema` with the same name as your migration
3. Create all table files & queries files
4. Implement up & down functions and use your schemas & queries in your migration file `db/migrations`

## Git
- Name your branch `feature/feature-name` or `fix/fix-name`
- If you fix a critical bug, create PR both into `stage` and into `dev`, otherwise create PR into `dev`

## General
- Leave comments if code is non-obvious
- Run tests before each PR
- Run `format_code.sh` before each PR
- Use test accounts to test your work


Feel free to ask your questions in https://interactiveed-o9c1503.slack.com/archives/C039N5Z0TM4


# First-time setups

## Setting up the development environment

1. **Recommend** that node.js version is the current LTS version [v18.12.1](<https://nodejs.org/en/>)
for best compatibility and the least amount of bugs as it is written and tested in this version

2. Refer to `.env.example` and create a `.env` file **with the same format** at the same directory level
as `.env.example`

3. Download and install dependencies (including development ones).
   > **Note:** Run `npm install -g bunyan` to get the bunyan CLI on your PATH

   Download the following as global dependencies
   * Bunyan (optional)
   * Nodemon (optional)
   * Snyk (optional)

4. Setup the database

5. Run `tables.sql` to set up and create necessary tables and relations for PostgreSQL

6. Then `npm run` to run

## Setting up the production environment

1. Use node.js current LTS version [v18.12.1](<https://nodejs.org/en/>)

2. `.env` or is correctly configured

3. Run tests before running the code

4. Setup PostgreSQL *USER ACCOUNT* and *DATABASE* <u>**respectively**</u>

   ```SQL
   CREATE USER eduhope WITH
      NOSUPERUSER
      NOCREATEDB
      NOCREATEROLE
      NOINHERIT
      NOREPLICATION
      CONNECTION LIMIT -1
      PASSWORD 'xxxxxx';

   COMMENT ON ROLE eduhope IS 'User account for EDUHOPE.SG Production Database';
   ```

   ```sql
   CREATE DATABASE eduhopesg
      WITH
      OWNER = eduhope
      ENCODING = 'UTF8'
      CONNECTION LIMIT = -1
      IS_TEMPLATE = False;

   COMMENT ON DATABASE eduhopesg
      IS 'EDUHOPE.SG Production Database';

   GRANT ALL ON DATABASE eduhopesg TO eduhope;
   ```

5. Run `tables.sql` to set up and create necessary tables and relations for PostgreSQL

6. Then `npm run` to run

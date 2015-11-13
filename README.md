# tablesurfer

---

## Tech Overview

Simplified overview of project's tech stack:

>* Task Runner
  * Grunt
* Client Side
  * Angular
  * Angular Material
* Server Side
  * Node
  * Express
  * Postgres
  * Sequelize

---

## File Structure

>`.bowerrc` is used to specify path for bower components; these client-side dependencies are located in `client/lib`

Simplified overview of project's file structure is laid out below:

```
client
  --- app
    // angular (views, services, etc)
  --- assets
    // client-side assets (ex: img)
  --- lib
    // bower components
  --- styles
    // stylesheets
  --- index.html

server
  --- routes
  --- server-spec
  --- server-config.js
  --- server.js
```

---

## Database

> ***Important***: Please follow the directions in order to setup the necessary local user and PostgreSQL database - proper local functionality and testing relies on this.

***To setup your database locally:***

1. Install ***Postgres.app***
  * full-featured PostgreSQL installation w/ `psql` CLI
  * http://postgresapp.com/
2. Install ***Postico*** *_[optional]_*
  * PostgreSQL Client for OSX aka GUI
  * https://eggerapps.at/postico/
3. Use ***psql***, the Postgres CLI, to create needed database and authorized user
  1. From your terminal, enter `psql` and hit enter
  2. Now that `psql` is running, go ahead and create the user
    * `CREATE USER admin WITH SUPERUSER;`
    * `ALTER USER admin WITH PASSWORD 'admin';`
    * `SET ROLE admin;`
    * `CREATE DATABASE tablesurfer;`
4. Double check that your ***Postgres.app*** is running from your OSX toolbar, it should indicate that the port you are using is ***5432***
5. You're successfully setup for Postgres to use ***tablesurfer***!

---

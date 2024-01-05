---
title: Ubuntu 22.04 LTS Deployment
permalink: /development/docs/deployment
---

The following instructions have been tested using Ubuntu 22.04.3 LTS.

First, install the required packages:

```
sudo apt-get update
sudo apt-get install docker docker-compose postgresql-client npm
```

We need a specific version of Node.js, so we can use the `n` npm package to install and use that version:

```
sudo npm install -g n yarn
sudo n 19.7.0
```

To ensure we don't get any permission errors running Docker as a non-root user:

```
sudo usermod -aG docker ${USER}
```

Reload the current terminal for this change to take effect.
Next, download and start a Docker Postgres container, passing a host machine data directory for it to use, e.g.:

```
docker pull postgres
mkdir ${HOME}/data
docker run --name pgsql-prod -e POSTGRES_PASSWORD=<postgres_password> -d -v ${HOME}/data:/var/lib/postgresql/data -p 5432:5432 postgres
```

We also need to download the Gutenberg training materials hosting infrastructure and course materials repos (you may wish to fork the `course-materials` repo first if you plan to make changes to the materials):

```
git clone https://github.com/OxfordRSE/gutenberg
cd gutenberg
git clone https://github.com/UNIVERSE-HPC/course-material .material
```

You’ll need to make use of some services that require credentials to use. Let’s create these and make a note of them now:

- `GITHUB_ID`, `GITHUB_SECRET`: go to https://github.com/settings/developers, select “New OAuth App”, then fill in details including homepage URL (e.g. http://localhost:3000) and auth callback URL (e.g. http://localhost:3000/api/auth/callback/github) You’ll also get a client ID. Select “generate a new client secret”
- `OPEN_API_KEY`: go to https://platform.openai.com, create an account, and log in. Then select the profile icon in the bottom right then “API keys”, and “Create new secret key”
- `NEXTAUTH_SECRET`: create a new hex 32 string for the NextAuth secret, using `openssl rand -hex 32`

Add these to .env (ignore the `QDRANT_*` entries):

```
MATERIAL_DIR=".material"
NEXT_PUBLIC_BASEPATH=""
NEXTAUTH_URL=http://localhost:3000/api/auth
NEXTAUTH_SECRET=“nextauth secret here"
OPENAI_API_KEY=“openai api secret here”
GITHUB_SECRET="github secret"
GITHUB_ID="github id"
DATABASE_URL=postgres://postgres:<postgres_password>@localhost:5432
```

Also ensure that `NEXTAUTH_URL` is as above and `DATABASE_URL` are configured correctly depending on your Postgres configuration.

We also should restrict permissions on `.env`:

```
chmod go-rw .env
```

We also need to enable corepack for a yarn install, otherwise it whinges about it:

```
sudo corepack enable
```

If it is your first time running the application, you will need to install the dependencies and run the migrations to set up the database schema.
This can be done with:

```
yarn install
yarn prisma migrate deploy
```

To start and view the site in a development mode, where pages are rendered on the fly (useful for quickly verifying changes to only a few files):

```
yarn next dev
```

Alternatively, to build the entire site beforehand and then view it:

```
yarn next build
yarn next start
```

# GETTING STARTED

Ontime consists of 3 distinct parts
- __client__: A React app for Ontime's UI and web clients 
- __electron__: An electron app which facilitates the cross-platform distribution of Ontime
- __server__: A node application which handles the domains services and integrations

The steps below will assume you have locally installed the necessary dependencies. 
Other dependencies will be installed as part of the setup
- __node__ (>=16.16)
- __pnpm__ (>=7)
- __docker__ (only necessary to run and build docker images)

## LOCAL DEVELOPMENT

The electron app is only necessary to distribute an installable version of the app and is not required for local development.
Locally, we would need to run both the React client and the node.js server in development mode

From the project root, run the following commands
- __Install the project dependencies__ by running `pnpm i`
- __Run dev mode__ by running `turbo dev`

### Debugging backend
To debug backend code in Node.js:
- Open two separate terminals and navigate to the `apps/client` and `apps/server` directories.
- In each terminal, run the command `pnpm dev` to start the development servers for both the client and server applications.
- If you need to set breakpoints and inspect the code execution, enable Node.js inspect mode by running `pnpm dev:inspect`.

## TESTING

Generally we have 2 types of tests. 
- Unit tests for functions that contain business logic
- End-to-end tests for core features

### Unit tests
Unit tests are contained in mostly all the apps and packages (client, server and utils)

You can run unit tests by running turbo `turbo test:pipeline` from the project root.
This will run all tests and close test runner.

Alternatively you can navigate to an app or project and run `pnpm test` to run those tests in watch mode

### E2E tests
E2E tests are in a separate package. On running, [playwright](https://playwright.dev/) will spin up an instance of the webserver to test against
These tests also run against a separate version of the DB (test-db)

You can run playwright tests from project root with `pnpm e2e`

When writing tests, it can be handy to run playwright in interactive mode with `pnpm e2e:i`. You would need to manually start the webserver with `pnpm dev:server`

## CREATE AN INSTALLABLE FILE (Windows | MacOS | Linux)

Ontime uses Electron to distribute the application.
You can generate a distribution for your OS by running the following steps.

From the project root, run the following commands
- __Install the project dependencies__ by running `pnpm i`
- __Build the UI and server__ by running `turbo build:local`
- __Create the package__ by running `turbo dist-win`, `turbo dist-mac` or `turbo dist-linux`

The build distribution assets will be at `.apps/electron/dist`

## DOCKER

Ontime provides a docker-compose file to aid with building and running docker images.
While it should allow for a generic setup, it might need to be modified to fit your infrastructure.

From the project root, run the following commands
- __Install the project dependencies__ by running `pnpm i`
- __Build docker image from__ by running `docker build -t getontime/ontime`
- __Run docker image from compose__ by running `docker-compose up -d`

Other useful commands
- __List running processes__ by running `docker ps`
- __Kill running process__ by running `docker kill <process-id>`

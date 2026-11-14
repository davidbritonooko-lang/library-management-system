<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Project setup

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Deployment

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

```bash
$ npm install -g @nestjs/mau
$ mau deploy
```

With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.

## Observability

In production applications, observability is essential for understanding how your system behaves, detecting issues early, and maintaining reliable performance.

[NestJS Observe](https://observe.nestjs.com) automatically instruments your NestJS application, giving you deep visibility into your system with minimal setup:

- **Distributed tracing:** Follow requests across services and understand how they flow through your system.
- **Waterfall analysis:** Visualize request execution and identify slow operations, bottlenecks, and unexpected delays.
- **Performance analysis:** Analyze application performance in real time and quickly pinpoint areas that need optimization.
- **Metrics:** Track key application and infrastructure metrics to understand system health and performance trends.
- **Logging:** Centralize and correlate logs with traces and other telemetry to make debugging easier.
- **Error tracking:** Detect errors quickly and investigate their root causes with the surrounding context.
- **SLA monitoring:** Track service-level objectives and identify when your application is approaching or exceeding defined thresholds.
- **Alarms and alerts:** Set up alerts for critical errors, performance degradation, SLA violations, and other anomalies so your team can react quickly.

This project is already instrumented. To connect it, run this and approve the code it prints at [observe.nestjs.com/link](https://observe.nestjs.com/link) - signing up for free if you have no account:

```bash
$ npx @nestjs/observe link
```

It writes the app key and secret into `.env` and makes every `nest start` script (`start`, `start:dev`, `start:debug`) load it. In production, set `OBSERVE_APP_KEY` and `OBSERVE_APP_SECRET` in the environment instead.

Or do it by hand: create an application and an API key at [observe.nestjs.com](https://observe.nestjs.com), and set the pair as `OBSERVE_APP_KEY` and `OBSERVE_APP_SECRET` in the environment the app runs in.

The free plan needs no payment details and covers 300,000 events a month. You can also browse the [live demo](https://www.observe-demo.nestjs.com/dashboard) first - the whole dashboard over a busy service's data, with nothing to install.

## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.
- Auto-instrument your application with [NestJS Observe](https://observe.nestjs.com). Distributed tracing, metrics, and logging made easy. Error tracking and performance monitoring for your NestJS applications.
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).




## Library Management System — Database

This project uses PostgreSQL with Prisma ORM to manage library data.

### Database Models

The database currently contains three main models:

- **User:** Stores user information, including name, email and role.
- **Genre:** Stores book categories, including a unique name and slug.
- **Book:** Stores book details, including title, author, ISBN, copy quantities and genre relationship.

### Schema Decisions

The `Book` model references the `Genre` model through a foreign key (`genreId`) rather than embedding genre information directly inside each book.

This relational approach was selected for the following reasons:

1. **Data consistency:** Each genre is stored once and referenced by multiple books.
2. **Reduced duplication:** Genre names do not need to be repeated in every book record.
3. **Easier updates:** Renaming a genre requires updating one record rather than multiple book records.
4. **Referential integrity:** The foreign key ensures that every book references an existing genre.
5. **Query flexibility:** Prisma can retrieve books together with their associated genre information.

### Database Setup

Create a `.env` file in the `api` directory and configure the PostgreSQL connection strings:

- `DATABASE_URL`: Supabase transaction-pooler connection used by the application.
- `DIRECT_URL`: Supabase session-pooler connection used by Prisma migrations and database operations.

Never commit `.env` or expose database credentials.

Use `.env.example` as a template when configuring a new environment.

### Prisma Commands

Generate the Prisma client:

```bash
npx prisma generate
```

Validate the database schema:

```bash
npx prisma validate
```

Create and apply a migration:

```bash
npx prisma migrate dev --name init
```

Seed the database:

```bash
npx prisma db seed
```

### Seed Data

The initial seed script is located at `prisma/seed.ts`.

It creates:

- 4 book genres.
- 16 sample books.
- 4 books in each genre.

The seed script uses `upsert` operations to prevent duplicate records when executed repeatedly.

### Database Technology

- PostgreSQL — relational database.
- Prisma ORM — database schema, migrations and queries.
- NestJS — backend application framework.
- Supabase — hosted PostgreSQL database.

## Book API, Authentication and Authorization

### Configuration

Copy `.env.example` to `.env` and configure `DATABASE_URL`, `DIRECT_URL`, and a strong random `JWT_SECRET`. Never commit `.env`.

To provision a librarian account for protected catalog writes, set all three optional variables before running the seed:

- `LIBRARIAN_NAME`
- `LIBRARIAN_EMAIL`
- `LIBRARIAN_PASSWORD`

The seed hashes the librarian password with bcrypt. If these variables are omitted, the genre and book seed data still runs, but no librarian account is created. Existing accounts from before the password migration receive a reset-required placeholder and cannot log in until an administrator sets a new bcrypt password hash for them.

### Apply the database migration

From the `api` directory:

```bash
npx prisma migrate deploy
npx prisma generate
npx prisma db seed
npm run build
npm test
```

### Authentication

- `POST /auth/register` creates a PATRON account and returns a bearer JWT.
- `POST /auth/login` verifies the bcrypt password hash and returns a bearer JWT.
- Tokens expire after one hour. Send them as `Authorization: Bearer <token>`.

Registration never accepts a role from the request body. New accounts are always PATRON. Librarian privileges must be assigned through trusted administrative provisioning, such as the optional librarian seed configuration.

### Genres

| Method | Endpoint | Purpose |
| --- | --- | --- |
| POST | `/genres` | Create a genre |
| GET | `/genres` | List genres |
| GET | `/genres/:id` | Get one genre |
| PATCH | `/genres/:id` | Update a genre |
| DELETE | `/genres/:id` | Delete a genre (blocked while books reference it) |

Genre create/update payloads are validated. Genre IDs must be UUIDs. Names and slugs are unique.

### Books

| Method | Endpoint | Access | Purpose |
| --- | --- | --- | --- |
| GET | `/books` | Public | List, filter, search, and paginate books |
| GET | `/books/:id` | Public | Get one book |
| POST | `/books` | LIBRARIAN | Create a book |
| PATCH | `/books/:id` | LIBRARIAN | Update a book |
| DELETE | `/books/:id` | LIBRARIAN | Delete a book |

The list endpoint accepts `genreId`, `search`, `page`, and `limit`. Search matches title or author without case sensitivity. Pagination defaults to page 1 and 10 records per page; the maximum page size is 100. The response contains `data` and pagination metadata in `meta`.

A newly created book starts with `availableCopies` equal to `totalCopies`. When total copies are changed, the service preserves the number of copies currently borrowed and rejects totals that would make available copies negative.

### Authorization

Book create/update/delete routes run `JwtAuthGuard` before `RolesGuard`. The JWT strategy verifies the bearer token using `JWT_SECRET`, and the roles guard permits only users whose token role is `LIBRARIAN`. Hiding controls in a frontend is not treated as authorization.

### Postman

Import `docs/postman_collection.json` into Postman. The collection includes all 12 implemented endpoints. Set the collection's `baseUrl`, `genreId`, and `bookId` variables as needed. Log in with the seeded librarian account to populate the `token` variable before running Book create/update/delete requests.

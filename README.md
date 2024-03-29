# explanation

I wanted to try out a few things regarding javascript fullstack development with nest.js in terms of testing and developer experience:

- How easy is it to have a straight forward development process with typeorm (specifically migrations)?
    - **Findings**
    - Nest.js offers multiple database integrations and delegates to their documentation.
    - There is a nest.js module for typeorm which provides dependency injection throughout the application.
    - But the typeorm cli which provides migrations depends on the same config that is passed to the nest.js module.
    - You have to extract that config so it can be used for both places (nest.js module and the typeorm cli).
    - That was not self explanatory and took a while to figure out but I think I found a good working solution.
- [I like my tests to not be mocked/stubbed when possible and therefore hit the db](https://martinfowler.com/bliki/UnitTest.html#SolitaryOrSociable) but unlike [Rails](https://rubyonrails.org/), [nest.js's documentation](https://docs.nestjs.com/fundamentals/testing) does not support this style of testing out of the box
    - **Findings**
    - To have a testing experience that suits my preferences, I needed my tests to grab different environment variables when I are in the `NODE_ENV=test` environment (See `typeorm.config.ts`) to connect to the test database.
    - My tests don't create a testing module as suggested by the nest.js docs (`Test.createTestingModule`), instead they simply create a real one `NestFactory.create(AppModule)` just like in the `main.ts` file.
    - The `db:migrate` npm script needs to execute the migrations on both the dev and the test database.
    - I couldn't figure out how to get transactions to work in my tests within a reasonable timeframe, therefore I currently simply clear the (only existing) repository like that: `await postsRepository.clear();` before each test. That's probably a bit worse than transactions in terms of performance but can be optimized once it becomes a problem.
    - The `NestFactory.create(AppModule)` currently gets called before every unit test and gets closed after every unit test which might lead to performance issues once the app or the test suite grows. It's probably possible to only create one instance and reuse it to reduce the overhead.
- E2E tests should ideally be independent from one another which requires database seeding in most applications. How can you seed test data when running e2e tests with a framework like cypress / playwright in combination with nest.js?
    - **Findings**
    - When running end to end tests, you need to start the full stack (frontend, backend and other services if necessary; not in this case though.) Depending on the project configuration, this could mean a few steps like shutting down the development environment, changing env vars, starting the test environment, clearing cache, ... which is a bad developer experience.
    - Cypress forces the caller to run the test server first which is problematic if you intend to call cypress in multiple different ways (e.g. `yarn e2e:run` or via vscode code lense for example).
    - Playwright handles this better: There is a `webServer` option in the `playwright.config.ts` file which you can configure to start the stack and also wait until the specified url returns a positive http status code before playwright attempts to visit the test url.
    - I had multiple different problems with cypress in the past and wanted to try out playwright anyways so I chose that.
    - **Data seeding with scripts**
        - I implemented data seeding by accessing the node child process and executing a npm script that calls a e2e seed `.ts` file for that specific test.
        - Inside that file, I call `NestFactory.createApplicationContext(AppModule)` which allows me to access dependency injection to seed the data.
        - The overall performance for that approach was not that great yet (~3s for calling the script, purging the db and seeding 2 records). I think part of the reason is ts-node and another part is that creating the application context takes a while especially when creating a new db connection.
    - **Data seeding with an endpoint**
        - Because of the performance issues with the first approach, I moved to a different approach which is much better in terms of performance.
        - I expose one endpoint to seed data for e2e tests.
        - This endpoint is only accessible in the `NODE_ENV=test`.
        - Another upside of that approach is that it's easier to receive JSON data that way which is needed for various tests.
    - I'm not sure about naming yet. Inside the `posts.spec.ts` file, there is a describe for `Posts` and a test for `can see posts as a list` and in that test I call `seedData('posts', 'a');` to seed the database.
    - `a` is just a unique indicator to differentiate between tests inside that test suite. There is a correlating `a.e2e-seed.ts` file in `api/src/e2e_seeds/post/a.e2e-seed.ts` which gets called.
    - `can_see_posts_as_a_list` would also be a viable option although I didn't want to add the constraint of having to rename multiple places whenever a test label changes.
    - I was able to extract both the `purgeDatabase` and the `FactoryBot` logic so it can be reused. They are currently used both in the controller spec `post.controller.spec.ts` and the e2e-seed files.

# optimal developer experience (vscode)

- https://github.com/vuejs/vetur
- https://github.com/microsoft/playwright
- https://github.com/firsttris/vscode-jest-runner

Add the following to your `settings.json`:
```
"jestrunner.codeLensSelector": "**/{api,client}/**/*.{test,spec}.{js,jsx,ts,tsx}",
```

That way you can
- Open `*.spec.ts` files in `e2e/specs` and simply click on the "Play" button for a single test, a describe block or a whole spec file inside vscode. This will do the following:
    - Spin up the stack (frontend & backend) in the test environment with a different database connection and different ports (so the development environment does not need to be shut down).
    - Wait for the stack to be done compiling.
    - Run the according spec(s) including the seeding step.
    - Shut the test steck down afterwards.
    - It all happens in ~4s.
- You can run all e2e specs by running `yarn e2e:run` or `yarn e2e:debug` (although when you're debugging it might be better to run just the one spec that you're debugging and setting a breakpoint).
- Open `*.spec.ts` files in `api` and simply click on the "Run" or "Debug" button above a `it` or `describe`. This will do the following:
    - API specs don't need the frontend but I want them to access the database.
    - `jest` automatically sets the `NODE_ENV` to `test`. Therefore that nest.js instance in the api specs connects to the test database.
    - The database gets purged before every spec, specs hit the database to allow me real behavior testing.
- You can run all api specs by running `cd api && yarn test`.

# dev setup

    # make sure docker is running
    bin/setup
    yarn start:dev
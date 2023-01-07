# dev setup

    cp .env.example .env

    docker-compose up -d
    # optionally to see logs afterwards
    # docker-compose logs -f

    bin/setup
    yarn start:dev

    # recommended vscode extensions
    # https://github.com/microsoft/playwright
    # https://github.com/firsttris/vscode-jest-runner
    # "jestrunner.codeLensSelector": "**/{api,client}/**/*.{test,spec}.{js,jsx,ts,tsx}",
    # https://github.com/vuejs/vetur

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
    - To have a testing experience that suits my preferences, I needed my tests to grab different environment variables when we are in the `NODE_ENV=test` environment (See `typeorm.config.ts`) to connect to the test database.
    - My tests don't create a testing app, instead they simply create a `NestFactory.create(AppModule)` just like in the `main.ts` file.
    - The `db:migrate` npm script needs to execute the migrations on both the dev and the test database.
    - I couldn't figure out how to get transactions to work in my tests within a reasonable timeframe, therefore I currently simply clear the (only existing) repository like that: `await postsRepository.clear();` before each test. That's probably a bit worse than transactions in terms of performance but can be optimized once it becomes a problem.
    - I currently use a simple custom implementation mimicking the factory bot syntax to seed the database with entities I need. This should be extracted / needs more research if there is a suitable library that can be used instead.
- How can you seed test data when running e2e tests with a framework like cypress / playwright
    - **Findings**
    - When running end to end tests, you need to start the full stack (frontend, backend and other services if necessary; not in this case though.)
    - Cypress forces the caller to run the test server first which is problematic if you intend to call cypress in multiple different ways (e.g. `yarn e2e:run` or via vscode code lense for example).
    - Playwright handles this better: There is a `webServer` option in the `playwright.config.ts` file which you can configure to start the stack and also wait until the specified url returns a positive http status code before playwright attempts to visit the test url.
    - I had multiple different problems with cypress in the past and wanted to try out playwright anyways so I sticked with that.
    - I implemented data seeding by accessing the node child process and executing a npm script that calls a e2e seed `.ts` file for that specific test.
    - I'm not sure about naming yet. Inside the `posts.spec.ts` file, there is a describe for `Post` and a test for `can see posts as a list` and in that test I call `seedData('posts', 'a');` to seed the database.
    - `a` is just a indicator to "count" so we can have a unique identifier for every test case within that spec. There is a correlating `a.ts` file in `api/specs/e2e_seeds/post/a.ts` which gets called.
    - `can_see_posts_as_a_list` would also be a viable option although I didn't want to add the constraint of having to rename 3 places whenever a test label changes.
    - Inside `a.ts` we call `NestFactory.createApplicationContext(AppModule)` which allows us to access dependency injection to seed the data.
    - I was able to extract both the `purgeDatabase` and the `FactoryBot` logic so it can be reused. Both are currently used both in the controller spec `post.controller.spec.ts` and the `a.ts` file.
    - The overall performance for the e2e seed script is not that great yet (~3s for calling the script, purging the db and seeding 2 records). I think part of the reason is ts-node and another part is that creating the application context takes a while especially when creating a new db connection.
    - Therefore I suppose it would be much better in terms of performance to expose endpoints to seed data for e2e tests. These endpoints should only be available in `NODE_ENV=test` and would basically eliminate all performance issues. I'd expect a reduction from ~3s down to ~50ms which is significant once you have many seed scripts.
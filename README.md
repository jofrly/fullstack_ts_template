# dev setup

    cp .env.example .env

    docker-compose up -d
    # optionally to see logs afterwards
    # docker-compose logs -f

    bin/setup

    # TODO: run server and frontend

# explanation

I wanted to try out a few things regarding javascript fullstack development with nest.js:

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
    - **Findings** (todo)
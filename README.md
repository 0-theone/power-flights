## Description
# POWER FLIGHTS
![Nodejs](https://img.shields.io/badge/-Nodejs-339933?style=flat-square&logo=Node.js&logoColor=white)
![NestJS](https://img.shields.io/badge/-NestJS-E0234E?style=flat-square&logo=nestjs&logoColor=white)

- A service in Node.js using Nest.js as framework.

- It loads flights from different sources and remove duplicates.

- New flight sources can be added into .env file

- After running 'npm run start' check the flights at http://localhost:3000/flights

- Local node version: v18.12.1

- As your data structure always has a round trip within a slice, I considered the combination of the two (outbound and return) as an identifier.

The remove duplicates function could also be done in the following way: 

```javascript
    // Using Node.js crypto.createHash() Method
    const filteredFlights = source.filter(flight => {
        const hash = createHash('md5').update(JSON.stringify(flight.slices)).digest('hex');
        if (!seen.hasOwnProperty(hash)) {
            seen[hash] = true
            return flight;
        }
    });
```

```bash
$ npm install
```

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```
# Minds Front

[![Gitlab CI Status](https://www.gitlab.com/minds/front/badges/master/pipeline.svg)](https://www.gitlab.com/minds/front)
[![BrowserStack Status](https://www.browserstack.com/automate/badge.svg?badge_key=T2NvVEVqQnJ5Qm1hVno1SGw2U2R6Z21paVlGR2lHdzNWZTgrWHRWZWN4WT0tLWRtS29ibHBuRk16c0dpbng2aXE3TVE9PQ==--f52d73f47d51343c6e9416cf27400c5f9202fabc)](https://www.browserstack.com/automate/public-build/T2NvVEVqQnJ5Qm1hVno1SGw2U2R6Z21paVlGR2lHdzNWZTgrWHRWZWN4WT0tLWRtS29ibHBuRk16c0dpbng2aXE3TVE9PQ==--f52d73f47d51343c6e9416cf27400c5f9202fabc)

Front-end web application for Minds. Please run inside of [the Minds repo](https://github.com/minds/minds).

## Documentation

Please see the documentation on [developers.minds.com](https://developers.minds.com) for instructions on how to [build the Minds Front-end](https://developers.minds.com/docs/guides/frontend).

### Building

Please see the documentation on Minds.org for instructions on how to [build the Minds Front-end](https://www.minds.org/docs/install/preparation.html#front-end).

### Unit Tests

Run `npm run test`

### Integration Tests

For integration tests you need to run:

`npm run e2e --config baseUrl=http://localhost --env username=minds,password=Pa$$w0rd`

For running Playwright tests on Browserstack: [QA] (https://developers.minds.com/docs/guides/qa).

## Contributing

If you'd like to contribute to the Minds project, check out the [Contribution](https://developers.minds.com/docs/contributing) section of Minds.org or head right over to the [Minds Open Source Community](https://www.minds.com/group/365903183068794880). If you've found or fixed a bug, let us know through our [Help Desk](https://support.minds.com/)!

## Security reports

Please report all security issues to [security@minds.com](mailto:security@minds.com).

## License

[AGPLv3](https://www.minds.org/docs/license.html). Please see the license file of each repository.

## Credits

[PHP](https://php.net), [Cassandra](http://cassandra.apache.org/), [Angular2](http://angular.io), [Nginx](https://nginx.com), [Ubuntu](https://ubuntu.com), [OpenSSL](https://www.openssl.org/), [RabbitMQ](https://www.rabbitmq.com/), [Elasticsearch](https://www.elastic.co/), [Cordova](https://cordova.apache.org/), [Neo4j](https://neo4j.com/), [Elgg](http://elgg.org), [Node.js](https://nodejs.org/en/), [MongoDB](https://www.mongodb.com/), [Redis](http://redis.io/), [WebRTC](https://webrtc.org/), [Socket.io](http://socket.io/), [TinyMCE](https://www.tinymce.com/), [Ionic](http://ionicframework.com/), [Requirejs](http://requirejs.org/), [OAuth](http://oauth.net/2/), [Apigen](http://www.apigen.org/), [Braintree](https://www.braintreepayments.com/). If any are missing please feel free to add.

## NVM

Use [NVM](https://github.com/nvm-sh/nvm) to manage node versions. The preferred node version is contained within `.nvmrc`. Consider [updating your bash profile](https://github.com/nvm-sh/nvm#automatically-call-nvm-use) so `nvm use` is called automatically whenever your CD into the repo.

**_Copyright Minds 2012 - 2023_**

Copyright for portions of Minds are held by [Elgg](http://elgg.org), 2013 as part of the [Elgg](http://elgg.org) project. All other copyright for Minds is held by Minds, Inc.

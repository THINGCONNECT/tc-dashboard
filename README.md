
Overview
========
Thingconnect user dashboard.

Install
=======
1. Get node if you haven't already. [Highly recommend nvm](https://github.com/creationix/nvm)
1. Install gulp: `npm i -g gulp`
1. Install flightplan: `npm i -g flightplan`
1. Install mongodb and make sure `mongod` is in your `PATH`
1. Install modules: `npm install`

Environment variables
===========
You will need to create a development.json and production.json file in server/lib/config. This file should contain the credentials to an AMQP server.

```
{
  "AMQP_URL":"",
  "AMQP_LOGIN":"",
  "AMQP_PASSWORD":"",
  "AMQP_VHOST":"",
  "AMQP_QUEUE_IN":"",
  "AMQP_QUEUE_OUT":"",
  "POLL_AMQP":true
}
```

To run
===========
`gulp watch`

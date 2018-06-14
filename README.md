# rabbitmq-client-wrapper

[![Code style: airbnb](https://img.shields.io/badge/code%20style-airbnb-blue.svg?style=flat-square)](https://github.com/airbnb/javascript)
![node (scoped with tag)](https://img.shields.io/node/v/@stdlib/stdlib/latest.svg)



 **Rabbitmq Client Wrapper** 
 Is created in base of [amqpjs] (https://www.npmjs.com/package/amqpjs) which
 is an architectural pattern for message validation, transformation, and routing. It mediates communication among applications, minimizing the mutual awareness that micro-services should have of each other in order to be able to exchange messages.


---
## Installation
* **You can find in a config folder a file containing the default properties of queue**
* **You have a option to setup your enviroment with [dotenv](https://github.com/motdotla/dotenv)**

```
  git clone https://github.com/cdjohnnatha/rabbitmq-client-wrapper.git
```
---


## Features

* Sender message to queue
* Consume message to queue
* Functions Helper (queueHelper, messageHelper, inputHelper)

## Security Issues
If you discover a security vulnerability in rabbitmq-client-wrapper, contact-me. 

## Dependências

* **[amqplib](https://www.npmjs.com/package/amqplib)**
* **If you are using the dotenv it is necessary write variables in your .env file as below:**
* **[dotenv](https://github.com/motdotla/dotenv)**

    * AMQP_HOST
    * DEFAULT_HOST
    * QUEUE_MESSAGE_EXPIRATION_TIME
    * AMQP_HOST
    * INPUT_QUEUE_PATTERN
    * OUTPUT_QUEUE_PATTERN
    * QUEUE_ARGS_DURABLE
    * QUEUE_ARGS_EXCLUSIVE
    * QUEUE_ARGS_EXPIRATION_TIME
    * NO_ACK_ARG=false
### Testes

#####  Dependency

* **[mochajs](https://mochajs.org/)**
* **[gulp](https://mochajs.org/)**
* **[gulp-mocha](https://mochajs.org/)**

  * To test the queue enviroment which have an example of an airport where simulate
  some services such as check_in, check_out, luggage_in, luggage_out and some clients.

```
  npm install
  gulp mocha
```

### Samples

At **tests/samples** you can find the examples used at crossingProcesses test
which use both libs, queue_sender and queue_consume.

---

## Example:
**OBS:** Must be String to send a message for queue.

```
const queueConsume = require('./lib/queueConsume');
const queueSender = require('./lib/queueSender');

const { BuildMessageBody } = require('./helpers/messageHelper');
const { ConsumedSignal } = require('./helpers/queueHelper');

// service sending object (as string), string...
queueSender.sendToQueue(id, 'service_in', 'my message');
// service waiting processed informations from out 
queueConsume.consumeFromQueue(id, `service_out`, (error, ch, msg, timeout) => {
  const message = BuildMessageBody(msg);
  // code...
  ConsumedSignal(ch, msg, timeout);
});

try{
    // service which consume from queue_in
    queueConsume.consumeFromQueue('', 'service_in', (error, ch, msg, timeoutService) => {
      const message = BuildMessageBody(msg);
      // code...
      // service which send processed object to out service which will be consumed by 
      // queue_out
      queueSender.sendToQueue(String(message.id), 'service_out', 'My service object');
      ConsumedSignal(ch, msg, timeoutService);
    });
  } catch (error) {
    console.log(error);
  }

```


## Contributors

> Claudio Djohnnatha Duarte Lourenço ([cdjohnnatha](https://github.com/cdjohnnatha)) cdjohnnatha@gmail.com

---

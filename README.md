# rabbitmq-client-wrapper

[![Code style: airbnb](https://img.shields.io/badge/code%20style-airbnb-blue.svg?style=flat-square)](https://github.com/airbnb/javascript)
![node (scoped with tag)](https://img.shields.io/node/v/@stdlib/stdlib/latest.svg)



 **Rabbitmq Client Wrapper**
 The tool you can send/consume messages throw [RabbitMQ](https://www.rabbitmq.com/tutorials/tutorial-one-javascript.html). That is created in base of [amqpjs](https://www.npmjs.com/package/amqpjs) which is an architectural pattern for message validation, transformation, and routing. It mediates communication among applications, minimizing the mutual awareness that micro-services should have of each other in order to be able to exchange messages.
 


---
## Installation
* **You can find in a config folder a file containing the default properties of queue**
* **You have a option to setup your enviroment with [dotenv](https://github.com/motdotla/dotenv)**

```
  git clone https://github.com/cdjohnnatha/rabbitmq-client-wrapper.git
```
---

## How it Works!
Take a look that you have basically two important functions which is Sender and Cosume. Sender you can send message throw RabbitMQ using a method called **sendToQueue** where you **must** use a function from Consume called **consumefromQueue**. 

The tool was implemented using an idea of **in** and **out** queues, so is **required identify in the begin of queue if the queue is 'input-' or 'output-'**, for example: input-myQueue, output-myQueue **(the pattern of 'input-' and 'output-' can be changed in .env file)**. 

### Sender
The send have just one approach:
* To send a message throw RabbitMQ is **required** send an id which will identify who or for who will be send a message, the queue name which identify which queue will be used and the message.

#### Example:

```
const queueSender = require('./lib/queueSender');
...

queueSender.sendToQueue('my-message-id', 'input-service', 'my message');

// The same approach is used to send a message for an output-queue
queueSender.sendToQueue('my-message-id', 'output-service', 'my message');
```

### Consume
The consume have two approaches:
* The service which read from an **input-** queue is unnecessary know who send it, so any service which is connected to that **input-** queue can consume the message using the callback function.

#### Example
```
try{
    // service which consume from input-queue
    queueConsume.consumeFromQueue('', 'input-service', (error, ch, msg, timeoutService) => {
      // Build a message.
      const message = BuildMessageBody(msg);
      // code...
      // Identify that the process worked successfully.
      ConsumedSignal(ch, msg, timeoutService);
    });
  } catch (error) {
    console.log(error);
  }
```

* The service which will consume from **output-** **MUST IDENTIFY THE ID** to get the properly message. 
```
try{
    // service which consume from input-queue
    queueConsume.consumeFromQueue('my-message-id', 'output-service', (error, ch, msg, timeoutService) => {
      // Build a message.
      const message = BuildMessageBody(msg);
      // code...
      // Identify that the process worked successfully.
      ConsumedSignal(ch, msg, timeoutService);
    });
  } catch (error) {
    console.log(error);
  }
```

## Features

* Sender message to queue
* Consume message to queue
* Functions Helper (queueHelper, messageHelper, inputHelper)

## Security Issues
If you discover a security vulnerability in rabbitmq-client-wrapper, contact-me. 

## Dependências

* **[amqplib](https://www.npmjs.com/package/amqplib)**
* **If you are using the dotenv it is necessary write variables in your [dotenv](https://github.com/motdotla/dotenv) file as below:**

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
queueSender.sendToQueue('some-id', 'input-service', 'my message');
// service waiting processed informations from out 
queueConsume.consumeFromQueue('some-id', `output-service`, (error, ch, msg, timeout) => {
  const message = BuildMessageBody(msg);
  // code...
  ConsumedSignal(ch, msg, timeout);
});

try{
    // service which consume from input-queue
    queueConsume.consumeFromQueue('', 'input-service', (error, ch, msg, timeoutService) => {
      const message = BuildMessageBody(msg);
      // code...
      // service which send processed object to out service which will be consumed by 
      // output-queue
      queueSender.sendToQueue(String(message.id), 'output-service', 'My service object');
      ConsumedSignal(ch, msg, timeoutService);
    });
  } catch (error) {
    console.log(error);
  }

```


## Contributors

> Claudio Djohnnatha Duarte Lourenço ([cdjohnnatha](https://github.com/cdjohnnatha)) cdjohnnatha@gmail.com

---

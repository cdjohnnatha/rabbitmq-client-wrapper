const amqp = require('amqplib/callback_api');
const {
  CreateDefaultServiceTimeout,
  FindId,
} = require('../helpers/inputHelper');
require('dotenv').config();
const {
  CheckConsumeInput,
  CheckInOutQueueName,
} = require('../helpers/queueHelper');

/**
 * @param {string} id - which compare to response a correct process
 * @param {string} queueName - which says which queue will be listening
 * @param {next} - The callback that handles the messages.
 * @callback  next function to handle messages from queue.
 * @param {Object} error - Object Error
 * @param {Object} channel - rabbitMQChannel, contain function as ack to send a
 * success process signal. using ch.ack(msg).
 * @param {Object} msg queue object message, contain message on msg.content.toString()
 * @param {Object} timeoutService timeout const which needs be canceled with function
 * clearTimeout().
 */

module.exports.consumeFromQueue = function consumeFromQueue(id, queueName, next) {
  try {
    CheckConsumeInput(id, queueName);
    CheckInOutQueueName(queueName);
    // Creates a connection with rabbitmq
    amqp.connect(process.env.AMQP_HOST, (err, connection) => {
      if (err) {
        throw new Error(`Cannot connect to RabbitMQ - ${err.message}`);
      }
      try {
        // Create a channel in that connection
        connection.createChannel((errChannel, channel) => {
          if (errChannel) {
            throw new Error(`Cannot connect to RabbitMQ - ${errChannel.message}`);
          }
          // Connect with a queue by name
          channel.assertQueue(queueName, { durable: false });
          channel.consume(queueName, (msg) => {
            if (queueName.includes('input-')) {
              next(
                null,
                channel,
                msg,
                CreateDefaultServiceTimeout(msg.properties.correlationId),
              );
            } else if (FindId(msg) === id) {
              next(
                null,
                channel,
                msg,
                CreateDefaultServiceTimeout(msg.properties.correlationId),
              );
            } else {
              channel.reject(msg);
            }
          }, { noAck: false });
        });
      } catch (error) {
        console.log(error);
        throw new Error(error.message);
      }
    });
  } catch (error) {
    console.log(error);
    throw new Error(`Input error - ${error.message}`);
  }
};

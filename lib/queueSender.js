const amqplib = require('amqplib/callback_api');
require('dotenv').config();
const {
  CheckSendInput,
  CheckInOutQueueName,
} = require('../helpers/inputHelper');


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

module.exports.sendToQueue = function sendToQueue(id, queueName, message, next) {
  try {
    CheckSendInput(id, queueName, message);
    CheckInOutQueueName(queueName);
    // It creates a connection with a rabbitmq
    amqplib.connect(process.env.AMQP_HOST, 'translates-service', (err, conn) => {
      if (err) {
        throw new Error(`Cannot connect to RabbitMQ - ${err.message}`);
      }

      try {
      // It creates a channel
        conn.createChannel((errChannel, ch) => {
          if (errChannel) {
            throw new Error(`Cannot connect to RabbitMQ - ${err.message}`);
          }
          // Connect with a queue by name
          ch.assertQueue(queueName, {
            durable: false,
            // messageTtl: parseInt(process.env.QUEUE_MESSAGE_EXPIRATION_TIME, Number),
          });
          // Send a message in that queue and send an id
          ch.sendToQueue(queueName, Buffer.from(message), { correlationId: id });
          try {
            ch.close();
          } catch (alreadyClosed) {
            throw new Error(`Channel already close - ${alreadyClosed.message} - ${alreadyClosed.stackAtStateChange}`);
          }
        });
        setTimeout(() => { conn.close(); }, 500000);
      } catch (error) {
        throw new Error(error.message);
      }
    });
  } catch (error) {
    throw new Error(error.message);
  }
};

const amqplib = require('amqplib/callback_api');
require('dotenv').config();
const {
  CheckSendInput,
  CheckInOutQueueName,
} = require('../helpers/inputHelper');

const queueProperties = require('../config/queueProperties');
const {
  CreateErrorCustomMessage,
  CreateError,
  CANNOT_CONNECT_RABBITMQ,
  CHANNEL_ALREADY_CLOSE,
} = require('../helpers/errorHelper');

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
    amqplib.connect(queueProperties.host, (err, conn) => {
      if (err) {
        CreateErrorCustomMessage(err, CANNOT_CONNECT_RABBITMQ);
      }

      try {
      // It creates a channel
        conn.createChannel((errChannel, ch) => {
          if (errChannel) {
            CreateErrorCustomMessage(err, CANNOT_CONNECT_RABBITMQ);
          }
          // Connect with a queue by name
          ch.assertQueue(queueName, queueProperties.defaultArgs);
          // Send a message in that queue and send an id
          ch.sendToQueue(queueName, Buffer.from(message), { correlationId: id });
          try {
            ch.close();
          } catch (alreadyClosed) {
            CreateErrorCustomMessage(alreadyClosed, CHANNEL_ALREADY_CLOSE);
          }
        });
        setTimeout(() => { conn.close(); }, 500000);
      } catch (error) {
        CreateError(error);
      }
    });
  } catch (error) {
    CreateError(error);
  }
};

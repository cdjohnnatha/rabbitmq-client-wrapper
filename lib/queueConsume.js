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

const queueProperties = require('../config/queueProperties');
const {
  CreateErrorCustomMessage,
  CreateError,
  CANNOT_CONNECT_RABBITMQ,
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

module.exports.consumeFromQueue = function consumeFromQueue(id, queueName, next) {
  try {
    CheckConsumeInput(id, queueName);
    CheckInOutQueueName(queueName);
    // Creates a connection with rabbitmq
    amqp.connect(queueProperties.host, (err, connection) => {
      if (err) {
        CreateErrorCustomMessage(err, CANNOT_CONNECT_RABBITMQ);
      }
      try {
        // Create a channel in that connection
        connection.createChannel((errChannel, channel) => {
          if (errChannel) {
            CreateErrorCustomMessage(errChannel, CANNOT_CONNECT_RABBITMQ);
          }
          // Connect with a queue by name
          channel.assertQueue(queueName, queueProperties.defaultArgs);
          channel.consume(queueName, (msg) => {
            if (queueName.includes(queueProperties.queueInputPattern)) {
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
          }, queueProperties.noAckArg);
        });
      } catch (error) {
        console.log(error);
        CreateError(error);
      }
    });
  } catch (error) {
    console.log(error);
    CreateErrorCustomMessage(error, 'input error -');
  }
};

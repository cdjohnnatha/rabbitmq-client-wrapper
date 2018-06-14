const DEFAULT_EXPIRATION_TIMEOUT = 45000;
require('dotenv').config();

/**
 * @param id RabbitMQMessage
 * @return {timeoutService} const which need be stopped on service
 */
function CreateDefaultServiceTimeout(id) {
  const timeoutService = setTimeout(() => {
    throw new Error(`Service timeout for ${id}`);
  }, process.env.QUEUE_MESSAGE_EXPIRATION_TIME || DEFAULT_EXPIRATION_TIMEOUT);

  return timeoutService;
}

/**
 * @param message Error body message
 * @param time timeout time
 * @return {timeoutService} const which need be stopped on service
 */
function CreateServiceTimeout(message, time) {
  const timeoutService = setTimeout(() => {
    throw new Error(message);
  }, time);
  return timeoutService;
}

/**
 * Parameters necesary to send a signal to queue which says that
 * it was processed successfully.
 * @param ch channel from queue
 * @param message queue message
 * @param time timeout const
 * @param closeChannel close channel if necessary
 */
function ConsumedSignal(ch, msg, timeout) {
  ch.ack(msg);
  clearTimeout(timeout);
  ch.close();
}

function FindId(msg) {
  if (msg.properties.correlationId !== undefined) {
    return msg.properties.correlationId;
  }
  const decodedMsg = JSON.parse(msg.content.toString());
  return decodedMsg.id;
}

module.exports = {
  CreateDefaultServiceTimeout,
  CreateServiceTimeout,
  ConsumedSignal,
  FindId,
};

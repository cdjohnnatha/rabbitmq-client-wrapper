const CANNOT_CONNECT_RABBITMQ = 'Cannot connect to RabbitMQ';
const CHANNEL_ALREADY_CLOSE = 'Channel already close';

/**
 * @param {string} customMessage - Message to be showed in error.
 */
function CreateCustomError(customMessage) {
  throw new Error(customMessage);
}

/**
 * @param {Object} error - Error object which will be showed a message.
 */
function CreateError(error) {
  throw new Error(error.message);
}

/**
 * @param {Object} error - Error object.
 * @param {string} message - Custom message.
 */
function CreateErrorCustomMessage(error, message) {
  throw new Error(`${message} - ${error.message} - ${error.stackAtStateChange}`);
}

module.exports = {
  CreateCustomError,
  CreateError,
  CreateErrorCustomMessage,

  CANNOT_CONNECT_RABBITMQ,
  CHANNEL_ALREADY_CLOSE,
};

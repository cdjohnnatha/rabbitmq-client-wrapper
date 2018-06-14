require('dotenv').config();

module.exports = {
  defaultArgs: {
    durable: process.env.QUEUE_ARGS_DURABLE || false,
    exclusive: process.env.QUEUE_ARGS_EXCLUSIVE || false,
    messageTtl: process.env.QUEUE_ARGS_EXPIRATION_TIME || null,
  },
  queueInputPattern: process.env.INPUT_QUEUE_PATTERN || 'input-',
  queueOutputPattern: process.env.OUTPUT_QUEUE_PATTERN || 'output-',
  noAckArg: { noAck: process.env.NO_ACK_ARG || false },
  host: process.env.AMQP_HOST || 'amqp://localhost',
};

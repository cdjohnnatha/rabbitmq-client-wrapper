require('dotenv').config();

function CheckSendInput(id, queueName, message) {
  if ((typeof id !== 'string' && typeof id !== 'number') || typeof queueName !== 'string' || typeof message !== 'string') {
    throw new Error('Missing parameters');
  }
}

function CheckInOutQueueName(queueName) {
  if (!queueName.includes(process.env.INPUT_QUEUE_PATTERN || 'input-') && !queueName.includes(process.env.OUTPUT_QUEUE_PATTERN || 'output-')) {
    throw new Error('Wrong queue name declaration. Must have _in or _out at end of queue name');
  }
}

function CheckConsumeInput(id, queueName) {
  if ((typeof id !== 'string' && typeof id !== 'number') || typeof queueName !== 'string') {
    throw new Error('Missing parameters at consumer');
  }
}

module.exports = {
  CheckSendInput,
  CheckInOutQueueName,
  CheckConsumeInput,
};

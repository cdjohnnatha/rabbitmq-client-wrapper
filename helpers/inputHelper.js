exports.checkSendInput = (id, queueName, message) => {
  if ((typeof id !== 'string' && typeof id !== 'number') || typeof queueName !== 'string' || typeof message !== 'string') {
    throw new Error('Missing parameters');
  }
};

exports.checkInOutQueueName = (queueName) => {
  if (!queueName.includes('input-') && !queueName.includes('output-')) {
    throw new Error('Wrong queue name declaration. Must have _in or _out at end of queue name');
  }
};

exports.checkConsumeInput = (id, queueName) => {
  if ((typeof id !== 'string' && typeof id !== 'number') || typeof queueName !== 'string') {
    throw new Error('Missing parameters at consumer');
  }
};

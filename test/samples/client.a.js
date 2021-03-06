const queueConsume = require('../../lib/queueConsume');
const queueSender = require('../../lib/queueSender');

const messageHelper = require('../../helpers/messageHelper');
const { ConsumedSignal } = require('../../helpers/queueHelper');

process.on('message', (object) => {
  // console.log('sent 1');
  setTimeout(() => {
    console.log(`client ${object.id} request`);
    queueSender.sendToQueue(object.id, `${object.service}_in`, `I am ${object.id}`);
    console.log('Finishing client request');
  }, 1000);
  setTimeout(() => {
    console.log(`I am ${object.id} who are waiting my response`);
    queueConsume.consumeFromQueue(object.id, `${object.service}_out`, (error, ch, msg, timeout) => {
      const message = messageHelper.buildMessageBody(msg);
      console.log(`IM client ${object.id} and got my response message: ${message.msg}`);
      console.log(`----------Im closing my client ${object.id} out request----------`);
      ConsumedSignal(ch, msg, timeout);
    });
  }, 1500);
});

const queueConsume = require('../../lib/queueConsume');

const { BuildMessageBody } = require('../../helpers/messageHelper');

process.on('message', (object) => {
  setTimeout(() => {
    console.log(`I am ${object.id} who are reopen and waiting my response`);
    queueConsume.consumeFromQueue(object.id, `${object.service}_out`, (error, ch, msg) => {
      const message = BuildMessageBody(msg);
      console.log(`IM client ${object.id} and got my response message: ${message.msg}`);
      console.log(`----------Im closing my client ${object.id} out request----------`);
      // clearInterval(clientOut);
      console.log('----------I consumed from queue and sent a signal request----------');
      ch.ack(msg);
    });
  }, 1500);
});

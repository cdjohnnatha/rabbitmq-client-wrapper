const queueConsume = require('../../lib/queueConsume');
const queueSender = require('../../lib/queueSender');

const messageHelper = require('../../helpers/messageHelper');
const queueHelper = require('../../helpers/queueHelper');


process.on('message', (object) => {
  console.log(`Service started ${object.service}`);
  try{
    queueConsume.consumeFromQueue('', `${object.service}_in`, (error, ch, msg, timeoutService) => {
      const message = messageHelper.buildMessageBody(msg);
      console.log(`IM ${object.id} service, I am processing the object: ${message.id}`);
      console.log('I already processed the content then I will send to the out queue');
      queueSender.sendToQueue(String(message.id), `${object.service2}_in`, 'I will register your luggage');
      console.log(`${object.service}_in closing issue client: ${message.id} ->>>`);
      queueHelper.consumedSignal(ch, msg, timeoutService);
    });
  } catch (error) {
    console.log(error);
  }

  console.log(`${object.service2}_in service waiting`);
  try {
    queueConsume.consumeFromQueue('', `${object.service2}_in`, (error, ch, msg, timeoutService) => {
      const message = messageHelper.buildMessageBody(msg);
      // Signal to consume message.
      queueHelper.consumedSignal(ch, msg, timeoutService);
      console.log(`${object.service2}_in closing issue client: ${message.id} ->>>`);
      // send to second service
      queueSender.sendToQueue(String(message.id), `${object.service2}_out`, 'I registered your luggage');
      // consume from second services
      queueConsume.consumeFromQueue(message.id, `${object.service2}_out`, (error, ch, msg, timeoutService) => {
        const message2 = messageHelper.buildMessageBody(msg);
        queueSender.sendToQueue(object.id, `${object.service}_out`, `Take your ticket n: ${message2.id}`);
        console.log(`${object.service2}_out closing issue client: ${message2.id} ->>>`);
        queueHelper.consumedSignal(ch, msg, timeoutService);
      });
    });
  } catch (error2) {
    console.log(error2);
  }
});

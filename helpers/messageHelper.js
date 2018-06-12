/**
 * @param msg RabbitMQMessage
 * @return {messageBody} json with id and message from rabbitMQMsgObject
 */

exports.buildMessageBody = (msg) => {
  const message = JSON.parse(msg.content.toString());
  const messageBody = {
    id: msg.properties.correlationId || (message._id),
    msg: msg.content.toString() || message.text,
  };
  return messageBody;
};

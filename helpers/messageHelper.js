/**
 * @param msg RabbitMQMessage
 * @return {messageBody} json with id and message from rabbitMQMsgObject
 */

function BuildMessageBody(msg) {
  const message = JSON.parse(msg.content.toString());
  const messageBody = {
    id: msg.properties.correlationId || (message.id),
    msg: msg.content.toString() || message.text,
  };
  return messageBody;
}

module.exports = {
  BuildMessageBody,
};

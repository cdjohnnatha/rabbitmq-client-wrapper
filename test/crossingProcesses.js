const cp = require('child_process');

const samplesPath = './test/samples/';
describe('Create fork of processes', () => {
  it('Simulate users and apis', () => {
    // this test will start the second process first
    const clientName = 'Airport_client';
    const clientName2 = 'Airport_client2';
    const clientName3 = 'Airport_client3';
    const clientName4 = 'Airport_client4';
    // IN CASE TO OLD TESTS BEFORE THIS VERSION, REMOVE QUEUES OR RENAME COMMONSERVICES
    const commonServiceName = 'check673';
    const commonServiceName2 = 'luggage733';

    const client = cp.fork(`${samplesPath}client.a`);
    const client2 = cp.fork(`${samplesPath}client.a`);
    const clientClosingChannel = cp.fork(`${samplesPath}client.close.channel`);
    const clientClosingChannel2 = cp.fork(`${samplesPath}client.close.channel`);
    const clientReopenChannel = cp.fork(`${samplesPath}client.reopen.channel`);
    const servicea = cp.fork(`${samplesPath}service`);
    client.send({ id: clientName, service: commonServiceName });
    client2.send({ id: clientName2, service: commonServiceName });
    clientClosingChannel.send({ id: clientName3, service: commonServiceName });
    clientClosingChannel.send({ id: clientName4, service: commonServiceName });
    clientReopenChannel.send({ id: clientName4, service: commonServiceName });
    servicea.send({
      id: clientName,
      service: commonServiceName,
      service2: commonServiceName2,
    });

    servicea.send({
      id: clientName2,
      service: commonServiceName,
      service2: commonServiceName2,
    });

    servicea.send({
      id: clientName3,
      service: commonServiceName,
      service2: commonServiceName2,
    });
  });
});

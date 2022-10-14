import { Template } from '@aws-cdk/assertions';
import * as cdk from '@aws-cdk/core';
import * as iot from '../lib';

test('Default property', () => {
  const stack = new cdk.Stack();

  new iot.IotEndpoint(stack, 'MyEndpoint', {
    endpointType: iot.IotEndpointType.DATA_ATS,
  });

  Template.fromStack(stack).hasResourceProperties('Custom::AWS', {
    Create: '{"service":"Iot","action":"describeEndpoint","physicalResourceId":{"responsePath":"endpointAddress"},"parameters":{"endpointType":"iot:Data-ATS"}}',
  });
});

test.each([
  ['DATA', iot.IotEndpointType.DATA, 'iot:Data'],
  ['DATA_ATS', iot.IotEndpointType.DATA_ATS, 'iot:Data-ATS'],
  ['CREDENTIAL_PROVIDER', iot.IotEndpointType.CREDENTIAL_PROVIDER, 'iot:CredentialProvider'],
  ['JOBS', iot.IotEndpointType.JOBS, 'iot:Jobs'],
])('set endpoint type with %s', (_, cdkEndpointType, endpointType) => {
  const stack = new cdk.Stack();

  new iot.IotEndpoint(stack, 'MyEndpoint', {
    endpointType: cdkEndpointType,
  });

  const expectedCustomResourceCreateString = `{\"service\":\"Iot\",\"action\":\"describeEndpoint\",\"physicalResourceId\":{\"responsePath\":\"endpointAddress\"},\"parameters\":{\"endpointType\":\"${endpointType}\"}}`;

  Template.fromStack(stack).hasResourceProperties('Custom::AWS', {
    Create: expectedCustomResourceCreateString,
  });
});

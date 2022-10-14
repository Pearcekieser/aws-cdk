import * as cdk from '@aws-cdk/core';
import * as integ from '@aws-cdk/integ-tests';
import * as iot from '../lib';

class TestStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    new iot.IotEndpoint(this, 'Endpoint', {
      endpointType: iot.IotEndpointType.DATA_ATS,
    });
  }
}

const app = new cdk.App();
const testCase = new TestStack(app, 'endpoint-test-stack');
new integ.IntegTest(app, 'Endpoint', {
  testCases: [testCase],
});

app.synth();
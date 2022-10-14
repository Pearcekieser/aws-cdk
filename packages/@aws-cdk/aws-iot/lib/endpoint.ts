import { Resource, IResource } from '@aws-cdk/core';
import { AwsCustomResource, PhysicalResourceId, AwsCustomResourcePolicy } from '@aws-cdk/custom-resources';
import { Construct } from 'constructs';


/**
 * Enumeration of the AWS IoT Endpoint Types [ref](https://docs.aws.amazon.com/iot/latest/apireference/API_DescribeEndpoint.html#API_DescribeEndpoint_RequestSyntax)
 */
export enum IotEndpointType {
  /**
   * Returns a VeriSign signed data endpoint.
   */
  DATA = 'iot:Data',

  /**
   * Returns an ATS signed data endpoint.
   */
  DATA_ATS = 'iot:Data-ATS',

  /**
   * Returns an AWS IoT credentials provider API endpoint.
   */
  CREDENTIAL_PROVIDER = 'iot:CredentialProvider',

  /**
   * Returns an AWS IoT device management Jobs API endpoint.
   */
  JOBS = 'iot:Jobs',
}

/**
 * Represents an AWS IoT Endpoint
 */
export interface IIotEndpoint extends IResource {
  /**
   * The endpoint url
   *
   * @attribute
   */
  readonly endpointUrl: string;

  /**
   * The endpoint type
   *
   * @attribute
   */
  readonly endpointType: IotEndpointType;
}

/**
 * Configuration for the IotEndpoint
 */
export interface IotEndpointProps {
  /**
   * The endpoint type
   */
  readonly endpointType: IotEndpointType;

  /**
   * The endpoint type
   */
  readonly customResourceName: string;
}

/**
 * Uses a custom resource to get the iot endpoint.
 * This is useful for example configuring lambda environment variables.
 *
 * @resource AWS::CloudFormation::CustomResource
 */
export class IotEndpoint extends Resource implements IIotEndpoint {

  /**
   * The endpoint url
   * @attribute
   */
  public readonly endpointUrl: string;

  /**
   * The endpoint type
   * @attribute
   */
  public readonly endpointType: IotEndpointType;

  constructor(scope: Construct, id: string, props: IotEndpointProps) {
    super(scope, id, {});
    const resource = new AwsCustomResource(this, `${id}-requestResource`, {
      onCreate: {
        service: 'Iot',
        action: 'describeEndpoint',
        physicalResourceId: PhysicalResourceId.fromResponse('endpointAddress'),
        parameters: {
          endpointType: props.endpointType,
        },
      },
      policy: AwsCustomResourcePolicy.fromSdkCalls({ resources: AwsCustomResourcePolicy.ANY_RESOURCE }),
    });

    this.endpointType = props.endpointType;
    this.endpointUrl = resource.getResponseField('endpointAddress');
  }
}

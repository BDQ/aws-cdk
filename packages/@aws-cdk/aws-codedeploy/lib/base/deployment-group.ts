import cdk = require('@aws-cdk/cdk');
import { IApplication } from './application';
import { IDeploymentConfig } from './deployment-config';

/**
 * Basic properties of both Lambda and Server Deployment Groups
 */
export interface IDeploymentGroup extends cdk.IConstruct {
  /**
   * The physical name of the CodeDeploy Deployment Group.
   */
  readonly deploymentGroupName: string;

  /**
   * The ARN of this Deployment Group.
   */
  readonly deploymentGroupArn: string;

  /**
   * The reference to the CodeDeploy Lambda Application that this Deployment Group belongs to.
   */
  readonly application: IApplication;


}

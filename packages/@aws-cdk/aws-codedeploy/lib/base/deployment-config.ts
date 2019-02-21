import cdk = require('@aws-cdk/cdk');

export interface IDeploymentConfig {
  readonly deploymentConfigName: string;
  deploymentConfigArn(scope: cdk.IConstruct): string;
  export?(): DeploymentConfigImportProps;
}

/**
 * Properties of a reference to a CodeDeploy Deployment Configuration.
 *
 * @see IDeploymentConfig#import
 * @see IDeploymentConfig#export
 */
export interface DeploymentConfigImportProps {
  /**
   * The physical, human-readable name of the custom CodeDeploy Deployment Configuration
   * that we are referencing.
   */
  deploymentConfigName: string;
}
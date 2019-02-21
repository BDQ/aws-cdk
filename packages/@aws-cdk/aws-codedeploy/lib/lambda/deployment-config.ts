import cdk = require('@aws-cdk/cdk');
import { IDeploymentConfig } from '../base/deployment-config';
import { arnForDeploymentConfigName } from '../utils';

class DefaultLambdaDeploymentConfig implements IDeploymentConfig {
  public readonly deploymentConfigName: string;

  constructor(deploymentConfigName: string) {
    this.deploymentConfigName = `CodeDeployDefault.Lambda${deploymentConfigName}`;
  }

  public deploymentConfigArn(scope: cdk.IConstruct): string {
    return arnForDeploymentConfigName(this.deploymentConfigName, scope);
  }
}

/**
 * Properties of a reference to a CodeDeploy Lambda Deployment Configuration.
 *
 * @see LambdaDeploymentConfig#import
 * @see LambdaDeploymentConfig#export
 */
export interface LambdaDeploymentConfigImportProps {
  /**
   * The physical, human-readable name of the custom CodeDeploy Lambda Deployment Configuration
   * that we are referencing.
   */
  deploymentConfigName: string;
}

class ImportedLambdaDeploymentConfig extends cdk.Construct implements IDeploymentConfig {
  public readonly deploymentConfigName: string;

  constructor(scope: cdk.Construct, id: string, private readonly props: LambdaDeploymentConfigImportProps) {
    super(scope, id);

    this.deploymentConfigName = props.deploymentConfigName;
  }

  public deploymentConfigArn(scope: cdk.IConstruct): string {
    return arnForDeploymentConfigName(this.deploymentConfigName, scope);
  }

  public export() {
    return this.props;
  }
}

/**
 * A custom Deployment Configuration for a Lambda Deployment Group.
 *
 * Note: This class currently stands as namespaced container of the default configurations
 * until CloudFormation supports custom Lambda Deployment Configs. Until then it is closed
 * (private constructor) and does not extend {@link cdk.Construct}
 */
export class LambdaDeploymentConfig {
  public static readonly AllAtOnce: IDeploymentConfig = new DefaultLambdaDeploymentConfig('AllAtOnce');
  public static readonly Canary10Percent30Minutes: IDeploymentConfig = new DefaultLambdaDeploymentConfig('Canary10Percent30Minutes');
  public static readonly Canary10Percent5Minutes: IDeploymentConfig = new DefaultLambdaDeploymentConfig('Canary10Percent5Minutes');
  public static readonly Canary10Percent10Minutes: IDeploymentConfig = new DefaultLambdaDeploymentConfig('Canary10Percent10Minutes');
  public static readonly Canary10Percent15Minutes: IDeploymentConfig = new DefaultLambdaDeploymentConfig('Canary10Percent15Minutes');
  public static readonly Linear10PercentEvery10Minutes: IDeploymentConfig = new DefaultLambdaDeploymentConfig('Linear10PercentEvery10Minutes');
  public static readonly Linear10PercentEvery1Minute: IDeploymentConfig = new DefaultLambdaDeploymentConfig('Linear10PercentEvery1Minute');
  public static readonly Linear10PercentEvery2Minutes: IDeploymentConfig = new DefaultLambdaDeploymentConfig('Linear10PercentEvery2Minutes');
  public static readonly Linear10PercentEvery3Minutes: IDeploymentConfig = new DefaultLambdaDeploymentConfig('Linear10PercentEvery3Minutes');

  /**
   * Import a custom Deployment Configuration for a Lambda Deployment Group defined outside the CDK.
   *
   * @param scope the parent Construct for this new Construct
   * @param id the logical ID of this new Construct
   * @param props the properties of the referenced custom Deployment Configuration
   * @returns a Construct representing a reference to an existing custom Deployment Configuration
   */
  public static import(scope: cdk.Construct, id: string, props: LambdaDeploymentConfigImportProps): IDeploymentConfig {
    return new ImportedLambdaDeploymentConfig(scope, id, props);
  }

  private constructor() {
    // nothing to do until CFN supports custom lambda deployment configurations
  }
}

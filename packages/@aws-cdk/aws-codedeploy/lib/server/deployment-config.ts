import cdk = require('@aws-cdk/cdk');
import { DeploymentConfigImportProps, IDeploymentConfig } from '../base/deployment-config';
import { CfnDeploymentConfig } from '../codedeploy.generated';
import { arnForDeploymentConfigName } from '../utils';

class ImportedServerDeploymentConfig extends cdk.Construct implements IDeploymentConfig {
  public readonly deploymentConfigName: string;

  constructor(scope: cdk.Construct, id: string, private readonly props: DeploymentConfigImportProps) {
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

class DefaultServerDeploymentConfig implements IDeploymentConfig {
  public readonly deploymentConfigName: string;

  constructor(deploymentConfigName: string) {
    this.deploymentConfigName = deploymentConfigName;
  }

  public deploymentConfigArn(scope: cdk.IConstruct): string {
    return arnForDeploymentConfigName(this.deploymentConfigName, scope);
  }

  public export(): DeploymentConfigImportProps {
    return {
      deploymentConfigName: this.deploymentConfigName
    };
  }
}

/**
 * Construction properties of {@link ServerDeploymentConfig}.
 */
export interface ServerDeploymentConfigProps {
  /**
   * The physical, human-readable name of the Deployment Configuration.
   *
   * @default a name will be auto-generated
   */
  deploymentConfigName?: string;

  /**
   * The minimum healhty hosts threshold expressed as an absolute number.
   * If you've specified this value,
   * you can't specify {@link #minHealthyHostPercentage},
   * however one of this or {@link #minHealthyHostPercentage} is required.
   */
  minHealthyHostCount?: number;

  /**
   * The minmum healhty hosts threshold expressed as a percentage of the fleet.
   * If you've specified this value,
   * you can't specify {@link #minHealthyHostCount},
   * however one of this or {@link #minHealthyHostCount} is required.
   */
  minHealthyHostPercentage?: number;
}

/**
 * A custom Deployment Configuration for an EC2/on-premise Deployment Group.
 */
export class ServerDeploymentConfig extends cdk.Construct implements IDeploymentConfig {
  public static readonly OneAtATime: IDeploymentConfig = new DefaultServerDeploymentConfig('CodeDeployDefault.OneAtATime');
  public static readonly HalfAtATime: IDeploymentConfig = new DefaultServerDeploymentConfig('CodeDeployDefault.HalfAtATime');
  public static readonly AllAtOnce: IDeploymentConfig = new DefaultServerDeploymentConfig('CodeDeployDefault.AllAtOnce');

  /**
   * Import a custom Deployment Configuration for an EC2/on-premise Deployment Group defined either outside the CDK,
   * or in a different CDK Stack and exported using the {@link #export} method.
   *
   * @param scope the parent Construct for this new Construct
   * @param id the logical ID of this new Construct
   * @param props the properties of the referenced custom Deployment Configuration
   * @returns a Construct representing a reference to an existing custom Deployment Configuration
   */
  public static import(scope: cdk.Construct, id: string, props: DeploymentConfigImportProps): IDeploymentConfig {
    return new ImportedServerDeploymentConfig(scope, id, props);
  }

  public readonly deploymentConfigName: string;

  constructor(scope: cdk.Construct, id: string, props: ServerDeploymentConfigProps) {
    super(scope, id);

    const resource = new CfnDeploymentConfig(this, 'Resource', {
      deploymentConfigName: props.deploymentConfigName,
      minimumHealthyHosts: this.minimumHealthyHosts(props),
    });

    this.deploymentConfigName = resource.ref.toString();
  }

  public deploymentConfigArn(scope: cdk.IConstruct): string {
    return arnForDeploymentConfigName(this.deploymentConfigName, scope);
  }

  public export(): DeploymentConfigImportProps {
    return {
      deploymentConfigName: new cdk.Output(this, 'DeploymentConfigName', {
        value: this.deploymentConfigName,
      }).makeImportValue().toString(),
    };
  }

  private minimumHealthyHosts(props: ServerDeploymentConfigProps):
    CfnDeploymentConfig.MinimumHealthyHostsProperty {
    if (props.minHealthyHostCount === undefined && props.minHealthyHostPercentage === undefined) {
      throw new Error('At least one of minHealthyHostCount or minHealthyHostPercentage must be specified when creating ' +
        'a custom Server DeploymentConfig');
    }
    if (props.minHealthyHostCount !== undefined && props.minHealthyHostPercentage !== undefined) {
      throw new Error('Both minHealthyHostCount and minHealthyHostPercentage cannot be specified when creating ' +
        'a custom Server DeploymentConfig');
    }

    return {
      type: props.minHealthyHostCount !== undefined ? 'HOST_COUNT' : 'FLEET_PERCENT',
      value: props.minHealthyHostCount !== undefined ? props.minHealthyHostCount : props.minHealthyHostPercentage!,
    };
  }
}

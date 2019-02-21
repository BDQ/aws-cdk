import cdk = require('@aws-cdk/cdk');
import { ApplicationImportProps, ApplicationProps, IApplication } from "../base/application";
import { CfnApplication } from '../codedeploy.generated';
import { applicationNameToArn } from '../utils';

class ImportedServerApplication extends cdk.Construct implements IApplication {
  public readonly applicationArn: string;
  public readonly applicationName: string;

  constructor(scope: cdk.Construct, id: string, private readonly props: ApplicationImportProps) {
    super(scope, id);

    this.applicationName = props.applicationName;
    this.applicationArn = applicationNameToArn(this.applicationName, this);
  }

  public export(): ApplicationImportProps {
    return this.props;
  }
}

/**
 * A CodeDeploy Application that deploys to EC2/on-premise instances.
 */
export class ServerApplication extends cdk.Construct implements IApplication {
  /**
   * Import an Application defined either outside the CDK,
   * or in a different CDK Stack and exported using the {@link #export} method.
   *
   * @param scope the parent Construct for this new Construct
   * @param id the logical ID of this new Construct
   * @param props the properties of the referenced Application
   * @returns a Construct representing a reference to an existing Application
   */
  public static import(scope: cdk.Construct, id: string, props: ApplicationImportProps): IApplication {
    return new ImportedServerApplication(scope, id, props);
  }

  public readonly applicationArn: string;
  public readonly applicationName: string;

  constructor(scope: cdk.Construct, id: string, props: ApplicationProps = {}) {
    super(scope, id);

    const resource = new CfnApplication(this, 'Resource', {
      applicationName: props.applicationName,
      computePlatform: 'Server',
    });

    this.applicationName = resource.ref;
    this.applicationArn = applicationNameToArn(this.applicationName, this);
  }

  public export(): ApplicationImportProps {
    return {
      applicationName: new cdk.Output(this, 'ApplicationName', { value: this.applicationName }).makeImportValue().toString()
    };
  }
}

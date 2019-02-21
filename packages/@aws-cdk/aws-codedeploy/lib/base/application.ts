import cdk = require('@aws-cdk/cdk');

export interface IApplication extends cdk.IConstruct {
  readonly applicationArn: string;
  readonly applicationName: string;

  export(): ApplicationImportProps;
}

export interface ApplicationProps {
  /**
   * The physical, human-readable name of the CodeDeploy Application.
   *
   * @default an auto-generated name will be used
   */
  applicationName?: string;
}

export interface ApplicationImportProps {
  /**
   * The physical, human-readable name of the Lambda Application we're referencing.
   * The Application must be in the same account and region as the root Stack.
   */
  applicationName: string;
}
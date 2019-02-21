import codepipeline = require('@aws-cdk/aws-codepipeline-api');
import cdk = require('@aws-cdk/cdk');
import { BasePipelineDeployAction, CommonPipelineDeployActionProps } from '../base/pipeline-action';
import { LambdaDeploymentGroup } from './deployment-group';

export interface LambdaPipelineDeployActionProps extends CommonPipelineDeployActionProps {
  deploymentGroup: LambdaDeploymentGroup;
}

export class LambdaPipelineDeployAction extends BasePipelineDeployAction {
  protected readonly deploymentGroup: LambdaDeploymentGroup;

  constructor(props: LambdaPipelineDeployActionProps) {
    super({
      ...props,
      configuration: {
        ApplicationName: props.deploymentGroup.application.applicationName,
        DeploymentGroupName: props.deploymentGroup.deploymentGroupName,
      }
    });

    this.deploymentGroup = props.deploymentGroup;
  }

  protected bind(stage: codepipeline.IStage, scope: cdk.Construct): void {
    this.addCommonPermissions(stage, scope, this.deploymentGroup);
  }
}

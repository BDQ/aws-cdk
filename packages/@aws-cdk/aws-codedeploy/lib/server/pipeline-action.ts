import codepipeline = require('@aws-cdk/aws-codepipeline-api');
import cdk = require('@aws-cdk/cdk');
import { BasePipelineDeployAction, CommonPipelineDeployActionProps } from '../base/pipeline-action';
import { ServerDeploymentGroupBase } from './deployment-group';

export interface ServerPipelineDeployActionProps extends CommonPipelineDeployActionProps {
  deploymentGroup: ServerDeploymentGroupBase;
}

export class ServerPipelineDeployAction extends BasePipelineDeployAction {
  protected readonly deploymentGroup: ServerDeploymentGroupBase;

  constructor(props: ServerPipelineDeployActionProps) {
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

    // grant the ASG Role permissions to read from the Pipeline Bucket
    for (const asg of this.deploymentGroup.autoScalingGroups || []) {
      stage.pipeline.grantBucketRead(asg.role);
    }
  }
}

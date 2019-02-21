
import codepipeline = require('@aws-cdk/aws-codepipeline-api');
import iam = require('@aws-cdk/aws-iam');
import cdk = require('@aws-cdk/cdk');
import { IDeploymentGroup } from './deployment-group';

/**
 * Common properties for creating a {@link PipelineDeployAction},
 * either directly, through its constructor,
 * or through {@link IServerDeploymentGroup#toCodePipelineDeployAction}.
 */
export interface CommonPipelineDeployActionProps extends codepipeline.CommonActionProps {
  /**
   * The source to use as input for deployment.
   */
  inputArtifact: codepipeline.Artifact;
}

/**
 * Common construction properties of the {@link BasePipelineDeployAction CodeDeploy deploy CodePipeline Action}.
 */
export interface PipelineDeployActionProps extends CommonPipelineDeployActionProps {
  configuration: any;
}

export abstract class BasePipelineDeployAction extends codepipeline.DeployAction {

  constructor(props: PipelineDeployActionProps) {
    super({
      ...props,
      artifactBounds: { minInputs: 1, maxInputs: 1, minOutputs: 0, maxOutputs: 0 },
      provider: 'CodeDeploy',
      inputArtifact: props.inputArtifact
    });

  }

  protected addCommonPermissions(stage: codepipeline.IStage, scope: cdk.Construct, deploymentGroup: IDeploymentGroup): void {
    stage.pipeline.role.addToPolicy(new iam.PolicyStatement()
      .addResource(deploymentGroup.application.applicationArn)
      .addActions(
        'codedeploy:GetApplicationRevision',
        'codedeploy:RegisterApplicationRevision',
      ));

    stage.pipeline.role.addToPolicy(new iam.PolicyStatement()
      .addResource(deploymentGroup.deploymentGroupArn)
      .addActions(
        'codedeploy:CreateDeployment',
        'codedeploy:GetDeployment',
      ));

    stage.pipeline.role.addToPolicy(new iam.PolicyStatement()
      .addResource(deploymentGroup.deploymentConfig.deploymentConfigArn(scope))
      .addActions(
        'codedeploy:GetDeploymentConfig',
      ));
  }

}

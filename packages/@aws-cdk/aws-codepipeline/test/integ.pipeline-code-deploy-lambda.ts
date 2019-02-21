
import codecommit = require('@aws-cdk/aws-codecommit');
import codedeploy = require('@aws-cdk/aws-codedeploy');
import lambda = require('@aws-cdk/aws-lambda');
import cdk = require('@aws-cdk/cdk');
import codepipeline = require('../lib');

import path = require('path');

const app = new cdk.App();

const stack = new cdk.Stack(app, 'aws-cdk-codepipeline-codedeploy-lambda');
const pipeline = new codepipeline.Pipeline(stack, 'Pipeline');

const repo = new codecommit.Repository(stack, 'Repo', {
  repositoryName: 'Repo',
});

const sourceAction = repo.toCodePipelineSourceAction({ actionName: 'CodeCommit' });
pipeline.addStage({
  name: 'Source',
  actions: [sourceAction],
});

const handler = new lambda.Function(stack, `Handler`, {
  code: lambda.Code.asset(path.join(__dirname, 'lambda/handler')),
  handler: 'index.handler',
  runtime: lambda.Runtime.NodeJS810,
});

const version = handler.addVersion('1');
const blueGreenAlias = new lambda.Alias(stack, `Alias`, {
  aliasName: `alias`,
  version
});

const deploymentGroup = new codedeploy.LambdaDeploymentGroup(stack, 'BlueGreenDeployment', {
  alias: blueGreenAlias,
  deploymentConfig: codedeploy.LambdaDeploymentConfig.Linear10PercentEvery1Minute,
});

// const deployAction = new codedeploy.LambdaPipelineDeployAction({
//   actionName: 'CodeDeploy',
//   inputArtifact: sourceAction.outputArtifact,
//   deploymentGroup,
// });

const deployStage = pipeline.addStage({ name: 'Deploy' });
deployStage.addAction(deploymentGroup.toCodePipelineDeployAction({
  actionName: 'CodeDeploy',
  inputArtifact: sourceAction.outputArtifact,
}));

app.run();

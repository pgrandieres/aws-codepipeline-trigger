# Trigger AWS Pipeline

This guide provides a comprehensive approach to integrating GitHub Actions with AWS CodePipeline. It assumes that you have an existing pipeline in AWS CodePipeline. This method focuses on triggering the pipeline rather than creating it.

## Configuration Steps

### Setting Up AWS IAM

Begin by establishing an IAM user with the `codepipeline:StartPipelineExecution` permission. The following IAM policy template serves as a solid starting point. It employs "*" for broad access, but for enhanced security, consider narrowing the policy to target specific pipelines. For a deeper understanding of IAM in the context of CodePipeline, explore the detailed documentation [here](https://docs.aws.amazon.com/codepipeline/latest/userguide/permissions-reference.html).

### Integrating GitHub Secrets

Post creation of the IAM user with appropriate permissions, proceed to add the following variables in your GitHub repository's secrets section:

- `AWS_PIPELINE_ACCESS_KEY`: The Access Key ID of the newly created user.
- `AWS_PIPELINE_SECRET_KEY`: The Secret Key of the same user.


## Implementing the Integration

Ensure to check the most recent version here and substitute `X.X.X` with the latest version in the code examples.

Identify the AWS region where your pipeline resides. Use this region in the `aws-region` field.

```
jobs:
  trigger:
    steps:
      - name: Trigger AWS CodePipeline
        uses: pgrandieres/aws-codepipeline-action@vX.X.X
        with:
          aws-access-key: ${{ secrets.AWS_PIPELINE_ACCESS_KEY }}
          aws-secret-key: ${{ secrets.AWS_PIPELINE_SECRET_KEY }}
          aws-region: "your-region"
          pipeline-name: "your-pipeline-name"
```

## Contribute 

Your contributions to this project are highly encouraged and valued. You are welcome to fork the repository and submit Pull Requests (PRs). I am committed to reviewing and merging your contributions. If you have questions or need guidance on contributing, please don't hesitate to reach out. Your engagement and collaboration are greatly appreciated.

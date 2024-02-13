import * as core from '@actions/core'
import {
  CodePipelineClient,
  StartPipelineExecutionCommand,
  GetPipelineExecutionCommand,
  StartPipelineExecutionCommandOutput,
  GetPipelineExecutionCommandOutput
} from '@aws-sdk/client-codepipeline'

/**
 * Polls the pipeline execution status until it's no longer in progress.
 * @param client The CodePipelineClient instance.
 * @param pipelineName The name of the pipeline.
 * @param executionId The execution ID of the pipeline.
 * @returns {Promise<boolean>} True if the pipeline execution succeeded, false otherwise.
 */
async function waitForPipelineCompletion(
  client: CodePipelineClient,
  pipelineName: string,
  executionId: string
): Promise<boolean> {
  let status = 'InProgress'

  await new Promise(resolve => setTimeout(resolve, 5000))

  do {
    const command = new GetPipelineExecutionCommand({
      pipelineName: pipelineName,
      pipelineExecutionId: executionId
    })

    const response: GetPipelineExecutionCommandOutput =
      await client.send(command)
    status = response.pipelineExecution?.status || 'InProgress'

    if (status === 'InProgress') {
      console.log('Pipeline execution in progress. Waiting...')
      await new Promise(resolve => setTimeout(resolve, 10000)) // Wait for 10 seconds before polling again.
    } else {
      console.log(`Pipeline execution completed with status: ${status}`)
    }
  } while (status === 'InProgress')

  return status === 'Succeeded'
}

/**
 * The main function for the action.
 * @returns {Promise<void>} Resolves when the action is complete.
 */
export async function run(): Promise<void> {
  try {
    const awsRegion: string = core.getInput('aws-region')
    const awsAccessKey: string = core.getInput('aws-access-key')
    const awsSecretKey: string = core.getInput('aws-secret-key')
    const pipelineName: string = core.getInput('pipeline-name')

    const codePipelineClient = new CodePipelineClient({
      region: awsRegion,
      credentials: {
        accessKeyId: awsAccessKey,
        secretAccessKey: awsSecretKey
      }
    })

    const startCommand = new StartPipelineExecutionCommand({
      name: pipelineName
    })

    let executionId: string | undefined

    try {
      const data: StartPipelineExecutionCommandOutput =
        await codePipelineClient.send(startCommand)
      executionId = data.pipelineExecutionId
      console.log(`Pipeline execution started. Execution ID: ${executionId}`)

      if (!executionId) {
        throw new Error('Failed to get the pipeline execution ID.')
      }

      const success = await waitForPipelineCompletion(
        codePipelineClient,
        pipelineName,
        executionId
      )

      if (success) {
        console.log('Pipeline execution succeeded.')
      } else {
        throw new Error('Pipeline execution failed or was stopped.')
      }
    } catch (err) {
      if (err instanceof Error) {
        console.error(err.message)
        core.setFailed(err.message)
      } else {
        console.error('An unknown error occurred')
        core.setFailed('An unknown error occurred')
      }
    }
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message)
      core.setFailed(error.message)
    } else {
      console.error('An unknown error occurred')
      core.setFailed('An unknown error occurred')
    }
  }
}

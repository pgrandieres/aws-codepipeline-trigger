import * as core from '@actions/core'
import {
  CodePipelineClient,
  StartPipelineExecutionCommand
} from '@aws-sdk/client-codepipeline'

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

    try {
      const data = await codePipelineClient.send(startCommand)
      console.log(data)
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
    core.setFailed((error as Error).message)
  }
}

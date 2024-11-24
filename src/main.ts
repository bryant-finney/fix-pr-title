import * as core from '@actions/core'
import { fix } from './fixer'

/**
 * The main function for the action.
 * @returns {Promise<void>} Resolves when the action is complete.
 */
export async function run(): Promise<void> {
  try {
    const title: string = core.getInput('title')
    const prefixes: string[] = core.getInput('prefixes').split(',')

    const fixed: string = await fix(prefixes, title)

    core.setOutput('title', fixed)
    core.setOutput('fixed', fixed !== title)
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}

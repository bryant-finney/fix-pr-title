/**
 * Unit tests for the action's main functionality, src/main.ts
 *
 * These should be run as if the action was called from a workflow.
 * Specifically, the inputs listed in `action.yml` should be set as environment
 * variables following the pattern `INPUT_<INPUT_NAME>`.
 */

import * as core from '@actions/core'
import * as main from '../src/main'

// Mock the action's main function
const runMock = jest.spyOn(main, 'run')

// Mock the GitHub Actions core library
let errorMock: jest.SpiedFunction<typeof core.error>
let getInputMock: jest.SpiedFunction<typeof core.getInput>
let setFailedMock: jest.SpiedFunction<typeof core.setFailed>
let setOutputMock: jest.SpiedFunction<typeof core.setOutput>

describe('action', () => {
  beforeEach(() => {
    jest.clearAllMocks()

    errorMock = jest.spyOn(core, 'error').mockImplementation()
    getInputMock = jest.spyOn(core, 'getInput').mockImplementation()
    setFailedMock = jest.spyOn(core, 'setFailed').mockImplementation()
    setOutputMock = jest.spyOn(core, 'setOutput').mockImplementation()
  })

  it('requires prefixes and a title as inputs', async () => {
    getInputMock.mockImplementation(name => {
      switch (name) {
        case 'title':
          return 'jira 1234 Fix a thing'
        case 'prefixes':
          return 'jira'
        default:
          return ''
      }
    })

    await main.run()
    expect(runMock).toHaveReturned()
  })

  it('sets "title" and "fixed" as outputs', async () => {
    getInputMock.mockImplementation(name => {
      switch (name) {
        case 'title':
          return 'jira 1234 Fix a thing'
        case 'prefixes':
          return 'jira'
        default:
          return ''
      }
    })

    await main.run()
    expect(runMock).toHaveReturned()
    expect(setOutputMock).toHaveBeenNthCalledWith(
      1,
      'title',
      'JIRA-1234 Fix a thing'
    )
    expect(setOutputMock).toHaveBeenNthCalledWith(2, 'fixed', true)
  })

  it('sets a failed status when a valid prefix is missing', async () => {
    const title = 'JIRA-1234: Fix a thing'

    getInputMock.mockImplementation(name => {
      switch (name) {
        case 'title':
          return title
        case 'prefixes':
          return 'dne,foo,bar'
        default:
          return ''
      }
    })

    await main.run()
    expect(runMock).toHaveReturned()

    expect(setFailedMock).toHaveBeenNthCalledWith(
      1,
      `No issue keys found: ${title}`
    )
    expect(errorMock).not.toHaveBeenCalled()
  })
})

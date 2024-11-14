/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Fixer } from '../src/fixer'
import { data } from './data.json'

const prefixes = ['JIRA']
const repo = 'test-0'

describe('data', () => {
  it(`includes a repo named ${repo}`, () => {
    expect(data.organization.repository.name).toEqual(repo)
  })
})

// TODO: add more data
describe('fix() when run on data', () => {
  const titles = data.organization.repository.pullRequests.nodes
    .map(pr => pr.title)
    .map(title => new Fixer(prefixes, title).fix())

  it('corrects the PR titles', () => {
    expect(titles).toMatchSnapshot()
  })
})

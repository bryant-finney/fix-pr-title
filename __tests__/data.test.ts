/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { data } from './data.json'

const repo = 'test-0'

describe('data', () => {
  it(`includes a repo named ${repo}`, () => {
    expect(data.organization.repository.name).toEqual(repo)
  })
})

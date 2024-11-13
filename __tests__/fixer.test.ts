/**
 * Unit tests for src/fixer.ts
 */

import { Fixer } from '../src/fixer'
import { expect } from '@jest/globals'

const prefixes = ['FOO', 'BAR', 'BAZ']

describe('Fixer', () => {
  describe('constructor()', () => {
    const prTitle = 'foo 1234 Fix a thing'
    it('takes a string (the PR title) and a list of strings (issue prefixes)', () => {
      const fixer = new Fixer(prefixes, prTitle)
      expect(fixer.prefixes).toEqual(prefixes)
      expect(fixer.raw).toEqual(prTitle)
    })
  })

  const desc = ': Fix a thing'
  describe('extract()', () => {
    const wrong = {
      case: 'fOo-1234',
      sep: 'FOO+5678',
      prefix: 'lumbar 739'
    }

    it(`detects incorrect case: ${wrong.case}`, () => {
      const fixer = new Fixer(prefixes, wrong.case.concat(desc))
      expect(fixer.extract()?.slice(0, 3)).toEqual([
        wrong.case,
        ...wrong.case.split('-')
      ])
    })

    it(`detects incorrect separator: ${wrong.sep}`, () => {
      const fixer = new Fixer(prefixes, wrong.sep.concat(desc))
      expect(fixer.extract()?.slice(0, 3)).toEqual([
        wrong.sep,
        ...wrong.sep.split('+')
      ])
    })

    const multi = Object.values(wrong).join(', ')

    it(`detects multiple issue numbers: ${multi}`, () => {
      const fixer = new Fixer(prefixes, `${multi} Fix a thing`)
      expect(fixer.extract()?.slice(0, 3)).toEqual(['fOo-1234', 'fOo', '1234'])
      expect(fixer.extract()?.slice(0, 3)).toEqual(['FOO+5678', 'FOO', '5678'])
    })

    it(`enforces word boundaries at the start: ${wrong.prefix}`, () => {
      const fixer = new Fixer(prefixes, wrong.prefix.concat(desc))
      expect(fixer.extract()).toBeNull()
    })
  })

  describe('apply()', () => {
    const wrong = {
      case: 'fOo-1234',
      sep: 'FOO+5678'
    }

    it(`fixes incorrect case: ${wrong.case}`, () => {
      const fixer = new Fixer(prefixes, wrong.case.concat(desc))
      expect(fixer.apply()).toEqual(wrong.case.toUpperCase().concat(desc))
    })

    it(`fixes incorrect separator: ${wrong.sep}`, () => {
      const fixer = new Fixer(prefixes, wrong.sep.concat(desc))
      expect(fixer.apply()).toEqual(wrong.sep.replace('+', '-').concat(desc))
    })

    const multi = Object.values(wrong).join(', ')
    it(`fixes multiple issue numbers: ${multi}`, () => {
      const fixer = new Fixer(prefixes, `${multi}`.concat(desc))
      expect(fixer.apply()).toEqual('FOO-1234, FOO-5678: Fix a thing')
    })
  })
})

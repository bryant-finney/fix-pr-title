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

  describe('extract()', () => {
    const wrongCase = 'fOo-1234'
    it(`detects incorrect case: ${wrongCase}`, () => {
      const fixer = new Fixer(prefixes, `${wrongCase} Fix a thing`)
      expect(fixer.extract()?.slice(0, 3)).toEqual([
        wrongCase,
        ...wrongCase.split('-')
      ])
    })

    const wrongSep = 'FOO+1234'
    it(`detects incorrect separator: ${wrongSep}`, () => {
      const fixer = new Fixer(prefixes, `${wrongSep} Fix a thing`)
      expect(fixer.extract()?.slice(0, 3)).toEqual([
        wrongSep,
        ...wrongSep.split('+')
      ])
    })

    const multi = ['FOO-1234', 'BAR-567']
    it(`detects multiple issue numbers: ${multi}`, () => {
      const fixer = new Fixer(prefixes, `${multi} Fix a thing`)
      expect(fixer.extract()?.slice(0, 3)).toEqual(['FOO-1234', 'FOO', '1234'])
      expect(fixer.extract()?.slice(0, 3)).toEqual(['BAR-567', 'BAR', '567'])
    })

    const badStart = 'lumbar 739'
    it(`enforces word boundaries at the start: ${badStart}`, () => {
      const fixer = new Fixer(prefixes, `${badStart} Fix a thing`)
      expect(fixer.extract()).toBeNull()
    })
  })

  const desc = ': Fix a thing'
  describe('apply()', () => {
    const wrongCase = 'fOo-1234'
    it(`fixes incorrect case: ${wrongCase}`, () => {
      const fixer = new Fixer(prefixes, wrongCase.concat(desc))
      expect(fixer.apply()).toEqual(wrongCase.toUpperCase().concat(desc))
    })

    const wrongSep = 'FOO+1234'
    it(`fixes incorrect separator: ${wrongSep}`, () => {
      const fixer = new Fixer(prefixes, wrongSep.concat(desc))
      expect(fixer.apply()).toEqual(wrongSep.replace('+', '-').concat(desc))
    })

    const multi = [wrongCase, wrongSep]
    it(`detects multiple issue numbers: ${multi}`, () => {
      const fixer = new Fixer(prefixes, `${multi}`.concat(desc))
      expect(fixer.apply()).toEqual('FOO-1234,FOO-1234: Fix a thing')
    })
  })
})

/**
 * @class Fixer
 * If possible, correct misspelled Jira issue keys in the given string.
 *
 * @param prefixes A list of prefixes
 * @param prTitle The title of the PR.
 */
class Fixer {
  prefixes: string[]
  raw: string
  re: RegExp

  constructor(prefixes: string[], prTitle: string) {
    this.prefixes = prefixes
    this.raw = prTitle
    this.re = new RegExp(
      `(?<![a-z])(${prefixes.join('|')})[^A-Z0-9](\\d+)`,
      'gi'
    )
  }

  /**
   * Return a single regex match from the PR title.
   *
   * When multiple matches are found, each invocation returns the subsequent match.
   *
   * @returns An array of issue keys or null if no matches are found.
   */
  check(): string[] | null {
    return this.re.exec(this.raw)
  }

  fix(): string {
    return this.raw.replace(this.re, (_, prefix: string, number: string) =>
      prefix.toUpperCase().concat('-', number)
    )
  }
}

async function fix(prefixes: string[], title: string): Promise<string> {
  return new Promise(resolve => resolve(new Fixer(prefixes, title).fix()))
}

export { Fixer, fix }

/**
 * @class Fixer
 * If possible, correct improperly formatted issue keys in the given string.
 *
 * @param prefixes A list of prefixes
 * @param raw The string to check and fix
 */
class Fixer {
  prefixes: string[]
  raw: string
  re: RegExp

  constructor(prefixes: string[], raw: string) {
    this.prefixes = prefixes
    this.raw = raw
    this.re = new RegExp(
      `(?<![a-z])(${prefixes.join('|')})[^A-Z0-9](\\d+)(?![A-Z])`,
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

  /**
   * Correct improperly formatted issue keys.
   *
   * @returns The corrected string.
   */
  fix(): string {
    return this.raw.replace(this.re, (_, prefix: string, number: string) =>
      prefix.toUpperCase().concat('-', number)
    )
  }
}

/**
 * Fix the issue keys in the PR title.
 *
 * @param prefixes An array of valid issue prefix strings
 * @param title The title of the PR to fix
 *
 * @returns The fixed PR title
 * @throws {Error} If no issue keys are found
 */
async function fix(prefixes: string[], title: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const fixer = new Fixer(prefixes, title)
    if (!fixer.check())
      return reject(new Error(`No issue keys found: ${fixer.raw}`))

    return resolve(fixer.fix())
  })
}

export { Fixer, fix }

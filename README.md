[![GitHub Super-Linter](https://github.com/bryant-finney/fix-pr-title/actions/workflows/linter.yml/badge.svg)](https://github.com/super-linter/super-linter)
![CI](https://github.com/bryant-finney/fix-pr-title/actions/workflows/ci.yml/badge.svg)
[![Check dist/](https://github.com/bryant-finney/fix-pr-title/actions/workflows/check-dist.yml/badge.svg)](https://github.com/actions/typescript-action/actions/workflows/check-dist.yml)
[![CodeQL](https://github.com/bryant-finney/fix-pr-title/actions/workflows/codeql-analysis.yml/badge.svg)](https://github.com/bryant-finney/fix-pr-title/actions/workflows/codeql-analysis.yml)
[![Coverage](./badges/coverage.svg)](./badges/coverage.svg)

# Fix PR Title V1

This action ensures PR titles include well-formatted Jira issue keys.

> _Created from the_ [`actions/typescript-action`] _template_

[`actions/typescript-action`]: https://github.com/actions/typescript-action

## Usage

An example of a minimal workflow is provided in
[`.github/workflows/example.yml`](./.github/workflows/example.yml).

1. Ensure the following permissions are set for the job:
   ```yaml
   permissions:
     pull-requests: write
   ```
2. Add the following two steps to a job in your workflow:

   ```yaml
   - id: fix
     uses: bryant-finney/fix-pr-title@v1
     with:
       # Check (and potentially fix) this string (required)
       title: ${{ github.event.pull_request.title }}

       # Specify which jira issue prefixes to enforce (required)
       prefixes: foo,bar,baz

   # the second step only runs if the first step made changes
   - if: ${{ steps.fix.outputs.fixed == 'true' }}

     env:
       # Store the PR number in an environment variable for readability
       PR_NUM: ${{ github.event.number }}

       # This example uses the `gh` CLI to edit the PR title
       GH_TOKEN: ${{ github.token }}

     # Apply the fix
     run: gh pr edit "$PR_NUM" --title "${{ steps.fix.outputs.title }}"
   ```

### Inputs

See [`action.yml`](./action.yml).

| Name       | Description                                                    | Required |
| ---------- | -------------------------------------------------------------- | -------- |
| `title`    | The PR title to check (and potentially fix)                    | Yes      |
| `prefixes` | A comma-separated list of valid jira issue prefixes to enforce | Yes      |

### Outputs

| Name    | Description                                                                   |
| ------- | ----------------------------------------------------------------------------- |
| `title` | The PR title after applying corrections (might not have changes)              |
| `fixed` | A string indicating whether the title was fixed (`"true"`) or not (`"false"`) |

## Contributing

### Development Setup

> [!NOTE]
>
> You'll need to have a reasonably modern version of
> [Node.js](https://nodejs.org) handy (20.x or later should work!). If you are
> using a version manager like [`nodenv`](https://github.com/nodenv/nodenv) or
> [`nvm`](https://github.com/nvm-sh/nvm), this template has a `.node-version`
> file at the root of the repository that will be used to automatically switch
> to the correct version when you `cd` into the repository. Additionally, this
> `.node-version` file is used by GitHub Actions in any `actions/setup-node`
> actions.

After you've cloned the repository to your local machine or codespace, perform
some initial setup steps:

1. 🛠 Install the dependencies

   ```bash
   npm install
   ```

1. 🏗 Package the TypeScript for distribution

   ```bash
   npm run bundle
   ```

1. ✅ Run the tests

   ```bash
   $ npm test

   PASS  ./index.test.js
     ✓ throws invalid number (3ms)
     ✓ wait 500 ms (504ms)
     ✓ test runs (95ms)

   ...
   ```

#### Visual Studio Code Setup

A baseline configuration for Visual Studio Code is included in this repository;
to use it:

```sh
# Copy the configuration file to the root of the repository
cp .vscode/fix-pr-title.code-workspace fix-pr-title.code-workspace

# Open the workspace in Visual Studio Code
code fix-pr-title.code-workspace
```

### How To

#### Update the Action Metadata

The [`action.yml`](action.yml) file defines metadata about your action, such as
input(s) and output(s). For details about this file, see
[Metadata syntax for GitHub Actions](https://docs.github.com/en/actions/creating-actions/metadata-syntax-for-github-actions).

Whenever the API of this action is changed, the [`action.yml`](action.yml) needs
to be updated accordingly.

#### Update the Action Code

The [`src/`](./src/) directory is the heart of your action! This contains the
source code that will be run when your action is invoked. There are a few things
to keep in mind when writing the action code:

- Most GitHub Actions toolkit and CI/CD operations are processed asynchronously.
  In `main.ts`, you will see that the action is run in an `async` function.

  ```javascript
  import * as core from '@actions/core'
  //...

  async function run() {
    try {
      //...
    } catch (error) {
      core.setFailed(error.message)
    }
  }
  ```

  For more information about the GitHub Actions toolkit, see the
  [documentation](https://github.com/actions/toolkit/blob/master/README.md).

1. Format the source code, execute tests, and build the `dist`

   ```bash
   npm run all
   ```

   > This step is important! It will run [`ncc`](https://github.com/vercel/ncc)
   > to build the final JavaScript action code with all dependencies included.
   > If you do not run this step, your action will not work correctly when it is
   > used in a workflow. This step also includes the `--license` option for
   > `ncc`, which will create a license file for all of the production node
   > modules used in your project.

1. Test the action out locally

   The [`@github/local-action`](https://github.com/github/local-action) utility
   can be used to test your action locally. It is a simple command-line tool
   that "stubs" (or simulates) the GitHub Actions Toolkit. This way, you can run
   your TypeScript action locally without having to commit and push your changes
   to a repository.

   The `local-action` utility can be run in the following ways:

   - Visual Studio Code Debugger

     Make sure to review and, if needed, update
     [`.vscode/launch.json`](./.vscode/launch.json)

   - Terminal/Command Prompt

     ```bash
     # npx local action <action-yaml-path> <entrypoint> <dotenv-file>
     npx local-action . src/main.ts .env
     ```

   You can provide a `.env` file to the `local-action` CLI to set environment
   variables used by the GitHub Actions Toolkit. For example, setting inputs and
   event payload data used by your action. For more information, see the example
   file, [`.env.example`](./.env.example), and the
   [GitHub Actions Documentation](https://docs.github.com/en/actions/learn-github-actions/variables#default-environment-variables).

For information about versioning this action, see
[Versioning](https://github.com/actions/toolkit/blob/master/docs/action-versioning.md)
in the GitHub Actions toolkit.

#### Validate the Action with CI

The action is referenced in a workflow file for testing; for details about this
test, see [`ci.yml`](./.github/workflows/ci.yml).

#### Publish a New Release

This project includes a helper script, [`script/release`](./script/release)
designed to streamline the process of tagging and pushing new releases for
GitHub Actions.

GitHub Actions allows users to select a specific version of the action to use,
based on release tags. This script simplifies this process by performing the
following steps:

1. **Retrieving the latest release tag:** The script starts by fetching the most
   recent SemVer release tag of the current branch, by looking at the local data
   available in your repository.
1. **Prompting for a new release tag:** The user is then prompted to enter a new
   release tag. To assist with this, the script displays the tag retrieved in
   the previous step, and validates the format of the inputted tag (vX.X.X). The
   user is also reminded to update the version field in package.json.
1. **Tagging the new release:** The script then tags a new release and syncs the
   separate major tag (e.g. v1, v2) with the new release tag (e.g. v1.0.0,
   v2.1.2). When the user is creating a new major release, the script
   auto-detects this and creates a `releases/v#` branch for the previous major
   version.
1. **Pushing changes to remote:** Finally, the script pushes the necessary
   commits, tags and branches to the remote repository. From here, you will need
   to create a new release in GitHub so users can easily reference the new tags
   in their workflows.

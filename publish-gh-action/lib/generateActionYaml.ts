import parsePackageJson, { ParsePackageJsonResult } from './parsePackageJson'
import parseReadme from './parseReadme'
import YAML from 'yaml'
import inputToEntry from './inputToEntry'

export interface GenerateActionYamlResult {
  actionYaml: string
  packageJson: ParsePackageJsonResult
}

/**
 * Reads `package.json` and `README.md` to get info about inputs and outputs.
 * Then generates an action yaml file.
 * @returns The `files` in package.json
 */
const generateActionYaml = async (): Promise<GenerateActionYamlResult> => {
  const projectDir = process.env.GITHUB_WORKSPACE ?? process.cwd()
  const [readme, packageJson] =
      await Promise.all([parseReadme(projectDir), parsePackageJson(projectDir)])
  const shell = 'bash'
  // eslint-disable-next-line no-template-curly-in-string
  const workingDirectory = '${{github.action_path}}'
  const commonEntries = { shell, 'working-directory': workingDirectory }
  const mainStepId = 'a'
  const actionYaml = YAML.stringify({
    name: readme.name,
    description: packageJson.description,
    inputs: Object.fromEntries(readme.inputs.map(inputToEntry)),
    outputs: Object.fromEntries(readme.outputs.map(inputToEntry).map(([k, v]) =>
      [k, { ...v, value: `\${{steps.${mainStepId}.outputs.${k}}} ` }])),
    runs: {
      using: 'composite',
      steps: [{
        run: 'pnpm i --only=prod',
        ...commonEntries
      }, {
        id: 'a',
        run: 'pnpm start',
        ...commonEntries,
        env: Object.fromEntries(readme.inputs.map(({ name }) =>
          [`INPUT_${name.toUpperCase()}`, `\${{inputs.${name}}}`]))
      }]
    }
  })
  return { actionYaml, packageJson }
}

export default generateActionYaml

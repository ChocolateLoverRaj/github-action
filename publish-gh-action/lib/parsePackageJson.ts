import jsonfile from 'jsonfile'
import { join } from 'path'

const { readFile } = jsonfile

export interface ParsePackageJsonResult {
  description: string
  main: string
  files: string[]
}

const parsePackageJson = async (projectDir: string): Promise<ParsePackageJsonResult> =>
  await readFile(join(projectDir, 'package.json'))

export default parsePackageJson

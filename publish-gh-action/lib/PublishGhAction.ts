import { Plugin } from 'release-it'
import { format } from 'release-it/lib/util'
import generateActionYaml from './generateActionYaml'
import { writeFile } from 'fs/promises'
import never from 'never'
import { readFileSync } from 'jsonfile'
import { join } from 'path'

const { name } = readFileSync(join(__dirname, '../package.json'))

class PublishGhAction extends Plugin {
  static isEnabled (): boolean {
    return true
  }

  tagName: string
  tagNameFormatted: string

  constructor ({ options }: any) {
    super(...arguments)
    this.tagName = options[name].tagName ?? never('Must specify tag name')
  }

  bump (version: any): void {
    this.tagNameFormatted = format(this.tagName, { version })
  }

  async release (): Promise<void> {
    const { actionYaml, packageJson, distPackageJson } = await generateActionYaml()
    if (!(packageJson.files instanceof Array)) throw new Error('Must specify files in package.json')
    await super.step({
      enabled: true,
      task: async (): Promise<void> => {
        await Promise.all([
          writeFile('action.yaml', actionYaml),
          writeFile('package.json', distPackageJson)
        ])
      },
      label: 'Create necessary files'
    })
    await super.step({
      enabled: true,
      task: async (): Promise<void> => {
        const previousCommit = await super.exec('git rev-parse HEAD') as string
        await super.exec(`git checkout --orphan ${this.tagNameFormatted}`)
        await super.exec('git reset')
        await super.exec(`git add -f action.yaml package.json ${packageJson.files.join(' ')}`)
        await super.exec('git commit -m "Build"')
        await super.exec(`git tag ${this.tagNameFormatted}`)
        await super.exec(`git push -f origin refs/tags/${this.tagNameFormatted}`)
        await super.exec(`git checkout -f ${previousCommit}`)
      },
      label: 'Create and push tag'
    })
  }
}

export = PublishGhAction

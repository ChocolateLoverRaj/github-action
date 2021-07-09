const { Plugin } = require('release-it')
const never = require('never')
const { format } = require('release-it/lib/util')
const major = require('semver/functions/major')
const minor = require('semver/functions/minor')
const { name } = require('./package.json')

class UpdateMinorTag extends Plugin {
  constructor ({ options }) {
    super(...arguments)
    this.tagName = options[name].tagName ?? never('No tagName specified')
  }

  bump (version) {
    this.targetTagName = format(this.tagName, { version })
    this.updateTagName = format(this.tagName, { version: `${major(version)}.${minor(version)}` })
  }

  async release () {
    await this.step({
      enabled: true,
      task: async () => {
        await this.exec(`git tag -f ${this.updateTagName} ${this.targetTagName}`)
        await this.exec(`git push -f origin ${this.updateTagName}`)
      },
      label: 'Create / Update and push tag'
    })
  }
}

module.exports = UpdateMinorTag

import { setOutput, getInput } from '@actions/core'

const str = getInput('str', { required: true })
setOutput('str', str.toUpperCase())

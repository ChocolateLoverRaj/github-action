import { setOutput, getInput } from '@actions/core'

const str = getInput('str')
setOutput('str', str.toUpperCase())

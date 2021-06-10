import { setOutput, getInput } from '@actions/core'

console.log(process.env)

const str = getInput('str', { required: true })
setOutput('str', str.toUpperCase())

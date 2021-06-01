import { setOutput, getInput } from '@actions/core'

const str = getInput('str', { required: true })
setOutput('str', str.toUpperCase())
console.log('Input', str, str.length)
console.log('Set output', str.toUpperCase())

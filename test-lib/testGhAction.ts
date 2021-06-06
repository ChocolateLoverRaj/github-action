import { spawn } from 'child_process'
import streamToString from 'stream-to-string'
import { once } from 'events'
import { EOL } from 'os'

const testGhAction = async (file: string, inputs: Record<string, string> = {}): Promise<Record<string, string>> => {
  const c = spawn('node', [file], {
    env: {
      ...process.env,
      ...Object.fromEntries(Object.entries(inputs).map(([k, v]) => [`INPUT_${k.toUpperCase()}`, v]))
    }
  })
  const stdoutStr = streamToString(c.stdout)
  const stderrStr = streamToString(c.stderr)
  const [code] = await once(c, 'exit')
  if (code !== 0) {
    throw new Error(
      `Process exited with code ${code as number}\n` +
      'Stderr is below:\n' +
      await stderrStr
    )
  }
  const setOutputStr = '::set-output name='
  return Object.fromEntries((await stdoutStr)
    .split(EOL)
    .map(str => {
      if (str.startsWith(setOutputStr)) {
        const keyValue = str.slice(setOutputStr.length).split('::')
        if (keyValue.length !== 2) throw new Error('Bad set output syntax')
        return keyValue
      }
      return undefined
    })
    .filter(v => v !== undefined) as any
  )
}

export default testGhAction

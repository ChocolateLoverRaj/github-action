import { parse } from 'md-2-json'
import { readFile } from 'fs/promises'
import { createMarkdownObjectTableSync } from 'parse-markdown-table'
import trimNewlines from 'trim-off-newlines'
import lowercaseObjectKeys from 'lowercase-object-keys'
import { join } from 'path'

export interface InputBase {
  name: string
}

export interface ParseReadmeResult {
  name: string
  inputs: Array<object & InputBase>
  outputs: Array<object & InputBase>
}

const parseReadme = async (projectDir: string): Promise<ParseReadmeResult> => {
  const [[name, subHeaders]] = Object.entries(parse(await readFile(join(projectDir, 'README.md'), 'utf8')))
  const raw = Object.fromEntries(Object.entries(subHeaders as object)
    .filter(entry => typeof entry[1] === 'object')
    .map(([k, v]) => [k.toLowerCase(), trimNewlines(v.raw)]))
  const inputs = ([...createMarkdownObjectTableSync(raw.inputs)] as Array<object & InputBase>).map(lowercaseObjectKeys) as any
  const outputs = ([...createMarkdownObjectTableSync(raw.outputs)] as Array<object & InputBase>).map(lowercaseObjectKeys) as any
  return { name, inputs, outputs }
}

export default parseReadme

import { InputBase } from './parseReadme'
import removeEmptyValues from './removeEmptyValues'

const inputToEntry = ({ name, ...input }: InputBase & object): [string, object] =>
  [name, removeEmptyValues(input)]

export default inputToEntry

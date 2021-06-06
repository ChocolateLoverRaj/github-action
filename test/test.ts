import testGhAction from '../test-lib/testGhAction'
import { join } from 'path'

test('works', async () => {
  await expect(testGhAction(join(__dirname, '../dist/index.js'), {
    str: 'guitar'
  })).resolves.toEqual({
    str: 'GUITAR'
  })
})

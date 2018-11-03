import Lab from 'lab'
import assert from 'assert'
import fs from 'fs'
import path from 'path'
import {getPage, loadFile} from './test-setup/test-common'

export const lab = Lab.script()

lab.experiment('Examples test', {timeout: 15000}, function () {
  let page = null

  async function loadPage (f) {
    return loadFile(page, f, {
      waitUntil: 'networkidle0'
    })
  }

  lab.before({timeout: 15000}, getPage(p => { page = p }))

  lab.test('Test all examples pages load without errors (does not test functionality)', {timeout: 50000}, async function () {
    const files = fs.readdirSync(path.join(__dirname, '../examples')).filter(f => f.endsWith('.html'))
    let isErrored = false

    page.on('error', (err) => {
      isErrored = err
    })
    page.on('pageerror', (err) => {
      isErrored = err
    })

    assert(!isErrored)

    for (let file of files) {
      await loadPage('../examples/' + file)
      if (isErrored) {
        throw new Error(`The example file ../examples/${file} threw an error ${isErrored}`)
      }
    }
  })
})

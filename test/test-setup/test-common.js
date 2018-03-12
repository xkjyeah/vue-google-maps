import Puppeteer from 'puppeteer'
import CompileStandalone from './compile-standalone'
import path from 'path'

const puppeteerPromise = CompileStandalone.then(() => {
  let options = {}

  if (process.env['THIS_IS_ON_TRAVIS_AND_SANDBOX_IS_NOT_ALLOWED'] === 'true') {
    options.args = ['--no-sandbox', '--disable-setuid-sandbox']
  }

  return Puppeteer.launch(options)
})

export function getPage (p) {
  return async () => {
    p(await puppeteerPromise.then(browser => browser.newPage()))
  }
}

export async function loadFile (page, relpath, options) {
  return page.goto('file:///' + path.join(__dirname, '../', relpath), options)
}

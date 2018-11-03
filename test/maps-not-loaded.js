import Lab from 'lab'
import assert from 'assert'
import {getPage, loadFile} from './test-setup/test-common'

export const lab = Lab.script()

lab.experiment('On-demand API loading', {timeout: 15000}, function () {
  let page = null

  async function loadPage () {
    return loadFile(page, './test-pages/test-page-without-maps.html', {
      waitUntil: 'networkidle0'
    })
  }

  async function mountVue () {
    return page.evaluateHandle(() =>
      new Promise((resolve) => {
        new Vue({
          data: {
            loadMap: false
          },
          mounted () {
            resolve(this)
          }
        }).$mount('#test1')
      }))
  }

  lab.before({timeout: 15000}, getPage(p => { page = p }))

  lab.test('Maps API is loaded only on demand', async function () {
    await loadPage()
    const vue = await mountVue()

    assert(await page.evaluate(
      (vue) => {
        const allScriptElements = Array.prototype.slice.call(document.getElementsByTagName('SCRIPT'), 0)
        return (
          allScriptElements.every(s => !s.src.toLowerCase().includes('maps.googleapis.com')) &&
          !window.google
        )
      },
      vue), 'Google APIs are not loaded')

    assert(await page.evaluate(
      (vue) => {
        return Promise.resolve(null)
          .then(() => {
            vue.loadMap = true

            return new Promise((resolve) => setTimeout(resolve, 100))
          })
          .then(() => vue.$refs.gmap.$mapPromise.then(() => !!window.google))
          .then((isGoogleLoaded) => {
            const allScriptElements = Array.prototype.slice.call(document.getElementsByTagName('SCRIPT'), 0)
            return (
              isGoogleLoaded &&
            allScriptElements.some(s => s.src.toLowerCase().includes('maps.googleapis.com'))
            )
          })
      },
      vue), 'Google APIs are loaded')
  })
})

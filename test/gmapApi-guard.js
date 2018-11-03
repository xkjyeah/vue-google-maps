import Lab from 'lab'
import assert from 'assert'
import {getPage, loadFile} from './test-setup/test-common'

export const lab = Lab.script()

lab.experiment('Effectiveness of gmapApi guard', {timeout: 15000}, function () {
  let page = null
  let isError = false

  async function loadPage () {
    return loadFile(page, './test-pages/test-gmapApi.html', {
      waitUntil: 'networkidle0'
    })
  }

  lab.before({timeout: 15000}, getPage(p => {
    isError = false
    page = p

    page.on('error', (err) => {
      isError = err
    })
    page.on('pageerror', (err) => {
      isError = err
    })
    return p
  }))

  lab.test('gmapGuard prevents errors', async function () {
    await loadPage()

    assert(!isError)
    assert(await page.evaluate(() => {
      return google && (window.vue.$refs.myMarker.position instanceof google.maps.LatLng)
    }), 'Marker is loaded with a position')
  })
})

import Lab from 'lab'
import assert from 'assert'
import fs from 'fs'
import path from 'path'
import {getPage, loadFile} from './test-setup/test-common'

export const lab = Lab.script()

lab.experiment('Basic tests', {timeout: 15000}, function () {
  let page = null

  async function loadPage () {
    return loadFile(page, './test-pages/test-plain-map.html', {
      waitUntil: 'domcontentloaded'
    })
  }

  async function mountVue () {
    return page.evaluateHandle(() =>
      new Promise((resolve) => {
        new Vue({
          created () {
            resolve(this)
          },
        }).$mount('#test1')
      }))
  }

  lab.before({timeout: 15000}, getPage(p => { page = p }))

  lab.test('Maps API is loaded', async function () {
    await loadPage()
    const vue = await mountVue()

    assert(await page.evaluate(() =>
      VueGoogleMaps.loaded.then(() => !!google.maps)),
    'google.maps is defined')

    assert(await page.evaluate(
      (vue) =>
        vue.$refs.map.$mapPromise
          .then(() => vue.$refs.map.$mapObject instanceof google.maps.Map),
      vue), '$mapPromise is defined')

    assert(await page.evaluate(
      (vue) =>
        vue.$refs.map.$mapObject
          .getDiv().parentNode.classList.contains('map-container'),
      vue),
    'Parent of $mapObject.div is a .map-container')
  })

  lab.test('Panning of map works', {timeout: 30000}, async function () {
    await loadPage()
    const vue = await mountVue()

    const [top, right, bottom, left] = await page.evaluate(() => {
      const el = document.querySelector('.map-container')
      const top = el.offsetTop
      const right = el.offsetLeft + el.offsetWidth
      const bottom = el.offsetTop + el.offsetHeight
      const left = el.offsetLeft

      return [top, right, bottom, left]
    })

    // Wait for map to load first...
    await page.evaluate((vue) =>
      vue.$refs.map.$mapPromise
        .then(() => new Promise(resolve => setTimeout(resolve, 500))),
      vue)

    // Then try to pan the page
    await page.mouse.move(right - 4, top + 4)
    await page.mouse.down()
    await page.mouse.move(left + 4, bottom - 4, {steps: 20})
    await new Promise(resolve => setTimeout(resolve, 100))
    await page.mouse.up()

    const {lat, lng} = await page.evaluate((vue) => {
      const c = vue.$refs.map.$mapObject.getCenter()
      return {lat: c.lat(), lng: c.lng()}
    }, vue)
    assert(lat > 1.45, 'Lat greater than 1.45')
    assert(lng > 103.9, 'Lng greater than 103.9')
  })

  lab.test('Lodash library is not bloating up the library', async () => {
    const libraryOutput = fs.readFileSync(
      path.join(__dirname, '../dist/vue-google-maps.js'),
      'utf-8'
    )

    if (/Lodash <http(.*)>/.test(libraryOutput)) {
      assert(false,
        'Lodash found! This is bad because you are bloating up the library')
    }
  })
})

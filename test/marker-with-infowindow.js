import Lab from 'lab'
import assert from 'assert'
import { getPage, loadFile } from './test-setup/test-common'

export const lab = Lab.script()

lab.experiment('Marker / Infowindow tests', { timeout: 15000 }, function () {
  let page = null

  async function loadPage () {
    return loadFile(page, './test-pages/test-marker-with-infowindow.html', {
      waitUntil: 'domcontentloaded'
    })
  }

  lab.before({ timeout: 15000 }, getPage(p => { page = p }))

  lab.test('Clicking the marker triggers the infowindow', async function () {
    await loadPage()

    await page.evaluate(() => {
      // Ensure that the map has been created
      return window.theVue.$refs.map.$mapPromise
        .then(() => {
        // Give some more time for the marker to initialize
          return new Promise(resolve => setTimeout(resolve, 100))
        })
    })

    // Is the infowindow hidden?
    assert(await page.evaluate(() => {
      return !document.getElementById('thediv') || (
        document.getElementById('thediv').offsetWidth === 0 &&
        document.getElementById('thediv').offsetHeight === 0
      )
    }),
    'infowindow is hidden')

    // Clicked is false
    assert(await page.evaluate(() => {
      return !window.theVue.clicked
    }),
    'marker is not clicked')

    // Obtain the center
    const [x, y] = await page.evaluate(() => {
      const el = window.theVue.$refs.map.$el

      return Promise.resolve([
        el.offsetLeft + 0.5 * el.offsetWidth,
        el.offsetTop + 0.5 * el.offsetHeight
      ])
    })

    await page.mouse.click(x, y - 20)

    // Clicked is now true!
    assert(await page.evaluate(() => {
      return new Promise(resolve => setTimeout(resolve, 100))
        .then(() => {
          return window.theVue.clicked
        })
    }),
    'marker is clicked')

    // Infowindow is now open!
    assert(await page.evaluate(() => {
      return document.getElementById('thediv').offsetWidth > 10
    }),
    '#thediv is visible')

    // shut the infowindow
    assert(await page.evaluate(() => {
      window.theVue.infoWindow.open = false
      return new Promise(resolve => setTimeout(resolve, 100))
        .then(() => {
          return !document.getElementById('thediv') || (
            document.getElementById('thediv').offsetWidth === 0 &&
            document.getElementById('thediv').offsetHeight === 0
          )
        })
    }), 'setting open=false closes #thediv')
  })
})

/// <reference types="vitest/globals" />
import fs from 'fs'
import jsdom from 'jsdom'
import morphdom from 'morphdom'

it('should call foo', () => {
  const {
    window: { document, MutationObserver }
  } = new jsdom.JSDOM(
    fs.readFileSync(__dirname + '/fixtures/counter.html', 'utf-8')
  )
  const container = document.createElement('div')
  container.innerHTML = `<span class="number" path="1-data[counter]">2</span>`

  let records: MutationRecord[] = []
  const dataObserver = new MutationObserver(
    rs => (records = records.concat(rs))
  )
  const elCurrent = document.querySelector('span.number')!
  expect(elCurrent.outerHTML).toMatchInlineSnapshot(
    `"<span class="number" path="1-data[counter]">1</span>"`
  )
  dataObserver.observe(elCurrent, {
    attributes: true,
    characterData: true,
    characterDataOldValue: true,
    childList: true,
    subtree: true
  })
  expect(elCurrent.textContent).toMatchInlineSnapshot(`"1"`)
  morphdom(elCurrent, container.firstChild!)
  expect(elCurrent.textContent).toMatchInlineSnapshot(`"2"`)
  // expect(callback.mock.calls.length).greaterThan(0)
  records = records.concat(dataObserver.takeRecords())
  expect(records.length).equal(1)
  expect(records[0].addedNodes).toMatchInlineSnapshot(`NodeList []`)
  expect(records[0].oldValue).toMatchInlineSnapshot(`"1"`)
  expect(records[0].target.textContent).toMatchInlineSnapshot(`"2"`)
})

/* eslint-disable @typescript-eslint/no-explicit-any */
import { deepMap, DeepMapStore } from 'nanostores'
import type { ViewHook } from 'phoenix_live_view'

export const registerIsland =
  <C>(name: string, createRoot: any, render: any, unmount: any) =>
  (components: Record<string, C>) => {
    const config = {} as ViewHook & {
      $store: DeepMapStore<any>
      component: string | null
      _rootEl: any
      children: string
      visit: ($store: DeepMapStore<any>, e: ChildNode, path: string) => any
      updateData: (rootEl: Element) => void
      render: () => void
    }
    Object.assign(config, {
      _rootEl: null,
      component: null,
      // dataObserver: null,
      $store: null,
      children: ''
    })
    config.visit = function ($store, e, path) {
      switch (e.nodeType) {
        case Node.ELEMENT_NODE: {
          switch (e.nodeName) {
            case 'SPAN': {
              let res: string | boolean | number | null
              switch (
                e.parentElement?.querySelector('span')?.getAttribute('class')
              ) {
                case 'null':
                  res = null
                  break
                case 'number':
                  res = Number(e.textContent)
                  break
                case 'boolean':
                  res = e.textContent === 'true'
                  break
                default:
                  res = e.textContent
              }
              $store.setKey(path, res)
              return res
            }
            case 'DL': {
              const map: Record<string, any> = {}
              let key = ''
              if (path) $store.setKey(path, {})
              e.childNodes.forEach(child => {
                if (child.nodeName === 'DT') {
                  key = child.textContent ?? ''
                } else if (child.nodeName == 'DD') {
                  child.childNodes.forEach(gc => {
                    if (map[key] === undefined) {
                      map[key] = this.visit(
                        $store,
                        gc,
                        path ? `${path}.${key}` : key
                      )
                    }
                  })
                }
              })
              return map
            }
            case 'UL': {
              const arr: any[] = []
              let idx = 0
              if (path) $store.setKey(path, [])
              e.childNodes.forEach(child => {
                if (child.nodeName === 'LI') {
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  let item: any = undefined
                  child.childNodes.forEach(gc => {
                    if (item === undefined) {
                      item = this.visit($store, gc, `${path}[${idx}]`)
                    }
                  })
                  arr.push(item)
                  idx += 1
                }
              })
              return arr
            }
          }
        }
      }
    }
    config.updateData = function (rootEl: Element) {
      rootEl.parentElement
        ?.querySelector('.phx-island_data')
        ?.childNodes.forEach(child => {
          if (child.nodeType == Node.ELEMENT_NODE) {
            return this.visit(this.$store, child, '')
          }
        })
    }
    config.mounted = function () {
      this.visit = this.visit.bind(this)
      this.pushEvent = this.pushEvent.bind(this)

      const rootEl = document
        .getElementById(this.el.id)!
        .querySelector('.phx-island_content')!
      this.component = rootEl.parentElement!.getAttribute('x-component')
      this._rootEl = createRoot(rootEl)
      this.$store = deepMap<any>({})
      // TODO: reduce tree traversal by DOM change detection
      /** 
          https://github.com/nanostores/nanostores -> supports multiple client framework
          https://github.com/bsalex/typed-path -> type-safe path watching
          this.dataObserver = new MutationObserver(console.log);
          this.dataObserver.observe(
            document.getElementById(this.el.id)!.querySelector(".phx-island_data")!,
            {
              attributes: true,
              characterData: true,
              characterDataOldValue: true,
              childList: true,
              subtree: true,
            }
          );
        */
      this.render()
    }

    config.destroyed = function () {
      if (!this._rootEl) return
      unmount(this._rootEl)
    }
    ;(config.updated = function () {
      this.render()
    }),
      (config.render = function () {
        if (!this.component) return
        const Component = components[this.component]
        const rootEl = document
          .getElementById(this.el.id)!
          .querySelector('.phx-island_content')!
        const children = rootEl.parentElement?.querySelector(
          '.phx-island_children'
        )?.innerHTML
        this.updateData(rootEl)
        if (this.children !== children) {
          console.log(this.el.id, 'children updated')
          render(this._rootEl, Component, {
            dispatch: this.pushEvent,
            store: this.$store,
            children
          })
          this.children = children ?? ''
        }
      })
    return { [name]: config }
  }

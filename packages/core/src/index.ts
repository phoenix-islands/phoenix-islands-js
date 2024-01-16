/* eslint-disable @typescript-eslint/no-explicit-any */
import { BaseDeepMap, deepMap, DeepMapStore } from 'nanostores'

import { GlobalData } from './data'

import type { ViewHook } from 'phoenix_live_view'
const settings = { debug: false }

if (window) {
  ;(window as any).setDebug = (v: boolean) => {
    settings.debug = v
  }
}
export const debug = (...args: any[]) => {
  if (settings.debug) {
    console.log(...args)
  }
}

export type Config = {
  childrenPassingMode?: 'sync'
  tunnel?: boolean | string[]
}

export type IslandProps<T extends BaseDeepMap, C = string> = {
  children: C | undefined
  store: DeepMapStore<T>
  globalStore: DeepMapStore<Partial<GlobalData>>
  proxyStore: DeepMapStore<Partial<GlobalData>>
} & Pick<ViewHook, 'pushEvent' | 'pushEventTo' | 'handleEvent'>

export const ATTRIBUTES = {
  COMPONENT: 'phx-island-component',
  GLOBAL_STORE_KEY: 'phx-island-global-store-key'
} as const

export const CLASSES = {
  ROOT: 'phx-island_root',
  DATA: 'phx-island_data',
  CONTENT: 'phx-island_content',
  CHILDREN: 'phx-island_children',
  MOUNTED_CHILDREN: 'phx-island_children-mounted'
} as const

const WINDOW_GLOBAL_STORE_KEY = '$phxIslandsStore'
const WINDOW_GLOBAL_STORE_KEY_TUNNEL_UNSUBSCRIBE = '$phxIslandsStoreUnsubscribe'
export const WINDOW_GLOBAL_PROXY_STORE_KEY = '$phxIslandsProxyStore'

const CLASS_QUERIES = Object.fromEntries(
  Object.entries(CLASSES).map(([k, v]) => [k, `.${v}`])
) as unknown as typeof CLASSES

export const registerIslands = <C, Root = any>(
  name: string,
  createRoot: (el: Element) => Root,
  render: (
    root: Root,
    Component: C,
    props: IslandProps<any>
  ) => null | undefined | (() => void),
  unmount: (root: Root) => void
) => {
  ;(window as any)[WINDOW_GLOBAL_STORE_KEY] =
    (window as any)[WINDOW_GLOBAL_STORE_KEY] ?? deepMap({})
  ;(window as any)[WINDOW_GLOBAL_PROXY_STORE_KEY] =
    (window as any)[WINDOW_GLOBAL_PROXY_STORE_KEY] ?? deepMap({})

  debug((window as any)[WINDOW_GLOBAL_STORE_KEY])

  return (components: Record<string, C>, config?: Config) => {
    const globalStore = (window as any)[
      WINDOW_GLOBAL_STORE_KEY
    ] as DeepMapStore<any>
    if (
      config?.tunnel &&
      !(window as any)[WINDOW_GLOBAL_STORE_KEY_TUNNEL_UNSUBSCRIBE] &&
      window.top
    ) {
      ;(window as any)[WINDOW_GLOBAL_STORE_KEY_TUNNEL_UNSUBSCRIBE] =
        globalStore.subscribe(data => {
          window.top?.postMessage({ type: 'phx_island_tunnel_updated', data })
        })
    }

    const viewHook = {} as ViewHook & {
      $store: DeepMapStore<any>
      component: string | null
      globalStoreKey: string | null
      _rootEl: any
      children: string
      unsubscribe?: null | (() => void)
      visit: ($store: DeepMapStore<any>, e: ChildNode, path: string) => any
      updateData: () => void
      render: () => void
      update: (initial?: boolean) => void
    }
    Object.assign(viewHook, {
      _rootEl: null,
      component: null,
      // dataObserver: null,
      $store: null,
      children: ''
    })
    viewHook.visit = function ($store, e, path) {
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

    viewHook.updateData = function () {
      let updated: any = undefined
      this.el.querySelector(CLASS_QUERIES.DATA)?.childNodes.forEach(child => {
        if (updated !== undefined) return
        if (child.nodeType == Node.ELEMENT_NODE) {
          updated = this.visit(this.$store, child, '')
        }
      })

      if (this.globalStoreKey) {
        debug(`[${this.el.id}] Update Data:`, this.globalStoreKey, updated)
        const globalStore: DeepMapStore<any> = ((window as any)[
          WINDOW_GLOBAL_STORE_KEY
        ] = (window as any)[WINDOW_GLOBAL_STORE_KEY] ?? deepMap({}))
        globalStore.setKey(this.globalStoreKey, updated)
      }
    }

    viewHook.mounted = function () {
      this.visit = this.visit.bind(this)
      this.pushEvent = this.pushEvent.bind(this)

      const rootEl = document
        .getElementById(this.el.id)!
        .querySelector(CLASS_QUERIES.CONTENT)!
      this.component = this.el.getAttribute(ATTRIBUTES.COMPONENT)
      debug(`[${this.el.id}] Mounting component:`, this.component)
      this.globalStoreKey =
        this.el.getAttribute(ATTRIBUTES.GLOBAL_STORE_KEY) ?? null
      debug(`[${this.el.id}] Register Data:`, this.globalStoreKey)
      if (this.component) {
        this._rootEl = createRoot(rootEl)
      }
      this.$store = deepMap<any>({})
      // TODO: reduce tree traversal by DOM change detection
      /** 
          https://github.com/nanostores/nanostores -> supports multiple client framework
          https://github.com/bsalex/typed-path -> type-safe path watching
          this.dataObserver = new MutationObserver(debug);
          this.dataObserver.observe(
            document.getElementById(this.el.id)!.querySelector(CLASS_QUERIES.DATA)!,
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
      this.update()
    }

    viewHook.destroyed = function () {
      if ((this._rootEl, this.component)) unmount(this._rootEl)
    }
    viewHook.updated = function () {
      this.update()
    }
    viewHook.update = function (initial) {
      if (this.component) {
        const childrenPassingMode = config?.childrenPassingMode || 'sync'
        if (initial || childrenPassingMode === 'sync') {
          setTimeout(() => {
            const children = this.el.querySelector(CLASS_QUERIES.CHILDREN)
            const mountedChildren = this.el.querySelector(
              CLASS_QUERIES.MOUNTED_CHILDREN
            )
            if (mountedChildren && children) {
              mountedChildren.innerHTML = children.innerHTML
              // morphdom(
              //   mountedChildren,
              //   childrenPassingMode === 'sync' ? children.outerHTML : children,
              //   { childrenOnly: true }
              // )
            }
          }, 0)
        }
      }
      this.updateData()
    }
    viewHook.render = function () {
      if (!this.component) return
      if (this.unsubscribe) {
        this.unsubscribe()
        this.unsubscribe = undefined
      }
      const Component = components[this.component]
      const children = this.el.querySelector(CLASS_QUERIES.CHILDREN)?.innerHTML
      this.updateData()
      if (this.children !== children) {
        debug(this.el.id, 'children updated')
        this.unsubscribe = render(this._rootEl, Component, {
          pushEvent: this.pushEvent,
          pushEventTo: this.pushEventTo,
          handleEvent: this.handleEvent,
          store: this.$store,
          globalStore: (window as any)[WINDOW_GLOBAL_STORE_KEY],
          proxyStore: (window as any)[WINDOW_GLOBAL_PROXY_STORE_KEY],
          children
        })
        this.children = children ?? ''
      }
    }
    return { [name]: viewHook }
  }
}

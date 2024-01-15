import morphdom from 'morphdom'
import { BaseDeepMap, deepMap, DeepMapStore } from 'nanostores'

/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ViewHook } from 'phoenix_live_view'

export interface GlobalData extends BaseDeepMap {}

export type Config = { childrenPassingMode?: 'sync' }
export type IslandProps<T extends BaseDeepMap> = {
  children: string | undefined
  store: DeepMapStore<T>
  globalStore: DeepMapStore<GlobalData>
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

const CLASS_QUERIES = Object.fromEntries(
  Object.entries(CLASSES).map(([k, v]) => [k, `.${v}`])
) as unknown as typeof CLASSES

export const registerIslands = <C, Root = any>(
  name: string,
  createRoot: (el: Element) => Root,
  render: (root: Root, Component: C, props: IslandProps<any>) => void,
  unmount: (root: Root) => void
) => {
  ;(window as any)[WINDOW_GLOBAL_STORE_KEY] =
    (window as any)[WINDOW_GLOBAL_STORE_KEY] ?? deepMap({})

  console.log((window as any)[WINDOW_GLOBAL_STORE_KEY])

  return (components: Record<string, C>, config?: Config) => {
    const viewHook = {} as ViewHook & {
      $store: DeepMapStore<any>
      component: string | null
      globalStoreKey: string | null
      _rootEl: any
      children: string
      visit: ($store: DeepMapStore<any>, e: ChildNode, path: string) => any
      updateData: (rootEl: Element) => void
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

    viewHook.updateData = function (rootEl: Element) {
      let updated: any = undefined
      rootEl.parentElement
        ?.querySelector(CLASS_QUERIES.DATA)
        ?.childNodes.forEach(child => {
          if (updated !== undefined) return
          if (child.nodeType == Node.ELEMENT_NODE) {
            updated = this.visit(this.$store, child, '')
          }
        })

      console.log(`[${this.el.id}] Update Data:`, this.globalStoreKey, updated)
      if (this.globalStoreKey) {
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
      this.component = rootEl.parentElement!.getAttribute(ATTRIBUTES.COMPONENT)
      console.log(`[${this.el.id}] Mounting component:`, this.component)
      this.globalStoreKey =
        rootEl.parentElement!.getAttribute(ATTRIBUTES.GLOBAL_STORE_KEY) ?? null
      console.log(`[${this.el.id}] Register Data:`, this.globalStoreKey)
      this._rootEl = createRoot(rootEl)
      this.$store = deepMap<any>({})
      // TODO: reduce tree traversal by DOM change detection
      /** 
          https://github.com/nanostores/nanostores -> supports multiple client framework
          https://github.com/bsalex/typed-path -> type-safe path watching
          this.dataObserver = new MutationObserver(console.log);
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
      if (!this._rootEl) return
      unmount(this._rootEl)
    }
    viewHook.updated = function () {
      this.update()
    }
    viewHook.update = function (initial) {
      if (!this.component) return
      const childrenPassingMode = config?.childrenPassingMode || 'sync'
      if (initial || childrenPassingMode === 'sync') {
        setTimeout(() => {
          const rootEl = document
            .getElementById(this.el.id)!
            .querySelector(CLASS_QUERIES.CONTENT)!
          const children = rootEl.parentElement?.querySelector(
            CLASS_QUERIES.CHILDREN
          )
          const mountedChildren = rootEl.querySelector(
            CLASS_QUERIES.MOUNTED_CHILDREN
          )
          // console.log(rootEl.outerHTML, mountedChildren, children)
          if (mountedChildren && children) {
            // console.log(mountedChildren.outerHTML, children.outerHTML)
            morphdom(
              mountedChildren,
              childrenPassingMode === 'sync' ? children.outerHTML : children,
              {
                childrenOnly: true
              }
            )
            // console.log(mountedChildren.outerHTML, children.outerHTML)
          }
        }, 0)
      }
      const rootEl = document
        .getElementById(this.el.id)!
        .querySelector(CLASS_QUERIES.CONTENT)!
      this.updateData(rootEl)
    }
    viewHook.render = function () {
      if (!this.component) return
      const Component = components[this.component]
      const rootEl = document
        .getElementById(this.el.id)!
        .querySelector(CLASS_QUERIES.CONTENT)!
      const children = rootEl.parentElement?.querySelector(
        CLASS_QUERIES.CHILDREN
      )?.innerHTML
      this.updateData(rootEl)
      if (this.children !== children) {
        console.log(this.el.id, 'children updated')
        render(this._rootEl, Component, {
          pushEvent: this.pushEvent,
          pushEventTo: this.pushEventTo,
          handleEvent: this.handleEvent,
          store: this.$store,
          globalStore: (window as any)[WINDOW_GLOBAL_STORE_KEY],
          children
        })
        this.children = children ?? ''
      }
    }
    return { [name]: viewHook }
  }
}

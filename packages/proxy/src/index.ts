import { WINDOW_GLOBAL_PROXY_STORE_KEY } from '@phoenix-islands/core'
import { ProxyData } from '@phoenix-islands/core/dist/data'
import { deepMap, DeepMapStore } from 'nanostores'

const origin = 'http://localhost:4000'

export class ProxyIsland extends EventTarget {
  iframe: HTMLIFrameElement | null
  store: DeepMapStore<ProxyData>
  constructor(query: string, allowedOrigin?: string) {
    super()
    this.iframe = document.querySelector(query)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    this.store = (window as any)[WINDOW_GLOBAL_PROXY_STORE_KEY] =
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (window as any)[WINDOW_GLOBAL_PROXY_STORE_KEY] ?? deepMap({})
    const listener = (e: MessageEvent) => {
      if (
        e.source == this.iframe?.contentWindow &&
        e.data.type === 'phx_island_tunnel_updated' &&
        e.origin === (allowedOrigin ?? origin)
      ) {
        const islandEvent = new Event('updated')
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ;(islandEvent as any).payload = e.data
        this.store.set(e.data.data)
        this.dispatchEvent(islandEvent)
      }
    }
    window.addEventListener('message', listener)
  }
}

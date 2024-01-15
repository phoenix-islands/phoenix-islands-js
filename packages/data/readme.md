# @phoenix-islands/data

**Phoenix Islands** is a library for creating islands of various frontend frameworks in Phoenix LiveView.

## Install

```bash
cd assets
npm i react @phoenix-islands/data
```

Or

```bash
yarn add @phoenix-islands/data
```

## Usage

### Install elixir library

Follow [instruction here to install server part](https://hexdocs.pm/phoenix_islands/readme.html)

### Register the component with live-view hooks

```tsx
import { registerReactIsland } from '@phoenix-islands/react'

let liveSocket = new LiveSocket('/live', Socket, {
  params: { _csrf_token: csrfToken },
  hooks: {
    ...registerDataIslands({
      Logger: {
        subscribe(store, globalStore) {
          const u1 = store.subscribe(console.log)
          const u2 = globalStore.subscribe(console.log)
          return () => {
            u1()
            u2()
          }
        }
      }
    })
  }
})
```

## License

![GitHub](https://img.shields.io/github/license/phoenix-islands/phoenix-islands-js)

A project by [Usage](https://www.usage.so) &copy; 2023.

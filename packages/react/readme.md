# @phoenix-islands/react

**Phoenix Islands** is a library for creating islands of various frontend frameworks in Phoenix LiveView.

## Install

```bash
cd assets
npm i react @phoenix-islands/react
```

Or

```bash
yarn add @phoenix-islands/react
```

## Usage

### Install elixir library

Follow [instruction here to install server part](https://hexdocs.pm/phoenix_islands/readme.html)

### 1. Create an island component

**Note** You might want to add `'./js/**/*.ts?'` to `tailwind.config.js` if you want to use typescript.

```tsx
import { ReactIslandProps, useStore } from '@phoenix-islands/react'
import React from 'react'

export const ReactCounter = ({
  store,
  children,
  pushEvent
}: ReactIslandProps<{ counter: number }>) => {
  const data = useStore(store)
  const [counter, setCounter] = React.useState(data.counter)
  React.useEffect(() => setCounter(data.counter ?? 0), [data.counter])
  return (
    <div className='w-full flex flex-col gap-3 items-stretch p-4 rounded-lg border-dashed border-zinc-500 border-2'>
      <div className='flex flex-row gap-3 items-center justify-between'>
        <div>Client State: {counter}</div>
        <button
          className='phx-submit-loading:opacity-75 rounded-lg bg-zinc-900 hover:bg-zinc-700 py-2 px-3 text-sm font-semibold leading-6 text-white active:text-white/80'
          onClick={() => {
            setCounter(counter + 1)
            pushEvent('update_counter', { counter: counter + 1 })
          }}
        >
          Client +1
        </button>
      </div>
      <div className='p-3 rounded-lg border-dashed border-zinc-300 border-2'>
        {children}
      </div>
    </div>
  )
}
```

### 2. Register the component with live-view hooks

```tsx
import { registerReactIsland } from '@phoenix-islands/react'

let liveSocket = new LiveSocket('/live', Socket, {
  params: { _csrf_token: csrfToken },
  hooks: {
    ...registerReactIslands({ ReactCounter })
  }
})
```

## License

![GitHub](https://img.shields.io/github/license/phoenix-islands/phoenix-islands-js)

A project by [Usage](https://www.usage.so) &copy; 2023.

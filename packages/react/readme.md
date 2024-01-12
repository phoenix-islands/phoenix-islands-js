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

### 1. Create an island component

**Note** You might want to add `'./js/**/*.ts?'` to `tailwind.config.js` if you want to use typescript.

```tsx
import { ReactIslandProps, useStore } from '@phoenix-islands/react'
import React from 'react'

export const ReactCounter = ({
  store,
  children,
  dispatch
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
            dispatch('update_counter', { counter: counter + 1 })
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

### 3. Use the component in Phoenix live-view

```elixir
      {:phoenix_islands, "~> 0.0.1"},
```

```elixir
defmodule MyApp.PageLive.Index do
  use MyApp, :live_view

  # add this
  import PhoenixIslands
end
```

```elixir
defmodule ExampleWeb.IslandsLive do
  use ExampleWeb, :live_view
  import PhoenixIslands

  def render(assigns) do
    ~H"""
    <div class="px-4 py-10 sm:px-6 sm:py-28 lg:px-8 xl:px-28 xl:py-32">
      <div class="mx-auto max-w-xl lg:mx-0">
        <p class="text-[1.2rem] mt-4 font-semibold leading-10 tracking-tighter text-zinc-900">
          Live View React Island
        </p>
        <.island id="1" component="ReactCounter" data={%{"counter" => @counter}}>
          <div class="w-full flex flex-row gap-3 items-center justify-between">
            <span>Server State: <%= @counter %></span>
            <button
              class="phx-submit-loading:opacity-75 rounded-lg bg-zinc-900 hover:bg-zinc-700 py-2 px-3 text-sm font-semibold leading-6 text-white active:text-white/80"
              phx-click="update_counter"
              phx-value-counter={@counter - 1}
            >
              LiveView -1
            </button>
          </div>
        </.island>
      </div>
    </div>
    """
  end

  def mount(_params, _session, socket) do
    {:ok, assign(socket, :counter, 1)}
  end

  def handle_event("update_counter", %{"counter" => counter}, socket) do
    {:noreply,
     assign(
       socket,
       :counter,
       if(is_binary(counter), do: String.to_integer(counter), else: counter)
     )}
  end
end
>
```

## License

![GitHub](https://img.shields.io/github/license/phoenix-islands/phoenix-islands-js)

A project by [Usage](https://www.usage.so) &copy; 2023.

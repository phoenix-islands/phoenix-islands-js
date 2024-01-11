# @phoenix-islands/react

**Phoenix Islands** is a library for creating islands of various frontend frameworks in Phoenix LiveView.

## Install

```bash
npm i @phoenix-islands/react
```

Or

```bash
yarn add @phoenix-islands/react
```

## Usage

### 1. Create an island component

```tsx
export const TestIsland = ({
  store,
  children,
}: ReactIslandProps<{ a: (string | number | boolean | null)[] }>) => {
  const data = useStore(store);
  return (
    <>
      <div className="p-3 rounded">
        React Component 2 - {JSON.stringify(data)}{" "}
      </div>
      {children}
    </>
  );
};
)
```

### 2. Register the component with live-view hooks

```tsx
import { registerReactIsland } from "@phoenix-islands/react";
let liveSocket = new LiveSocket("/live", Socket, {
  params: { _csrf_token: csrfToken },
  hooks: { 
    ...registerReactIsland({ Test, Test2, OverviewChart }),
  },
});
```
### 3. Use the component in Phoenix live-view

```elixir
      {:phoenix_islands, "~> 0.0.1"},
```

```elixir
  import PhoenixIslands
```

```elixir
  <.island
    id="2"
    component="Test2"
    data={
      %{
        "a" => [
          2 * @counter,
          "counter: #{@counter}",
          :test,
          rem(@counter, 2) == 0,
          nil,
          @counter / 3 * 1.0e-30
        ]
      }
    }
  >
    <div
      class="align-center mb-4 flex flex-row justify-between rounded-lg bg-green-50 p-4 text-sm text-green-800 dark:bg-gray-800 dark:text-green-400"
      role="alert"
    >
      <div>
        [Live View] <span class="font-medium">Counter: <%= @counter %></span>
      </div>
      <.button color="alternative" phx-click="incr">phx-click -1</.button>
    </div>
  </.island>
```

## License

![GitHub](https://img.shields.io/github/license/phoenix-islands/phoenix-islands-js)

A project by [Usage](https://www.usage.so) &copy; 2023.

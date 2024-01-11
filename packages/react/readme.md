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

## License

![GitHub](https://img.shields.io/github/license/phoenix-islands/phoenix-islands-js)

A project by [Usage](https://www.usage.so) &copy; 2023.

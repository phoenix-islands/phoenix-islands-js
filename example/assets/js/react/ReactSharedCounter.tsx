import { ReactIslandProps, useStore } from "@phoenix-islands/react";
import React from "react";

export const ReactSharedCounter = ({
  globalStore,
  children,
  pushEvent,
}: ReactIslandProps<{ counter: number }>) => {
  const data = useStore(globalStore);
  const [counter, setCounter] = React.useState(data.counterData?.counter);
  React.useEffect(
    () => setCounter(data.counterData?.counter ?? 0),
    [data.counterData?.counter],
  );
  return (
    <div className="w-full flex flex-col gap-3 items-stretch p-4 rounded-lg border-zinc-500 border overflow-hidden relative">
      <div className="absolute top-0 left-0 px-1.5 py-0.5 text-white bg-zinc-500 font-semibold text-xs rounded-br">
        REACT ISLAND
      </div>
      <div className="flex flex-row gap-3 items-center justify-between">
        <div>Global State: {data.counterData.counter}</div>
        <div>Local State: {counter}</div>
        <button
          className="phx-submit-loading:opacity-75 rounded-lg bg-zinc-900 hover:bg-zinc-700 py-2 px-3 text-sm font-semibold leading-6 text-white active:text-white/80"
          onClick={() => {
            setCounter(counter + 1);
            pushEvent("update_counter", { counter: counter + 1 });
          }}
        >
          Island +1
        </button>
      </div>
      <div className="p-3 rounded-lg border-dashed border-zinc-300 border-2">
        {children}
      </div>
    </div>
  );
};

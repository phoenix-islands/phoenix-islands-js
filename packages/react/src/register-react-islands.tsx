/* eslint-disable @typescript-eslint/no-explicit-any */
import { GlobalData, registerIslands, CLASSES } from '@phoenix-islands/core'
import React from 'react'
import { createRoot, Root } from 'react-dom/client'

// import parse from 'html-react-parser'
import type { DeepMapStore, BaseDeepMap } from 'nanostores'
import type { ViewHook } from 'phoenix_live_view'
export type ReactIslandProps<T extends BaseDeepMap> = React.PropsWithChildren<
  {
    store: DeepMapStore<T>
    globalStore: DeepMapStore<GlobalData>
  } & Pick<ViewHook, 'pushEvent' | 'pushEventTo' | 'handleEvent'>
>

export const registerReactIslands = registerIslands(
  'ReactIsland',
  createRoot,
  (
    root: Root,
    Component: React.FC<ReactIslandProps<any>>,
    props: ReactIslandProps<any>
  ) =>
    root.render(
      <React.StrictMode>
        <Component
          {...props}
          children={<div className={CLASSES.MOUNTED_CHILDREN} />}
        />
      </React.StrictMode>
    ),
  (root: Root) => root.unmount()
)

export default registerReactIslands

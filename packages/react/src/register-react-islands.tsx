/* eslint-disable @typescript-eslint/no-explicit-any */
import { CLASSES, registerIslands } from '@phoenix-islands/core'
import { GlobalData } from '@phoenix-islands/core/dist/global-data'
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
    void root.render(
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

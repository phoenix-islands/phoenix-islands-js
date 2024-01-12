/* eslint-disable @typescript-eslint/no-explicit-any */
import { registerIslands } from '@phoenix-islands/core'
import parse from 'html-react-parser'
import React from 'react'
import { createRoot, Root } from 'react-dom/client'

import type { DeepMapStore, BaseDeepMap } from 'nanostores'
import type { ViewHook } from 'phoenix_live_view'
export type ReactIslandProps<T extends BaseDeepMap> = React.PropsWithChildren<{
  dispatch: ViewHook['pushEvent']
  store: DeepMapStore<T>
}>

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
          children={props.children && parse(props.children)}
        />
      </React.StrictMode>
    ),
  (root: Root) => root.unmount()
)

export default registerReactIslands

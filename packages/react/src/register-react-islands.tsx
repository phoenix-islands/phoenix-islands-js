/* eslint-disable @typescript-eslint/no-explicit-any */
import { CLASSES, IslandProps, registerIslands } from '@phoenix-islands/core'
import React from 'react'
import { createRoot, Root } from 'react-dom/client'

import type { BaseDeepMap } from 'nanostores'

export type ReactIslandProps<T extends BaseDeepMap> = IslandProps<
  T,
  React.ReactNode
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

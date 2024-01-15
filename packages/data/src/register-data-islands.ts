/* eslint-disable @typescript-eslint/no-explicit-any */
import { IslandProps, registerIslands } from '@phoenix-islands/core'

import type { BaseDeepMap } from 'nanostores'

export type DataComponent<T extends BaseDeepMap> = {
  subscribe?: (
    store: IslandProps<T>['store'],
    globalStore: IslandProps<T>['globalStore']
  ) => () => void
}

export const registerDataIslands = registerIslands<DataComponent<any>, null>(
  'DataIsland',
  () => null,
  (root, Component: DataComponent<any>, props: IslandProps<any>) =>
    Component.subscribe?.(props.store, props.globalStore),
  () => null
)

export default registerDataIslands

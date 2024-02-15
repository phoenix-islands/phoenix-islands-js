import { BaseDeepMap } from 'nanostores'

export type IslandData = BaseDeepMap
export interface GlobalData extends IslandData {}
export interface ProxyData extends IslandData {}

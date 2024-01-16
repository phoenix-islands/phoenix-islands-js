import { BaseDeepMap } from "nanostores";

declare module "@phoenix-islands/core/dist/data" {
  export interface GlobalData extends BaseDeepMap {
    counterData?: {
      counter: number;
    };
  }
  export interface Proxy extends BaseDeepMap {
    counterData?: {
      counter: number;
    };
  }
}

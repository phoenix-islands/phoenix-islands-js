import { BaseDeepMap } from "nanostores";

declare module "@phoenix-islands/core/dist/global-data" {
  export interface GlobalData extends BaseDeepMap {
    counterData?: {
      counter: number;
    };
  }
}

import { Library } from "../helpers/firebase.interface";

export interface StoreType {
  auth: any,
  dashboard: {
    libraries: Library[]
  },
  player: any
}

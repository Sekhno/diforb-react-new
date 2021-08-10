import { Library } from "../helpers/firebase.interface";

export interface StoreType {
  auth: {
    isLogged: boolean
  },
  dashboard: {
    libraries: Library[]
  },
  player: {
    playing: boolean
  }
}

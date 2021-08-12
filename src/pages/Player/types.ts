import { Library } from "../../helpers/firebase.interface"

export type SideType = 'left' | 'right'

export type ReverbType = 'room' | 'hall' | 'stadium'

export enum SoundListType {
  category = 'category',
  sub = 'subcategory',
  sound = 'sound'
}

export enum MouseEvents  {
  MOUSEDOWN = 'mousedown',
  MOUSEUP = 'mouseup',
  MOUSEMOVE = 'mousemove'
}

export enum TouchEvents {
  TOUCHSTART = 'touchstart',
  TOUCHEND = 'touchend',
  TOUCHMOVE = 'touchmove'

}

export enum KeypressEvent {
  KEYDOWN = 'keydown'
}

export enum ReverbsEnum {
  Room = 'room',
  Hall = 'hall',
  Stadium = 'stadium'
}

export interface PropsSliderInterface {
  onChange?: (gain: number) => void
  onChangeReverbType?: (type: ReverbsEnum) => void
}

export interface PropsSideInterface {
  library: Library
  loading: boolean
  onChangeSound: (url: string) => void
  onActive: (active: ActiveSound) => void
}

export interface ActiveSound {
  category: string
  sub: string
  sound: string
}


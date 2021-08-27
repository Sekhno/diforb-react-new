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
  setAdditionalSides?: Function
  additionalSides?: boolean
  leftReverbState?: ReverState
	rightReverbState?: ReverState
	leftAdditionalReverbState?: ReverState
	rightAdditionalReverbState?: ReverState
}

export interface PropsSideInterface {
  mode?: 'main' | 'main2' | 'extra' | 'extra2'
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

export interface ReverState {
  [key: string]: boolean
  // room: boolean,
  // hall: boolean,
  // stadium: boolean
}

export interface StateToProps {
  player: { 
    playing: boolean 
  }
}

export enum SessionStorage {
  Timeshift = '[Timeshift]',
  TimeshiftAdditional = '[TimeshiftAdditional]',
  LeftVolume = '[LeftVolume]',
  LeftVolumeAdditional = '[LeftVolumeAdditional]',
  RightVolume = '[RightVolume]',
  RightVolumeAdditional = '[RightVolumeAdditional]',
  LeftReverbVolume = '[LeftReverbVolume]',
  RightReverbVolume = '[RightReverbVolume]',
  LeftReverbVolumeAdditional = '[LeftReverbVolumeAdditional]',
  RightReverbVolumeAdditional = '[RightReverbVolumeAdditional]'
}


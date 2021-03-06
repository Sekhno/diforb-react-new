import React, { forwardRef, RefObject, createRef, LegacyRef } from 'react'
import { loadRecordFile } from '../../../services/audio/audio.instance'
import { ReverbsEnum, ReverState, Side } from '../types'
import Timeshift 	from './Timeshift'
import VolumeLeft from './VolumeLeft'
import VolumeRight from './VolumeRight'
import Knob from './Knob'
import ReverbLeft from './ReverbLeft'
import ReverbRight from './ReverbRight'
import styles 		from './Player.module.scss'
import { useEffect } from 'react'
import { useState } from 'react'

interface PlayerPropsInterface {
	id: string
	playing: boolean | undefined
	changeTimeshiftValue: (gain: number) => void
	changeLeftVolumeValue: (gain: number) => void
	changeRightVolumeValue: (gain: number) => void
	changeLeftPitchValue: (gain: number) => void
	changeRightPitchValue: (gain: number) => void
	changeLeftReverVolumeGain: (gain: number) => void
	changeRightReverVolumeGain: (gain: number) => void
	changeLeftReverType: (gain: ReverbsEnum) => void
	changeRightReverType: (gain: ReverbsEnum) => void
	onClickPlay: () => void
	onClickStop: () => void
	additionalSides: boolean
	setAdditionalSides: Function
	leftReverbState: ReverState
	rightReverbState: ReverState
	leftAdditionalReverbState: ReverState
	rightAdditionalReverbState: ReverState
}

export const Player = forwardRef((props: PlayerPropsInterface, ref) => {
	const { 
		id, playing, additionalSides,
		leftReverbState, rightReverbState,
		leftAdditionalReverbState, rightAdditionalReverbState,
		setAdditionalSides,
		changeTimeshiftValue,
		changeLeftVolumeValue,
		changeRightVolumeValue,
		changeLeftPitchValue,
		changeRightPitchValue,
		changeLeftReverVolumeGain,
		changeRightReverVolumeGain,
		changeLeftReverType,
		changeRightReverType,
		onClickPlay,
		onClickStop
	} = props
	
	const [ isRecord, setIsRecord ] = useState(false)
	const [ recordUrl, setRecordUrl ] = useState('')

	useEffect(() => {
		if (playing) setIsRecord(true)
		if (isRecord) {
			loadRecordFile().then(url => setRecordUrl(url as string))
		}
	}, [ playing ])
	
	return (
		<div className = { styles.wrapper }>
			<div className = { styles.holder }>
				<div className = { styles.inner }>
					<div className = { styles.wave }>
						<div className = { styles.waveHolder }>
							<div className =  { styles.waveInner }>
								<div className = { styles.analizer }>
									<canvas 
										style = {{ opacity: playing ? '1' : '0' }}
										ref = { ref as RefObject<HTMLCanvasElement> }
									></canvas>
								</div> 
								<div className = { styles.title } style = {{ opacity: playing ? '0' : '1' }}>
									<i className = 'icon-logo'></i>
									<h1>{ id }</h1>
								</div>
							</div>
						</div>
					</div>
					<div className = { styles.timeshift }>
						<Timeshift 
							additionalSides = { additionalSides }
							setAdditionalSides = { setAdditionalSides }
							onChange = {(gain) => changeTimeshiftValue(gain)}
						/>
					</div>
					<div className = { styles.sliderMiddle }>
						<div className = { styles.sliderMiddleLeft }>
							<VolumeLeft 
								additionalSides = { additionalSides }
								setAdditionalSides = { setAdditionalSides }
								onChange = { changeLeftVolumeValue }
							/>
						</div>
						<div className = { styles.sliderMiddleRight }>
							<VolumeRight 
								additionalSides = { additionalSides }
								setAdditionalSides = { setAdditionalSides }
								onChange = { changeRightVolumeValue }
							/>
						</div>
					</div>
					<div className = { styles.pitchWrappers }>
						<div className = { styles.pitchLeft }>
							<Knob 
								side = { Side.Left }
								additionalSides = { additionalSides }
								setAdditionalSides = { setAdditionalSides }
								onChange = { changeLeftPitchValue }
							/>
						</div>
						<div className = { styles.pitchRight }>
							<Knob 
								side = { Side.Right }
								additionalSides = { additionalSides }
								setAdditionalSides = { setAdditionalSides }
								onChange = { changeRightPitchValue }
							/>
						</div>
					</div>
					<div className = { styles.sliderBottom }>
						<div className = { styles.sliderBottomLeft }>
							<ReverbLeft 
								additionalSides = { additionalSides }
								setAdditionalSides = { setAdditionalSides }
								leftReverbState = { leftReverbState }
								leftAdditionalReverbState = { leftAdditionalReverbState }
								onChange = { changeLeftReverVolumeGain } 
								onChangeReverbType = { changeLeftReverType }
							/>
						</div>
						<div className = { styles.bottomControl }>
							<button className = { styles.btnPlay } onClick = { playing ? onClickStop : onClickPlay }>
								<i className = { playing ? 'icon-pause' : 'icon-play' }></i>
							</button>
							<a className = { styles.btnDownload } style = {{pointerEvents: !recordUrl ? 'none' : 'auto'}}
								href = { recordUrl } download = 'output.wav' 
							>Download</a>
						</div>
						<div className = { styles.sliderBottomRight }>
							<ReverbRight 
								additionalSides = { additionalSides }
								setAdditionalSides = { setAdditionalSides }
								rightReverbState = { rightReverbState }
								rightAdditionalReverbState = { rightAdditionalReverbState }
								onChange = { changeRightReverVolumeGain } 
								onChangeReverbType = { changeRightReverType }
							/>
						</div>
					</div>
				</div>
			</div>
			
		</div>
	)
})

export default Player
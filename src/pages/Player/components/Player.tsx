import React, { forwardRef, RefObject } from 'react'
import { ReverbsEnum } from '../types'
import Timeshift 	from './Timeshift'
import VolumeLeft from './VolumeLeft'
import VolumeRight from './VolumeRight'
import Knob from './Knob'
import ReverbLeft from './ReverbLeft'
import ReverbRight from './ReverbRight'
import styles 		from './Player.module.scss'

interface PlayerPropsInterface {
	playing: boolean | undefined
	changeTimeshiftValue: (gain: number) => void
	changeLeftVolumeValue: (gain: number) => void
	changeRightVolumeValue: (gain: number) => void,
	changeLeftPitchValue: (gain: number) => void,
	changeRightPitchValue: (gain: number) => void,
	changeLeftReverVolumeGain: (gain: number) => void,
	changeRightReverVolumeGain: (gain: number) => void,
	changeLeftReverType: (gain: ReverbsEnum) => void,
	changeRightReverType: (gain: ReverbsEnum) => void,
	onClickPlay: () => void
}

export const Player = forwardRef((props: PlayerPropsInterface, ref) => {
	const { 
		playing,
		changeTimeshiftValue,
		changeLeftVolumeValue,
		changeRightVolumeValue,
		changeLeftPitchValue,
		changeRightPitchValue,
		changeLeftReverVolumeGain,
		changeRightReverVolumeGain,
		changeLeftReverType,
		changeRightReverType,
		onClickPlay
	} = props
	
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
									<h1>{ 'Interface' }</h1>
								</div>
							</div>
						</div>
					</div>
					<div className = { styles.timeshift }>
						<Timeshift onChange = {(gain) => changeTimeshiftValue(gain)}/>
					</div>
					<div className = { styles.sliderMiddle }>
						<div className = { styles.sliderMiddleLeft }>
							<VolumeLeft onChange = { changeLeftVolumeValue }/>
						</div>
						<div className = { styles.sliderMiddleRight }>
							<VolumeRight onChange = { changeRightVolumeValue }/>
						</div>
					</div>
					<div className = { styles.pitchWrappers }>
						<div className = { styles.pitchLeft }>
							<Knob onChange = { changeLeftPitchValue }/>
						</div>
						<div className = { styles.pitchRight }>
							<Knob onChange = { changeRightPitchValue }/>
						</div>
					</div>
					<div className = { styles.sliderBottom }>
						<div className = { styles.sliderBottomLeft }>
							<ReverbLeft 
								onChange = { changeLeftReverVolumeGain } 
								onChangeReverbType = { changeLeftReverType }
							/>
						</div>
						<div className = { styles.bottomControl }>
							<button className = { styles.btnPlay } onClick = { onClickPlay }>
								<i className = { playing ? 'icon-pause' : 'icon-play' }></i>
							</button>
							<button className = { styles.btnDownload }>Download</button>
						</div>
						<div className = { styles.sliderBottomRight }>
							<ReverbRight 
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
import React, { forwardRef, RefObject, createRef, LegacyRef } from 'react'
import { loadRecordFile } from '../../../services/audio/audio.instance'
import { ReverbsEnum } from '../types'
import TabletTimeshift 	from './TabletTimeshift'
import TabletVolumeLeft from './TabletVolumeLeft'
import TabletVolumeRight from './TabletVolumeRight'
import Knob from './Knob'
import TabletReverbLeft from './TabletReverbLeft'
import TabletReverbRight from './TabletReverbRight'
import styles 		from './Player.module.scss'
import { useEffect } from 'react'
import { useState } from 'react'

interface PlayerPropsInterface {
	id: string
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
	onClickPlay: () => void,
	onClickStop: () => void
}

export const Player = forwardRef((props: PlayerPropsInterface, ref) => {
	const { 
		id, playing,
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
						<TabletTimeshift onChange = {(gain) => changeTimeshiftValue(gain)}/>
					</div>
					<div className = { styles.sliderMiddle }>
						<div className = { styles.sliderMiddleLeft }>
							<TabletVolumeLeft onChange = { changeLeftVolumeValue }/>
						</div>
						<div className = { styles.sliderMiddleRight }>
							<TabletVolumeRight onChange = { changeRightVolumeValue }/>
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
							<TabletReverbLeft 
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
							<TabletReverbRight 
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
import React from 'react'
import Timeshift 	from './Timeshift'
import VolumeLeft from './VolumeLeft'
import VolumeRight from './VolumeRight'
import Knob from './Knob'
import ReverbLeft from './ReverbLeft'
import ReverbRight from './ReverbRight'
import styles 		from './Player.module.scss'

export const Player = () => {
	return (
		<div className = { styles.wrapper }>
			<div className = { styles.holder }>
				<div className = { styles.inner }>
					<div  className = { styles.wave }>
						<div className = { styles.waveHolder }>
							<div className =  { styles.waveInner }>
								<i className = 'icon-logo'></i>
								<h1>{ 'Interface' }</h1>
							</div>
						</div>
					</div>
					<div className = { styles.timeshift }>
						<Timeshift/>
					</div>
					<div className = { styles.sliderMiddle }>
						<div className = { styles.sliderMiddleLeft }>
							<VolumeLeft />
						</div>
						<div className = { styles.sliderMiddleRight }>
							<VolumeRight />
						</div>
					</div>
					<div className = { styles.pitchWrappers }>
						<div className = { styles.pitchLeft }>
							<Knob onChange = {(v: number) => console.log(v)}/>
						</div>
						<div className = { styles.pitchRight }>
							<Knob onChange = {(v: number) => console.log(v)}/>
						</div>
					</div>
					<div className = { styles.sliderBottom }>
						<div className = { styles.sliderBottomLeft }>
							<ReverbLeft 
								onChange = {(gain) => console.log(gain)} 
								onChangeReverbType = {(type) => console.log(type)}
							/>
						</div>
						<div className = { styles.bottomControl }>
							<button>Play</button>
							<button>Download</button>
						</div>
						<div className = { styles.sliderBottomRight }>
							<ReverbRight 
								onChange = {(gain) => console.log(gain)} 
								onChangeReverbType = {(type) => console.log(type)}
							/>
						</div>
					</div>
				</div>
			</div>
			
		</div>
	)
}

export default Player
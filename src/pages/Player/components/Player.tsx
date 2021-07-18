import React from 'react'
import Timeshift 	from './Timeshift'
import VolumeLeft from './VolumeLeft'
import VolumeRight from './VolumeRight'
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
				</div>
			</div>
			
		</div>
	)
}

export default Player
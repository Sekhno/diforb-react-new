import React, { useEffect, useRef, useState } from 'react'
import { fromEvent, Subscription } from 'rxjs'
import { MouseEvents, ReverbsEnum, SessionStorage } from '../types'
import { PropsSliderInterface } from '../types'
import styles from './RangeSlider.module.scss'

const RADIUS = 256
const OFFSETX = -290
const OFFSETY = 400
const STARTANGLE = Math.PI * 1.15
const ENDANGLE = Math.PI * 1.313
const DIFFANGLE = STARTANGLE - ENDANGLE
const TOP = 10, BOTTOM = 96
const STEP = DIFFANGLE / (BOTTOM - TOP)
const reverConfigs = [
	{ x: 137, y: 10, title: ReverbsEnum.Room },
	{ x: 117, y: 28, title: ReverbsEnum.Hall },
	{ x: 95, y: 47, title: ReverbsEnum.Stadium }
]



export const ReverbRight = (props: PropsSliderInterface) => {
	const [ current, setCurrent ] = useState<string | null>(null)
  const clipRef: React.MutableRefObject<SVGRectElement | null> = useRef(null)
  const handlerRef: React.MutableRefObject<SVGAElement | null> = useRef(null)
	const { 
		onChange, onChangeReverbType, 
		additionalSides, setAdditionalSides,
		rightReverbState, rightAdditionalReverbState 
	} = props
  
  let angle = STARTANGLE - DIFFANGLE / 2
  let centerX = RADIUS + OFFSETX, centerY = RADIUS - OFFSETY
  let X, Y

	const translateHandler = (value: number) => {
    const offsetY = BOTTOM - value
    angle = STARTANGLE + (offsetY - BOTTOM) * STEP
		X = Math.ceil(centerX - RADIUS * Math.sin(angle))
		Y = Math.ceil(centerY - RADIUS * Math.cos(angle))
		handlerRef?.current?.setAttribute('transform', `translate(${X}, ${Y})`)  
		clipRef.current?.setAttribute('y', String(offsetY))
		onChange && onChange(value)
  }
  const handlerMove = (event: Event) => {
    const { offsetY } = (event as MouseEvent)
    if (offsetY > TOP && offsetY <= BOTTOM) {
      const value = (BOTTOM - offsetY)
      setAdditionalSides && setAdditionalSides(
        (prevState: boolean) => {
          console.log(prevState)
          if (prevState) {
            sessionStorage.setItem(SessionStorage.RightReverbVolumeAdditional, `${value}`)
          } else {
            sessionStorage.setItem(SessionStorage.RightReverbVolume, `${value}`)
          }
          return prevState
        }
      )
      translateHandler(value)
    }
  }
	const clickHandle = (type: ReverbsEnum) => {
		onChangeReverbType && onChangeReverbType(type)
		setCurrent(type === current ? null : type)
	}
	const reverbBtns = reverConfigs.map((value, index) => {
		index = index + 1

		return (
			<g
				key = { 'reverb_right_' + index }
				className = { styles.reverbButton }
				transform = { `translate(${ value.x }, ${ value.y })` }
				onClick = {() => clickHandle(value.title)}
			>
				<g className = { current === value.title ? styles.active : '' }>
					<path className = { styles.reverbButtonBorder } d='M7.995,2c2.375,0,4.626,1.421,5.57,3.761c1.241,3.071-0.243,6.565-3.314,7.804
						C9.516,13.859,8.757,14,8.011,14c-2.375,0-4.625-1.42-5.569-3.758C1.201,7.17,2.685,3.675,5.756,2.437C6.49,2.14,7.249,2,7.995,2
						M7.995,0C6.97,0,5.965,0.196,5.009,0.581C3.027,1.38,1.476,2.903,0.641,4.87c-0.834,1.966-0.854,4.14-0.053,6.12
						C1.817,14.033,4.731,16,8.011,16c1.025,0,2.03-0.195,2.987-0.582c1.98-0.797,3.531-2.318,4.366-4.285
						c0.836-1.965,0.855-4.141,0.055-6.122C14.19,1.968,11.276,0,7.995,0L7.995,0z' />
					<linearGradient id={'SLIDER_REVERB_ACTIVE_' + index} gradientUnits='userSpaceOnUse' x1='3.0508' y1='3.0498' x2='12.9551' y2='12.9541'>
						<stop offset='0' style={{ stopColor: '#D6D5DE' }} />
						<stop offset='0.7108' style={{ stopColor: '#FFFFFF' }} />
					</linearGradient>
					<path className = { styles.reverbButtonWrapper } fill={`url(#SLIDER_REVERB_ACTIVE_${index})`} d='M13.803,11.922c0.013-0.019,0.023-0.039,0.035-0.058c0.11-0.167,0.216-0.337,0.312-0.514
						c0.215-0.397,0.393-0.814,0.528-1.246c0.056-0.177,0.101-0.356,0.142-0.536c0.009-0.037,0.021-0.073,0.029-0.111
						c0.047-0.217,0.082-0.436,0.107-0.655c0-0.002,0-0.005,0.001-0.008c0.052-0.45,0.059-0.904,0.021-1.356
						c-0.001-0.002,0-0.003-0.001-0.005c-0.018-0.218-0.047-0.435-0.086-0.651c-0.002-0.012-0.003-0.024-0.006-0.037
						c-0.04-0.219-0.092-0.437-0.154-0.652c-0.002-0.01-0.004-0.021-0.007-0.03c-0.066-0.228-0.144-0.453-0.233-0.676
						c-0.137-0.34-0.299-0.662-0.48-0.969c-0.019-0.03-0.042-0.057-0.061-0.086c-0.168-0.273-0.35-0.537-0.551-0.781
						c-0.001-0.002-0.003-0.004-0.005-0.006c-1.092-1.328-2.64-2.213-4.368-2.467C8.687,1.026,8.341,0.999,7.993,0.999
						c-0.221,0-0.443,0.012-0.665,0.033C7.298,1.034,7.27,1.042,7.24,1.044C7.05,1.065,6.861,1.091,6.671,1.127
						C6.604,1.14,6.539,1.161,6.473,1.175C6.321,1.21,6.169,1.242,6.019,1.286C5.995,1.294,5.972,1.304,5.948,1.312
						C5.758,1.37,5.569,1.433,5.382,1.509C5.275,1.552,5.176,1.604,5.073,1.651c-0.11,0.051-0.222,0.097-0.328,0.152
						C4.66,1.849,4.581,1.899,4.499,1.947C4.378,2.017,4.256,2.084,4.14,2.16C4.079,2.2,4.023,2.246,3.964,2.288
						C3.834,2.38,3.703,2.471,3.58,2.571C3.538,2.604,3.501,2.643,3.46,2.677C3.327,2.792,3.194,2.907,3.069,3.03
						C3.038,3.062,3.01,3.096,2.98,3.127C2.853,3.259,2.728,3.392,2.611,3.532C2.577,3.574,2.547,3.619,2.514,3.661
						C2.409,3.795,2.304,3.929,2.208,4.07c-0.062,0.093-0.116,0.19-0.174,0.286C1.976,4.452,1.913,4.545,1.859,4.644
						C1.641,5.044,1.462,5.466,1.326,5.9C1.284,6.033,1.253,6.169,1.219,6.304C1.199,6.386,1.173,6.466,1.156,6.548
						C1.114,6.741,1.085,6.937,1.06,7.132C1.057,7.158,1.051,7.184,1.048,7.21C1.023,7.424,1.011,7.639,1.006,7.854
						c0,0.011-0.002,0.021-0.002,0.031C1.001,8.102,1.009,8.317,1.026,8.534c0.001,0.012,0,0.023,0.001,0.035
						c0.019,0.22,0.048,0.438,0.087,0.657c0.002,0.01,0.002,0.019,0.004,0.028c0.085,0.461,0.216,0.917,0.396,1.362
						c0.945,2.339,3.028,3.948,5.467,4.306c0.267,0.04,0.54,0.052,0.812,0.061C7.867,14.986,7.938,15,8.012,15h0h0
						c0.219,0,0.439-0.011,0.659-0.031c0.156-0.016,0.309-0.042,0.463-0.067c0.064-0.01,0.128-0.015,0.191-0.027
						c0.441-0.085,0.875-0.212,1.297-0.382c0.445-0.18,0.863-0.401,1.254-0.66c0.006-0.004,0.012-0.008,0.017-0.012
						C12.65,13.318,13.296,12.676,13.803,11.922z' />
					<path className = { styles.reverbButtonInner } fillRule='evenodd' clipRule='evenodd' fill='#4AB873' d='M11.003,8.002c0,1.656-1.344,2.998-3,2.998c-1.658,0-3.001-1.342-3-3c0-1.656,1.343-2.999,3-2.999C9.661,5.001,11.004,6.346,11.003,8.002z' />
				</g>
				<g>
					<text x='-10' y='10' fontSize='12px' textRendering='optimizeLegibility' fontVariant='small-caps' letterSpacing='.1em' textAnchor='end'>
						{value.title}
					</text>
				</g>
			</g>
		)
	})

	useEffect(() => {
    let volume = null
    
    if (additionalSides) {
      volume = sessionStorage.getItem(SessionStorage.RightReverbVolumeAdditional)
      volume && translateHandler(+volume)
    } else {
      volume = sessionStorage.getItem(SessionStorage.RightReverbVolume)
      volume && translateHandler(+volume)
    }
    if (volume) {
      translateHandler(+volume)
    } else {
      X = Math.ceil(centerX - RADIUS * Math.sin(angle))
			Y = Math.ceil(centerY - RADIUS * Math.cos(angle))
			
			handlerRef?.current?.setAttribute('transform', `translate(${X}, ${Y})`)  
			clipRef.current?.setAttribute('y', String(Math.abs(0.6 * (TOP - BOTTOM))))
    }
  }, [ additionalSides ])

	useEffect(() => {
    let mouseDownSubscribed: Subscription
    if (handlerRef.current) {
      const svgElem = handlerRef.current.parentNode as SVGAElement
      mouseDownSubscribed = fromEvent(handlerRef.current, MouseEvents.MOUSEDOWN)
        .subscribe(e => {
          const mouseMoveSubscribed = fromEvent(svgElem, MouseEvents.MOUSEMOVE)
            .subscribe(handlerMove)
          const mouseUpSubscribed = fromEvent(window, MouseEvents.MOUSEUP)
            .subscribe(e => {
                mouseUpSubscribed.unsubscribe()
                mouseMoveSubscribed.unsubscribe()
            })
      })
    }
    
    return () => {
      mouseDownSubscribed.unsubscribe()
    }
  }, [ handlerRef, clipRef ])

	useEffect(() => {
    let pure = true
    if (additionalSides && rightAdditionalReverbState) {
      for (const key in rightAdditionalReverbState) {
        if (rightAdditionalReverbState[key]) {
          setCurrent(key)
          pure = false
          break
        }
      }
      pure && setCurrent('')
    } else {
      for (const key in rightReverbState) {
        if (rightReverbState[key]) {
          setCurrent(key)
          pure = false
          break
        }
      }
      pure && setCurrent('')
    }
  }, [ additionalSides, rightReverbState, rightAdditionalReverbState ])

	return (
		<svg x='0px' y='0px' width='200px' height='105px' viewBox='0 0 200 105' enableBackground='new 0 0 200 105'>
			<g className = { styles.volumeRange } transform='translate(90,5)'>
				<filter id='REVERB_RIGHT_f2' y='0' x='0'>
					<feGaussianBlur in='SourceGraphic' stdDeviation='1'></feGaussianBlur>
				</filter>
				<filter id='REVERB_RIGHT_f1' y='0' x='0'>
					<feGaussianBlur in='SourceGraphic' stdDeviation='0.5'></feGaussianBlur>
				</filter>
				<g>
					<g transform='translate(-1,-1)'>
						<g filter='url(#REVERB_RIGHT_f1)'>
							<path opacity='0.3' d='M100.295,3.416c-0.088-0.461-0.348-0.86-0.736-1.125c-0.775-0.53-1.914-0.311-2.438,0.46
                        c-0.285,0.416-0.371,0.919-0.244,1.418l0.055,0.219l-0.127,0.187C73.43,38.864,41.615,67.016,4.799,85.984l-0.201,0.104
                        l-0.21-0.082c-0.21-0.082-0.429-0.123-0.65-0.123c-0.276,0-0.541,0.062-0.787,0.191c-0.861,0.443-1.2,1.504-0.756,2.365
                        c0.303,0.586,0.901,0.951,1.562,0.951l0,0c0.281,0,0.551-0.066,0.802-0.197c0.436-0.225,0.749-0.613,0.88-1.094l0.058-0.211
                        l0.195-0.102C42.824,68.662,74.91,40.271,98.482,5.684l0.123-0.181l0.217-0.032c0.494-0.074,0.92-0.336,1.193-0.74
                        C100.283,4.345,100.381,3.876,100.295,3.416z' />
						</g>
					</g>
					<g transform='translate(1,1)'>
						<g filter='url(#REVERB_RIGHT_f2)'>
							<path fill='#FFFFFF' d='M100.295,3.416c-0.088-0.461-0.348-0.86-0.736-1.125c-0.775-0.53-1.914-0.311-2.438,0.46
                        c-0.285,0.416-0.371,0.919-0.244,1.418l0.055,0.219l-0.127,0.187C73.43,38.864,41.615,67.016,4.799,85.984l-0.201,0.104
                        l-0.21-0.082c-0.21-0.082-0.429-0.123-0.65-0.123c-0.276,0-0.541,0.062-0.787,0.191c-0.861,0.443-1.2,1.504-0.756,2.365
                        c0.303,0.586,0.901,0.951,1.562,0.951l0,0c0.281,0,0.551-0.066,0.802-0.197c0.436-0.225,0.749-0.613,0.88-1.094l0.058-0.211
                        l0.195-0.102C42.824,68.662,74.91,40.271,98.482,5.684l0.123-0.181l0.217-0.032c0.494-0.074,0.92-0.336,1.193-0.74
                        C100.283,4.345,100.381,3.876,100.295,3.416z' />
						</g>
					</g>
					<g>
						<path fill='#CACACA' d='M100.295,3.416c-0.088-0.461-0.348-0.86-0.736-1.125c-0.775-0.53-1.914-0.311-2.438,0.46
                    c-0.285,0.416-0.371,0.919-0.244,1.418l0.055,0.219l-0.127,0.187C73.43,38.864,41.615,67.016,4.799,85.984l-0.201,0.104
                    l-0.21-0.082c-0.21-0.082-0.429-0.123-0.65-0.123c-0.276,0-0.541,0.062-0.787,0.191c-0.861,0.443-1.2,1.504-0.756,2.365
                    c0.303,0.586,0.901,0.951,1.562,0.951l0,0c0.281,0,0.551-0.066,0.802-0.197c0.436-0.225,0.749-0.613,0.88-1.094l0.058-0.211
                    l0.195-0.102C42.824,68.662,74.91,40.271,98.482,5.684l0.123-0.181l0.217-0.032c0.494-0.074,0.92-0.336,1.193-0.74
                    C100.283,4.345,100.381,3.876,100.295,3.416z' />
					</g>
				</g>
				<g>
					<path fill='#838688' d='M50.918,88.795l-1.178,0.809l-3.721-1.479l-0.93,0.638l1.88,2.741l-0.96,0.658l-4.405-6.422l2.256-1.548
                c0.805-0.552,1.438-0.867,1.898-0.945c0.46-0.078,0.867,0.14,1.22,0.654l0.761,1.108c0.271,0.396,0.314,0.806,0.129,1.229
                c-0.185,0.423-0.509,0.792-0.97,1.109L50.918,88.795z M46.697,85.55l-0.61-0.891c-0.33-0.481-0.911-0.438-1.742,0.133l-1.346,0.923
                l1.656,2.415l1.257-0.862c0.455-0.312,0.753-0.6,0.894-0.861C46.946,86.146,46.91,85.859,46.697,85.55z' />
					<path fill='#838688' d='M58.494,83.265l-4.304,3.182l-4.63-6.262l4.207-3.11l0.484,0.656l-3.271,2.418l1.513,2.046l2.952-2.184
                l0.485,0.656l-2.953,2.184l1.663,2.248l3.367-2.49L58.494,83.265z' />
					<path fill='#838688' d='M62.168,70.476l2.432,8.021l-1.051,0.838l-7.218-4.207l0.947-0.755l6.117,3.672l0.085-0.067l-2.213-6.783
                L62.168,70.476z' />
					<path fill='#838688' d='M74.017,70.628l-4.062,3.484l-5.07-5.911l3.972-3.406l0.531,0.619l-3.088,2.648l1.656,1.931l2.787-2.391
                l0.531,0.62l-2.787,2.391l1.82,2.122l3.179-2.727L74.017,70.628z' />
					<path fill='#838688' d='M81.547,63.789l-1.051,0.968l-3.894-0.934l-0.829,0.764l2.251,2.445l-0.856,0.789l-5.275-5.729l2.013-1.854
                c0.719-0.661,1.3-1.062,1.744-1.206c0.445-0.143,0.879,0.016,1.301,0.475l0.911,0.988c0.325,0.354,0.426,0.752,0.303,1.197
                s-0.391,0.857-0.803,1.236L81.547,63.789z M76.907,61.178l-0.731-0.795c-0.396-0.429-0.964-0.303-1.706,0.38l-1.2,1.105
                l1.983,2.154l1.121-1.032c0.406-0.374,0.66-0.7,0.762-0.979C77.238,61.732,77.162,61.454,76.907,61.178z' />
					<path fill='#838688' d='M86.426,55.032l0.92,0.93c0.399,0.403,0.527,0.84,0.383,1.309c-0.144,0.469-0.562,1.047-1.257,1.732
                l-2.038,2.018l-5.478-5.536l1.979-1.958c0.478-0.473,0.899-0.794,1.266-0.965c0.365-0.171,0.66-0.226,0.883-0.165
                c0.224,0.061,0.445,0.202,0.664,0.424l0.734,0.742c0.226,0.228,0.333,0.464,0.323,0.71s-0.112,0.521-0.306,0.825l0.033,0.034
                c0.347-0.241,0.689-0.378,1.029-0.41S86.189,54.793,86.426,55.032z M83.68,54.305l-0.642-0.648
                c-0.208-0.21-0.431-0.282-0.669-0.216c-0.237,0.066-0.536,0.277-0.895,0.632l-1.151,1.14l1.857,1.876l1.177-1.164
                c0.353-0.349,0.551-0.649,0.595-0.9C83.996,54.771,83.905,54.532,83.68,54.305z M86.484,56.746l-0.827-0.836
                c-0.146-0.147-0.293-0.236-0.44-0.266c-0.146-0.028-0.302,0.002-0.467,0.091c-0.164,0.09-0.301,0.18-0.409,0.27
                c-0.107,0.09-0.253,0.226-0.435,0.405l-1.211,1.198l2,2.021l1.211-1.198c0.415-0.41,0.666-0.743,0.752-0.997
                C86.745,57.181,86.687,56.951,86.484,56.746z' />
					<path fill='#838688' d='M96.748,44.005l0.97,0.877c0.421,0.382,0.573,0.811,0.455,1.286s-0.505,1.076-1.159,1.799l-1.925,2.127
                l-5.774-5.227l1.868-2.064c0.451-0.498,0.854-0.842,1.211-1.032c0.355-0.19,0.646-0.262,0.873-0.214
                c0.226,0.049,0.454,0.177,0.686,0.387l0.774,0.7c0.237,0.215,0.357,0.445,0.361,0.691s-0.083,0.527-0.26,0.842l0.035,0.032
                c0.333-0.261,0.668-0.416,1.005-0.467C96.206,43.691,96.499,43.779,96.748,44.005z M93.967,43.429l-0.676-0.611
                c-0.22-0.199-0.446-0.259-0.681-0.179c-0.233,0.079-0.52,0.306-0.858,0.68l-1.087,1.201l1.957,1.771l1.111-1.228
                c0.333-0.368,0.515-0.678,0.545-0.932C94.308,43.878,94.204,43.644,93.967,43.429z M96.901,45.713l-0.872-0.789
                c-0.154-0.14-0.306-0.22-0.454-0.241c-0.148-0.021-0.302,0.019-0.461,0.117s-0.291,0.195-0.394,0.291s-0.24,0.238-0.412,0.429
                l-1.144,1.263l2.108,1.909l1.144-1.264c0.392-0.433,0.624-0.778,0.696-1.037S97.114,45.906,96.901,45.713z' />
				</g>
			</g>
			<g className = { styles.volumeClipPath }>
				<defs>
					<clipPath id='REVERB_RIGHT_CLIP_PATH'>
						<rect ref = { clipRef } x='0' y='0' width='200' height='100' />
					</clipPath>
				</defs>
			</g>
			<g className = { styles.volumeGrad } transform='translate(82,3)' clipPath='url(#REVERB_RIGHT_CLIP_PATH)'>
				<g transform='translate(-1,-1)'>
					<defs>
						<filter id='f1' x='0' y='0'>
							<feGaussianBlur in='SourceGraphic' stdDeviation='0.5' />
						</filter>
					</defs>
					<path fill='#709795' filter='url(#f1)' d='M107.859,6.922c-0.087-0.461-0.348-0.86-0.735-1.125c-0.776-0.53-1.915-0.311-2.439,0.46
                        c-0.285,0.416-0.371,0.919-0.244,1.418l0.056,0.219l-0.127,0.187C80.995,42.37,49.18,70.521,12.364,89.49l-0.201,0.104
                        l-0.21-0.082c-0.21-0.082-0.429-0.124-0.65-0.124c-0.276,0-0.541,0.064-0.787,0.192c-0.861,0.444-1.2,1.505-0.756,2.365
                        c0.303,0.587,0.901,0.951,1.562,0.951c0,0,0,0,0,0c0.281,0,0.551-0.066,0.802-0.196c0.436-0.225,0.749-0.613,0.88-1.094
                        l0.058-0.211l0.195-0.101c37.132-19.126,69.218-47.517,92.79-82.104l0.123-0.181l0.217-0.032c0.494-0.074,0.919-0.336,1.194-0.74
                        C107.848,7.851,107.946,7.383,107.859,6.922z' />
				</g>
				<g transform='translate(0,1)'>
					<defs>
						<filter id='f2' x='0' y='0'>
							<feGaussianBlur in='SourceGraphic' stdDeviation='1' />
						</filter>
					</defs>
					<path fill='white' filter='url(#f2)' d='M107.859,6.922c-0.087-0.461-0.348-0.86-0.735-1.125c-0.776-0.53-1.915-0.311-2.439,0.46
                        c-0.285,0.416-0.371,0.919-0.244,1.418l0.056,0.219l-0.127,0.187C80.995,42.37,49.18,70.521,12.364,89.49l-0.201,0.104
                        l-0.21-0.082c-0.21-0.082-0.429-0.124-0.65-0.124c-0.276,0-0.541,0.064-0.787,0.192c-0.861,0.444-1.2,1.505-0.756,2.365
                        c0.303,0.587,0.901,0.951,1.562,0.951c0,0,0,0,0,0c0.281,0,0.551-0.066,0.802-0.196c0.436-0.225,0.749-0.613,0.88-1.094
                        l0.058-0.211l0.195-0.101c37.132-19.126,69.218-47.517,92.79-82.104l0.123-0.181l0.217-0.032c0.494-0.074,0.919-0.336,1.194-0.74
                        C107.848,7.851,107.946,7.383,107.859,6.922z' />
				</g>
				<g>
					<g>
						<path fill='#5EC7E1' d='M107.859,6.922c-0.087-0.461-0.348-0.86-0.735-1.125c-0.776-0.53-1.915-0.311-2.439,0.46
                        c-0.285,0.416-0.371,0.919-0.244,1.418l0.056,0.219l-0.127,0.187C80.995,42.37,49.18,70.521,12.364,89.49l-0.201,0.104
                        l-0.21-0.082c-0.21-0.082-0.429-0.124-0.65-0.124c-0.276,0-0.541,0.064-0.787,0.192c-0.861,0.444-1.2,1.505-0.756,2.365
                        c0.303,0.587,0.901,0.951,1.562,0.951c0,0,0,0,0,0c0.281,0,0.551-0.066,0.802-0.196c0.436-0.225,0.749-0.613,0.88-1.094
                        l0.058-0.211l0.195-0.101c37.132-19.126,69.218-47.517,92.79-82.104l0.123-0.181l0.217-0.032c0.494-0.074,0.919-0.336,1.194-0.74
                        C107.848,7.851,107.946,7.383,107.859,6.922z' />
					</g>
				</g>
			</g>

			{reverbBtns}

			<g className = { styles.handler } ref = { handlerRef }>
				<g>
					<linearGradient id='REVERB_RIGHT_HANDLER_1' gradientUnits='userSpaceOnUse' x1='3.5317' y1='3.4653' x2='26.5141' y2='26.4477'>
						<stop offset='0.0142' style={{ stopColor: '#5A5A5A', stopOpacity: 0.4 }} />
						<stop offset='0.8328' style={{ stopColor: '#5A5A5A', stopOpacity: 0 }} />
					</linearGradient>
					<path fill='url(#REVERB_RIGHT_HANDLER_1)' d='M28.444,23.575c0.949-2.236,0.973-4.709,0.062-6.964c-0.484-1.197-1.199-2.244-2.08-3.104
						l0.004-0.007L16.321,3.393l-0.005,0.003c-1.664-1.629-3.92-2.589-6.358-2.589c-1.165,0-2.31,0.223-3.396,0.66
						C4.309,2.374,2.544,4.108,1.596,6.345c-0.949,2.235-0.971,4.709-0.061,6.96c0.538,1.33,1.368,2.467,2.388,3.38l9.274,9.272
						c1.695,1.97,4.178,3.153,6.887,3.153c1.167,0,2.309-0.221,3.396-0.662C25.729,27.541,27.495,25.812,28.444,23.575z' />
					<g>
						<path className = { styles.handlerWrapper } d='M19.267,6.264C17.731,2.46,14.09,0,9.99,0C8.709,0,7.453,0.246,6.258,0.727
							C3.782,1.725,1.843,3.629,0.8,6.088c-1.042,2.457-1.066,5.175-0.066,7.649C2.27,17.542,5.911,20,10.01,20
							c1.282,0,2.538-0.244,3.733-0.728c2.474-0.996,4.413-2.898,5.455-5.356C20.244,11.46,20.267,8.74,19.267,6.264z' />
						<linearGradient id='REVERB_RIGHT_HANDLER_2' gradientUnits='userSpaceOnUse' x1='2.3364' y1='3.5698' x2='17.6648' y2='16.4319'>
							<stop offset='0' style={{ stopColor: '#FFFFFF' }} />
							<stop offset='1' style={{ stopColor: '#A8A6A6' }} />
						</linearGradient>
						<path fill='url(#REVERB_RIGHT_HANDLER_2)' d='M9.99,1c3.689,0,6.966,2.213,8.35,5.638c0.901,2.231,0.879,4.677-0.062,6.888
							c-0.938,2.211-2.681,3.923-4.91,4.82C12.294,18.779,11.164,19,10.01,19c-3.689,0-6.966-2.213-8.349-5.638
							c-0.9-2.227-0.879-4.672,0.06-6.884C2.66,4.266,4.404,2.552,6.631,1.654C7.711,1.22,8.841,1,9.99,1 M9.99,0
							C8.709,0,7.453,0.246,6.258,0.727C3.782,1.725,1.843,3.629,0.8,6.088c-1.042,2.457-1.066,5.175-0.066,7.649
							C2.27,17.542,5.911,20,10.01,20c1.282,0,2.538-0.244,3.733-0.728c2.474-0.996,4.413-2.898,5.455-5.356
							c1.045-2.456,1.069-5.176,0.069-7.652C17.731,2.46,14.09,0,9.99,0L9.99,0z' />
					</g>
					<path className = { styles.handlerInner } fillRule='evenodd' clipRule='evenodd' fill='#4AB873' d='M13.749,10.003c0,2.07-1.68,3.747-3.748,3.747c-2.072,0-3.75-1.677-3.75-3.75c0-2.07,1.68-3.749,3.75-3.749S13.75,7.933,13.749,10.003z' />
				</g>
			</g>
		</svg>
	)
}

export default ReverbRight
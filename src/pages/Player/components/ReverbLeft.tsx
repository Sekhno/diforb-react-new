import React, { useEffect, useRef, useState } from 'react'
import { fromEvent, Subscription } from 'rxjs'
import { MouseEvents, ReverbsEnum } from '../types'
import { PropsSliderInterface, SessionStorage } from '../types'
import styles from './RangeSlider.module.scss'

const RADIUS = 256
const OFFSETX = -42
const OFFSETY = 400
const STARTANGLE = Math.PI * 0.85
const ENDANGLE = Math.PI * 0.687
const DIFFANGLE = STARTANGLE - ENDANGLE
const TOP = 10, BOTTOM = 96
const STEP = DIFFANGLE / (BOTTOM - TOP)
const reverbConfigs = [
  { x: 40, y: 8, title: ReverbsEnum.Room },
  { x: 59, y: 27, title: ReverbsEnum.Hall },
  { x: 80, y: 45, title: ReverbsEnum.Stadium }
]

export const ReverbLeft = (props: PropsSliderInterface) => {
  const [ current, setCurrent ] = useState<string>('')
  const clipRef: React.MutableRefObject<SVGRectElement | null> = useRef(null)
  const handlerRef: React.MutableRefObject<SVGAElement | null> = useRef(null)
  const { 
    onChange, onChangeReverbType, 
    additionalSides, setAdditionalSides,
    leftReverbState, leftAdditionalReverbState
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
            sessionStorage.setItem(SessionStorage.LeftReverbVolumeAdditional, `${value}`)
          } else {
            sessionStorage.setItem(SessionStorage.LeftReverbVolume, `${value}`)
          }
          return prevState
        }
      )
      translateHandler(value)
    }
  }
  const clickHandle = (type: ReverbsEnum) => {
		onChangeReverbType && onChangeReverbType(type)
		setCurrent(type === current ? '' : type)
	}
  const reverbBtns = reverbConfigs.map((value, index) => {
    index = index + 1
    return (
      <g 
        key = { 'reverb_left_' + index }
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
          <path className = { styles.reverbButtonWrapper } fill={'url(#SLIDER_REVERB_ACTIVE_' + index + ')'} d='M13.803,11.922c0.013-0.019,0.023-0.039,0.035-0.058c0.11-0.167,0.216-0.337,0.312-0.514c0.215-0.397,0.393-0.814,0.528-1.246c0.056-0.177,0.101-0.356,0.142-0.536c0.009-0.037,0.021-0.073,0.029-0.111
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
          <path className = { styles.reverbButtonInner } fillRule='evenodd' clipRule='evenodd' d='M11.003,8.002c0,1.656-1.344,2.998-3,2.998c-1.658,0-3.001-1.342-3-3c0-1.656,1.343-2.999,3-2.999C9.661,5.001,11.004,6.346,11.003,8.002z' />
        </g>
        <g>
          <text x='25' y='10' textRendering='optimizeLegibility' fontVariant='small-caps' letterSpacing='0.22px'>
            { value.title }
          </text>
        </g>
      </g>
    )
  })

  useEffect(() => {
    let volume = null
    
    if (additionalSides) {
      volume = sessionStorage.getItem(SessionStorage.LeftReverbVolumeAdditional)
      volume && translateHandler(+volume)
    } else {
      volume = sessionStorage.getItem(SessionStorage.LeftReverbVolume)
      volume && translateHandler(+volume)
    }
    if (volume) {
      translateHandler(+volume)
    } else {
      X = Math.ceil(centerX - RADIUS * Math.sin(angle))
      Y = Math.ceil(centerY - RADIUS * Math.cos(angle))
      console.log(`X: ${X}, Y: ${Y}`)
      
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
    if (additionalSides && leftAdditionalReverbState) {
      for (const key in leftAdditionalReverbState) {
        if (leftAdditionalReverbState[key]) {
          setCurrent(key)
          pure = false
          break
        }
      }
      pure && setCurrent('')
    } else {
      for (const key in leftReverbState) {
        if (leftReverbState[key]) {
          setCurrent(key)
          pure = false
          break
        }
      }
      pure && setCurrent('')
    }
  }, [ additionalSides, leftReverbState, leftAdditionalReverbState ])

  return (
    <svg x='0px' y='0px' width='200px' height='105px' viewBox='0 0 200 105' enableBackground='new 0 0 200 105'>
      <g className = { styles.volumeRange } transform='translate(8,2)'>
        <filter id='REVERB_LEFT_f2' y='0' x='0'>
          <feGaussianBlur in='SourceGraphic' stdDeviation='1'></feGaussianBlur>
        </filter>
        <filter id='REVERB_LEFT_f1' y='0' x='0'>
          <feGaussianBlur in='SourceGraphic' stdDeviation='0.5'></feGaussianBlur>
        </filter>
        <g>
          <path fill='#838688' d='M4.276,47.09L3.353,46l1.094-3.852l-0.729-0.86l-2.537,2.148l-0.752-0.888l5.942-5.034l1.769,2.087
            c0.631,0.745,1.008,1.343,1.133,1.793c0.124,0.45-0.051,0.877-0.527,1.28l-1.026,0.868c-0.366,0.311-0.769,0.395-1.208,0.254
            c-0.439-0.142-0.84-0.426-1.202-0.854L4.276,47.09z M7.077,42.562l0.824-0.698c0.446-0.378,0.343-0.951-0.309-1.72l-1.055-1.246
            l-2.234,1.893l0.985,1.163c0.357,0.421,0.672,0.688,0.947,0.802C6.509,42.87,6.79,42.806,7.077,42.562z' />
          <path fill='#838688' d='M10.523,54.042l-3.601-3.96l5.762-5.239l3.52,3.871l-0.604,0.549l-2.737-3.01l-1.882,1.711l2.47,2.717
            l-0.604,0.549l-2.47-2.717l-2.069,1.881l2.817,3.099L10.523,54.042z' />
          <path fill='#838688' d='M23.63,56.42l-7.734,3.229l-0.939-0.962l3.457-7.605l0.847,0.867l-3.036,6.456l0.076,0.077l6.525-2.886
            L23.63,56.42z' />
          <path fill='#838688' d='M24.66,68.212l-3.876-3.69l5.371-5.64l3.789,3.607L29.38,63.08l-2.946-2.805l-1.754,1.842l2.659,2.532
            l-0.562,0.591l-2.659-2.532l-1.928,2.025l3.033,2.888L24.66,68.212z' />
          <path fill='#838688'
            d='M32.227,75.021l-1.068-0.948l0.537-3.968l-0.844-0.749l-2.207,2.486l-0.871-0.772l5.169-5.825l2.046,1.816
            c0.73,0.647,1.188,1.186,1.375,1.614c0.187,0.428,0.073,0.875-0.341,1.342l-0.892,1.005c-0.318,0.359-0.706,0.5-1.161,0.422
            c-0.455-0.077-0.892-0.302-1.311-0.674L32.227,75.021z M34.358,70.143l0.717-0.808c0.388-0.438,0.205-0.99-0.549-1.659
            l-1.221-1.083l-1.943,2.189l1.14,1.012c0.413,0.366,0.763,0.587,1.051,0.66C33.84,70.527,34.109,70.424,34.358,70.143z' />
          <path fill='#838688' d='M41.445,79.006l-0.833,1.009c-0.362,0.438-0.783,0.608-1.264,0.513s-1.098-0.455-1.851-1.076l-2.212-1.825
            l4.957-6.007l2.147,1.772c0.518,0.428,0.88,0.814,1.087,1.161s0.291,0.635,0.253,0.862c-0.038,0.229-0.156,0.463-0.355,0.703
            l-0.665,0.806c-0.204,0.247-0.428,0.378-0.674,0.393c-0.246,0.015-0.53-0.059-0.853-0.221l-0.03,0.037
            c0.275,0.319,0.445,0.647,0.512,0.982C41.732,78.449,41.659,78.746,41.445,79.006z M39.745,79.236l0.749-0.907
            c0.132-0.16,0.206-0.314,0.22-0.464s-0.032-0.301-0.137-0.456c-0.106-0.154-0.209-0.281-0.309-0.379
            c-0.101-0.099-0.25-0.229-0.447-0.393l-1.314-1.084l-1.81,2.193l1.314,1.084c0.451,0.372,0.807,0.588,1.068,0.648
            C39.339,79.539,39.562,79.459,39.745,79.236z M41.893,76.201l0.58-0.704c0.188-0.228,0.238-0.457,0.147-0.688
            c-0.09-0.229-0.33-0.505-0.718-0.826l-1.25-1.031l-1.681,2.036l1.277,1.055c0.383,0.315,0.701,0.482,0.956,0.501
            C41.459,76.562,41.688,76.447,41.893,76.201z' />
          <path fill='#838688' d='M52.555,91.05l-0.977-0.718l0.686-2.431l-2.688-1.977L47.47,87.31l-0.928-0.683l7.108-4.438l1.083,0.797
            L52.555,91.05z M52.508,87.083l1.021-3.614l-0.087-0.063l-3.147,2.05L52.508,87.083z' />
        </g>
        <g transform='translate(1,-1)'>
          <g filter='url(#REVERB_LEFT_f1)'>
            <path opacity='0.3' d='M100.211,89.386c-0.445-0.229-0.965-0.252-1.438-0.067L98.562,89.4l-0.201-0.104
                C61.546,70.326,29.731,42.175,6.357,7.887L6.23,7.701l0.055-0.218c0.126-0.5,0.04-1.004-0.243-1.418
                C5.715,5.584,5.172,5.298,4.59,5.298c-0.353,0-0.695,0.106-0.988,0.306c-0.799,0.545-1.005,1.64-0.459,2.44
                c0.276,0.404,0.7,0.667,1.194,0.74l0.217,0.032l0.123,0.181c23.571,34.585,55.658,62.976,92.791,82.104l0.195,0.101l0.06,0.211
                c0.133,0.481,0.444,0.87,0.879,1.095c0.842,0.434,1.935,0.08,2.365-0.756c0.217-0.417,0.256-0.895,0.112-1.341
                C100.936,89.964,100.627,89.602,100.211,89.386z' />
          </g>
        </g>
        <g transform='translate(-1,1)'>
          <g filter='url(#REVERB_LEFT_f2)'>
            <path fill='#FFFFFF' d='M100.211,89.386c-0.445-0.229-0.965-0.252-1.438-0.067L98.562,89.4l-0.201-0.104
                C61.546,70.326,29.731,42.175,6.357,7.887L6.23,7.701l0.055-0.218c0.126-0.5,0.04-1.004-0.243-1.418
                C5.715,5.584,5.172,5.298,4.59,5.298c-0.353,0-0.695,0.106-0.988,0.306c-0.799,0.545-1.005,1.64-0.459,2.44
                c0.276,0.404,0.7,0.667,1.194,0.74l0.217,0.032l0.123,0.181c23.571,34.585,55.658,62.976,92.791,82.104l0.195,0.101l0.06,0.211
                c0.133,0.481,0.444,0.87,0.879,1.095c0.842,0.434,1.935,0.08,2.365-0.756c0.217-0.417,0.256-0.895,0.112-1.341
                C100.936,89.964,100.627,89.602,100.211,89.386z' />
          </g>
        </g>
        <path fill='#CACACA' d='M100.211,89.386c-0.445-0.229-0.965-0.252-1.438-0.067L98.562,89.4l-0.201-0.104
        C61.546,70.326,29.731,42.175,6.357,7.887L6.23,7.701l0.055-0.218c0.126-0.5,0.04-1.004-0.243-1.418
        C5.715,5.584,5.172,5.298,4.59,5.298c-0.353,0-0.695,0.106-0.988,0.306c-0.799,0.545-1.005,1.64-0.459,2.44
        c0.276,0.404,0.7,0.667,1.194,0.74l0.217,0.032l0.123,0.181c23.571,34.585,55.658,62.976,92.791,82.104l0.195,0.101l0.06,0.211
        c0.133,0.481,0.444,0.87,0.879,1.095c0.842,0.434,1.935,0.08,2.365-0.756c0.217-0.417,0.256-0.895,0.112-1.341
        C100.936,89.964,100.627,89.602,100.211,89.386z' />
      </g>
      <g className = { styles.volumeClipPath } transform='translate(8,2)'>
        <defs>
          <clipPath id='REVERB_LEFT_CLIP_PATH'>
            <rect ref = { clipRef } x='0' y='0' width='200' height='100' />
          </clipPath>
        </defs>
      </g>
      <g className = { styles.volumeGrad } transform='translate(8,2)' clipPath='url(#REVERB_LEFT_CLIP_PATH)'>
        <g transform='translate(1,-1)'>
          <defs>
            <filter id='REVERB_LEFT_GRAD_f1' x='0' y='0'>
              <feGaussianBlur in='SourceGraphic' stdDeviation='0.5' />
            </filter>
          </defs>
          <path fill='#709795' filter='url(#REVERB_LEFT_GRAD_f1)' d='M100.211,89.386c-0.445-0.23-0.965-0.252-1.438-0.068l-0.21,0.082l-0.201-0.104
                C61.546,70.326,29.731,42.175,6.357,7.887L6.23,7.701l0.055-0.218c0.126-0.5,0.04-1.004-0.243-1.418
                C5.715,5.584,5.172,5.298,4.59,5.298c-0.353,0-0.695,0.106-0.988,0.306c-0.799,0.545-1.005,1.64-0.459,2.44
                c0.276,0.404,0.7,0.667,1.194,0.74l0.217,0.032l0.123,0.181c23.571,34.585,55.658,62.976,92.791,82.104l0.195,0.101l0.059,0.211
                c0.133,0.481,0.445,0.87,0.88,1.095c0.841,0.434,1.934,0.08,2.365-0.756c0.216-0.417,0.255-0.894,0.112-1.341
                C100.936,89.964,100.627,89.601,100.211,89.386z' />
        </g>
        <g transform='translate(0,1)'>
          <defs>
            <filter id='REVERB_LEFT_GRAD_f2' x='0' y='0'>
              <feGaussianBlur in='SourceGraphic' stdDeviation='1' />
            </filter>
          </defs>
          <path fill='white' filter='url(#REVERB_LEFT_GRAD_f2)' d='M100.211,89.386c-0.445-0.23-0.965-0.252-1.438-0.068l-0.21,0.082l-0.201-0.104
                C61.546,70.326,29.731,42.175,6.357,7.887L6.23,7.701l0.055-0.218c0.126-0.5,0.04-1.004-0.243-1.418
                C5.715,5.584,5.172,5.298,4.59,5.298c-0.353,0-0.695,0.106-0.988,0.306c-0.799,0.545-1.005,1.64-0.459,2.44
                c0.276,0.404,0.7,0.667,1.194,0.74l0.217,0.032l0.123,0.181c23.571,34.585,55.658,62.976,92.791,82.104l0.195,0.101l0.059,0.211
                c0.133,0.481,0.445,0.87,0.88,1.095c0.841,0.434,1.934,0.08,2.365-0.756c0.216-0.417,0.255-0.894,0.112-1.341
                C100.936,89.964,100.627,89.601,100.211,89.386z' />
        </g>
        <path fill='#5EC7E1' d='M100.211,89.386c-0.445-0.23-0.965-0.252-1.438-0.068l-0.21,0.082l-0.201-0.104
                C61.546,70.326,29.731,42.175,6.357,7.887L6.23,7.701l0.055-0.218c0.126-0.5,0.04-1.004-0.243-1.418
                C5.715,5.584,5.172,5.298,4.59,5.298c-0.353,0-0.695,0.106-0.988,0.306c-0.799,0.545-1.005,1.64-0.459,2.44
                c0.276,0.404,0.7,0.667,1.194,0.74l0.217,0.032l0.123,0.181c23.571,34.585,55.658,62.976,92.791,82.104l0.195,0.101l0.059,0.211
                c0.133,0.481,0.445,0.87,0.88,1.095c0.841,0.434,1.934,0.08,2.365-0.756c0.216-0.417,0.255-0.894,0.112-1.341
                C100.936,89.964,100.627,89.601,100.211,89.386z' />
      </g>

      {reverbBtns}

      <g className = { styles.handler } ref = { handlerRef }>
        <g>
          <linearGradient id='REVERB_LEFT_HANDLER_1' gradientUnits='userSpaceOnUse' x1='3.5317' y1='3.4653' x2='26.5141' y2='26.4477'>
            <stop offset='0.0142' style={{ stopColor: '#5A5A5A', stopOpacity: 0.4 }} />
            <stop offset='0.8328' style={{ stopColor: '#5A5A5A', stopOpacity: 0 }} />
          </linearGradient>
          <path fill='url(#REVERB_LEFT_HANDLER_1)' d='M28.444,23.575c0.949-2.236,0.973-4.709,0.062-6.964c-0.484-1.197-1.199-2.244-2.08-3.104
            l0.004-0.007L16.321,3.393l-0.005,0.003c-1.664-1.629-3.92-2.589-6.358-2.589c-1.165,0-2.31,0.223-3.396,0.66
            C4.309,2.374,2.544,4.108,1.596,6.345c-0.949,2.235-0.971,4.709-0.061,6.96c0.538,1.33,1.368,2.467,2.388,3.38l9.274,9.272
            c1.695,1.97,4.178,3.153,6.887,3.153c1.167,0,2.309-0.221,3.396-0.662C25.729,27.541,27.495,25.812,28.444,23.575z' />
          <g>
            <path className = { styles.handlerWrapper } fill='#E9E9E2' d='M19.267,6.264C17.731,2.46,14.09,0,9.99,0C8.709,0,7.453,0.246,6.258,0.727
              C3.782,1.725,1.843,3.629,0.8,6.088c-1.042,2.457-1.066,5.175-0.066,7.649C2.27,17.542,5.911,20,10.01,20
              c1.282,0,2.538-0.244,3.733-0.728c2.474-0.996,4.413-2.898,5.455-5.356C20.244,11.46,20.267,8.74,19.267,6.264z' />
            <linearGradient id='REVERB_LEFT_HANDLER_2' gradientUnits='userSpaceOnUse' x1='2.3364' y1='3.5698' x2='17.6648' y2='16.4319'>
              <stop offset='0' style={{ stopColor: '#FFFFFF' }} />
              <stop offset='1' style={{ stopColor: '#A8A6A6' }} />
            </linearGradient>
            <path fill='url(#REVERB_LEFT_HANDLER_2)' d='M9.99,1c3.689,0,6.966,2.213,8.35,5.638c0.901,2.231,0.879,4.677-0.062,6.888
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

export default ReverbLeft
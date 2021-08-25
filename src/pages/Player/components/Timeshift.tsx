import React, { createRef, useRef, useEffect, LegacyRef } from 'react'
import { fromEvent, Subscription } from 'rxjs'
import { MouseEvents, PropsSliderInterface, SessionStorage } from '../types'
import styles from './RangeSlider.module.scss'


export const Timeshift = (props: PropsSliderInterface) => {
  const { 
    onChange, 
    additionalSides, setAdditionalSides 
  } = props
  const handlerRef: React.MutableRefObject<SVGAElement | null> = useRef(null)
  const translateHandler = (volume: number) => {
    let centerX = 125,
        centerY = 267,
        radius = 240,
        angle = 0,
        numObjects = 1450,
        slice = Math.PI * 2 / numObjects,
        x, y
		
		if (volume > 71) volume = 70
		if (volume < -70) volume = -70

    setAdditionalSides && setAdditionalSides(
      (prevState: boolean) => {
        if (prevState) {
          sessionStorage.setItem(SessionStorage.TimeshiftAdditional, `${volume}`)
        } else {
          sessionStorage.setItem(SessionStorage.Timeshift, `${volume}`)
        }
        return prevState
      }
    )
    
    

		angle = volume * slice
		x = centerX - Math.sin(angle) * radius
		y = centerY - Math.cos(angle) * radius

		const prop = 'transform'
		const value = `translate(${x}, ${y})`

    handlerRef.current && handlerRef.current.setAttribute(prop, value)
    onChange && onChange(volume)
  }
  const handlerMove = (event: Event) => {
    translateHandler(
      Math.floor(140 - (event as MouseEvent).offsetX)
    )
  }

  useEffect(() => {
    let mouseDownSubscribed: Subscription
    if (handlerRef.current) {
      const svgElem = handlerRef?.current?.parentNode as SVGAElement
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
      console.log('Destroy hendlerRef')
    }
  }, [ handlerRef ])

  useEffect(() => {
    let volume = null
    if (additionalSides) {
      volume = sessionStorage.getItem(SessionStorage.TimeshiftAdditional)
      volume && translateHandler(+volume)
    } else {
      volume = sessionStorage.getItem(SessionStorage.Timeshift)
      volume && translateHandler(+volume)
    }
    volume && translateHandler(+volume)
  }, [ additionalSides ])

  return (
    <svg x = '0px' y = '0px' width = '274px' height = '76px' viewBox = '0 0 274 76' enableBackground = 'new 0 0 274 76'>
      <g className = { styles.volumeRange }>
        <g>
          <g>
            <path d='M119.194,11.395c-0.099-0.087-0.222-0.131-0.355-0.115c-0.188,0.015-0.33,0.113-0.412,0.29l-3.252,8.087
              l-4.516-7.459c-0.101-0.157-0.257-0.235-0.445-0.218c-0.135,0.011-0.247,0.068-0.334,0.17c-0.085,0.101-0.124,0.221-0.113,0.356
              l0.7,8.62c0.01,0.132,0.068,0.248,0.169,0.334c0.09,0.076,0.195,0.114,0.312,0.114c0.015,0,0.029,0,0.044-0.002
              c0.136-0.01,0.248-0.067,0.333-0.17c0.083-0.101,0.12-0.22,0.109-0.355l-0.533-6.574l3.93,6.483
              c0.101,0.19,0.259,0.287,0.472,0.267c0.179-0.015,0.316-0.105,0.402-0.272l2.854-7.098l0.533,6.573
              c0.01,0.132,0.069,0.247,0.17,0.334c0.102,0.085,0.221,0.126,0.356,0.113c0.134-0.011,0.249-0.07,0.331-0.169
              c0.084-0.101,0.122-0.22,0.111-0.356l-0.699-8.621C119.348,11.591,119.292,11.479,119.194,11.395z M130.511,19.436
              c0,0-0.001,0-0.002,0l-5.286,0.183l-0.116-3.352l3.838-0.133c0.135-0.004,0.25-0.056,0.342-0.154
              c0.09-0.098,0.134-0.215,0.129-0.35c-0.005-0.136-0.057-0.25-0.154-0.341c-0.092-0.086-0.204-0.13-0.35-0.13c0,0-0.001,0-0.001,0
              l-3.839,0.133l-0.116-3.352l5.286-0.183c0.131-0.005,0.244-0.057,0.335-0.155c0.09-0.098,0.134-0.214,0.129-0.345
              c-0.004-0.135-0.056-0.25-0.153-0.341c-0.092-0.086-0.201-0.13-0.344-0.13c0,0-0.001,0-0.002,0l-5.767,0.2
              c-0.136,0.004-0.251,0.056-0.342,0.154c-0.09,0.096-0.135,0.217-0.13,0.352l0.3,8.644c0.004,0.134,0.056,0.249,0.154,0.341
              c0.093,0.086,0.206,0.13,0.333,0.13c0.001,0,0.016,0,0.017,0l5.769-0.2c0.131-0.005,0.244-0.057,0.335-0.155
              c0.09-0.098,0.134-0.216,0.129-0.351c-0.004-0.13-0.058-0.246-0.153-0.335C130.763,19.479,130.654,19.436,130.511,19.436z
              M124.757,20.481v-0.005l0,0L124.757,20.481z M104.488,12.77c-0.105-0.082-0.226-0.116-0.36-0.099
              c-0.135,0.016-0.244,0.078-0.325,0.183c-0.079,0.104-0.111,0.225-0.096,0.359l1.026,8.587c0.016,0.133,0.078,0.246,0.177,0.326
              c0.086,0.07,0.186,0.105,0.295,0.105c0.021,0,0.042-0.001,0.064-0.004c0.136-0.017,0.246-0.078,0.327-0.182
              c0.082-0.103,0.116-0.228,0.1-0.36l-1.026-8.586C104.655,12.964,104.594,12.854,104.488,12.77z M98.065,13.447l-6.18,0.949
              c-0.129,0.021-0.235,0.084-0.314,0.191c-0.078,0.106-0.108,0.229-0.088,0.365c0.021,0.13,0.086,0.236,0.193,0.314
              c0.106,0.079,0.229,0.108,0.358,0.089l2.61-0.401l1.24,8.071c0.021,0.135,0.086,0.243,0.192,0.32
              c0.084,0.063,0.18,0.095,0.283,0.095c0.027,0,0.054-0.002,0.081-0.006c0.135-0.021,0.243-0.086,0.318-0.193
              c0.077-0.106,0.106-0.229,0.085-0.363l-1.24-8.071l2.611-0.4c0.131-0.021,0.242-0.088,0.319-0.193
              c0.079-0.104,0.109-0.229,0.09-0.359c-0.021-0.133-0.085-0.241-0.193-0.321C98.322,13.456,98.198,13.426,98.065,13.447z
              M169.586,12.607l-5.739-0.617c-0.137-0.013-0.257,0.022-0.359,0.105c-0.103,0.082-0.164,0.195-0.178,0.329l-0.925,8.6
              c-0.015,0.133,0.021,0.258,0.104,0.359c0.083,0.103,0.196,0.165,0.328,0.179c0.02,0.002,0.038,0.003,0.057,0.003
              c0.113,0,0.214-0.037,0.301-0.109c0.103-0.084,0.161-0.195,0.174-0.329l0.411-3.814l3.82,0.411
              c0.138,0.015,0.257-0.022,0.359-0.105c0.103-0.083,0.164-0.196,0.178-0.328c0.015-0.135-0.021-0.256-0.104-0.361
              c-0.083-0.102-0.197-0.163-0.328-0.177l-3.82-0.41l0.358-3.334l5.26,0.566c0.128,0.009,0.248-0.022,0.354-0.105
              c0.103-0.084,0.163-0.192,0.177-0.323c0.015-0.133-0.021-0.257-0.104-0.358C169.827,12.682,169.715,12.62,169.586,12.607z
              M157.782,11.486c-0.003,0-0.035-0.001-0.038-0.001c-0.12,0-0.227,0.04-0.315,0.12c-0.098,0.087-0.152,0.199-0.163,0.333
              l-0.645,8.626c-0.009,0.131,0.03,0.253,0.113,0.353c0.084,0.101,0.199,0.16,0.332,0.168c0.015,0.001,0.028,0.002,0.042,0.002
              c0.119,0,0.225-0.04,0.314-0.118c0.102-0.088,0.157-0.201,0.167-0.334l0.645-8.625c0.01-0.132-0.03-0.255-0.116-0.356
              C158.03,11.552,157.917,11.496,157.782,11.486z M140.054,15.59c-0.255-0.289-0.553-0.523-0.887-0.696
              c-0.333-0.173-0.697-0.282-1.085-0.325c-0.195-0.019-0.376-0.07-0.537-0.15c-0.163-0.081-0.309-0.2-0.437-0.355
              c-0.128-0.15-0.22-0.314-0.272-0.489c-0.053-0.175-0.072-0.365-0.058-0.564c0.027-0.386,0.191-0.7,0.503-0.959
              c0.313-0.257,0.666-0.369,1.056-0.343c0.384,0.027,0.701,0.196,0.971,0.515c0.088,0.108,0.163,0.204,0.225,0.289
              c0.049,0.066,0.147,0.146,0.34,0.146c0.132,0,0.246-0.047,0.342-0.141c0.094-0.094,0.142-0.209,0.142-0.34
              c0-0.098-0.023-0.187-0.068-0.262c-0.063-0.109-0.143-0.219-0.238-0.333c-0.52-0.569-1.133-0.859-1.831-0.861
              c-0.592,0-1.117,0.193-1.562,0.574c-0.556,0.465-0.843,1.089-0.854,1.856c-0.001,0.283,0.048,0.559,0.146,0.819
              c0.097,0.256,0.237,0.499,0.418,0.724c0.208,0.242,0.455,0.438,0.736,0.583c0.28,0.144,0.583,0.234,0.904,0.268
              c0.255,0.023,0.496,0.092,0.717,0.206c0.22,0.113,0.416,0.271,0.586,0.471c0.301,0.351,0.452,0.761,0.45,1.221
              c-0.001,0.345-0.065,0.637-0.192,0.868c-0.13,0.237-0.295,0.442-0.489,0.61c-0.356,0.3-0.767,0.452-1.225,0.452
              c-0.353-0.012-0.649-0.082-0.88-0.208c-0.235-0.128-0.438-0.29-0.599-0.479c-0.064-0.079-0.12-0.155-0.17-0.228
              c-0.1-0.143-0.243-0.218-0.416-0.218c-0.133,0-0.25,0.049-0.34,0.142c-0.092,0.093-0.139,0.208-0.14,0.344
              c0,0.109,0.033,0.209,0.097,0.295c0.079,0.115,0.155,0.214,0.226,0.294c0.617,0.679,1.364,1.024,2.221,1.027
              c0.001,0,0.014,0,0.014,0c0.678,0,1.296-0.23,1.839-0.684c0.307-0.256,0.553-0.554,0.732-0.886
              c0.185-0.337,0.283-0.792,0.293-1.35c0.002-0.33-0.057-0.654-0.174-0.966C140.438,16.148,140.271,15.858,140.054,15.59z
              M181.702,14.45c-0.077-0.106-0.188-0.172-0.32-0.192l-6.183-0.931c-0.127-0.02-0.252,0.011-0.357,0.09
              c-0.106,0.079-0.171,0.187-0.192,0.322c-0.019,0.131,0.012,0.25,0.09,0.357c0.081,0.108,0.188,0.172,0.316,0.191l2.61,0.393
              l-1.215,8.074c-0.021,0.133,0.009,0.255,0.088,0.364c0.08,0.108,0.188,0.172,0.321,0.191c0.026,0.004,0.053,0.006,0.078,0.006
              c0.104,0,0.2-0.032,0.283-0.096c0.104-0.079,0.168-0.187,0.189-0.321l1.216-8.074l2.61,0.394c0.132,0.019,0.256-0.01,0.363-0.089
              s0.173-0.188,0.19-0.315C181.812,14.679,181.782,14.557,181.702,14.45z M151.653,11.083c-0.128,0-0.239,0.043-0.329,0.127
              c-0.1,0.091-0.153,0.206-0.158,0.341l-0.161,3.832l-4.797-0.202l0.163-3.833c0.005-0.134-0.036-0.251-0.125-0.352
              c-0.089-0.098-0.203-0.15-0.359-0.157c-0.126,0-0.237,0.043-0.33,0.128c-0.097,0.089-0.151,0.207-0.156,0.34l-0.364,8.64
              c-0.006,0.135,0.036,0.253,0.128,0.352c0.089,0.097,0.207,0.151,0.365,0.157c0.125,0,0.237-0.045,0.323-0.129
              c0.097-0.09,0.148-0.204,0.153-0.339l0.162-3.832l4.796,0.202l-0.161,3.832c-0.006,0.134,0.036,0.252,0.127,0.353
              c0.092,0.098,0.207,0.15,0.34,0.156c0.002,0,0.022,0,0.025,0c0.12,0,0.229-0.043,0.321-0.128c0.097-0.089,0.149-0.203,0.156-0.339
              l0.364-8.641c0.005-0.136-0.038-0.254-0.128-0.352C151.92,11.143,151.808,11.09,151.653,11.083z M151.295,20.576l-0.001-0.007
              l0.001,0V20.576z' />
          </g>
        </g>
        <defs>
          <filter id='f1' x='0' y='0'>
            <feGaussianBlur in='SourceGraphic' stdDeviation='0.6' />
          </filter>
        </defs>
        <g transform='translate(0,-1)'>
          <path className = { styles.volumeRangeShadow } filter='url(#f1)' d='M202.293,47.874c0.927,0.253,1.897-0.307,2.146-1.192c0.12-0.432,0.063-0.885-0.159-1.276
          c-0.229-0.402-0.605-0.69-1.058-0.813c-0.465-0.124-0.966-0.052-1.382,0.2l-0.184,0.112l-0.208-0.057
          C179.89,38.977,157.604,36,135.21,36c-22.479,0-44.905,3-66.656,8.915l-0.208,0.057l-0.184-0.112
          c-0.284-0.172-0.604-0.264-0.927-0.264c-0.153,0-0.306,0.021-0.455,0.062c-0.455,0.122-0.831,0.41-1.06,0.812
          c-0.223,0.392-0.279,0.845-0.159,1.277c0.248,0.884,1.228,1.438,2.145,1.191c0.48-0.131,0.882-0.464,1.102-0.914l0.099-0.204
          l0.219-0.06c21.562-5.859,43.794-8.83,66.079-8.83c22.2,0,44.292,2.948,65.666,8.764l0.22,0.06l0.1,0.205
          C201.414,47.418,201.806,47.744,202.293,47.874z' />
        </g>
        
        <defs>
            <filter id='f2' x='0' y='0'>
                <feGaussianBlur in='SourceGraphic' stdDeviation='1' />
            </filter>
        </defs>
        <g transform='translate(0,1)'>
          <path fill='white' filter='url(#f2)' d='M202.293,47.874c0.927,0.253,1.897-0.307,2.146-1.192c0.12-0.432,0.063-0.885-0.159-1.276
          c-0.229-0.402-0.605-0.69-1.058-0.813c-0.465-0.124-0.966-0.052-1.382,0.2l-0.184,0.112l-0.208-0.057
          C179.89,38.977,157.604,36,135.21,36c-22.479,0-44.905,3-66.656,8.915l-0.208,0.057l-0.184-0.112
          c-0.284-0.172-0.604-0.264-0.927-0.264c-0.153,0-0.306,0.021-0.455,0.062c-0.455,0.122-0.831,0.41-1.06,0.812
          c-0.223,0.392-0.279,0.845-0.159,1.277c0.248,0.884,1.228,1.438,2.145,1.191c0.48-0.131,0.882-0.464,1.102-0.914l0.099-0.204
          l0.219-0.06c21.562-5.859,43.794-8.83,66.079-8.83c22.2,0,44.292,2.948,65.666,8.764l0.22,0.06l0.1,0.205
          C201.414,47.418,201.806,47.744,202.293,47.874z' />
        </g>
      </g>
      <g className = { styles.volumeGrad }>
          <g className = { styles.sliderGrad }>
              <path className = { styles.sliderGradInner } d='M202.293,47.874c0.927,0.253,1.897-0.307,2.146-1.192c0.12-0.432,0.063-0.885-0.159-1.276
              c-0.229-0.402-0.605-0.69-1.058-0.813c-0.465-0.124-0.966-0.052-1.382,0.2l-0.184,0.112l-0.208-0.057
              C179.89,38.977,157.604,36,135.21,36c-22.479,0-44.905,3-66.656,8.915l-0.208,0.057l-0.184-0.112
              c-0.284-0.172-0.604-0.264-0.927-0.264c-0.153,0-0.306,0.021-0.455,0.062c-0.455,0.122-0.831,0.41-1.06,0.812
              c-0.223,0.392-0.279,0.845-0.159,1.277c0.248,0.884,1.228,1.438,2.145,1.191c0.48-0.131,0.882-0.464,1.102-0.914l0.099-0.204
              l0.219-0.06c21.562-5.859,43.794-8.83,66.079-8.83c22.2,0,44.292,2.948,65.666,8.764l0.22,0.06l0.1,0.205
              C201.414,47.418,201.806,47.744,202.293,47.874z' /> 
          </g>
      </g>
      <g className = { styles.handler }
        ref = { handlerRef } transform = 'translate(126, 27)'>
        <g>
          <g>
            <path className = { styles.handlerWrapper } d='M19.267,6.264C17.731,2.46,14.09,0,9.99,0C8.709,0,7.453,0.246,6.258,0.727
              C3.782,1.725,1.843,3.629,0.8,6.088c-1.042,2.457-1.066,5.175-0.066,7.649C2.27,17.542,5.911,20,10.01,20
              c1.282,0,2.538-0.244,3.733-0.728c2.474-0.996,4.413-2.898,5.455-5.356C20.244,11.46,20.267,8.74,19.267,6.264z' />
              <linearGradient id='TIMESHIFT_LEFT_HANDLER' gradientUnits='userSpaceOnUse' x1='2.3364' y1='3.5698' x2='17.6648' y2='16.4319'>
                <stop offset='0' style = { { stopColor: '#FFFFFF' } } />
                <stop offset='1' style = { { stopColor: '#A8A6A6' } } />
              </linearGradient>
              <path fill='url(#TIMESHIFT_LEFT_HANDLER)' d='M9.99,1c3.689,0,6.966,2.213,8.35,5.638c0.901,2.231,0.879,4.677-0.062,6.888
              c-0.938,2.211-2.681,3.923-4.91,4.82C12.294,18.779,11.164,19,10.01,19c-3.689,0-6.966-2.213-8.349-5.638
              c-0.9-2.227-0.879-4.672,0.06-6.884C2.66,4.266,4.404,2.552,6.631,1.654C7.711,1.22,8.841,1,9.99,1 M9.99,0
              C8.709,0,7.453,0.246,6.258,0.727C3.782,1.725,1.843,3.629,0.8,6.088c-1.042,2.457-1.066,5.175-0.066,7.649
              C2.27,17.542,5.911,20,10.01,20c1.282,0,2.538-0.244,3.733-0.728c2.474-0.996,4.413-2.898,5.455-5.356
              c1.045-2.456,1.069-5.176,0.069-7.652C17.731,2.46,14.09,0,9.99,0L9.99,0z' />
          </g>
          <path className = { styles.handlerInner } fillRule='evenodd' clipRule='evenodd' d='M13.749,10.003c0,2.07-1.68,3.747-3.748,3.747
          c-2.072,0-3.75-1.677-3.75-3.75c0-2.07,1.68-3.749,3.75-3.749S13.75,7.933,13.749,10.003z' />
        </g>
      </g>
    </svg>
  )
}

export default Timeshift
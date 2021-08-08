import React, { useEffect, useRef } from 'react'
import { fromEvent, Subscription } from 'rxjs'
import { MouseEvents } from '../types'
import { PropsSliderInterface } from '../types'
import styles from './RangeSlider.module.scss'


const RADIUS = 233
const OFFSETX = 10
const OFFSETY = 58 
const STARTANGLE = Math.PI * 0.53
const ENDANGLE = Math.PI * 0.24
const DIFFANGLE = STARTANGLE - ENDANGLE
const TOP = 12, BOTTOM = 206
const STEP = DIFFANGLE / (BOTTOM - TOP)

export const VolumeLeft = (props: PropsSliderInterface) => {
  let angle = STARTANGLE - DIFFANGLE / 2
  let centerX = RADIUS + OFFSETX, centerY = RADIUS - OFFSETY
  let X, Y

  const { onChange } = props
  const clipRef: React.MutableRefObject<SVGRectElement | null> = useRef(null)
  const handlerRef: React.MutableRefObject<SVGAElement | null> = useRef(null)
  const handlerMove = (event: Event) => {
    const { offsetY } = (event as MouseEvent)
    
    if (offsetY > TOP && offsetY <= BOTTOM) {
      const value = (BOTTOM - offsetY)
      angle = STARTANGLE + (offsetY - BOTTOM) * STEP
      X = Math.ceil(centerX - RADIUS * Math.sin(angle))
      Y = Math.ceil(centerY - RADIUS * Math.cos(angle))
      handlerRef?.current?.setAttribute('transform', `translate(${X}, ${Y})`)  
      clipRef.current?.setAttribute('y', String(offsetY - TOP))
      console.log(value)
      onChange && onChange(value)
    }
  }

  useEffect(() => {
    let mouseDownSubscribed: Subscription
    X = Math.ceil(centerX - RADIUS * Math.sin(angle))
    Y = Math.ceil(centerY - RADIUS * Math.cos(angle))
    console.log(`X: ${X}, Y: ${Y}`)
    
    handlerRef?.current?.setAttribute('transform', `translate(${X}, ${Y})`)  
    clipRef.current?.setAttribute('y', String(Math.abs(0.5 * (TOP - BOTTOM))))

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

  return (
    <svg x='0px' y='0px' width='105px' height='227px' viewBox='0 0 105 227' enableBackground='new 0 0 105 227' >
      <g className = { styles.volumeRange } >
        <filter id='VOLUME_LEFT_RANGE_f2' y='0' x='0'>
          <feGaussianBlur in='SourceGraphic' stdDeviation='1'></feGaussianBlur>
        </filter>
        <filter id='VOLUME_LEFT_RANGE_f1' y='0' x='0'>
          <feGaussianBlur in='SourceGraphic' stdDeviation='0.5'></feGaussianBlur>
        </filter>
        <g transform='translate(-1,0)'>
          <g>
            <path opacity='0.3' fill='none' stroke='#000000' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'
              d='M90.797,14.962c-17.374,17.988-32.322,38.911-44.044,62.5c-20.636,41.524-28.652,86.028-25.512,129.153' />
          </g>
        </g>
        <g transform='translate(1,1)' >
          <g filter='url(#VOLUME_LEFT_RANGE_f2)'>
            <path fill='none' stroke='#FFFFFF' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' d='M90.797,14.962
                        c-17.374,17.988-32.322,38.911-44.044,62.5c-20.636,41.524-28.652,86.028-25.512,129.153' />
          </g>
        </g>
        <g transform='translate(-1,0)' >
          <g filter='url(#VOLUME_LEFT_RANGE_f1)'>
            <circle opacity='0.3' cx='90.742' cy='15.068' r='2' />
          </g>
        </g>
        <path className = { styles.volumeRangeShadow } fill='#CACACA' d='M90.742,13.068c-1.105,0-2,0.896-2,2c0,0.183,0.032,0.357,0.078,0.525
          C71.562,33.729,57.106,54.38,45.857,77.017c-19.729,39.698-28.606,83.86-25.732,127.834c-0.523,0.361-0.867,0.963-0.867,1.646
          c0,1.104,0.896,2,2,2c1.105,0,2-0.896,2-2c0-0.795-0.467-1.476-1.139-1.798c-2.847-43.616,5.96-87.418,25.528-126.793
          C58.803,55.46,73.134,34.982,90.246,16.998c0.159,0.041,0.323,0.07,0.496,0.07c1.104,0,2-0.896,2-2S91.847,13.068,90.742,13.068z' />
        <g>
          <path fill='#838688' d='M3.675,121.417l6.789,4.913l-0.33,1.303l-8.292,1.02l0.298-1.175l7.092-0.778l0.026-0.104l-5.867-4.062
                    L3.675,121.417z' />
          <path fill='#838688' d='M8.504,112.253l3.545,1.045c0.407,0.12,0.723,0.32,0.949,0.599c0.226,0.28,0.357,0.608,0.392,0.985
                    s0.03,0.738-0.014,1.084c-0.043,0.346-0.122,0.711-0.235,1.095c-0.615,2.087-1.598,2.932-2.949,2.533l-3.534-1.042
                    c-1.427-0.42-1.833-1.674-1.218-3.762C6.063,112.681,7.084,111.835,8.504,112.253z M11.719,114.377l-3.557-1.048
                    c-0.921-0.271-1.585,0.284-1.992,1.665c-0.086,0.292-0.145,0.554-0.176,0.786c-0.031,0.233-0.029,0.467,0.006,0.703
                    c0.035,0.234,0.129,0.438,0.283,0.608c0.154,0.171,0.373,0.298,0.657,0.382l3.557,1.049c0.859,0.253,1.494-0.314,1.903-1.703
                    C12.805,115.444,12.578,114.631,11.719,114.377z' />
          <path fill='#838688'
            d='M16.793,105.212l-1.582,4.735l-7.387-2.468l0.369-1.104l6.613,2.209l1.213-3.63L16.793,105.212z' />
          <path fill='#838688' d='M12.693,93.747l5.431,2.024c1.319,0.492,1.624,1.69,0.915,3.594c-0.143,0.382-0.294,0.714-0.455,0.996
                    c-0.161,0.282-0.361,0.544-0.601,0.788c-0.24,0.244-0.529,0.396-0.868,0.458c-0.339,0.062-0.711,0.017-1.116-0.134l-5.431-2.024
                    l0.39-1.046l5.42,2.02c0.48,0.179,0.87,0.141,1.17-0.115c0.3-0.255,0.556-0.668,0.769-1.238c0.212-0.569,0.287-1.043,0.223-1.422
                    c-0.064-0.378-0.336-0.656-0.816-0.835l-5.42-2.02L12.693,93.747z' />
          <path fill='#838688'
            d='M24.808,84.766l-0.397,0.94l-6.068-2.565l-0.023,0.055l5.091,4.875l-0.406,0.961l-7.073-0.189l-0.023,0.056
                    l6.068,2.565l-0.406,0.962l-7.173-3.033l0.677-1.603l6.94,0.224l0.025-0.029l-5.059-4.705l0.654-1.547L24.808,84.766z' />
          <path fill='#838688' d='M28.898,75.975l-2.285,4.84l-7.043-3.324l2.233-4.731l0.738,0.348l-1.737,3.679l2.301,1.086l1.567-3.32
                    l0.738,0.348l-1.567,3.321l2.529,1.193l1.788-3.787L28.898,75.975z' />
          <path fill='#838688' d='M36.146,62.065l-0.577,1.065l-2.501-0.345l-1.589,2.933l1.661,1.896l-0.548,1.013l-5.374-6.432l0.64-1.182
                    L36.146,62.065z M32.224,62.656l-3.72-0.514l-0.051,0.095l2.463,2.835L32.224,62.656z' />
        </g>
        <g>
          <path fill='#838688' d='M17.759,223.126h-1.128v-3.84h-0.024l-1.312,3.84h-1l-1.352-3.84h-0.032v3.84h-1.144v-5.192h1.776
                    l1.28,3.712l1.264-3.712h1.672V223.126z' />
          <path fill='#838688' d='M20.127,223.126h-1.248v-5.192h1.248V223.126z' />
          <path fill='#838688'
            d='M26.135,223.126h-1.264l-2.512-3.6v3.6h-1.112v-5.192h1.264l2.512,3.544v-3.544h1.112V223.126z' />
        </g>
        <g>
          <g enableBackground='new'>
            <path fill='#838688' d='M90.092,6.965h-1.128v-3.84h-0.024l-1.312,3.84h-1l-1.353-3.84h-0.031v3.84H84.1V1.772h1.776l1.28,3.712
                        l1.264-3.712h1.672V6.965z' />
            <path fill='#838688' d='M95.98,6.965h-1.265l-0.464-1.368h-1.896L91.9,6.965h-1.232l1.92-5.192h1.52L95.98,6.965z M93.98,4.765
                        l-0.656-1.952h-0.032l-0.656,1.952H93.98z' />
            <path fill='#838688' d='M101.34,6.965h-1.447l-1.185-1.84l-1.192,1.84h-1.439l1.912-2.648l-1.832-2.544h1.439l1.112,1.729
                        l1.104-1.729h1.439L99.42,4.316L101.34,6.965z' />
          </g>
        </g>
      </g>
      <g className = { styles.volumeClipPath }>
        <defs>
          <clipPath id='VOLUME_LEFT_CLIP_PATH'>
            <rect ref = { clipRef } x='0' y='0' width='105' height='227' />
          </clipPath>
        </defs>
      </g>
      <g className = { styles.volumeGrad } transform='translate(19,12)' clipPath='url(#VOLUME_LEFT_CLIP_PATH)'>
        <g transform='translate(-1,0)'>
          <defs>
            <filter id='VOLUME_LEFT_GRAD_f1' x='0' y='0'>
              <feGaussianBlur in='SourceGraphic' stdDeviation='0.5' />
            </filter>
          </defs>
          <path fill='#709795' filter='url(#VOLUME_LEFT_GRAD_f1)' d='M71.741,0.812c-1.246,0-2.256,1.01-2.256,2.256c0,0.26,0.053,0.505,0.134,0.738
            C52.448,21.891,38.062,42.469,26.856,65.018C7.17,104.63-1.711,148.687,1.106,192.568c-0.659,0.394-1.104,1.106-1.104,1.93
            c0,1.246,1.01,2.256,2.256,2.256c1.246,0,2.256-1.01,2.256-2.256c0-0.947-0.586-1.756-1.414-2.09
            c-2.789-43.52,6.023-87.214,25.547-126.5C39.759,43.547,54.024,23.139,71.05,5.205c0.22,0.071,0.448,0.119,0.691,0.119
            c1.246,0,2.256-1.01,2.256-2.256C73.997,1.822,72.987,0.812,71.741,0.812z' />
        </g>

        <g transform='translate(1,0)' >
          <defs>
            <filter id='VOLUME_LEFT_GRAD_f2' x='0' y='0'>
              <feGaussianBlur in='SourceGraphic' stdDeviation='1' />
            </filter>
          </defs>
          <path fill='white' filter='url(#VOLUME_LEFT_GRAD_f2)' d='M71.741,0.812c-1.246,0-2.256,1.01-2.256,2.256c0,0.26,0.053,0.505,0.134,0.738
            C52.448,21.891,38.062,42.469,26.856,65.018C7.17,104.63-1.711,148.687,1.106,192.568c-0.659,0.394-1.104,1.106-1.104,1.93
            c0,1.246,1.01,2.256,2.256,2.256c1.246,0,2.256-1.01,2.256-2.256c0-0.947-0.586-1.756-1.414-2.09
            c-2.789-43.52,6.023-87.214,25.547-126.5C39.759,43.547,54.024,23.139,71.05,5.205c0.22,0.071,0.448,0.119,0.691,0.119
            c1.246,0,2.256-1.01,2.256-2.256C73.997,1.822,72.987,0.812,71.741,0.812z' />
        </g>
        <g>
          <path fill='#5EC7E1' d='M71.741,0.812c-1.246,0-2.256,1.01-2.256,2.256c0,0.26,0.053,0.505,0.134,0.738
            C52.448,21.891,38.062,42.469,26.856,65.018C7.17,104.63-1.711,148.687,1.106,192.568c-0.659,0.394-1.104,1.106-1.104,1.93
            c0,1.246,1.01,2.256,2.256,2.256c1.246,0,2.256-1.01,2.256-2.256c0-0.947-0.586-1.756-1.414-2.09
            c-2.789-43.52,6.023-87.214,25.547-126.5C39.759,43.547,54.024,23.139,71.05,5.205c0.22,0.071,0.448,0.119,0.691,0.119
            c1.246,0,2.256-1.01,2.256-2.256C73.997,1.822,72.987,0.812,71.741,0.812z' />
        </g>
      </g>
      <g className = { styles.handler } ref = { handlerRef }>
        <g>
          <path className = { styles.handlerWrapper } d='M19.267,6.264C17.731,2.46,14.09,0,9.99,0C8.709,0,7.453,0.246,6.258,0.727
            C3.782,1.725,1.843,3.629,0.8,6.088c-1.042,2.457-1.066,5.175-0.066,7.649C2.27,17.542,5.911,20,10.01,20
            c1.282,0,2.538-0.244,3.733-0.728c2.474-0.996,4.413-2.898,5.455-5.356C20.244,11.46,20.267,8.74,19.267,6.264z' />
          <linearGradient id='VOLUME_LEFT_HANDLER' gradientUnits='userSpaceOnUse' x1='2.3364' y1='3.5698' x2='17.6648' y2='16.4319'>
            <stop offset='0' style={{ stopColor: '#FFFFFF' }} />
            <stop offset='1' style={{ stopColor: '#A8A6A6' }} />
          </linearGradient>
          <path fill='url(#VOLUME_LEFT_HANDLER)' d='M9.99,1c3.689,0,6.966,2.213,8.35,5.638c0.901,2.231,0.879,4.677-0.062,6.888
            c-0.938,2.211-2.681,3.923-4.91,4.82C12.294,18.779,11.164,19,10.01,19c-3.689,0-6.966-2.213-8.349-5.638
            c-0.9-2.227-0.879-4.672,0.06-6.884C2.66,4.266,4.404,2.552,6.631,1.654C7.711,1.22,8.841,1,9.99,1 M9.99,0
            C8.709,0,7.453,0.246,6.258,0.727C3.782,1.725,1.843,3.629,0.8,6.088c-1.042,2.457-1.066,5.175-0.066,7.649
            C2.27,17.542,5.911,20,10.01,20c1.282,0,2.538-0.244,3.733-0.728c2.474-0.996,4.413-2.898,5.455-5.356
            c1.045-2.456,1.069-5.176,0.069-7.652C17.731,2.46,14.09,0,9.99,0L9.99,0z' />
        </g>
        <path className = { styles.handlerInner } fillRule='evenodd' clipRule='evenodd' fill='#4AB873' d='M13.749,10.003c0,2.07-1.68,3.747-3.748,3.747c-2.072,0-3.75-1.677-3.75-3.75c0-2.07,1.68-3.749,3.75-3.749S13.75,7.933,13.749,10.003z' />
      </g>
    </svg>
  )
}

export default VolumeLeft
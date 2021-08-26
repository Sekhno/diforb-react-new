import React, { useRef, useEffect } from 'react'
import { fromEvent, Subscription } from 'rxjs'
import { MouseEvents, PropsSliderInterface, SessionStorage } from '../types'
import styles from './RangeSlider.module.scss'

const RADIUS = 233
const OFFSETX = 75  
const OFFSETY = 59 
const STARTANGLE = Math.PI * 1.47 //Math.PI * 0.53
const ENDANGLE = Math.PI * 1.76 // Math.PI * 0.24 
const DIFFANGLE = STARTANGLE - ENDANGLE
const TOP = 13, BOTTOM = 200
const STEP = DIFFANGLE / (BOTTOM - TOP)

export const VolumeRight = (props: PropsSliderInterface) => {
  let angle = STARTANGLE - DIFFANGLE / 2
  let centerX = RADIUS + OFFSETX, centerY = RADIUS - OFFSETY
  let X, Y

  const { onChange, additionalSides, setAdditionalSides} = props
  const clipRef: React.MutableRefObject<SVGRectElement | null> = useRef(null)
  const handlerRef: React.MutableRefObject<SVGAElement | null> = useRef(null)
  const translateHandler = (value: number) => {
    const offsetY = BOTTOM - value
    angle = STARTANGLE + (offsetY - BOTTOM) * STEP
    X = Math.ceil(centerX - RADIUS * Math.sin(angle)) - 2 * RADIUS
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
          if (prevState) {
            sessionStorage.setItem(SessionStorage.RightVolumeAdditional, `${value}`)
          } else {
            sessionStorage.setItem(SessionStorage.RightVolume, `${value}`)
          }
          return prevState
        }
      )
      translateHandler(value)
    }
  }

  useEffect(() => {
    let volume = null
    if (additionalSides) {
      volume = sessionStorage.getItem(SessionStorage.RightVolumeAdditional)
      volume && translateHandler(+volume)
    } else {
      volume = sessionStorage.getItem(SessionStorage.RightVolume)
      volume && translateHandler(+volume)
    }
    if (volume) {
      translateHandler(+volume)
    } else {
      X = Math.ceil(centerX - RADIUS * Math.sin(angle)) - 2 * RADIUS
      Y = Math.ceil(centerY - RADIUS * Math.cos(angle))
    
      handlerRef?.current?.setAttribute('transform', `translate(${X}, ${Y})`)  
      clipRef.current?.setAttribute('y', String(Math.abs(0.5 * (TOP - BOTTOM))))
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
  }, [ handlerRef ])

  return(
    <svg x='0px' y='0px' width='105px' height='227px' viewBox='0 0 105 227' enableBackground='new 0 0 105 227' >
      <g className = { styles.volumeRange }>
        <filter id='VOLUME_RIGHT_RANGE_f2' y='0' x='0'>
          <feGaussianBlur in='SourceGraphic' stdDeviation='1'></feGaussianBlur>
        </filter>
        <filter id='VOLUME_RIGHT_RANGE_f1' y='0' x='0'>
          <feGaussianBlur in='SourceGraphic' stdDeviation='0.5'></feGaussianBlur>
        </filter>
        <g>
          <g transform='translate(1,0)'>
            <g filter='url(#VOLUME_RIGHT_RANGE_f1)'>
              <path opacity='0.5' d='M85.591,205.089l-0.151-0.157l0.016-0.221c2.889-43.993-6.008-88.22-25.729-127.898
                C48.482,54.188,34.012,33.509,16.719,15.35l-0.15-0.158l0.014-0.218c0.031-0.495-0.135-0.962-0.47-1.316
                c-0.643-0.682-1.8-0.713-2.482-0.07c-0.341,0.322-0.536,0.758-0.549,1.227c-0.013,0.469,0.157,0.915,0.479,1.255
                c0.329,0.349,0.781,0.54,1.273,0.54l0.228-0.01l0.242,0.163c17.138,18.004,31.482,38.507,42.633,60.94
                c19.554,39.347,28.381,83.207,25.524,126.839l-0.015,0.228l-0.182,0.139c-0.414,0.316-0.66,0.769-0.693,1.273
                c-0.061,0.967,0.674,1.805,1.64,1.866l0.116,0.004c0.921,0,1.688-0.721,1.748-1.642C86.107,205.919,85.936,205.45,85.591,205.089
                z' />
            </g>
          </g>
          <g transform='translate(-1,0)'>
            <g filter='url(#VOLUME_RIGHT_RANGE_f2)'>
              <path fill='#FFFFFF' d='M85.591,205.089l-0.151-0.157l0.016-0.221c2.889-43.993-6.008-88.22-25.729-127.898
                C48.482,54.188,34.012,33.509,16.719,15.35l-0.15-0.158l0.014-0.218c0.031-0.495-0.135-0.962-0.47-1.316
                c-0.643-0.682-1.8-0.713-2.482-0.07c-0.341,0.322-0.536,0.758-0.549,1.227c-0.013,0.469,0.157,0.915,0.479,1.255
                c0.329,0.349,0.781,0.54,1.273,0.54l0.228-0.01l0.242,0.163c17.138,18.004,31.482,38.507,42.633,60.94
                c19.554,39.347,28.381,83.207,25.524,126.839l-0.015,0.228l-0.182,0.139c-0.414,0.316-0.66,0.769-0.693,1.273
                c-0.061,0.967,0.674,1.805,1.64,1.866l0.116,0.004c0.921,0,1.688-0.721,1.748-1.642C86.107,205.919,85.936,205.45,85.591,205.089
                z' />
            </g>
          </g>
          <g>
            <path className = { styles.volumeRangeShadow } fill='#CACACA' d='M85.591,205.089l-0.151-0.157l0.016-0.221c2.889-43.993-6.008-88.22-25.729-127.898
              C48.482,54.188,34.012,33.509,16.719,15.35l-0.15-0.158l0.014-0.218c0.031-0.495-0.135-0.962-0.47-1.316
              c-0.643-0.682-1.8-0.713-2.482-0.07c-0.341,0.322-0.536,0.758-0.549,1.227c-0.013,0.469,0.157,0.915,0.479,1.255
              c0.329,0.349,0.781,0.54,1.273,0.54l0.228-0.01l0.242,0.163c17.138,18.004,31.482,38.507,42.633,60.94
              c19.554,39.347,28.381,83.207,25.524,126.839l-0.015,0.228l-0.182,0.139c-0.414,0.316-0.66,0.769-0.693,1.273
              c-0.061,0.967,0.674,1.805,1.64,1.866l0.116,0.004c0.921,0,1.688-0.721,1.748-1.642C86.107,205.919,85.936,205.45,85.591,205.089z' />
          </g>
        </g>
        <g>
          <g>
            <path fill='none' d='M47.806,28.949c33.577,44.729,53.469,100.316,53.469,160.551' />
          </g>
        </g>
        <g>
          <path fill='#848688' d='M84.886,224.385h-1.128v-3.84h-0.023l-1.312,3.84h-1l-1.352-3.84h-0.032v3.84h-1.144v-5.192h1.775l1.28,3.712l1.264-3.712h1.672V224.385z' />
          <path fill='#848688' d='M87.254,224.385h-1.248v-5.192h1.248V224.385z' />
          <path fill='#848688' d='M93.262,224.385h-1.264l-2.512-3.6v3.6h-1.112v-5.192h1.265l2.512,3.544v-3.544h1.111V224.385z' />
        </g>
        <g>
          <g enableBackground='new    '>
            <path fill='#848688' d='M7.552,8.224H6.424v-3.84H6.4l-1.312,3.84h-1l-1.352-3.84H2.704v3.84H1.56V3.031h1.776l1.28,3.712 L5.88,3.031h1.672V8.224z' />
            <path fill='#848688' d='M13.44,8.224h-1.264l-0.464-1.368H9.816L9.36,8.224H8.128l1.92-5.192h1.52L13.44,8.224z M11.44,6.023l-0.656-1.952h-0.032l-0.656,1.952H11.44z' />
            <path fill='#848688' d='M18.8,8.224h-1.448l-1.184-1.84l-1.192,1.84h-1.44l1.912-2.648l-1.832-2.544h1.44l1.112,1.729l1.104-1.729h1.44L16.88,5.575L18.8,8.224z' />
          </g>
        </g>
        <g>
          <path fill='#848688' d='M78.471,66.146l-8.328,0.939l-0.635-1.186l5.445-6.337l0.57,1.069l-4.719,5.352l0.051,0.095l7.072-0.949L78.471,66.146z' />
          <path fill='#848688' d='M81.07,76.169l-3.324,1.614c-0.381,0.186-0.75,0.251-1.105,0.197s-0.672-0.209-0.953-0.464
            c-0.279-0.256-0.52-0.526-0.721-0.811c-0.199-0.285-0.387-0.607-0.562-0.967c-0.951-1.957-0.793-3.243,0.475-3.858l3.314-1.609
            c1.338-0.65,2.482,0.003,3.434,1.961C82.588,74.209,82.402,75.522,81.07,76.169z M77.264,76.764l3.336-1.62
            c0.863-0.419,0.98-1.277,0.352-2.572c-0.133-0.273-0.266-0.506-0.4-0.699c-0.133-0.193-0.293-0.365-0.477-0.516
            c-0.184-0.15-0.391-0.237-0.619-0.259s-0.477,0.031-0.742,0.161l-3.336,1.62c-0.807,0.392-0.893,1.238-0.26,2.541C75.742,76.707,76.459,77.155,77.264,76.764z' />
          <path fill='#848688'
            d='M79.691,86.972l-2.02-4.565l7.123-3.15l0.471,1.065l-6.377,2.819l1.549,3.501L79.691,86.972z' />
          <path fill='#848688' d='M90.441,92.685l-5.379,2.16c-1.307,0.525-2.338-0.156-3.096-2.041c-0.152-0.378-0.264-0.726-0.334-1.042
            c-0.072-0.316-0.1-0.646-0.086-0.987c0.012-0.342,0.123-0.649,0.334-0.923c0.209-0.273,0.514-0.491,0.914-0.652l5.379-2.161
            l0.416,1.036l-5.367,2.156c-0.477,0.191-0.738,0.481-0.789,0.872c-0.049,0.391,0.039,0.868,0.266,1.433
            c0.227,0.564,0.49,0.964,0.793,1.201c0.303,0.236,0.691,0.259,1.166,0.068l5.367-2.156L90.441,92.685z' />
          <path fill='#848688' d='M87.531,107.49l-0.34-0.962l6.215-2.188l-0.02-0.057l-7.047-0.177l-0.348-0.985L91.35,98.5l-0.02-0.057
            l-6.215,2.188l-0.346-0.985l7.346-2.586l0.578,1.641l-5.283,4.506v0.038l6.908,0.074l0.559,1.585L87.531,107.49z' />
          <path fill='#848688' d='M90.422,116.732l-1.568-5.117l7.445-2.281l1.533,5.002l-0.779,0.239l-1.191-3.89l-2.434,0.745l1.076,3.511
            l-0.781,0.239l-1.074-3.511l-2.674,0.819l1.227,4.004L90.422,116.732z' />
          <path fill='#848688' d='M96.949,130.234l-1.27,0.314c-0.551,0.137-0.992,0.022-1.32-0.342c-0.33-0.363-0.611-1.019-0.846-1.967
            l-0.688-2.783l7.561-1.869l0.668,2.703c0.162,0.652,0.221,1.179,0.182,1.58c-0.041,0.402-0.146,0.684-0.312,0.844
            s-0.4,0.278-0.703,0.354l-1.014,0.25c-0.311,0.076-0.568,0.048-0.775-0.086c-0.205-0.135-0.391-0.363-0.553-0.686l-0.047,0.012
            c0.031,0.42-0.027,0.785-0.174,1.094C97.512,129.96,97.275,130.154,96.949,130.234z M95.447,129.407l1.141-0.282
            c0.203-0.05,0.354-0.131,0.453-0.242c0.102-0.111,0.154-0.26,0.162-0.447s0-0.351-0.021-0.489
            c-0.023-0.139-0.064-0.333-0.125-0.581l-0.41-1.654l-2.76,0.683l0.408,1.654c0.141,0.567,0.297,0.952,0.471,1.157
            C94.939,129.408,95.168,129.477,95.447,129.407z M98.98,128.25l0.885-0.219c0.287-0.071,0.463-0.227,0.529-0.465
            c0.064-0.238,0.035-0.602-0.086-1.092l-0.389-1.572l-2.562,0.633l0.398,1.607c0.117,0.482,0.273,0.807,0.469,0.973
            C98.418,128.281,98.67,128.326,98.98,128.25z' />
        </g>
      </g>
      <g className = { styles.volumeClipPath }>
        <defs>
          <clipPath id='VOLUME_RIGHT_RANGE_CLIP-PATH'>
            <rect ref = { clipRef } x='0' y='0' width='105' height='227' />
          </clipPath>
        </defs>
      </g>
      <g className = { styles.volumeGrad } transform='translate(11,5)' clipPath='url(#VOLUME_RIGHT_RANGE_CLIP-PATH)'>
        <g transform='translate(1,-1)'>
          <defs>
            <filter id='VOLUME_RIGHT_GRAD_f1' x='0' y='0'>
              <feGaussianBlur in='SourceGraphic' stdDeviation='0.5' />
            </filter>
          </defs>
          <path fill='#709795' filter='url(#VOLUME_RIGHT_GRAD_f1)' d='M74.155,200.251l-0.151-0.158l0.015-0.22c2.889-43.992-6.008-88.219-25.728-127.898
            C37.047,49.352,22.578,28.673,5.283,10.512l-0.15-0.158l0.014-0.218c0.031-0.495-0.135-0.962-0.47-1.316
            c-0.644-0.681-1.8-0.714-2.482-0.07C1.854,9.072,1.659,9.508,1.646,9.977c-0.013,0.469,0.157,0.915,0.479,1.255
            c0.329,0.349,0.781,0.54,1.273,0.54l0.228-0.01l0.242,0.163C21.005,29.927,35.349,50.431,46.5,72.865
            c19.555,39.346,28.382,83.207,25.526,126.839l-0.015,0.228l-0.182,0.138c-0.407,0.311-0.66,0.775-0.692,1.273
            c-0.062,0.966,0.673,1.804,1.64,1.867l0.113,0.004c0.922,0,1.69-0.722,1.75-1.643C74.672,201.081,74.5,200.612,74.155,200.251z' />
        </g>
        <g transform='translate(-1,0)'>
          <defs>
            <filter id='VOLUME_RIGHT_GRAD_f2' x='0' y='0'>
              <feGaussianBlur in='SourceGraphic' stdDeviation='1' />
            </filter>
          </defs>
          <path fill='white' filter='url(#VOLUME_RIGHT_GRAD_f2)' d='M74.155,200.251l-0.151-0.158l0.015-0.22c2.889-43.992-6.008-88.219-25.728-127.898
            C37.047,49.352,22.578,28.673,5.283,10.512l-0.15-0.158l0.014-0.218c0.031-0.495-0.135-0.962-0.47-1.316
            c-0.644-0.681-1.8-0.714-2.482-0.07C1.854,9.072,1.659,9.508,1.646,9.977c-0.013,0.469,0.157,0.915,0.479,1.255
            c0.329,0.349,0.781,0.54,1.273,0.54l0.228-0.01l0.242,0.163C21.005,29.927,35.349,50.431,46.5,72.865
            c19.555,39.346,28.382,83.207,25.526,126.839l-0.015,0.228l-0.182,0.138c-0.407,0.311-0.66,0.775-0.692,1.273
            c-0.062,0.966,0.673,1.804,1.64,1.867l0.113,0.004c0.922,0,1.69-0.722,1.75-1.643C74.672,201.081,74.5,200.612,74.155,200.251z' />
        </g>
        <g className='slider-grad'>
          <path fill='#5EC7E1' d='M74.155,200.251l-0.151-0.158l0.015-0.22c2.889-43.992-6.008-88.219-25.728-127.898
            C37.047,49.352,22.578,28.673,5.283,10.512l-0.15-0.158l0.014-0.218c0.031-0.495-0.135-0.962-0.47-1.316
            c-0.644-0.681-1.8-0.714-2.482-0.07C1.854,9.072,1.659,9.508,1.646,9.977c-0.013,0.469,0.157,0.915,0.479,1.255
            c0.329,0.349,0.781,0.54,1.273,0.54l0.228-0.01l0.242,0.163C21.005,29.927,35.349,50.431,46.5,72.865
            c19.555,39.346,28.382,83.207,25.526,126.839l-0.015,0.228l-0.182,0.138c-0.407,0.311-0.66,0.775-0.692,1.273
            c-0.062,0.966,0.673,1.804,1.64,1.867l0.113,0.004c0.922,0,1.69-0.722,1.75-1.643C74.672,201.081,74.5,200.612,74.155,200.251z' />
        </g>
      </g>
      <g className = { styles.handler } ref = { handlerRef }>
        <g>
          <path className = { styles.handlerWrapper } fill='#E9E9E2' d='M19.267,6.264C17.731,2.46,14.09,0,9.99,0C8.709,0,7.453,0.246,6.258,0.727
            C3.782,1.725,1.843,3.629,0.8,6.088c-1.042,2.457-1.066,5.175-0.066,7.649C2.27,17.542,5.911,20,10.01,20
            c1.282,0,2.538-0.244,3.733-0.728c2.474-0.996,4.413-2.898,5.455-5.356C20.244,11.46,20.267,8.74,19.267,6.264z' />
          <linearGradient id='VOLUME_RIGHT_HANDLER' gradientUnits='userSpaceOnUse' x1='2.3364' y1='3.5698' x2='17.6648' y2='16.4319'>
            <stop offset='0' style={{ stopColor: '#FFFFFF' }} />
            <stop offset='1' style={{ stopColor: '#A8A6A6' }} />
          </linearGradient>
          <path fill='url(#VOLUME_RIGHT_HANDLER)' d='M9.99,1c3.689,0,6.966,2.213,8.35,5.638c0.901,2.231,0.879,4.677-0.062,6.888
            c-0.938,2.211-2.681,3.923-4.91,4.82C12.294,18.779,11.164,19,10.01,19c-3.689,0-6.966-2.213-8.349-5.638
            c-0.9-2.227-0.879-4.672,0.06-6.884C2.66,4.266,4.404,2.552,6.631,1.654C7.711,1.22,8.841,1,9.99,1 M9.99,0
            C8.709,0,7.453,0.246,6.258,0.727C3.782,1.725,1.843,3.629,0.8,6.088c-1.042,2.457-1.066,5.175-0.066,7.649
            C2.27,17.542,5.911,20,10.01,20c1.282,0,2.538-0.244,3.733-0.728c2.474-0.996,4.413-2.898,5.455-5.356
            c1.045-2.456,1.069-5.176,0.069-7.652C17.731,2.46,14.09,0,9.99,0L9.99,0z' />
        </g>
        <path className = { styles.handlerInner } fillRule='evenodd' clipRule='evenodd' fill='#4AB873' d='M13.749,10.003c0,2.07-1.68,3.747-3.748,3.747
          c-2.072,0-3.75-1.677-3.75-3.75c0-2.07,1.68-3.749,3.75-3.749S13.75,7.933,13.749,10.003z' />
      </g>
    </svg>
  )
}

export default VolumeRight
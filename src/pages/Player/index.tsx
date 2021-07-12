import React, { FC, useEffect, useState } from 'react'
import { audioService, leftSnd, rightSnd } from '../../services/audio/audio.instance'

const sound1 = 'libraries/Interface/Music/Positive/Digital_01.wav'
const sound2 = 'libraries/Interface/Music/Negative/Digital_01.wav'
const rever1 = 'reverbs/rever_hall.wav'
const rever2 = 'reverbs/wildecho.wav'

const Player: FC = (): JSX.Element =>  {
  const [loading, setLoading] = useState(false)

  const onClickHandler = () => {
    setLoading(true)
    
    // leftSnd.setVolume(0)
    // rightSnd.setVolume(2)
    Promise.all([ 
      audioService.loaderBuffer(sound1), 
      audioService.loaderBuffer(sound2),
      audioService.loaderBuffer(rever2) 
    ]).then(async ([ blob1, blob2, rever ]) => {
        if (blob1) {
          const buffer = await blob1?.arrayBuffer()
          await leftSnd.onDecodeData(buffer)
        }
        if (blob2) {
          const buffer = await blob2.arrayBuffer()
          await rightSnd.onDecodeData(buffer)
        }
        if (rever) {
          const buffer1 = await rever.arrayBuffer()
          const buffer2 = await rever.arrayBuffer()
          await leftSnd.onReverbDecodeData(buffer1)
          await rightSnd.onReverbDecodeData(buffer2)
        }
        // console.log(rever1)
        
        blob1 && leftSnd.onStart()
        blob2 && rightSnd.onStart()
        setLoading(false)
      })
  }

  useEffect(() => {
    document.addEventListener('click', onClickHandler)

    return () => {
      document.removeEventListener('click', onClickHandler)
    }
  }, [])
  return (
    <div>
      { loading ? 'loading' : 'no loading' }
    </div>
  )
}

export default Player
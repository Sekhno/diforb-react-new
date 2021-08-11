import React, { FC } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { BrowserView, MobileOnlyView } from 'react-device-detect'
import DesctopWrapper from './DesctopWrapper'


const DiforbApp: FC = (): JSX.Element =>  {

  return (
    <React.Fragment>
      <BrowserView>
        <DesctopWrapper/>
      </BrowserView>
    </React.Fragment>
  )
  
}

interface StateToProps {
  player: { 
    playing: boolean 
  }
}

const mapStateToProps = (state: StateToProps) => {
  return {
    playing: state.player.playing
  }
}

export default withRouter(connect(mapStateToProps)(DiforbApp))
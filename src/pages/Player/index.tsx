import React, { FC, useEffect } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { BrowserView, MobileOnlyView, TabletView, isMobileSafari } from 'react-device-detect'
import DesktopWrapper from './DesktopWrapper'
import TabletWrapper from './TabletWrapper'


const DiforbApp: FC = (): JSX.Element =>  {
  useEffect(() => {
    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = 'auto'
    }
  })

  return (
    <React.Fragment>
      {
        !isMobileSafari &&
        <BrowserView>
          <DesktopWrapper/>
        </BrowserView>
      }
      <TabletView>
        <TabletWrapper/>
      </TabletView>
      <MobileOnlyView>
        Mobile version comming soon! 
      </MobileOnlyView>
    </React.Fragment>
  )
  
}

interface StateToProps {
  player: { 
    playing: boolean 
  }
}

const mapStateToProps = () => {
  return {}
}

export default withRouter(connect(mapStateToProps)(DiforbApp))
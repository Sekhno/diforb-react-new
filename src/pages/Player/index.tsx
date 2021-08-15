import React, { FC } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { BrowserView, MobileOnlyView, TabletView, MobileView, isMobileSafari } from 'react-device-detect'
import DesktopWrapper from './DesktopWrapper'
import TabletWrapper from './TabletWrapper'


const DiforbApp: FC = (): JSX.Element =>  {

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
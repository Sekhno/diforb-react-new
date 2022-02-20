import React, { FC, useEffect } from 'react';
import { connect } from 'react-redux';
import {useParams, withRouter} from 'react-router-dom';
import { BrowserView, MobileOnlyView, TabletView, isMobileSafari } from 'react-device-detect';
import { logEvent } from '../../helpers/firebase.helper';
import { EventName } from '../../helpers/GoogleAnalyticsEvent.enum';
import DesktopWrapper from './DesktopWrapper';
import TabletWrapper  from './TabletWrapper';
import MobileWrapper  from './MobileWrapper';


const DiforbApp: FC = (): JSX.Element =>  {
  const { id } = useParams<{id: string}>();

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    logEvent(EventName.LOADED_LIBRARY, {name: id});

    return () => {
      document.body.style.overflow = 'auto';
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
        <MobileWrapper/>
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
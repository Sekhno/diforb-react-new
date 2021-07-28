import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

export const Terms = () => {
  return(
    <div>
      <h3>DIFORB LICENSE AGREEMENT (EULA)</h3>
      The provided Sounds and Sound Libraries are the property Diforb.
      Permission is hereby granted, free of charge, to any person or organization to use these Sounds for commercial or non-commercial purposes without the prior permission from Diforb under the terms of this License Agreement. This samples may not be resold or redistributed (commercially or otherwise) in any way, either individually or repackaged in whole or in part as audio samples, sound libraries or sound effects.
      Getting any of sound effects from Diforb, you accept and agree to all the issues and terms stated in this License Agreement.
      If you have any questions, please, contact us by e-mail <a href = 'mailto:support@diforb.com'>support@diforb.com</a>
    </div>
  )
}

const mapStateToProps = (state: { auth: { isLogged: boolean } }) => {
  return {
    isLogged: state.auth.isLogged
  }
}

export default withRouter(connect(mapStateToProps)(Terms))
import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'


const Privacy = () => {
  return(
    <div className = 'paperWrapper'>
      <p>Protection of your privacy is crucial to us. We have taken all necessary precautions to ensure for your personal data to be protected and not passed on to any third parties. Please note that by entering our site, you agree to the privacy policy described below:</p>

      <h1>Collection of personal information consent</h1>
      <p>While using this website an automatical collection of information about the User may occur. This data helps us to better understand customer needs and improve our service.</p>

      <h2>Gathered information includes:</h2>
      <ul>
        <li>- IP address of the User</li>
        <li>- Country and city of the User</li>
        <li>- Time spent on site</li>
        <li>- Browser type used</li>
        <li>- Address of the site from which the transition to our website has been made</li>
        <li>- Your computer's OS</li>
      </ul>

      <h1>Use of personal information</h1>
      <h2>We collect and use your personal information for the following purpose:</h2>
      <ul>
        <li>- Creation and maintenance of your account</li>
        <li>- For the processing of your transactions</li>
        <li>- For analysis, with the ultimate goal of improving our service</li>
        <li>- For providing and displaying the data in accordance with your preferences</li>
        <li>- To introduce users of the site with the new sound libraries and other useful information</li>
        <li>- To send messages related to cash transactions</li>
      </ul>

      <p>Personal information collected by Diforb may be stored and processed in the country in which Diforb is physically located or any other country in which there is a representative office of Diforb.</p>

      <h1>Disclosure of personal information</h1>
      <p>We shall never share, sell, rent or otherwise disclose your personal information to third parties.</p>

      <h1>Protection of personal information</h1>
      <p>We use multiple security measures to protect the information we collect. All personal information is encrypted using SSL (Secure Socket Layer) technology. SSL encrypts information sent between you and the server rendering it unreadable to anyone who tries to intercept the data. Alas, despite all the precautions, there is no foolproof way to protect information. We aim to protect all the information gathered as much as possible, but we can not guarantee the absolute security of the information collected.</p>

      <h1>Coockie files</h1>
      <p>Like many other websites, we use the technology called "cookie" files for the registration of users and the usage of other functions of the site. A "cookie" is a small portion of data that is stored on your computer to collect data in order to improve our service. "Cookies" can not gather data off your hard disk or read other "cookie" files created by different sites. You can minimize or block "cookies" using the privacy settings of your web browser, however, this may affect the site performance. More information about "cookies" can be reached using the link - http://www.allaboutcookies.org/</p>

      <h1>Contact information</h1>
      <p>If you have any questions, please, contact us by e-mail support@diforb.com</p>
    </div>
  )
}

const mapStateToProps = (state: { auth: { isLogged: boolean } }) => {
  return {
    isLogged: state.auth.isLogged
  }
}

export default withRouter(connect(mapStateToProps)(Privacy))
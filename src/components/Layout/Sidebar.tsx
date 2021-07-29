import React from 'react'
import { Link } from 'react-router-dom'
import styles from './index.module.scss'
import CustomAvatar from './CustomAvatar'

interface PropsType {
  className: string
}

export const Sidebar = (props: PropsType) => {
  const { className } = props
  return(
    <div className = { className }>
      <div className = { styles.logo }>
        <i className = 'icon-logo'></i>
      </div>
      <div className = { styles.user }>
        <CustomAvatar />
        <div className = { styles.controls }>
          <Link to = '/settings'><i className = 'icon-cog'/></Link>
          <i className = 'icon-logout'/>
        </div>
      </div>
      <div className = { styles.simpleLink }>
        <Link to = '/libraries'>
          <i className = 'icon-libs'/>
          <span>Libraries</span>
        </Link>
      </div>
      <div className = { styles.simpleLink }>
        <Link to = '/tutorial'>
          <i className = 'icon-play'/>
          <span>Watch Tutorial</span>
        </Link>
      </div>
      <div className = { styles.simpleLink }>
        <Link to = '/faq'>
          <i className = 'icon-info'/>
          <span>F.A.Q.</span>
        </Link>
      </div>
      <div className = { styles.otherLinks }>
        <Link to = '/terms'>License agreement</Link>
        <Link to = '/privacy'>Privacy policy</Link>
        <Link to = '/support'>Support</Link>
        {/* <Link to = '/touch'>Get in touch</Link> */}
        <Link to = '/reviews'>Reviews</Link>
      </div>
      <div className = { styles.socialLinks }>
        <a className = 'icon-facebook' href = 'https://www.facebook.com/diforb/'/>
        <a className = 'icon-twitter' href = 'https://twitter.com/diforb'/>
      </div>
    </div>
  )
}

export default Sidebar
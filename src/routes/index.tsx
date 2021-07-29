import React from 'react'
import { Redirect } from 'react-router-dom'
import Home         from '../pages/Home'
import Libraries    from '../pages/Libraries'
import DiforbApp    from '../pages/Player'
import Terms        from '../pages/Terms'
import Privacy      from '../pages/Privacy'
import Tutorial     from '../pages/Tutorial'
import Settings     from '../pages/Settings'
import Faq          from '../pages/Faq'
import Reviews      from '../pages/Reviews'
import Support      from '../pages/Support'
import Login        from '../features/auth/Login'
import Signup       from '../features/auth/Signup'
import Reset        from '../features/auth/Reset'


const authProtectedRoutes = [
  { path: '/home', component: Home },
  { path: '/libraries', component: Libraries },
  { path: '/libraries/:id', component: Libraries },
  { path: '/settings', component: Settings },
  { path: '/tutorial', component: Tutorial },
  { path: '/terms', component: Terms },
  { path: '/privacy', component: Privacy },
  { path: '/faq', component: Faq },
  { path: '/support', component: Support },
  { path: '/reviews', component: Reviews },
  { path: '/app/:id', component: DiforbApp },
  { path: '/', exact: true, component: () => <Redirect to='/libraries' /> }
]

const publicRoutes = [
  { path: '/login', component: Login },
  { path: '/signup', component: Signup },
  { path: '/reset', component: Reset }
  
]

export { authProtectedRoutes, publicRoutes }
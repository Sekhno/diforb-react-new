import React from 'react'
import { Redirect } from 'react-router-dom'
import Home    from '../pages/Home'
import DiforbApp    from '../pages/Player'
import Terms        from '../pages/Terms'
import Login        from '../features/auth/Login'
import Signup       from '../features/auth/Signup'
import Reset        from '../features/auth/Reset'


const authProtectedRoutes = [
  { path: '/home', component: Home },
  { path: '/terms', component: Terms },
  { path: '/app/:id', component: DiforbApp },
  { path: '/', exact: true, component: () => <Redirect to='/home' /> }
]

const publicRoutes = [
  { path: '/login', component: Login },
  { path: '/signup', component: Signup },
  { path: '/reset', component: Reset }
  
]

export { authProtectedRoutes, publicRoutes }
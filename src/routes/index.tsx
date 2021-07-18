import React from 'react'
import { Redirect } from 'react-router-dom'
import Dashboard    from '../pages/Dashboard'
import DiforbApp    from '../pages/Player'
import Login        from '../features/auth/Login'
import Signup       from '../features/auth/Signup'
import Reset        from '../features/auth/Reset'


const authProtectedRoutes = [
  { path: '/dashboard', component: Dashboard },
  { path: '/app', component: DiforbApp },
  { path: '/', exact: true, component: () => <Redirect to='/dashboard' /> }
]

const publicRoutes = [
  { path: '/login', component: Login },
  { path: '/signup', component: Signup },
  { path: '/reset', component: Reset }
  
]

export { authProtectedRoutes, publicRoutes }
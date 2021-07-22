import { createStore, combineReducers, applyMiddleware } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import thunk from 'redux-thunk'
import authReducer      from '../features/auth/authSlice'
import dashboardReducer from '../pages/Home/dashboardSlice'
import playerReducer    from '../pages/Player/playerSlice'

const rootReducer = combineReducers({
  auth: authReducer,
  dashboard: dashboardReducer,
  player: playerReducer
})

const store = createStore(rootReducer, composeWithDevTools(applyMiddleware(thunk)))

export default store

import { createStore, combineReducers, applyMiddleware } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import thunk from 'redux-thunk'
import authReducer      from '../features/auth/authSlice'
import dashboardReducer from '../pages/Dashboard/dashboardSlice'

const rootReducer = combineReducers({
  auth: authReducer,
  dashboard: dashboardReducer
})

const store = createStore(rootReducer, composeWithDevTools(applyMiddleware(thunk)))

export default store

import { combineReducers } from 'redux'
import transport from './transport'
import accommodation from './accommodation'
//import temp from './temp'

export default combineReducers({
    transport,
    accommodation
})


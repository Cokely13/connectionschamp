import {createStore, combineReducers, applyMiddleware} from 'redux'
import {createLogger} from 'redux-logger'
import thunkMiddleware from 'redux-thunk'
import {composeWithDevTools} from 'redux-devtools-extension'
import auth from './auth'
import usersReducer from './allUsersStore'
import singleUserReducer from './singleUserStore'
import singleAnswerReducer from './singleAnswerStore'
import answersReducer from './allAnswersStore'
import messagesReducer from './allMessagesStore'


const reducer = combineReducers({ auth,
  allUsers: usersReducer,
  singleUser: singleUserReducer,
  singleAnswer: singleAnswerReducer,
  allAnswers: answersReducer,
  allMessages: messagesReducer
 })
const middleware = composeWithDevTools(
  applyMiddleware(thunkMiddleware, createLogger({collapsed: true}))
)
const store = createStore(reducer, middleware)

export default store
export * from './auth'

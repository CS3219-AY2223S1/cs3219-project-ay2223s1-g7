const URI_USER_SVC = process.env.REACT_APP_URI_USER_SVC || 'http://localhost:8000'
const URI_MATCH_SVC = process.env.REACT_APP_URI_MATCH_SVC || 'http://localhost:8001'
const URI_COLLAB_SVC = process.env.REACT_APP_URI_COLLAB_SVC || 'http://localhost:8002'
const URI_QUESTION_SVC = process.env.REACT_APP_URI_QUESTION_SVC || 'http://localhost:8003'
const URI_WEBCAM_SVC = process.env.REACT_APP_URI_WEBCAM_SVC || 'http://localhost:8004'

const PREFIX_USER_SVC = '/api/user'
const PREFIX_MATCH_SVC = '/'
const PREFIX_COLLAB_SVC = '/'
const PREFIX_QUESTION_SVC = '/api/question/'
const PREFIX_WEBCAM_SVC = '/'


export const URL_USER_SVC = URI_USER_SVC + PREFIX_USER_SVC
export const URL_MATCH_SVC = URI_MATCH_SVC + PREFIX_MATCH_SVC
export const URL_COLLAB_SVC = URI_COLLAB_SVC + PREFIX_COLLAB_SVC
export const URL_QUESTION_SVC = URI_QUESTION_SVC + PREFIX_QUESTION_SVC
export const URL_WEBCAM_SVC = URI_WEBCAM_SVC + PREFIX_WEBCAM_SVC


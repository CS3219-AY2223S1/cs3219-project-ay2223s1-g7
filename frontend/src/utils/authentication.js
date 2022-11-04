import { userApi } from './api.js'
import { STATUS_CODE_OK } from '../constants.js'

export async function authenticate() {
    return await userApi.post('/authenticate', {})
        .then(res => {
            if (res && res.status === STATUS_CODE_OK) {
                return true
            }
            return false
        })
        .catch((err) => {
            return false
        })
}
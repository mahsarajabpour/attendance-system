import * as actionTypes from './userData.actionTypes'

export const userLogin = (value) => {
    return dispatch => {
        dispatch(
            saveInfo(value)
        )
    }
}
export const saveInfo = (value) => {
    return {
        type: actionTypes.LOGIN,
        value
    }
}
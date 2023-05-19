import axios from "axios"
import {
    CLEAR_ERRORS,
    LOAD_USER_FAILED,
    LOAD_USER_REQUEST,
    LOAD_USER_SUCCESS,
    LOGIN_FAILED,
    LOGIN_REQUEST,
    LOGIN_SUCCESS,
    LOGOUT_FAILED,
    LOGOUT_SUCCESS,
    REGISTER_USER_FAILED,
    REGISTER_USER_REQUEST,
    REGISTER_USER_SUCCESS,
    UPDATE_PROFILE_FAILED,
    UPDATE_PROFILE_REQUEST,
    UPDATE_PROFILE_SUCCESS
} from "../constants/userConstants"


export const login = (email, password) => async (dispatch) => {
    try {
        dispatch({type: LOGIN_REQUEST})
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }
        const {data} = await axios.post('/api/user/login', {email, password}, config)
        dispatch({type: LOGIN_SUCCESS, payload: data.user})
    } catch (error) {
        dispatch({
            type: LOGIN_FAILED,
            payload: error.response.data.message
        })
    }
}
export const register = (userData) => async (dispatch) => {
    try {
        dispatch({type: REGISTER_USER_REQUEST})
        const config = {
            headers: {
                'content-type': 'multipart/form-data'
            }
        }
        const {data} = await axios.post('/api/user/register', userData, config)
        dispatch({
            type: REGISTER_USER_SUCCESS,
            payload: data.user
        })
    } catch (error) {
        dispatch({
            type: REGISTER_USER_FAILED,
            payload: error.response.data.message
        })
    }
}
export const updateProfile = (userData) => async (dispatch) => {
    try {
        dispatch({type: UPDATE_PROFILE_REQUEST})
        const config = {
            headers: {
                'content-type': 'multipart/form-data'
            }
        }
        const {data} = await axios.put('/api/user/update/profile', userData, config)
        dispatch({
            type: UPDATE_PROFILE_SUCCESS,
            payload: data.success
        })
    } catch (error) {
        dispatch({
            type: UPDATE_PROFILE_FAILED,
            payload: error.response.data.message
        })
    }
}
export const loadUser = () => async (dispatch) => {
    try {
        dispatch({type: LOAD_USER_REQUEST})

        const {data} = await axios.get('/api/user/me')
        dispatch({
            type: LOAD_USER_SUCCESS,
            payload: data.user
        })
    } catch (error) {
        dispatch({
            type: LOAD_USER_FAILED,
            payload: error.response.data.message
        })
    }
}
export const logout = () => async (dispatch) => {
    try {
        await axios.get('/api/user/logout')
        dispatch({
            type: LOGOUT_SUCCESS,
        })
    } catch (error) {
        dispatch({
            type: LOGOUT_FAILED,
            payload: error.response.data.message
        })
    }
}
export const clearError = () => async (dispatch) => {
    dispatch({type: CLEAR_ERRORS})
}
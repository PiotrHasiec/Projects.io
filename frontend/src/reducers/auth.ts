import {
    LOGIN_SUCCESS,
    LOGIN_FAIL,
    USER_LOADED_SUCCESS,
    USER_LOADED_FAIL,
    AUTHENTICATED_SUCCESS,
    AUTHENTICATED_FAIL,
    LOGOUT,
    SIGNUP_FAIL,
    SIGNUP_SUCCESS
} from '../Actions/types'


const initialState = {
    access: localStorage.getItem('access'),
    refresh: localStorage.getItem('refresh'),
    isAuthenticated: null,
    user: null,
    errors: null,
};


export default function(state = initialState, action) {
    const { type, payload } = action;
    switch(type) {
        case AUTHENTICATED_SUCCESS:
            return {
                ...state,
                isAuthenticated: true
            }
        case LOGIN_SUCCESS:
            localStorage.setItem('access', payload.access);
            localStorage.setItem('refresh', payload.refresh);
            return {
                ...state,
                isAuthenticated: true,
                access: payload.access,
                refresh: payload.refresh
            }
        case USER_LOADED_SUCCESS:
            return{
                ...state,
                user: payload
            }
        case AUTHENTICATED_SUCCESS:
            return {
                ...state,
                isAuthenticated: false
            }
        case USER_LOADED_FAIL:
            return{
                ...state,
                user: null
            }
        case SIGNUP_SUCCESS:
            return {
                ...state,
                isAuthenticated: false,
                errors: null,
            }
        case LOGOUT:
            localStorage.removeItem('access');
            localStorage.removeItem('refresh');
            return {
                ...state,
                access: null,
                refresh: null,
                isAuthenticated: false,
                user: null,
                errors: null
            }
        case LOGIN_FAIL:
        case SIGNUP_FAIL:
            localStorage.removeItem('access');
            localStorage.removeItem('refresh');
            return {
                ...state,
                access: null,
                refresh: null,
                isAuthenticated: false,
                user: null,
                errors: payload
            }
        default:
            return state
    }
    
}
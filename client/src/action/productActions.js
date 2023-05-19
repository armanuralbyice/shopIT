import axios from 'axios';
import {
    ALL_PRODUCT_FAILED,
    ALL_PRODUCT_REQUESTS,
    ALL_PRODUCT_SUCCESS,
    CLEAR_ERRORS,
    PRODUCT_DETAILS_FAILED,
    PRODUCT_DETAILS_REQUEST,
    PRODUCT_DETAILS_SUCCESS
} from "../constants/productConstants";

export const getAllProducts = (keyword = '', currentPage = 1) => async (dispatch) => {
    try {
        dispatch({type: ALL_PRODUCT_REQUESTS})
        const {data} = await axios.get(`/api/v1/products?keyword=${keyword}&page=${currentPage}`)
        dispatch({
            type: ALL_PRODUCT_SUCCESS,
            payload: data
        })
    } catch (error) {
        dispatch({
            type: ALL_PRODUCT_FAILED,
            payload: error.response.data.message
        })
    }

}
export const getProductById = (id) => async (dispatch) => {
    try {
        dispatch({type: PRODUCT_DETAILS_REQUEST})
        const {data} = await axios.get(`/api/v1/${id}`)
        dispatch({
            type: PRODUCT_DETAILS_SUCCESS,
            payload: data.product
        })
    } catch (error) {
        dispatch({
            type: PRODUCT_DETAILS_FAILED,
            payload: error.response.data.message
        })
    }
}
export const clearError = () => async (dispatch) => {
    dispatch({type: CLEAR_ERRORS})
}
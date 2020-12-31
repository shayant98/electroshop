import {
  SALE_DELETE_FAIL,
  SALE_DELETE_REQUEST,
  SALE_DELETE_SUCCESS,
  SALE_DETAILS_FAIL,
  SALE_DETAILS_REQUEST,
  SALE_DETAILS_SUCCESS,
  SALE_LIST_FAIL,
  SALE_LIST_REQUEST,
  SALE_LIST_SUCCESS,
  SALE_UPDATE_FAIL,
  SALE_UPDATE_REQUEST,
} from "../constants/saleConstants";
import { USER_LOGOUT } from "../constants/userConstants";

export const listProducts = () => async (dispatch) => {
  try {
    dispatch({ type: SALE_LIST_REQUEST });
    const { data } = await axios.get(`/api/sales`);
    dispatch({ type: SALE_LIST_SUCCESS, payload: data });
  } catch (error) {
    const message =
      error.response && error.response.data.message
        ? error.response.data.message
        : error.message;
    if (message === "Not authorized, token failed") {
      dispatch({ type: USER_LOGOUT });
    }

    dispatch({
      type: SALE_LIST_FAIL,
      payload: message,
    });
  }
};

export const listProductDetails = (id) => async (dispatch) => {
  try {
    dispatch({ type: SALE_DETAILS_REQUEST });
    const { data } = await axios.get(`/api/sales/${id}`);
    dispatch({ type: SALE_DETAILS_SUCCESS, payload: data });
  } catch (error) {
    const message =
      error.response && error.response.data.message
        ? error.response.data.message
        : error.message;
    if (message === "Not authorized, token failed") {
      dispatch({ type: USER_LOGOUT });
    }

    dispatch({
      type: SALE_DETAILS_FAIL,
      payload: message,
    });
  }
};
export const deleteProduct = (id) => async (dispatch, getState) => {
  try {
    dispatch({
      type: SALE_DELETE_REQUEST,
    });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    await axios.delete(`/api/sales/${id}`, config);

    dispatch({
      type: SALE_DELETE_SUCCESS,
    });
  } catch (error) {
    const message =
      error.response && error.response.data.message
        ? error.response.data.message
        : error.message;
    if (message === "Not authorized, token failed") {
      dispatch({ type: USER_LOGOUT });
    }

    dispatch({
      type: SALE_DELETE_FAIL,
      payload: message,
    });
  }
};
export const updateProduct = (product) => async (dispatch, getState) => {
  try {
    dispatch({
      type: SALE_UPDATE_REQUEST,
    });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    const { data } = await axios.put(
      `/api/products/${product._id}`,
      product,
      config
    );

    dispatch({
      type: SALE_UPDATE_SUCCESS,
    });

    dispatch({ type: SALE_DETAILS_SUCCESS, payload: data });
  } catch (error) {
    const message =
      error.response && error.response.data.message
        ? error.response.data.message
        : error.message;
    if (message === "Not authorized, token failed") {
      dispatch({ type: USER_LOGOUT });
    }

    dispatch({
      type: SALE_UPDATE_FAIL,
      payload: message,
    });
  }
};

import axios from "axios";

export const fetchAllProducts = async ({ queryKey }) => {
  const page = Math.max(queryKey[1], 1);
  const keyword = queryKey[2] || "";

  try {
    const res = await axios.get(
      `/api/products?keyword=${keyword}&pageNumber=${page}`
    );
    return res.data;
  } catch (error) {
    const message =
      error.response && error.response.data.message
        ? error.response.data.message
        : error.message;
    throw new Error(message);
  }
};

export const fetchProduct = async ({ queryKey }) => {
  try {
    const id = queryKey[1];
    const res = await axios.get(`/api/products/${id}`);
    return res.data;
  } catch (error) {
    throw new Error(error);
  }
};

export const createProductReview = async ({ productId, review, token }) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };
  try {
    await axios.post(`/api/products/${productId}/reviews`, review, config);
  } catch (error) {
    const message =
      error.response && error.response.data.message
        ? error.response.data.message
        : error.message;
    throw new Error(message);
  }
};

export const fetchTopRatedProducts = async () => {
  try {
    const { data } = await axios.get(`/api/products/top`);
    return data;
  } catch (error) {
    const message =
      error.response && error.response.data.message
        ? error.response.data.message
        : error.message;
    throw new Error(message);
  }
};

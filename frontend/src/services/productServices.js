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

export const deleteProduct = async ({ id, token }) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };

  try {
    await axios.delete(`/api/products/${id}`, config);
    return true;
  } catch (error) {
    const message =
      error.response && error.response.data.message
        ? error.response.data.message
        : error.message;
    throw new Error(message);
  }
};

export const createProduct = async ({ token }) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };

  const { data } = await axios.post(`/api/products`, {}, config);
  return data;
};

export const updateProduct = async ({ product, token }) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };
  const { data } = await axios.put(
    `/api/products/${product._id}`,
    product,
    config
  );
  return data;
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

export const uploadImage = async ({ image, token }) => {
  const formData = new FormData();
  formData.append("image", image);

  const config = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };

  try {
    const { data } = await axios.post("/api/upload", formData, config);
    return data;
  } catch (error) {
    const message =
      error.response && error.response.data.message
        ? error.response.data.message
        : error.message;
    throw new Error(message);
  }
};

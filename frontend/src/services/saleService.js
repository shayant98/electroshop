import axios from "axios";

export const fetchSales = async ({ queryKey }) => {
  const token = queryKey[1] || "";
  const config = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };

  try {
    const { data } = await axios.get(`/api/sales`, config);
    return data;
  } catch (error) {
    const message =
      error.response && error.response.data.message
        ? error.response.data.message
        : error.message;
    throw new Error(message);
  }
};

export const fetchSale = async ({ queryKey }) => {
  const id = queryKey[1] || "";
  const token = queryKey[2] || "";
  const config = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };

  try {
    const { data } = await axios.get(`/api/sales/${id}`, config);
    return data;
  } catch (error) {
    const message =
      error.response && error.response.data.message
        ? error.response.data.message
        : error.message;
    throw new Error(message);
  }
};

export const deleteSale = async ({ id, token }) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };

  try {
    await axios.delete(`/api/sales/${id}`, config);
    return true;
  } catch (error) {
    const message =
      error.response && error.response.data.message
        ? error.response.data.message
        : error.message;
    throw new Error(message);
  }
};

export const createSale = async ({ token }) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };

  try {
    const { data } = await axios.post(`/api/sales`, {}, config);
    return data;
  } catch (error) {
    const message =
      error.response && error.response.data.message
        ? error.response.data.message
        : error.message;
    throw new Error(message);
  }
};

export const updateSale = async ({ sale, token }) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };
  try {
    const { data } = await axios.put(`/api/sales/${sale._id}`, sale, config);
    return data;
  } catch (error) {
    const message =
      error.response && error.response.data.message
        ? error.response.data.message
        : error.message;
    throw new Error(message);
  }
};

export const fetchCoupon = async ({ queryKey }) => {
  const code = queryKey[1] || "";
  const token = queryKey[2] || "";
  const config = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };

  try {
    if (code.length < 7) {
      return;
    }
    const { data } = await axios.get(
      `/api/sales/${code.toUpperCase()}/coupon`,
      config
    );

    return data;
  } catch (error) {
    const message =
      error.response && error.response.data.message
        ? error.response.data.message
        : error.message;
    throw new Error(message);
  }
};

export const fetchPayPalToken = async () => {
  try {
    const { data } = await axios.get("/api/config/paypal");
    return data;
  } catch (error) {}
};

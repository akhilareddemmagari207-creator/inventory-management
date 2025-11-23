import axios from "axios";

const API = "http://localhost:5000/api/products";

export const getProducts = () => axios.get(API);
export const updateProduct = (id, data) => axios.put(`${API}/${id}`, data);
export const getHistory = (id) => axios.get(`${API}/${id}/history`);
export const importCSV = (formData) =>
  axios.post(`${API}/import`, formData);

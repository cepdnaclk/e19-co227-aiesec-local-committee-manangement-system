import axios from "../../api/axios";

const URL = "/term";

export const loadAll = async () => {
  const response = await axios.get(URL);
  return response.data;
};

export const loadTerm = () => {};

export const addTerm = () => {};

export const editTerm = () => {};

export const deleteTerm = () => {};

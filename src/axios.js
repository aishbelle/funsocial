import axios from "axios";

export const makeRequest = axios.create({
  baseURL: "https://funsocial-a5e2cfc4eaab.herokuapp.com/api/",
  withCredentials: true,
});
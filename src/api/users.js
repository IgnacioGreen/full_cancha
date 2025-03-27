import axios from "axios";
import httpClient from "./httpClient";

export default {
  getProfile() {
    return axios.get(`${httpClient}users/profile/`);
  },
  updateProfile(userData) {
    return axios.put(`${httpClient}users/profile/`, userData);
  }
};

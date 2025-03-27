import httpClient from "./httpClient";



export default {
  getToken(credentials) {
    return httpClient.post('token/', credentials);
  },
  logOut() {
    return httpClient.post('logout/');
  },
  register(userData) {
    return httpClient.post('register/', userData);
  }
};

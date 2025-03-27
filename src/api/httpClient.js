import axios from "axios";
import API_BASE_URL from "../config/apiURL";
import store from "../store"; // Importa el store de Vuex

const httpClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor para agregar automáticamente el token en cada petición
httpClient.interceptors.request.use(
  (config) => {
    const token = store.state.auth.token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor de respuesta para manejar la expiración del token
httpClient.interceptors.response.use(
  (response) => response, // Si la respuesta es correcta, la retorna sin cambios
  async (error) => {
    const originalRequest = error.config;
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = store.state.auth.refreshToken; // Obtiene el refresh token
        const response = await axios.post(`${API_BASE_URL}token/refresh/`, {
          refresh: refreshToken,
        });

        const newAccessToken = response.data.access;
        store.commit("auth/SET_TOKEN", newAccessToken); // Guarda el nuevo token en el store
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        return httpClient(originalRequest); // Reintenta la petición original con el nuevo token
      } catch (refreshError) {
        store.dispatch("auth/logout"); // Si falla la renovación, cierra la sesión
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default httpClient;

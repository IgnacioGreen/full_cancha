import authApi from "@/api/auth";
import router from "@/router";

export default {
  namespaced: true,
  state: {
    user: null,
    token: localStorage.getItem("token") || null
  },
  getters: {
    isAuthenticated: (state) => !!state.token
  },
  mutations: {
    SET_USER(state, user) {
      state.user = user;
    },
    SET_TOKEN(state, token) {
      state.token = token;
      localStorage.setItem("token", token);
    },
    SET_REFRESH_TOKEN(state, refreshToken) {
      state.refreshToken = refreshToken;
      localStorage.setItem("refreshToken", refreshToken);
    },
    LOGOUT(state) {
      state.user = null;
      state.token = null;
      state.refreshToken = null;
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");

    }
  },
  actions: {
    async getToken({ commit }, credentials) {
      try {
        const response = await authApi.getToken(credentials);
        commit("SET_TOKEN", response.data.access);
        commit("SET_REFRESH_TOKEN", response.data.refresh);
      } catch (error) {
        console.error("Error en el login:", error);
      }
    },
    logout({ commit }) {
      //authApi.logOut();
      router.push('/');
      commit("LOGOUT");
    }
  }
};

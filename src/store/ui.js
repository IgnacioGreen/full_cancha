export default {
    namespaced: true, // Permite llamar acciones como "ui/accion"
    state: {
      snackbar: {
        show: false,
        message: "",
        color: ""
      }
    },
    mutations: {
      SHOW_SNACKBAR(state, { message, color }) {
        state.snackbar.show = true;
        state.snackbar.message = message;
        state.snackbar.color = color;
      },
      HIDE_SNACKBAR(state) {
        state.snackbar.show = false;
        state.snackbar.message = "";
        state.snackbar.color = "";
      }
    },
    actions: {
      triggerSnackbar({ commit }, payload) {
        commit("SHOW_SNACKBAR", payload);
        setTimeout(() => {
          commit("HIDE_SNACKBAR");
        }, 3000);
      }
    }
  };
  
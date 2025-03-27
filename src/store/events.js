import eventApi from "@/api/events";

export default {
  namespaced: true,
  state: {
    events: [],
    event: {}
  },
  getters: {
    event: state => state.event,
  },
  mutations: {
    SET_EVENTS(state, events) {
      state.events = events;
    },
    SET_SELECTED_EVENT(state, event) {
      state.event = event;
    },
    REMOVE_EVENT(state, eventId) {
      state.events = state.events.filter(event => event.id !== eventId);
    },
    UPDATE_EVENT_LIST(state, event) {
      const index = state.events.findIndex(e => e.id === event.id);
      if (index !== -1) {
        // Si el evento ya existe, lo actualizamos
        state.events.splice(index, 1, event);
      } else {
        // Si el evento es nuevo, lo agregamos
        state.events.push(event);
      }
    }
  },
  actions: {
    async fetchEvents({ commit }) {
      const response = await eventApi.getAll();
      commit("SET_EVENTS", response.data);
    },
    async getEventById({ commit }, eventId) {
      try {
        const response = await eventApi.getById(eventId);
        commit("SET_SELECTED_EVENT", response.data);
        return response.data;
      } catch (error) {
        console.error("Error al obtener el evento", error);
        throw error;
      }
    },
    async saveEvent({ commit }, eventData) {
      try {
        let response;
        if (eventData.id) {
          // Si tiene ID, actualizamos (PUT)
          response = await eventApi.update(eventData.id, eventData);
        } else {
          // Si NO tiene ID, creamos un nuevo evento (POST)
          response = await eventApi.create(eventData);
        }
        commit("UPDATE_EVENT_LIST", response.data); // Mutación para actualizar el store
        return response;
      } catch (error) {
        console.error("Error al guardar el evento", error);
        throw error;
      }
    },
    async deleteEvent({ commit }, eventId) {
      try {
        const response = await eventApi.delete(eventId); 
        console.log(response)// Llamamos a la API para eliminar el evento
        commit("REMOVE_EVENT", eventId);
        dispatch("ui/triggerSnackbar", {
          message: "Evento eliminado correctamente",
          color: "success"
        }, { root: true });
      } catch (error) {
        dispatch("ui/triggerSnackbar", {
          message: `Error al eliminar el evento: ${error.message}`,
          color: "error"
        }, { root: true });

      }
    }
  }
};

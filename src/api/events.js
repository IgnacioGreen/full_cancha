import httpClient from "./httpClient";

export default {
  getAll() {
    console.log('http', httpClient)
    return httpClient.get('/events/');
  },
  getById(id) {
    return httpClient.get(`/events/${id}/`);
  },
  create(eventData) {
    return httpClient.post('/events/', eventData);
  },
  update(id, eventData) {
    return httpClient.put(`/events/${id}/`, eventData);
  },
  delete(id) {
    return httpClient.delete(`/events/${id}/`);
  }
};

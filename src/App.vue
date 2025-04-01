<template>
  <v-app>
    <v-app-bar
      v-if="isAuthenticated"
      app
      color="primary"
      dark
    >
      <div class="d-flex align-center">
        <v-img
          alt="Vuetify Logo"
          class="shrink mr-2"
          contain
          src="https://cdn.vuetifyjs.com/images/logos/vuetify-logo-dark.png"
          transition="scale-transition"
          width="40"
        />

        <v-img
          alt="Vuetify Name"
          class="shrink mt-1 hidden-sm-and-down"
          contain
          min-width="100"
          src="https://cdn.vuetifyjs.com/images/logos/vuetify-name-dark.png"
          width="100"
        />
      </div>

      <v-spacer></v-spacer>

      <v-btn
        @click="logout"
        text
      >
        <span class="mr-2">Sign out</span>
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </v-app-bar>

    <v-main class="blue-grey darken-1">
      <router-view/>
    </v-main>
    <v-snackbar top v-model="snackbar.show" :color="snackbar.color" timeout="3000">
    {{ snackbar.message }}
    <template v-slot:action="{ attrs }">
      <v-btn text v-bind="attrs" @click="closeSnackbar">Cerrar</v-btn>
    </template>
  </v-snackbar>
  </v-app>
</template>

<script>
import { mapState, mapMutations, mapGetters, mapActions } from "vuex";

export default {
  name: 'App',

  computed: {
    ...mapGetters("auth", ["isAuthenticated"]),
    ...mapState("ui", ["snackbar"])
  },
  methods: {
    ...mapActions("auth", ["logout"]),
    ...mapMutations("ui", ["HIDE_SNACKBAR"]), 
    closeSnackbar() {
      this.HIDE_SNACKBAR();
    }
  },
};
</script>

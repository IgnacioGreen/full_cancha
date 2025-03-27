<template>
  <v-container class="d-flex justify-center align-center" style="height: 100vh;">
    <v-card class="pa-5" width="400" >
      <v-card-title class="text-center">Iniciar Sesión</v-card-title>
      <v-card-text>
        <v-form ref="form" v-model="valid">
          <v-text-field
            v-model="username"
            label="Usuario"
            prepend-icon="mdi-account"
            required
          ></v-text-field>
          <v-text-field
            v-model="password"
            label="Contraseña"
            
            :type="showPassword ? 'text' : 'password'"
            :append-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
            prepend-icon="mdi-lock"
            required
            @click:append="togglePassword"
            @keydown.enter="logIn"
          ></v-text-field>
          <v-btn color="primary" block @click="logIn">Iniciar Sesión</v-btn>
        </v-form>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  name: 'Login',
  data() {
    return {
      username: 'ignaciog',
      password: 'ignaciog1',
      valid: true,
      showPassword: false
    };
  },
  created(){
    if(this.$store.getters['auth/isAuthenticated']){
      console.log('Authenticated');
      this.$router.push('/reservations');
    }
  },
  methods: {
    ...mapActions("auth", ["getToken"]),
    async logIn() {
      await this.getToken({ username: this.username, password: this.password });
      this.$router.push("/reservations");
    },
    togglePassword() {
      this.showPassword = !this.showPassword;
    }
  }
};
</script>
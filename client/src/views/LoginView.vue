<template>
  <div>
    <input type="email" placeholder="email" v-model="email" />
    <input type="password" placeholder="password" v-model="password" />
    <button @click="login">Submit</button>
  </div>
</template>

<script>
const axios = require("axios").default;
export default {
  name: "LoginView",
  components: {},
  data() {
    return {
      email: "",
      password: "",
    };
  },
  methods: {
    login() {
      const credentials = {
        email: this.email,
        password: this.password,
      };
      console.log(credentials);
      axios
        .post("http://localhost:8081/login", credentials, {
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then((response) => {
          console.log(response.data);
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },
};
</script>

<style scoped></style>

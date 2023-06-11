<template>
  <div class="container mt-4">
    <table class="table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Personal Email</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(user, index) in users" :key="index">
          <td>{{ user.id }}</td>
          <td>{{ user.email }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
const axios = require("axios").default;

export default {
  name: "UsersView",
  data() {
    return {
      users: [],
    };
  },
  methods: {
    loadUsers() {
      axios
        .get("http://localhost:8081/users/view/all")
        .then((response) => {
          // console.log(response);
          // response.json();
          // this.users = response.data.map((item) => {
          //  return {
          //    id: item.id,
          //    email: item.email,
          //    // Add more properties or modify existing ones as needed
          //  };
          // });
          this.users = response.data;
          console.log(this.users);
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },
  beforeMount() {
    this.loadUsers();
  },
};
</script>

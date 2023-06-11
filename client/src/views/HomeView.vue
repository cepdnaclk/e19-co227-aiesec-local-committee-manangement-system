<template>
  <div class="home">
    <!-- NavBar -->
    <nav class="navbar navbar-expand-sm navbar-dark bg-primary">
      <div class="container-fluid">
        <div class="navbar-header">
          <span class="navbar-brand">
            <img src="@/assets/logo-small.png" alt="LOGO" />
          </span>
        </div>
        <div class="collapse navbar-collapse" id="navbarSupportedContent">
          <!-- <ul class="navbar-nav mr-auto">
            <li class="nav-item active" v-if="isAdmin">
              <router-link class="nav-link" to="/users">Users</router-link>
            </li>
          </ul> -->
          <div class="dropdown mr-auto" v-if="isAdmin">
            <button
              class="btn btn-primary dropdown-toggle"
              type="button"
              id="dropdownMenuButtonUsers"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              Users
            </button>
            <ul class="dropdown-menu bg-primary" aria-labelledby="dropdownMenuButtonProfile">
              <li>
                <router-link class="nav-link" to="/usersview">View Users</router-link>
              </li>
            </ul>
          </div>
          <!-- <ul class="navbar-nav ml-auto"> -->
          <ul class="navbar-nav ms-auto" v-if="!isLoggedIn">
            <li class="nav-item active">
              <router-link class="nav-link" to="/login">Login</router-link>
            </li>
          </ul>
          <div class="dropdown ms-auto" v-if="isLoggedIn">
            <button
              class="btn btn-primary dropdown-toggle"
              type="button"
              id="dropdownMenuButton1"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              Hey {{ userName }}
            </button>
            <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton1">
              <li><a class="dropdown-item" href="#">Action</a></li>
              <li><a class="dropdown-item" href="#">Another action</a></li>
              <li><a class="dropdown-item" href="#">Something else here</a></li>
            </ul>
          </div>
          <!-- <li v-if="isLoggedIn" class="nav-item active">
            <p> Hey {{ userName }} <p>
          </li> -->
        </div>
      </div>
    </nav>
    <router-view />
  </div>
</template>

<script>
// @ is an alias to /src
// import HelloWorld from '@/components/HelloWorld.vue'
import { mapGetters } from "vuex";

export default {
  name: "HomeView",
  components: {
    // HelloWorld
  },
  computed: {
    ...mapGetters(["isLoggedIn", "userName", "isAdmin"]),
  },
};
</script>

<style scoped>
.nav-link {
  color: white;
  margin: 10px;
}
</style>

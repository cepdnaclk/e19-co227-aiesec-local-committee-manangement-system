<template>
<div class="container mt-5">
        <div class="row justify-content-center">
          <div class="col-md-6">
            <div class="card">
              <div class="card-header">
                <h4>Login</h4>
              </div>
              <div class="card-body">
                <div class="form-floating my-3">
                    <input type="email" 
                    class="form-control" 
                    id="floatingEmail" 
                    placeholder="name@example.com" 
                    v-model="state.user.email" 
                    @input="v$.user.email.$touch()"
                    :class="{ 'is-invalid': v$.user.email.$error }">
                    <label for="floatingEmail">Email address</label>
                    <p v-if="v$.user.email.$error" class="invalid-feedback">
                      {{ v$.user.email.$errors[0].$message }}
                    </p>
                  </div>
                  <div class="form-floating my-3">
                    <input type="password" 
                    class="form-control" 
                    id="floatingPassword" 
                    placeholder="Password" 
                    v-model="state.user.password"
                    @input="v$.user.password.$touch()"
                    :class="{ 'is-invalid': v$.user.password.$error }">
                    <label for="floatingPassword">Password</label>
                    <p v-if="v$.user.password.$error" class="invalid-feedback">
                      {{ v$.user.password.$errors[0].$message }}
                    </p>
                  </div>
                  <div class="text-center">
                  <button type="submit" class="btn btn-primary" @click="login">Login</button>
                  </div>
              </div>
            </div>
          </div>
        </div>
      </div>
</template>

<script>
const axios = require("axios").default;
import { required, email } from "@vuelidate/validators";
import useValidate from "@vuelidate/core";
import {reactive, computed} from "vue";
// import { useRouter } from 'vue-router';

export default {
  name: "LoginView",
  components: {},
  setup () {
    const state = reactive({
      user: {
        email: "",
        password: "",
      },
    })

    const rules = computed(() =>{
      return {
      user: {
        email: {
          required,
          email,
        },
        password: {
          required,
        },
      }
    }
    })

    const v$ = useValidate(rules, state)

    return {
      state,
      v$,
    }
  },
  // data() {
  //   return {
  //     v$: useValidate(),
  //     user: {
  //       email: "",
  //       password: "",
  //     },
  //   };
  // },
  methods: {
    login() {
      // Validate form
      this.v$.$validate();

      if(this.v$.$error){
        return
      }

      const credentials = {
        email: this.state.user.email,
        password: this.state.user.password,
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
          if (response.data.message == "Login successful"){
            console.log("Great Success")
            this.$router.push('/');
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },
  // validations() {
  //   return {
  //     user: {
  //       email: {
  //         required,
  //         email,
  //       },
  //       password: {
  //         required,
  //       },
  //     }
  //   }
  // },
};
</script>

<style scoped></style>

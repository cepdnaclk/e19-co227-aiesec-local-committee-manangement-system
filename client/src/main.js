// Create Vue App 
import { createApp } from 'vue'
import App from './App.vue'
// const app = createApp(App)

// Page routing
import router from './router'
// app.use(router)

// Global Data 
import store from './store'
// app.use(store)

// Form Validation
// import Vuelidate from 'vuelidate'
// app.use(Vuelidate)

// Boostrap Styling
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap';

createApp(App).use(router).use(store).mount('#app')

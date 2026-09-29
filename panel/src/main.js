import { createApp } from 'vue';
import { createRouter, createWebHistory } from 'vue-router';
import App from './App.vue';
import Dashboard from './views/Dashboard.vue';
import Products from './views/Products.vue';
import Categories from './views/Categories.vue';
import Users from './views/Users.vue';
import Orders from './views/Orders.vue';
import Login from './views/Login.vue';

const routes = [
  { path: '/', component: Dashboard },
  { path: '/products', component: Products },
  { path: '/categories', component: Categories },
  { path: '/users', component: Users },
  { path: '/orders', component: Orders },
  { path: '/login', component: Login }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

const app = createApp(App);
app.use(router);
app.mount('#app');

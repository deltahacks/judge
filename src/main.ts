import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store"
import * as firebase from "firebase/app";
import Buefy from "buefy";
import "buefy/dist/buefy.css";
import "./assets/app.scss";
import "@mdi/font/css/materialdesignicons.min.css";

Vue.use(Buefy);

Vue.config.productionTip = false;
let app: null | any = null;

firebase.auth().onAuthStateChanged(() => {
  if (!app)
    app = new Vue({
      router,
      store,
      render: h => h(App)
    }).$mount("#app");
});

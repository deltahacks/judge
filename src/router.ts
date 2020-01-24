/* eslint-disable no-unused-expressions */
import Vue from "vue";
import Router from "vue-router";
import * as firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import Login from "./components/Login.vue";
import Empty from "./components/Empty.vue";
import Register from "./components/Register.vue";
import Home from "./components/Home.vue";
import Tables from "./components/Tables.vue";
import Marking from "./components/Marking.vue";
import TopTen from "./components/TopTen.vue";
import Ranking from "./components/Ranking.vue";
import db from "./firebaseinit";

Vue.use(Router);

const router = new Router({
  mode: "history",
  routes: [
    {
      path: "/",
      name: "Login",
      component: Login,
      meta: {
        loginRedir: true
      }
    },
    {
      path: "/register",
      name: "Register",
      component: Register,
      meta: {
        loginRedir: true
      }
    },
    {
      path: "/status",
      name: "Status",
      component: Empty,
      meta: {
        auth: true
      }
    },
    {
      path: "/ranking",
      name: "Ranking",
      component: Ranking,
      meta: {
        auth: true
      }
    },
    {
      path: "/submissions",
      name: "Submissions",
      component: Tables,
      meta: {
        auth: true
      }
    },
    {
      path: "/submission/:tableNumber/",
      name: "Marking",
      component: Marking,
      props: true,
      meta: {
        auth: true
      }
    },
    {
      path: "/topTen",
      name: "TopTen",
      component: TopTen,
      meta: {
        auth: true
      }
    },
    {
      path: "*",
      component: Tables,
      meta: {
        auth: true
      }
    }
  ]
});

// Router guard setup
router.beforeEach((to, from, next) => {
  if (to.matched.some(rec => rec.meta.auth)) {
    // console.log('Protected route detected');
    firebase.auth().onAuthStateChanged(user => {
      // If user is logged in
      if (user) {
        // Proceed to next page
        console.log("Authorized user: ", user.email);
        next();
      } else {
        // Otherwise redirect to login
        console.log("Not authorized");
        next({ name: "Login" });
      }
    });
  } else if (to.matched.some(rec => rec.meta.adminAuth)) {
    console.log("Protected route detected");
    firebase.auth().onAuthStateChanged(user => {
      // If user is logged in
      if (user) {
        // Proceed to next page
        // console.log('Authorized user2: ', user);

        db.collection("admins")
          .doc(user.email!.toLocaleLowerCase())
          .get()
          .then(doc => {
            if (doc.exists) {
              // console.log('Document data:', doc.data());
              next();
            } else {
              // console.log('Not an admin user!');
              next({ name: "Login" });
            }
          })
          .catch(error => {
            // console.log('Not an admin user!');
            next({ name: "Login" });
          });
      } else {
        // Otherwise redirect to login
        // console.log('Not authorized');
        next({ name: "Login" });
      }
    });
  } else if (to.matched.some(rec => rec.meta.loginRedir)) {
    firebase.auth().onAuthStateChanged(user => {
      // If user is logged in
      if (user) {
        // console.log("Times", firebase.auth().currentUser!.metadata.creationTime, firebase.auth().currentUser!.metadata.lastSignInTime)
        // Check if this is the first time the user has logged in and pass param to display splash screen
        if (
          firebase.auth().currentUser!.metadata.creationTime ===
          firebase.auth().currentUser!.metadata.lastSignInTime
        ) {
          next({ name: "Status", params: { firstTime: "yes" } });
        } else next({ name: "Submissions", params: { firstTime: "no" } });
      } else {
        // Otherwise redirect to login
        // console.log('Not authorized');
        next();
      }
    });
  } else {
    // console.log('No route guard');
    next();
  }
});

export default router;

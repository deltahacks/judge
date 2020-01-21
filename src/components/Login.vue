<template>
  <div class="main">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
      <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" style="stop-color:#469E9A;stop-opacity:1" />
          <stop offset="40%" style="stop-color:#2B408A;stop-opacity:1" />
        </linearGradient>
      </defs>
      <path
        fill="url(#grad)"
        fill-opacity="0.7"
        d="M0,224L60,213.3C120,203,240,181,360,192C480,203,600,245,720,240C840,235,960,181,1080,170.7C1200,160,1320,192,1380,208L1440,224L1440,0L1380,0C1320,0,1200,0,1080,0C960,0,840,0,720,0C600,0,480,0,360,0C240,0,120,0,60,0L0,0Z"
      ></path>
      <!-- <path fill="url(#grad)" fill-opacity="0.9" d="M0,160L48,138.7C96,117,192,75,288,74.7C384,75,480,117,576,165.3C672,213,768,267,864,288C960,309,1056,299,1152,256C1248,213,1344,139,1392,101.3L1440,64L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"></path> -->
      <path
        fill="url(#grad)"
        fill-opacity="0.8"
        d="M0,192L80,202.7C160,213,320,235,480,229.3C640,224,800,192,960,192C1120,192,1280,224,1360,240L1440,256L1440,0L1360,0C1280,0,1120,0,960,0C800,0,640,0,480,0C320,0,160,0,80,0L0,0Z"
      ></path>
      <!-- <path fill="url(#grad)" fill-opacity="0.8" d="M0,160L120,186.7C240,213,480,267,720,261.3C960,256,1200,192,1320,160L1440,128L1440,0L1320,0C1200,0,960,0,720,0C480,0,240,0,120,0L0,0Z"></path> -->
      <!-- <text x="600" y="120" fill="white">Delta</text><text x="675" y="120" fill="white">Delta</text> -->
    </svg>
    <span>
      <span class="txt1">Log</span>
      <span class="txt2">in</span>
      <b-field class="limited">
        <b-input
          placeholder="Email"
          type="email"
          icon="email"
          color="black"
          v-model="email"
        ></b-input>
      </b-field>
      <b-field class="limited">
        <b-input
          placeholder="Password"
          type="password"
          icon="lock"
          password-reveal
          v-model="password"
        ></b-input>
      </b-field>
      <b-notification
        type="is-danger"
        :active.sync="showError"
        aria-close-label="Close notification"
        role="alert"
        style="margin-top: 30px; width: 50%; margin-left: auto; margin-right: auto;"
      >
        {{ this.error }}
      </b-notification>
      <a class="forgot">Forgot Password?</a><br /><br />
      <b-button rounded type="is-success" outlined @click="login()"
        >Submit</b-button
      ><br /><br />
      <b-button rounded type="is-primary" outlined @click="gotoRegister()"
        >Create Account</b-button
      >
    </span>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { auth, functions } from "firebase/app";
import { LoginData } from "../types";

export default Vue.extend({
  name: "Login",
  data(): LoginData {
    return {
      email: "",
      password: "",
      showError: false,
      error: ""
    };
  },
  methods: {
    gotoRegister() {
      this.$router.push({ name: "Register" });
    },
    async login() {
      try {
        console.log(this.email);
        const signupRequest = await functions().httpsCallable("isJudge")({
          email: this.email
        });

        if (!signupRequest.data.judge) {
          console.log("User is not a judge!");
          this.error = "User is not a judge!";
          this.showError = true;
          return;
        }

        await auth().signInWithEmailAndPassword(this.email, this.password);
        console.log("Successfuly logged in");
        this.$router.push({ name: "Submissions" });
      } catch (e) {
        console.log(e);
        this.error = e;
        this.showError = true;
      }
    }
  }
});
</script>

<style lang="scss" scoped>
@import url("https://fonts.googleapis.com/css?family=Montserrat:300,400,600&display=swap");
.main {
  text-align: center;
  justify-content: center;
  align-items: center;
  font-family: "Montserrat", sans-serif;
  color: black;
}
.txt1 {
  font-size: 3em;
  font-weight: 600;
}
.txt2 {
  font-size: 3em;
  font-weight: 300;
}
.limited {
  width: 50%;
  margin-left: 25vw;
}
.forgot {
  color: grey;
}
.forgot:hover {
  color: black;
}
</style>

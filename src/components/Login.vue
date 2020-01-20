<template>
  <div class="main">
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

<template>
  <div class="main">
    <LoginHeader :noMenu="true" :noBack="true"></LoginHeader>
    <div class="blurb" v-if="this.$store.state.checkinCode">
      <span v-if="this.$store.state.checkinCode">
        <h2 class="checkin">
          Join our
          <a href="https://discord.gg/6HvMQAnMgb">Discord Server</a> using the
          code:
          <u>{{ this.$store.state.checkinCode }}</u>
        </h2>
        <p>
          Please contact us via the support channels on Discord if further
          assistance is needed.
        </p>
        <hr />
      </span>
    </div>
    <span v-else>
      <span class="txt1">Log</span>
      <span class="txt2">in</span>
      <br /><br />
      <div class="loginContainer">
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
      </div>
      <b-notification
        type="is-danger"
        :active.sync="showError"
        aria-close-label="Close notification"
        role="alert"
        style="
          margin-top: 30px;
          width: 50%;
          margin-left: auto;
          margin-right: auto;
        "
      >
        {{ this.error }}
      </b-notification>
      <a class="forgot" @click="reset()">Forgot Password?</a>
      <div class="btnContainer">
        <b-button
          class="btn"
          rounded
          type="is-success"
          outlined
          @click="login()"
        >
          <div v-if="this.loading" class="processing"></div>
          <div v-else>Submit</div> </b-button
        ><br />
        <b-button
          class="btn"
          rounded
          type="is-primary"
          outlined
          @click="gotoRegister()"
          >Create Account</b-button
        >
      </div>
    </span>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { auth, functions } from "firebase/app";
import { LoginData } from "../types";
import LoginHeader from "@/components/LoginHeader.vue";

export default Vue.extend({
  name: "Login",
  components: {
    LoginHeader
  },
  data(): LoginData {
    return {
      email: "",
      password: "",
      showError: false,
      error: "",
      loading: false
    };
  },
  methods: {
    gotoRegister() {
      if (!this.loading) {
        this.$router.push({ name: "Register" });
      }
    },
    async login() {
      this.loading = true;
      try {
        console.log(this.email);
        const signupRequest = await functions().httpsCallable("isJudge")({
          email: this.email
        });
        const isMentorOrSponsor = await functions().httpsCallable(
          "isMentorOrSponsor"
        )({
          email: this.email
        });

        if (isMentorOrSponsor.data.status && !signupRequest.data.judge) {
          await auth().signInWithEmailAndPassword(this.email, this.password);
          const personalCode = await functions().httpsCallable(
            "getPersonalCode"
          )({
            email: this.email
          });
          if (
            personalCode &&
            personalCode.data &&
            !personalCode.data.error &&
            personalCode.data.code
          ) {
            this.$store.state.checkinCode = personalCode.data.code;
            auth().signOut();
          }
          console.log(personalCode);
          return;
        }
        if (!signupRequest.data.judge) {
          console.log("User is not a judge!");
          this.error = "User is not a judge!";
          this.showError = true;
          return;
        } else {
          await auth().signInWithEmailAndPassword(this.email, this.password);
        }
        console.log("Successfuly logged in");
        this.$router.push({ name: "Submissions" });
      } catch (e) {
        console.log(e);
        this.error = e;
        this.showError = true;
      } finally {
        this.loading = false;
      }
    },
    async reset() {
      this.$router.push({ name: "Reset" });
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
.checkin {
  font-size: 35px;
  color: #3e6195;
}

.blurb {
  font-size: 20px;
  text-align: center;
  padding: 50px;
  background: white;
}

.txt1 {
  font-size: 3em;
  font-weight: 600;
}
.txt2 {
  font-size: 3em;
  font-weight: 300;
}
.loginContainer {
  margin-top: 30px;
  margin-bottom: 30px;
}
.limited {
  width: 20%;
  margin: auto;
}
.processing {
  margin: auto 2vmin auto 2vmin;
  border: 0.3em solid #2b408a; /* Light grey */
  border-top: 0.3em solid #469e9a; /* Blue */
  border-radius: 50%;
  width: 1.4em;
  height: 1.4em;
  animation: spin 2s linear infinite;
}
@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
@media only screen and (max-width: 900px) {
  .limited {
    width: 50%;
  }
}
.forgot {
  color: grey;
}
.forgot:hover {
  color: black;
}
.btnContainer {
  margin-bottom: 30px;
}
.btn {
  margin-top: 30px;
}
.button.is-success.is-outlined:hover {
  color: green;
}
.button.is-primary.is-outlined:hover {
  color: purple;
}
</style>

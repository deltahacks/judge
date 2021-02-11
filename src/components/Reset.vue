<template>
  <div class="main">
    <login-header :noMenu=true></login-header>
    <span>
      <span class="txt1">Reset</span>
      <span class="txt2">Password</span><br />
      <span class="txt3">Please enter your email and a link will be sent to it.</span><br />
    </span>
    <form @submit.prevent="submit()" ref="form" class="register-form">
      <div class="input-container">
        <i class="fa fa-envelope icon"></i>
        <input
          class="input-field"
          type="text"
          placeholder="Email"
          name="email"
          v-model="email"
          pattern="[a-zA-Z0-9.-_]{1,}@[a-zA-Z0-9.-]{1,}[.]{1}[a-zA-Z0-9]{2,}"
          oninvalid="setCustomValidity('Please enter a valid email')"
          oninput="setCustomValidity('')"
          required
        />
      </div>

      <b-notification
        :type="notifType"
        :active.sync="showFb"
        aria-close-label="Close notification"
        role="alert"
        style="margin-top: 30px;"
      >
        {{ this.feedback }}
      </b-notification>

      <button type="submit" class="btn">Reset</button>
      <button type="submit" class="btn" @click="gotoLogin()">
        Return to Login
      </button>
    </form>
  </div>
</template>

<script lang="ts">
import { ResetData } from "../types";
import firebase from "firebase";
import Vue from "vue";
import LoginHeader from "@/components/LoginHeader.vue";

export default Vue.extend({
  name: "Login",
  components: {
    LoginHeader
  },
  data(): ResetData {
    return {
      email: "",
      showFb: false,
      isInvalid: false,
      feedback: "",
      debounce: false,
      last: ""
    };
  },
  methods: {
    async submit() {
      if (this.getForm().checkValidity()) {
        firebase.auth().sendPasswordResetEmail(this.email).then(() => {
            if(!this.debounce || this.email != this.last) {
              this.isInvalid = false
              this.feedback = 'Reset email sent.';
              this.debounce = true;
              this.last = this.email;
              setTimeout(() => this.debounce = false, 5000)
            }
        }).catch((e) => {
            this.isInvalid = true
            this.feedback = 'User with this email does not exist';
        });
        this.showFb = true
      }
      else if (!this.getForm().checkValidity()){
          this.showFb = false
      }
    },
    getForm(): HTMLFormElement {
      return this.$refs.form as HTMLFormElement;
    },
    gotoLogin() {
      this.$router.push("Login");
    }
  },
  computed: {
      notifType() {
          if (this.isInvalid) { return "is-danger" }
          else { return "is-success" }
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
.txt3 {
  font-size: 1em;
  font-weight: 300;
}

.input-container {
  display: -ms-flexbox; /* IE10 */
  display: flex;
  width: 100%;
  margin-bottom: 5px;
}
.register-form {
  max-width: 400px;
  margin: 25px auto;
  display: flex;
  flex-direction: column;
}

.role-dropdown {
  flex-grow: 1;
  align-self: center;
  width: 50%;
  margin-top: 10px;
  padding: 2%;
  border: 1px solid black;
  font-size: 15px;
  text-align: center;
}

.multi-container {
  margin-top: 10px;
}

.icon {
  padding: 20px;
  //   background: dodgerblue;
  color: black;
  //   min-width: 50px;
  text-align: center;
}

.input-field {
  width: 100%;
  padding: 10px;
  border: 0;
  outline: 0;
  background: transparent;
  border-bottom: 1px solid black;
  font-size: 1em;
  font-weight: 400;
}
.input-field:hover {
  cursor: pointer;
}

.input-field:focus {
  border-bottom: 1px solid dodgerblue;
}

input::placeholder {
  color: rgba(0, 0, 0, 0.5);
}
/* Set a style for the submit button */
.btn {
  background-image: linear-gradient(90deg, #84fab0 0%, #8fd3f4 100%);
  color: black;
  margin-top: 30px;
  padding: 15px 0px;
  border: none;
  border-radius: 500px;
  width: 100%;
  opacity: 0.8;
  font-size: 1em;
  font-weight: 600;
}

.btn:hover {
  opacity: 1;
}
</style>

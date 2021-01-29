<template>
  <div class="main">
    <login-header></login-header>
    <span>
      <span class="txt1">Create</span>
      <span class="txt2">Account</span><br />
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

      <div class="input-container">
        <i class="fa fa-key icon"></i>
        <input
          class="input-field"
          type="password"
          placeholder="Password"
          name="password"
          v-model="password"
          pattern=".{6,}"
          oninvalid="setCustomValidity('Password must be at least 6 characters')"
          oninput="setCustomValidity('')"
          required
        />
      </div>

      <div class="input-container">
        <i class="fa fa-key icon"></i>
        <input
          class="input-field"
          type="password"
          placeholder="Confirm Password"
          name="confirm"
          @input="e => confirmCheck(e.target)"
          required
        />
      </div>

      <div class="input-container">
        <i class="fa fa-id-card icon"></i>
        <input
          class="input-field"
          type="text"
          placeholder="First Name"
          name="first"
          style="margin-right: 20px"
          v-model="first"
          required
        />
        <input
          class="input-field"
          type="text"
          placeholder="Last Name"
          name="last"
          v-model="last"
          required
        />
      </div>

      <div class="input-container">
        <i class="fa fa-question icon"></i>
        <input
          class="input-field"
          type="text"
          placeholder="Secret"
          name="secret"
          v-model="secret"
          required
        />
      </div>

      <div class="input-container">
        <i class="fa fa-building icon"></i>
        <input
          class="input-field"
          type="text"
          placeholder="Organization"
          name="organization"
          v-model="organization"
          required
        />
      </div>
      <div class="input-container">
        <i class="fa fa-phone-alt icon"></i>
        <input
          class="input-field"
          type="text"
          placeholder="Contact"
          name="contact"
          v-model="contact"
          required
        />
      </div>

      <select v-model="role" class="role-dropdown" required>
        <option disabled selected value="">Select desired role</option>
        <option value="volunteer">Volunteer</option>
        <option value="mentor">Mentor</option>
        <option value="judge">Judge</option>
      </select>

      <div v-if="role === 'judge'" class="multi-container">
        <b-dropdown v-model="categories" multiple aria-role="list" required>
          <button class="button is-dark" type="button" slot="trigger">
            <span style="padding-bottom: 20px;"
              >Categories: ({{ categories.length }})</span
            >
            <b-icon style="padding-bottom: 20px;" icon="menu-down"></b-icon>
          </button>
          <b-dropdown-item
            v-for="category in getCategories()"
            :key="category"
            :value="category"
            aria-role="listitem"
          >
            <span>{{ category }}</span>
          </b-dropdown-item>
        </b-dropdown>
      </div>
      <b-notification
        type="is-danger"
        :active.sync="showError"
        aria-close-label="Close notification"
        role="alert"
        style="margin-top: 30px;"
      >
        {{ this.error }}
      </b-notification>

      <button type="submit" class="btn">Register</button>
      <button type="submit" class="btn" @click="gotoLogin()">
        Return to Login
      </button>
    </form>
  </div>
</template>

<script lang="ts">
import { RegisterData, categories } from "../types";
import firebase from "firebase";
import Vue from "vue";
import LoginHeader from "@/components/LoginHeader.vue";

export default Vue.extend({
  name: "Login",
  components: {
    LoginHeader
  },
  data(): RegisterData {
    return {
      email: "",
      password: "",
      first: "",
      last: "",
      secret: "",
      role: "",
      organization: "",
      contact: "",
      categories: [],
      showError: false,
      error: ""
    };
  },
  methods: {
    getCategories() {
      return categories;
    },
    async submit() {
      if (
        this.getForm().checkValidity() &&
        (this.role !== "judge" || this.categories.length > 0)
      ) {
        try {
          const signupRequest = await firebase
            .functions()
            .httpsCallable("judgeSignup")({
            email: this.email,
            password: this.password,
            secret: this.secret,
            first: this.first,
            last: this.last,
            role: this.role,
            organization: this.organization,
            contact: this.contact,
            categories: this.categories
          });
          console.log("RESPONSE: ", signupRequest.data);
          if (signupRequest.data.createdUser) {
            console.log("Success created");
            this.$router.push("Login");
          } else {
            this.error = signupRequest.data.error;
            this.showError = true;
          }
        } catch (e) {
          // this.feedback = "There was an error :(";
          console.log("Error: ", e);
          this.error = e;
          this.showError = true;
        }
      }
    },
    getForm(): HTMLFormElement {
      return this.$refs.form as HTMLFormElement;
    },
    confirmCheck(input: HTMLInputElement) {
      if (input.value !== this.password) {
        input.setCustomValidity("Password does not match");
      } else {
        input.setCustomValidity("");
      }
    },
    gotoLogin() {
      this.$router.push("Login");
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

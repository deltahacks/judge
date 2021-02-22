<template>
  <div class="main">
    <login-header :noMenu=true></login-header>
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
        <i class="fab fa-discord" id="discord"></i>
        <input
          class="input-field"
          type="text"
          placeholder="Discord Username"
          name="discord"
          v-model="discord"
          pattern="^.{3,32}#[0-9]{4}$"
          oninvalid="setCustomValidity('Please enter a valid Discord username')"
          oninput="setCustomValidity('')"
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
        <b-dropdown class="cat-dropdown" v-model="categories" multiple aria-role="list" required>
          <button class="button" type="button" slot="trigger">
            <span style="padding-top:20px; padding-bottom: 20px;"
              >Categories: ({{ categories.length }})
            </span>
            <b-icon style="padding-bottom: 20px;" icon="menu-down"></b-icon>
          </button>
          <b-dropdown-item
            v-for="category in cats"
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

      <button type="submit" class="btn">
        <div v-if="this.loading" class="processing"></div>
        <div v-else>Register</div>
      </button>
      <button type="submit" class="btn" @click="gotoLogin()">
        Return to Login
      </button>
    </form>
  </div>
</template>

<script lang="ts">
import { RegisterData, getCategories } from "../types";
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
      discord: "",
      organization: "",
      contact: "",
      categories: [],
      showError: false,
      error: "",
      cats: [],
      loading: false,
    };
  },
  methods: {
    async submit() {
      if (
        this.getForm().checkValidity() &&
        (this.role !== "judge" || this.categories.length > 0)
      ) {
        this.loading = true;
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
            discord: this.discord,
            organization: this.organization,
            contact: this.contact,
            categories: this.categories.map(each => each.toLowerCase())
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
        } finally {
          this.loading = false
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
      if (!this.loading) { this.$router.push("Login"); }
    }
  },
  async created() {
    const cats = await getCategories()

    this.cats = cats.map(each => {
      return each
        .split(" ")
        .map(word => {
          return (
            word.substring(0, 1).toUpperCase() +
            word.substring(1, word.length).toLowerCase()
          );
        })
        .join(" ");
    });
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
#discord{
  padding: 13px;
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

.cat-dropdown /deep/ .dropdown-menu{
  max-height: 11vh;
  overflow-y: auto;
}

.button {
  margin-top: 10px;
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

.processing {
  margin: auto;
  border: 0.3em solid #5565a1; /* Light grey */
  border-top: 0.3em solid white; /* Blue */
  border-radius: 50%;
  width: 1.4em;
  height: 1.4em;
  animation: spin 2s linear infinite;
}
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
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

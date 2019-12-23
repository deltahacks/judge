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
        ></b-input>
      </b-field>
      <b-field class="limited">
        <b-input
          placeholder="Password"
          minlength="7"
          type="password"
          icon="lock"
          password-reveal
        ></b-input>
      </b-field>
      <a class="forgot">Forgot Password?</a><br /><br />
      <b-button rounded type="is-success" outlined>Submit</b-button><br /><br />
      <b-button rounded type="is-primary" outlined>Create Account</b-button>
    </span>
  </div>
</template>

<script lang="ts">
export default {
  name: "Login"
};
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

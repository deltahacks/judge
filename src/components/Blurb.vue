<template>
  <div id="app">
    <link
      href="https://fonts.googleapis.com/css?family=Montserrat:300,400&display=swap"
      rel="stylesheet"
    />
    <p class="blurb">
      {{ content }}
    </p>
  </div>
</template>

<script>
import Vue from "vue";
export default Vue.extend({
  name: "Home",
  props: {
      content: String
  }
});
</script>

<style>
.blurb {
  font-size: 20px;
  text-align: center;
  padding: 30px;
}
</style>

<template>
  <div id="app">
    <login-header></login-header>
    <router-view />
  </div>
</template>

<script>
import LoginHeader from "@/components/LoginHeader.vue";

export default {
  name: "app",
  components: {
    LoginHeader,
  }
};
</script>

<style lang="scss">
.background {
  background: linear-gradient(
    269deg,
    #7c1078,
    #e8727c,
    #4f6ad3,
    #2c938b,
    #8b3ddb,
    #5088cd
  );
  background-size: 800% 800%;
}
@-webkit-keyframes ApplyAnimation {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 51%;
  }
  100% {
    background-position: 0% 50%;
  }
}
@-moz-keyframes ApplyAnimation {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 51%;
  }
  100% {
    background-position: 0% 50%;
  }
}
@keyframes ApplyAnimation {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 51%;
  }
  100% {
    background-position: 0% 50%;
  }
}
</style>

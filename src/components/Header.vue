<template>
  <section id="header">
    <div id="title-section">
      <h1 id="title" class="header-title">
        Delta<span style="font-weight: 300">Hacks</span>
      </h1>
      <h1 id="subtitle" class="header-title">Judging</h1>
      <img
        src="../assets/delta_logo.svg"
        height="50"
        width="50"
        alt="DeltaHacks Logo"
      />
    </div>
    <div class="nav" :class="{ open: showMenu }">
      <ul>
        <a href="/home"><li>Home</li></a>
        <a href="/ranking"><li>Rankings</li></a>
        <a href="#" @click="logout()"><li>Logout</li></a>
      </ul>
    </div>
    <div
      class="navicon"
      @click="showMenu = !showMenu"
      :class="{ open: showMenu }"
    >
      <div class="bar first"></div>
      <div class="bar middle"></div>
      <div class="bar last"></div>
    </div>
  </section>
</template>

<script lang="ts">
import Vue from "vue";
import * as firebase from "firebase";
import { auth } from "firebase/app";
export default Vue.extend({
  name: "LoginHeader",
  props: {
    title: {
      type: String,
      default: "DeltaHacks-VI Application Judging Platform"
    }
  },
  data(): { showMenu: boolean } {
    return {
      showMenu: false
    };
  },
  methods: {
    test() {
      console.log("x");
    },
    logout() {
      auth().signOut();
      this.$store.state.checkinCode = null;
      this.$router.push({ name: "Login" });
    }
  }
});
</script>

<style>
#header {
  position: relative;
  overflow: hidden;
  background: linear-gradient(90deg, #469e9a 0%, #2b408a 90%);
  height: 180px;
}

#title-section {
  position: absolute;
  left: 1%;
  top: 3vw;
}

.header-title {
  position: absolute;
  font-family: "Montserrat", sans-serif;
  font-weight: 600;
  color: white;
  padding-left: 60px;
}
#title {
  font-size: 25px;
}
#subtitle {
  top: 28px;
  font-size: 15px;
  margin: 0px;
}

.navicon {
  position: absolute;
  left: 93%;
  width: 80px;
  height: 50px;
  top: 3vw;
  background: #5565a1;
  border-radius: 10px;
  overflow: hidden;
}

.navicon .bar {
  background: rgb(160, 157, 157);
  width: 20px;
  height: 1px;
  position: relative;
  left: 2px;
  transition: 300ms all ease-in-out;
}

.navicon .bar.first {
  top: 18px;
}

.navicon .bar.middle {
  top: 24px;
}

.navicon .bar.last {
  top: 30px;
}

.navicon.open .bar:first-child {
  transform: rotate(45deg);
  top: 22px;
}
.navicon.open .bar:last-child {
  transform: rotate(-45deg);
  top: 20px;
}
.navicon.open .bar.middle {
  opacity: 0;
}

.nav {
  position: absolute;
  left: 40%;
  top: 3vw;
  height: 50px;
  width: 1200px;
  transition: all 300ms ease-in-out;
  background: #5b79a5;
  transform: scaleX(0);
  border-radius: 100px;
  transform-origin: right;
}

.open {
  transform: scaleX(1);
}

.nav ul {
  padding: 0;
  margin: 0;
}
.nav li {
  display: inline-block;
  color: #fff;
  font-family: sans-serif;
  padding: 12px 12px 12px 50px;
}

@media only screen and (max-width: 900px) {
  .navicon {
    left: 90%;
  }
  .nav {
    border-radius: 10px;
    top: 48vw;
  }
}

@media only screen and (max-width: 690px) {
  .navicon {
    left: 80%;
    top: 18%;
  }
  .nav {
    left: 45%;
    border-radius: 10px;
    top: 50vw;
    background: none;
  }
  .nav li {
    display: block;
    height: 15px;
  }
}
</style>

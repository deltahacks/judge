<template>
  <section>
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
      <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" style="stop-color:#469E9A;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#2B408A;stop-opacity:1" />
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
        <a href="/home"><li>Rubric</li></a>
        <a href="/home"><li>Rankings</li></a>
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

<script>
import Vue from "vue";
export default Vue.extend({
  name: "Header",
  props: {
    title: {
      type: String,
      default: "DeltaHacks-VI Application Judging Platform"
    }
  },
  data() {
    return {
      showMenu: false
    };
  }
});
</script>

<style>
section {
  position: relative;
  overflow: hidden;
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
  left: 91%;
  width: 150px;
  height: 50px;
  top: 3vw;
  background: #5565a1;
  border-radius: 10px;
}

.navicon .bar {
  background: rgb(160, 157, 157);
  width: 20px;
  height: 1px;
  position: relative;
  left: 30px;
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
  left: 50%;
  top: 3vw;
  height: 50px;
  width: 800px;
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
  svg {
    height: 100%;
    width: 200%;
  }
  .navicon {
    width: 100px;
    left: 80%;
    top: 4vw;
  }
  .nav {
    height: auto;
    border-radius: 10px;
    transform: scaleY(0);
    transform-origin: top;
  }
  .nav li {
    display: block;
  }
  .open {
    transform: scaleY(1);
  }
}
</style>

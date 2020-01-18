<template>
  <div id="timer">
    <div>
      <h1>Timer</h1>
    </div>
    <div id="clock">
			<span>{{ minutes }}</span>
			<span>:</span>
			<span>{{ seconds }}</span>
    </div>
    <div>
      <b-button @click="reset">Reset</b-button>
      <b-button v-if="!started" @click="start">Start</b-button>
			<b-button v-if="started" @click="pause">Pause</b-button>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
export default Vue.extend({
  name: "Timer",
  data() {
		return {
			time_left: 300000,
			interval: 0,
			started: false
		}
  },
  methods: {
    reset() {
			this.time_left = 300000;
			this.interval = clearInterval(this.interval);
			this.started = false;
    },
    start() {
			this.started = true;
			this.interval = setInterval(() => this.countdown(), 1000);
		},
		countdown() {
			this.time_left = this.time_left - 1000;
			if (this.time_left === 0) {
				this.interval = clearInterval(this.interval); 
				this.started = false;
				this.time_left = 300000;
			}
		},
		two_digits(seconds) {
			return (seconds < 10 ? '0' : '') + seconds;
		},
		pause() {
			this.interval = clearInterval(this.interval);
			this.started = false;
		}
	},
	computed: {
		minutes() {
			return Math.floor(this.time_left / 1000 / 60);
		},
		seconds() {
			return this.two_digits((this.time_left / 1000) % 60);
		}
	}
});
</script>

<style>
#timer {
  display: grid;
  grid-auto-flow: column;
  background: #1a1a1a;
  height: 100px;
  width: 100%;
  position: fixed;
  bottom: 0;
  font-size: 40px;
  color: white;
  font-family: "Montserrat", sans-serif;
}

#timer h1 {
  padding: 20px;
  font-weight: 700;
}

#timer button {
  float: right;
  height: 100%;
  width: 20vw;
  background: #484848;
  color: white;
  border-color: #1a1a1a;
  font-size: 20px;
}

#clock {
  padding: 20px;
}

@media only screen and (max-width: 600px) {
  #timer button {
		height: 49%;
	}
}
</style>

<template>
  <div id="timer">
    <div>
      <h1>Timer</h1>
    </div>
    <div id="clock">
			<span id="minutes">{{ minutes }}</span>
			<span id="middle">:</span>
			<span id="seconds">{{ seconds }}</span>
    </div>
    <div>
      <b-button @click="reset">Reset</b-button>
      <b-button @click="start">Start</b-button>
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
			interval: 0
		}
  },
  methods: {
    reset() {
			this.time_left = 300000;
			clearInterval(this.interval);
    },
    start() {
			this.time_left = 300000; // 5 minutes
			this.interval = setInterval(() => this.countdown(), 1000);
		},
		countdown() {
			this.time_left = this.time_left - 1000;
			console.log("time");
			if (this.time_left === 0) {
				clearInterval(this.interval); 
			}
		},
		two_digits(seconds) {
			return (seconds < 10 ? '0' : '') + seconds;
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
</style>

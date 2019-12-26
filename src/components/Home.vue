<template>
  <div id="app">
    <link
      href="https://fonts.googleapis.com/css?family=Montserrat:300,400&display=swap"
      rel="stylesheet"
    />
    <p class="blurb">
      Here are the teams you will be judging today. Click on a group to see
      their rubric and start marking.
    </p>
    <div id="app" class="container">
      <ul id="example-1">
        <li v-for="(team, i) in teams" :key="(team, i)">
          <a href="/home">
            <div
              class="team"
              :style="
                'background: linear-gradient(90deg,' +
                  colors[i % 5][0] +
                  ' 0%,' +
                  colors[i % 5][1] +
                  ' 120%)'
              "
            >
              <div class="team-div">
                <h1 class="team-name">
                  <span style="font-weight: 600">Team</span>{{ team }}
                </h1>
              </div>
              <div class="mark">
                <h1 class="team-name">Mark</h1>
              </div>
            </div>
          </a>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
export default Vue.extend({
  name: "Home",
  props: {},
  data() {
    return {
      teams: Array,
      colors: [
        ["#FCE18A", "#F54FA1"],
        ["#F54FA1", "#fa96a8"],
        ["#18BDD9", "#267aed"],
        ["#7419E6", "#e619ce"],
        ["#42E596", "#42d7e5"]
      ]
    };
  },
  methods: {
    getTeams() {
      this.teams = [1, 2, 3, 4, 5, 6, 7];
    }
  },
  async mounted() {
    this.getTeams();
  }
});
</script>

<style>
.team-div {
  float: left;
}
.mark {
  top: 0;
  background: rgba(255, 255, 255, 0.2);
  width: 150px;
  float: right;
}
.team-name {
  font-size: 30px;
  color: white;
  line-height: 100px;
  margin: 0 40px;
  font-family: "Montserrat", sans-serif;
  font-weight: 300;
}
.team {
  height: 100px;
}
.blurb {
  font-size: 20px;
  text-align: center;
  padding: 50px;
}
</style>

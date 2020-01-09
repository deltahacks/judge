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
            <div v-if="i%2==0">  <!-- Useless logic -->
          <router-link :to="{ name: 'Marking', params: { teamId: teams[i] } }">
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
                  <span>Table: </span>
                  <span style="font-weight: 600" v-if="i%2==0">{{ teams[i] }}</span>
                </h1>
              </div>
              <router-link :to="{ name: 'Marking', params: { teamId: teams[i+1] } }">
                <div class="mark">
                    <h1 class="team-name">
                  <!-- Could just put in the selected teams inside the selected tables list -->
                  <span>Table: </span>
                  <span style="font-weight: 600" v-if="i%2==0">{{ teams[i+1] }}</span>
                        </h1>
                </div>
              </router-link>
            </div>
          </router-link>
          </div> <!-- Useless logic div end -->
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
      this.teams = [1,2,3,4,5,6,7,8];
    }
  },
  async mounted() {
    this.getTeams();
  }
});
</script>

<style>
.container{
  height: 98vh;
}
.team-div {
  float: left;
}
.mark {
  top: 0;
  background: rgba(255, 255, 255, 0.2);
  /* float: right; */
  width: 50% !important;
}
.team-name {
  font-size: 1.5em;
  color: white;
  line-height: 150px;
  margin: 0 40px;
  font-family: "Montserrat", sans-serif;
  font-weight: 300;
}
.team {
  height: 150px;
}
.blurb {
  font-size: 20px;
  text-align: center;
  padding: 50px;
}
</style>

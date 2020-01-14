<template>
  <div id="app">
    <link
      href="https://fonts.googleapis.com/css?family=Montserrat:300,400&display=swap"
      rel="stylesheet"
    />
    <div class="blurb">
      <p>
        Here are the teams you will be judging today. Click on a group to see
        their rubric and start marking.
      </p>
      <br />
      <b-dropdown v-model="selectedOptions" dark>
        <button class="button is-primary" type="button" slot="trigger">
          <span> {{ selectedOptions }} </span>
          <b-icon icon="menu-down"></b-icon>
        </button>

        <b-dropdown-item value="Arcelor Mittal Dofasco">
          <span>Arcelor Mittal Dofasco</span>
        </b-dropdown-item>

        <b-dropdown-item value="CIBC">
          <span>CIBC</span>
        </b-dropdown-item>

        <b-dropdown-item value="Deloitte">
          <span>Deloitte</span>
        </b-dropdown-item>

        <b-dropdown-item value="Loyalty One">
          <span>Loyalty One</span>
        </b-dropdown-item>
      </b-dropdown>
    </div>
    <div id="app" class="container">
      <ul id="example-1">
        <li v-for="(team, i) in teams" :key="(team, i)">
          <div v-if="i % 2 == 0">
            <!-- Useless logic -->
            <router-link
              :to="{ name: 'Marking', params: { teamId: teams[i] } }"
            >
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
                    <span
                      style="font-weight: 600"
                      v-if="i % 2 == 0 && teams2[i] == 1"
                      ><strike
                        ><span style="font-weight:300">Table:</span>
                        {{ teams[i] }}</strike
                      >
                      <span style="color: #7FFF00;"> ✔</span>
                    </span>
                    <span
                      style="font-weight: 600"
                      v-if="i % 2 == 0 && teams2[i] == 0"
                      ><span style="font-weight:300">Table:</span>
                      {{ teams[i] }}
                    </span>
                  </h1>
                </div>
                <router-link
                  :to="{ name: 'Marking', params: { teamId: teams[i + 1] } }"
                >
                  <div class="mark">
                    <h1 class="team-name">
                      <!-- Could just put in the selected teams inside the selected tables list -->
                      <span
                        style="font-weight: 600"
                        v-if="i % 2 == 0 && teams2[i + 1] == 1"
                        ><strike
                          ><span style="font-weight:300">Table:</span>
                          {{ teams[i + 1] }}</strike
                        >
                        <span style="color: #7FFF00;"> ✔</span>
                      </span>
                      <span
                        style="font-weight: 600"
                        v-if="i % 2 == 0 && teams2[i + 1] == 0"
                        ><span style="font-weight:300">Table:</span>
                        {{ teams[i + 1] }}</span
                      >
                    </h1>
                  </div>
                </router-link>
              </div>
            </router-link>
          </div>
          <!-- Useless logic div end -->
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
      selectedOptions: "Select a Challenge to Judge",
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
      this.teams = [1, 2, 3, 4, 5, 6, 7, 8];
      this.teams2 = [0, 0, 1, 1, 0, 1, 1, 0];
    }
  },
  async mounted() {
    this.getTeams();
  }
});
</script>

<style>
.container {
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

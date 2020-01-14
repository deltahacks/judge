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
      <b-dropdown v-model="selectedCat" dark>
        <button class="button is-primary" type="button" slot="trigger">
          <span>
            {{
              selectedCat.substring(0, 1).toUpperCase() +
                selectedCat.substring(1, selectedCat.length).toLowerCase()
            }}
          </span>
          <b-icon icon="menu-down"></b-icon>
        </button>

        <b-dropdown-item
          v-for="category in getCategories()"
          :key="category"
          :value="category"
          @click="getTables()"
          aria-role="listitem"
        >
          <span>{{
            category.substring(0, 1).toUpperCase() +
              category.substring(1, category.length).toLowerCase()
          }}</span>
        </b-dropdown-item>
      </b-dropdown>
    </div>
    <div id="app" class="container">
      <ul id="example-1">
        <li v-for="(team, i) in currentProjects" :key="(team, i)">
          <router-link
            :to="{ name: 'Marking', params: { teamId: team._.table } }"
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
                  <span style="font-weight: 600"
                    ><span style="font-weight:300"
                      >{{ team.name.project }} Table:</span
                    >
                    {{ team._.table }}
                  </span>
                </h1>
              </div>
            </div>
          </router-link>
          <!-- Useless logic div end -->
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import { auth } from "firebase/app";
import db from "../firebaseinit";
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
      ],
      judge: {},
      selectedCat: "general",
      currentProjects: []
    };
  },
  methods: {
    getTeams() {
      this.teams = [1, 2, 3, 4, 5, 6, 7, 8];
      this.teams2 = [0, 0, 1, 1, 0, 1, 1, 0];
    },
    async getJudge() {
      let doc = await db
        .collection("DH6")
        .doc("hackathon")
        .collection("judges")
        .doc(this.getUUID())
        .get();
      this.judge = doc.data();
      this.selectedCat = this.judge.categories.length
        ? this.judge.categories[0]
        : "general";
    },
    getUUID() {
      return auth().currentUser.email;
    },
    getCategories() {
      return this.judge.categories
        ? this.judge.categories.map(cat => cat.toLowerCase())
        : [];
    },
    async getTables() {
      let doc = await db
        .collection("DH6")
        .doc("hackathon")
        .collection("projects")
        .get();
      let projects = doc.docs.filter(project => {
        return (
          Object.keys(project.data()._.categories).includes(
            this.selectedCat.toLowerCase()
          ) &&
          project
            .data()
            ._.categories[this.selectedCat.toLowerCase()].filter(
              judge => judge.email === this.getUUID()
            ).length
        );
      });
      this.currentProjects = projects.map(proj => proj.data());
      console.log(this.currentProjects);
    }
  },
  async mounted() {
    this.getTeams();
    this.getJudge();
    console.log(this.getUUID());
    console.log(await this.getTables());
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

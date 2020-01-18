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
      <!--
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
      -->
    </div>
    <div id="app" class="container">
      <ul id="example-1">
        <li v-for="(team, i) in currentProjects" :key="(team, i)">
          <router-link
            :to="{ name: 'Marking', params: { tableNumber: team._.table } }"
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
              <div v-if="!doneMarking(team._.table)" class="team-div">
                <h1 class="team-name">
                  <span style="font-weight: 600"
                    ><span style="font-weight:300"
                      >{{ team.name.project }} Table:</span
                    >
                    {{ team._.table }}
                  </span>
                  <span style="float: right; font-weight: 600">
                    {{ getProjectCatsNames(team) }}
                  </span>
                </h1>
              </div>
              <div v-else class="team-div">
                <h1 class="team-name">
                  <span style="font-weight: 600"
                    ><strike
                      ><span style="font-weight:300"
                        >{{ team.name.project }} Table:</span
                      >
                      {{ team._.table }}</strike
                    >
                    <span style="color: #7FFF00;"> ✔</span>
                    <span style="float: right; font-weight: 600">
                      {{ getProjectCatsNames(team) }}
                    </span>
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
      currentProjects: [],
      categories: []
    };
  },
  methods: {
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
    getProjectCatsNames(team) {
      return Object.keys(team._.categories)
        .filter(each => {
          return (
            this.getCategories().includes(each.toLowerCase()) &&
            team._.categories[each.toLowerCase()].filter(judge => {
              return judge.email === this.getUUID();
            }).length
          );
        })
        .map(
          each =>
            each.substring(0, 1).toUpperCase() +
            each.substring(1, each.length).toLowerCase()
        )
        .join(", ");
    },
    async getTables() {
      let doc = await db
        .collection("DH6")
        .doc("hackathon")
        .collection("projects")
        .get();
      let projects = doc.docs.filter(project => {
        return Object.keys(project.data()._.categories).filter(each => {
          return (
            this.getCategories().includes(each) &&
            project
              .data()
              ._.categories[each].filter(
                judge => judge.email === this.getUUID()
              ).length
          );
        }).length;
      });
      this.currentProjects = projects
        .map(proj => proj.data())
        .sort((proja, projb) => proja._.table - projb._.table);
      console.log(this.currentProjects);
    },
    doneMarking(tabnum) {
      for (let cat of this.getCategories()) {
        for (let tab of this.currentProjects) {
          if (
            tab._.table === tabnum &&
            Object.keys(tab._.categories).includes(cat)
          ) {
            for (let judge of tab._.categories[cat.toLowerCase()]) {
              if (judge.email === this.getUUID()) {
                console.log(judge.rubric.score);
                if (judge.rubric.score === 0) return false;
              }
            }
          }
        }
      }
      return true;
    },
    getProjectScore(tabnum, category) {
      let score = 0;
      for (let tab of this.currentProjects) {
        if (tab._.table === tabnum) {
          for (let judge of tab._.categories[category.toLowerCase()]) {
            if (judge.email === this.getUUID()) score = judge.rubric.score;
          }
        }
      }
      return score;
    }
  },
  async mounted() {
    await this.getJudge();
    await this.getTables();
    this.categories = this.getCategories();
  }
});
</script>

<style>
.container {
  height: 98vh;
}
.team-div {
  float: left;
  width: 100%;
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
  width: 90%;
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

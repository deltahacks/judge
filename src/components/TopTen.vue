<template>
  <div id="app">
    <div class="center">
      <b-dropdown v-model="selectedOptions" dark>
        <button class="button is-primary" type="button" slot="trigger">
          <span> {{ selectedOptions }}</span>
          <b-icon icon="menu-down"></b-icon>
        </button>
        <div v-for="category in submission_categories" :key="category">
          <b-dropdown-item :value="category" id="category">
            {{ category }}
          </b-dropdown-item>
        </div>
      </b-dropdown>
    </div>
    <Blurb
      :content="
        'Here are the top 10 teams in the category you selected based on your marking. \
      Click on a group to see their rubric if you want to make any adjustments in score.'
      "
    ></Blurb>

    <div id="app">
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
              <router-link
                :to="{ name: 'Marking', params: { tableNumber: team } }"
              >
                <div class="mark">
                  <h1 class="team-name">Mark</h1>
                </div>
              </router-link>
            </div>
          </a>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import Blurb from "@/components/Blurb.vue";
import db from "../firebaseinit";
import * as firebase from "firebase/app";

export default Vue.extend({
  name: "Home",
  components: {
    Blurb
  },
  props: {},
  data() {
    return {
      submission_categories: ["A", "B", "C"],
      selectedOptions: "Select a category to judge",
      teams: [],
      judgeEmail: firebase.auth().currentUser.email,
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
    getJudgesCategories() {
      db.collection("DH6")
        .doc("hackathon")
        .collection("projects")
        .get()
        .then(snapshot => {
          snapshot.forEach(element => {
            try {
              let projectCategories = element.data()._.categories;
              Object.keys(projectCategories).forEach(category => {
                for (let i = 0; i < projectCategories[category].length; i++) {
                  if (this.submission_categories.indexOf(category) == -1) {
                    this.submission_categories.push(category);
                  }
                }
                console.log(this.submission_categories);
              });
            } catch (error) {
              console.log(error);
            }
          });
        });
    },
    getTeams() {
      this.teams = [];
      let scoreArray = [];
      let category = this.selectedOptions;
      db.collection("DH6")
        .doc("hackathon")
        .collection("projects")
        .get()
        .then(snapshot => {
          snapshot.forEach(element => {
            try {
              let projectCategories = element.data()._.categories;
              let totalScore = 0;
              let numOfScores = 0;
              for (let i = 0; i < projectCategories[category].length; i++) {
                totalScore += element.data()._.categories[category][i].rubric
                  .score;
                numOfScores++;
              }
              scoreArray.push([
                element.id,
                element.data(),
                totalScore / numOfScores
              ]);
            } catch (error) {
              console.log(element.id);
            }
            scoreArray.sort(function(a, b) {
              return a[2] < b[2] ? 1 : -1;
            });
          });
          try {
            for (let i = 0; i < 10; i++) {
              this.teams.push(scoreArray[i][1].name.project);
              console.log(scoreArray);
            }
          } catch (error) {
            console.log(error);
          }
        });
    }
  },
  async mounted() {
    this.getJudgesCategories();
    this.getTeams();
  },
  watch: {
    selectedOptions: function() {
      this.getTeams();
    }
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
</style>

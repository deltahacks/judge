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

    <div id="app" class="container">
      <ul id="example-1">
        <li v-for="(team, i) in teams" :key="(team, i)">
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
                <span style="padding-right: 2%; font-weight: 800;"
                  >Rank {{ i + 1 }}</span
                >
                <span style="font-weight: 600">Team</span
                >{{ team[0].name.project }}
                <span style="float: right;">Score: {{ team[1] }}</span>
              </h1>
            </div>
          </div>
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
      submission_categories: [],
      selectedOptions: "Select a category to judge",
      teams: [],
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
              let avgScore = 0;
              for (let i = 0; i < projectCategories[category].length; i++) {
                if (
                  element.data()._.categories[category][i].rubric.score != 0
                ) {
                  totalScore += element.data()._.categories[category][i].rubric
                    .score;
                  numOfScores++;
                  console.log(element.id);
                  console.log(totalScore);
                }
              }
              if (totalScore == 0) {
                avgScore = 0;
              } else {
                avgScore = totalScore / numOfScores;
              }
              scoreArray.push([element.id, element.data(), avgScore]);
            } catch (error) {
              console.log(element.id);
            }
            scoreArray.sort(function(a, b) {
              return a[2] < b[2] ? 1 : -1;
            });
          });
          try {
            for (let i = 0; i < 10; i++) {
              this.teams.push([scoreArray[i][1], scoreArray[i][2]]);
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

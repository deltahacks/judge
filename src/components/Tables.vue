<template>
  <div id="tables">
    <login-header></login-header>
    <link
      href="https://fonts.googleapis.com/css?family=Montserrat:300,400&display=swap"
      rel="stylesheet"
    />
    <div class="blurb">
      <span v-if="!this.$store.state.checkedIn">
        <span v-if="this.$store.state.checkinCode">
          <h2 class="checkin">
            Join our
            <a href="https://discord.gg/6HvMQAnMgb">Discord Server</a> using the
            code:
            <u>{{ this.$store.state.checkinCode }}</u>
          </h2>
          <p>
            Please contact us via the support channels on Discord if further
            assistance is needed.
          </p>
          <hr />
        </span>
        <span v-else>
          <h2 class="checkin">
            Your check-in code will be updated here when DeltaHacks 8 has
            started.
          </h2>
          <!-- <h2 class="checkin">
          Please contact us via the support channels on our
          <a href="https://discord.gg/6HvMQAnMgb">Discord server</a> for your
          check-in code.
        </h2> -->
          <hr />
        </span>
      </span>
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
                <h1>
                  <div class="team-name" style="font-weight: 300">
                    <span style="font-weight: 600"
                      >Group: {{ team._.table }}</span
                    >
                    {{ team.name.project }}
                  </div>
                  <ul class="stacked" style="font-weight: 600">
                    <li
                      v-for="category in getProjectCatsNames(team)"
                      :key="category"
                    >
                      {{ category }}
                    </li>
                  </ul>
                </h1>
              </div>
              <div v-else class="team-div">
                <h1>
                  <div class="team-name" style="font-weight: 300">
                    <strike
                      ><span style="font-weight: 600"
                        >Group: {{ team._.table }}</span
                      >
                      {{ team.name.project }}
                    </strike>
                    <span style="color: #7fff00"> ✔</span>
                  </div>
                  <ul class="stacked" style="font-weight: 600">
                    <li
                      v-for="category in getProjectCatsNames(team)"
                      :key="category"
                    >
                      {{ category }}
                    </li>
                  </ul>
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
import { auth, functions } from "firebase/app";
import db from "../firebaseinit";
import LoginHeader from "@/components/LoginHeader.vue";
import { getCategoriesMap } from "../types";

export default Vue.extend({
  name: "Home",
  components: {
    LoginHeader,
  },
  props: {},
  data() {
    return {
      projects: "",
      selectedOptions: "Select a Challenge to Judge",
      teams: Array,
      colors: [
        ["#FCE18A", "#F54FA1"],
        ["#F54FA1", "#fa96a8"],
        ["#18BDD9", "#267aed"],
        ["#7419E6", "#e619ce"],
        ["#42E596", "#42d7e5"],
      ],
      judge: {},
      selectedCat: "general",
      currentProjects: [],
      categories: [],
    };
  },
  methods: {
    async getJudge() {
      let doc = await db
        .collection(this.$store.state.currentHackathon)
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
        ? this.judge.categories.map((cat) => cat.toLowerCase())
        : [];
    },
    getProjectCatsNames(team) {
      return Object.keys(team._.categories)
        .filter((each) => {
          return (
            this.getCategories().includes(each.toLowerCase()) &&
            team._.categories[each.toLowerCase()].filter((judge) => {
              return judge.email === this.getUUID();
            }).length
          );
        })
        .map((each) => {
          let lookup = this.catMap;
          each = lookup[each];
          console.log(each);
          if (each.length >= 24) each = each.substring(0, 24) + "...";
          return each;
        })
        .splice(0, 3);
    },
    async getTables() {
      let doc = await db
        .collection(this.$store.state.currentHackathon)
        .doc("hackathon")
        .collection(this.projects)
        .get();
      let projects = doc.docs.filter((project) => {
        return Object.keys(project.data()._.categories).filter((each) => {
          return (
            this.getCategories().includes(each) &&
            project
              .data()
              ._.categories[each].filter(
                (judge) => judge.email === this.getUUID()
              ).length
          );
        }).length;
      });
      this.currentProjects = projects
        .map((proj) => proj.data())
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
    },
    async isCheckedIn() {
      const checkedInSnapshot = await db
        .collection(this.$store.state.currentHackathon)
        .doc("hackathon")
        .collection("checked in")
        .doc(this.getUUID())
        .get();
      if (checkedInSnapshot.data()) {
        this.$store.state.checkedIn = true;
        return true;
      }
      return false;
    },
    async getCode() {
      const checkincode = await functions().httpsCallable("getPersonalCode")({
        email: this.getUUID(),
      });
      if (checkincode.data.code) {
        this.$store.state.checkinCode = checkincode.data.code;
      }
    },
    async updateCheckInCode() {
      const isCheckedIn = await this.isCheckedIn();
      if (!isCheckedIn) {
        this.getCode();
      }
    },
  },
  async mounted() {
    this.categoriesMap = await getCategoriesMap();
    console.log(this.categoriesMap);
    await this.getJudge();
    await this.getTables();
    this.categories = this.getCategories();
    this.updateCheckInCode();
  },
  async beforeMount() {
    this.projects =
      auth().currentUser.email != "judge@deltahacks.com"
        ? "projects"
        : "projects stage";
    console.log(auth().currentUser.email, this.projects, "A");
    this.catMap = await getCategoriesMap();
  },
});
</script>

<style>
.container {
  height: 98vh;
}
.team-div {
  float: left;
  width: 100%;
  height: 140px;
}

.team-name {
  font-size: 1.5em;
  color: white;
  line-height: 140px;
  margin: 0 40px;
  font-family: "Montserrat", sans-serif;
  font-weight: 300;
}
.team {
  height: 150px;
}

.checkin {
  font-size: 35px;
  color: #3e6195;
}

.blurb {
  font-size: 20px;
  text-align: center;
  padding: 50px;
  background: white;
}

.stacked {
  font-size: 1.5em;
  color: white;
  text-align: center;
  margin: -130px 0px;
  font-family: "Montserrat", sans-serif;
  font-weight: 700;
  float: right;
}

@media only screen and (max-width: 700px) {
  .team {
    height: 210px !important;
    padding: 5px;
  }
  .team-name {
    text-align: center;
  }
  .stacked {
    float: left;
    margin-top: -50px;
    font-size: 4vw;
    list-style: none;
    width: 100%;
    height: auto;
  }
}
</style>

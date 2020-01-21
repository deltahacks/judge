<template>
  <div id="marking">
    <timer></timer>
    <Blurb
      content="
        Please assign marks to every category appropriately.
    "
    ></Blurb>
    <div class="center submission-info">
      <h1>TeamName</h1>
      <h2>Table 3</h2>
      <p>Members:</p>
      <p v-for="member in ['A', 'B', 'C']" :key="member">
        {{ member }}
      </p>
      <a href="https://devpost.com">Devpost link</a>
    </div>
    <div class="center">
      <b-dropdown v-model="selectedOptions" dark>
        <button class="button is-primary" type="button" slot="trigger">
          <span> {{ selectedOptions }}</span>
          <b-icon icon="menu-down"></b-icon>
        </button>
        <div v-for="category in submission_categories" :key="category">
          <b-dropdown-item :value="category">
            {{ category }}
          </b-dropdown-item>
        </div>
      </b-dropdown>
    </div>
    <ul>
      <li v-for="(criteria, i) in marking_criteria" :key="(criteria, i)">
        <div
          class="marking-category"
          :style="
            'background: linear-gradient(90deg,' +
              colors[i][0] +
              ' 0%,' +
              colors[i][1] +
              ' 120%)'
          "
        >
          <div class="marking-div">
            <h1 class="category name">
              <span style="font-weight: 600"></span>{{ criteria.type }}
            </h1>
            <p class="category subheading">{{ criteria.desc }}</p>
          </div>
          <div class="mark-field">
            <input type="text" placeholder="1" maxlength="1" />
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import Vue from "vue";
import Blurb from "@/components/Blurb.vue";
import Timer from "@/components/Timer.vue";
import * as firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";

import "firebase/storage";
import db from "../firebaseinit";
import { LoginData } from "../types";

export default Vue.extend({
  name: "Home",
  components: {
    Blurb,
    Timer
  },
  props: {},
  data() {
    return {
      submission_categories: Array,
      colors: [
        ["#FF9DA0", "#FACFC3"],
        ["#FF9DA0", "#FACFC3"],
        ["#FF9DA0", "#FACFC3"],
        ["#649C9F", "#FACFC3"],
        ["#649C9F", "#FACFC3"]
      ],
      marking_criteria: [
        {
          type: "Technical",
          desc: "How technically impressive is the hack?"
        },
        {
          type: "Technical",
          desc: "Is the project complete?"
        },
        {
          type: "Technical",
          desc: "Does the hack allow for a good user experience?"
        },
        {
          type: "Social Impact",
          desc: "Does the hack solve an important/relevant issue in society?"
        },
        {
          type: "Social Impact",
          desc:
            "Does the hack have a positive impact for the targeted audience?"
        }
      ],
      selectedOptions: "Select a category to judge",
      table: -1
    };
  },
  methods: {
    async getSubmissionCategories() {
      db.collection("DH6")
        .doc("hackathon")
        .collection("projects")
        .where("_.table", "==", Number(this.table))
        .onSnapshot(snap => {
          if (snap.empty) return;
          this.submission_categories = Object.keys(
            snap.docs[0].data()._.categories
          ).map(
            cat =>
              cat.substring(0, 1).toUpperCase() + cat.substring(1, cat.length)
          );
        });
    },
    onSubmit() {
      const marks = document.getElementsByClassName("marks");
      let rubric = {};
      let totalScore = 0;
      let judgeEmail = firebase.auth().currentUser.email;
      const category = "A";
      const project = "test1@test.com";
      for (let i = 0; i < this.categories.length; i++) {
        rubric[this.categories[i].desc] = marks[i].value;
        totalScore += Number(marks[i].value);
      }
      totalScore = totalScore / this.categories.length;
      rubric["score"] = totalScore;

      judgeEmail = "judge@gmail.com";

      db.collection("DH6")
        .doc("hackathon")
        .collection("projects")
        .doc(project)
        .get()
        .then(doc => {
          let data = doc.data()._;
          console.log(data.categories[category][0].rubric);
          let arrayIndex = data.categories[category].findIndex(
            x => x.email === judgeEmail
          );
          data.categories[category][arrayIndex].rubric = rubric;

          let updateNested = db
            .collection("DH6")
            .doc("hackathon")
            .collection("projects")
            .doc(project)
            .update({
              _: data
            });
        });
    }
  },
  async mounted() {
    this.table = this.$route.params.tableNumber;
    await this.getSubmissionCategories();
  }
});
</script>

<style>
#marking {
  padding-bottom: 100px;
}
#marking .marking-div {
  float: left;
  width: 70%;
}
#marking .mark-field {
  top: 0;
  width: 50px;
  float: right;
  margin-right: 20px;
}

.marking-category {
  height: 100px;
  padding-top: 20px;
}

.category {
  font-size: 16px;
  margin-bottom: 0;
  margin: 0 40px;
  font-family: "Montserrat", sans-serif;
  font-weight: 700;
}

#marking .name {
  text-transform: uppercase;
  color: #f2f2f2;
  line-height: 20px;
}

.subheading {
  font-size: 14px;
  color: white;
}

.mark-field input {
  border: none;
  outline: none;
  border-radius: 0;
  text-align: center;
  background-color: transparent;
  width: 60px;
  height: 60px;
  font-weight: 700;
  font-family: "Montserrat", sans-serif;
  font-size: 60px;
  /* padding: 1rem; */
  color: rgba(255, 255, 255, 0.6);
}

/* Chrome, Firefox, Opera, Safari 10.1+ */
::placeholder {
  color: rgba(255, 255, 255, 0.6);
  opacity: 1; /* Firefox */
}

.center {
  padding-bottom: 20px;
  text-align: center;
}

.submission-info {
  font-family: "Montserrat", sans-serif;
}

.submission-info h1 {
  font-weight: 700;
  font-size: 30px;
}
</style>

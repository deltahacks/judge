<template>
  <div id="app">
    <Blurb
      :content="'Please assign marks to every category appropriately.'"
    ></Blurb>
    <div id="app">
      <ul id="example-1">
        <li v-for="(category, i) in categories" :key="(category, i)">
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
            <div class="team-div">
              <h1 class="category name">
                <span style="font-weight: 600"></span>{{ category.type }}
              </h1>
              <p class="category subheading">{{ category.desc }}</p>
            </div>
            <div class="mark-field">
              <input type="text" placeholder="1" maxlength="1" class="marks" />
            </div>
          </div>
        </li>
      </ul>
    </div>
    <button style="width=100px;height=100px;" @click="onSubmit()"></button>
  </div>
</template>

<script>
import Vue from "vue";
import Blurb from "@/components/Blurb.vue";
import * as firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";
import db from "../firebaseinit";
import { LoginData } from "../types";

export default Vue.extend({
  name: "Home",
  components: {
    Blurb
  },
  props: {},
  data() {
    return {
      teams: Array,
      colors: [
        ["#FF9DA0", "#FACFC3"],
        ["#FF9DA0", "#FACFC3"],
        ["#FF9DA0", "#FACFC3"],
        ["#649C9F", "#FACFC3"],
        ["#649C9F", "#FACFC3"]
      ],
      categories: [
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
      ]
    };
  },
  methods: {
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
  }
});
</script>

<style>
.team-div {
  float: left;
  width: 70%;
}
.mark-field {
  top: 0;
  width: 50px;
  float: right;
  margin-right: 20px;
}
.team-name {
  font-size: 30px;
  color: white;
  line-height: 100px;
  margin: 0 40px;
  font-family: "Montserrat", sans-serif;
  font-weight: 300;
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

.name {
  text-transform: uppercase;
  color: #f2f2f2;
  line-height: 20px;
}

.subheading {
  font-size: 14px;
  color: white;
}

input {
  border: none;
  outline: none;
  border-radius: 0;
  text-align: center;
  background-color: transparent;
  width: 60px;
  height: 60px;
  font-weight: 700;
  font-family: "Lato", georgia;
  font-size: 60px;
  /* padding: 1rem; */
  color: rgba(255, 255, 255, 0.6);
}

::placeholder {
  /* Chrome, Firefox, Opera, Safari 10.1+ */
  color: rgba(255, 255, 255, 0.6);
  opacity: 1; /* Firefox */
}
</style>

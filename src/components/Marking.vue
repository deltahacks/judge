<template>
  <div id="marking">
    <Header></Header>
    <timer></timer>
    <Blurb
      content="
        Please assign marks to every category appropriately.
    "
    ></Blurb>
    <div class="columns submission-info" 
      style="margin-bottom:0">
      <div class="column left">
        <h1>{{ tableDoc.name ? tableDoc.name.project : "" }}</h1>
        <h2>Table {{ tableNumber }}</h2>
        <p>Members:</p>
        <p v-for="(member, i) in tableDoc.group ? tableDoc.group : []" :key="i">
          <span v-if="member.email">{{ member.email }}</span>
        </p>
        <p><a class="devpost" :href="tableDoc.name ? tableDoc.name.devpost : ''">Devpost link</a></p>
        <b-dropdown v-model="selectedOptions" dark>
          <button class="button is-primary" type="button" slot="trigger">
            <span> {{ selectedOptions }}</span>
            <b-icon icon="menu-down"></b-icon>
          </button>
          <div v-for="category in cats" :key="category">
            <b-dropdown-item :value="category" @click="changeCategory()">
              {{ category }}
            </b-dropdown-item>
          </div>
        </b-dropdown>
        <b-button class="button is-primary" type="button"
          v-if="selectedOptions !== 'Select a category to judge'"
          @click="onSubmit()"
        >
          Submit
        </b-button>
      </div>
      <div class="column">
        <b-input
          class="notes"
          maxlength="200"
          type="textarea"
          placeholder="Add your notes here..."
        ></b-input>
      </div>
      <div class="column">
        <h2 class="score">Overall score: <span id="score-val">69</span></h2>
      </div>
    </div>
    <ul
      v-if="
        !(selectedOptions !== 'Select a category to judge' &&
          tableDoc._ &&
          tableDoc._.categories[selectedOptions.toLowerCase()].score !== 0)
      "
    >
      <li v-for="(criteria, i) in marking_criteria" :key="(criteria, i)">
        <div
          class="marking-category"
          :style="
            'background: linear-gradient(90deg,' +
              colors[i] +
              ' 0%, #FACFC3 120%)'
          "
        >
          <div class="marking-div">
            <h1 class="category name">
              <span style="font-weight: 600"></span>{{ criteria.type }}
            </h1>
            <p class="category subheading">{{ criteria.desc }}</p>
            <b-slider class="drag" size="is-large" :max="10" v-model="marks[i]" :tooltip="false">
              </b-slider>
          </div>
          <div class="mark-field">
            <p>{{marks[i]}}</p>
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
import Header from "@/components/Header.vue";

import "firebase/storage";
import db from "../firebaseinit";
import {LoginData} from "../types";

export default Vue.extend({
  name: "Home",
  components: {
    Blurb,
    Timer,
    Header
  },
  props: {},
  data() {
    return {
      projects: "",
      colors: [
        "#FF9DA0",
        "#FF9DA0",
        "#FF9DA0", 
        "#649C9F", 
        "#649C9F",   
        "#4768DB", 
        "#4768DB", 
        "#AF6AB3", 
        "#AF6AB3" 
      ],
      marking_criteria: [
        {
          type: "Technical",
          desc: "How technically impressive is the hack?",
        },
        {
          type: "Technical",
          desc: "Is the project complete?",
        },
        {
          type: "Technical",
          desc: "Does the hack allow for a good user experience?",
        },
        {
          type: "Social Impact",
          desc: "Does the hack solve an important/relevant issue in society?",
        },
        {
          type: "Social Impact",
          desc:
            "Does the hack have a positive impact for the targeted audience?"
        },
        {
          type: "Originality",
          desc:
            "Was the hack original? \
            Were you surprised by the hack or have you seen similar things done before? \
            Did they come up with problem that you had not thought to approach?"
        },
        {
          type: "Originality",
          desc:
            "Was the hack creative? \
            Was the solution / problem approached in a unique way?"
        },
        {
          type: "Presentation",
          desc:
            "Was the project clearly explained? \
            Was the solution relevant to the given problem that they identified? \
            Was it clear how the product works?"
        },
        {
          type: "Presentation",
          desc:
            "Was the group prepared to present? \
            Was the demo of high quality? Did they have demos, visuals, research, powerpoints, logos etc. (note: not all are required)."
        }
      ],
      selectedOptions: "Select a category to judge",
      tableID: "",
      tableDoc: {},
      tableNumber: -1,
      judge: {},
      cats: [],
      marks: [0, 0, 0, 0, 0],
    };
  },
  methods: {
    async getTableID() {
      let table = this.$route.params.tableNumber;
      let doc = await db
        .collection("DH6")
        .doc("hackathon")
        .collection(this.projects)
        .where("_.table", "==", Number(table))
        .onSnapshot(snap => {
          if (snap.empty) {
            console.log("empty");
            return;
          }
          this.tableID = snap.docs[0].id;
          console.log(this.tableID);
          this.tableDoc = snap.docs[0].data();
        });
      this.tableNumber = table;
      console.log(this.tableNumber);
    },
    getSubmissionCategories() {
      db.collection("DH6")
        .doc("hackathon")
        .collection(this.projects)
        .where("_.table", "==", Number(this.table))
        .onSnapshot(snap => {
          if (snap.empty) return;
          this.submission_categories = Object.keys(
            snap.docs[0].data()._.categories,
          ).map(
            cat =>
              cat.substring(0, 1).toUpperCase() + cat.substring(1, cat.length),
          );
        });
    },
    onSubmit() {
      let rubric = {};
      let totalScore = 0;
      let judgeEmail = firebase.auth().currentUser.email;
      const category = this.selectedOptions.toLowerCase();
      const criteria = this.marking_criteria;
      const project = this.tableID;

      for (let i = 0; i < criteria.length; i++) {
        rubric[criteria[i].desc] = Number(this.marks[i]);
        totalScore += Number(this.marks[i]);
      }

      totalScore = totalScore / criteria.length;
      rubric.score = totalScore;

      judgeEmail = this.getUUID();

      db.collection("DH6")
        .doc("hackathon")
        .collection(this.projects)
        .doc(project)
        .get()
        .then(doc => {
          let data = doc.data()._;
          console.log(data.categories[category][0].rubric);
          let arrayIndex = data.categories[category].findIndex(
            x => x.email === judgeEmail,
          );
          data.categories[category][arrayIndex].rubric = rubric;
          let updateNested = db
            .collection("DH6")
            .doc("hackathon")
            .collection(this.projects)
            .doc(project)
            .update({
              _: data,
            })
            .then(() => window.location.reload());
        });
    },
    getUUID() {
      return firebase.auth().currentUser.email;
    },
    async getJudge() {
      let doc = await db
        .collection("DH6")
        .doc("hackathon")
        .collection("judges")
        .doc(this.getUUID())
        .get();
      if (!doc.exists) return;
      this.judge = doc.data();
    },
    getCategories() {
      return this.judge.categories
        ? this.judge.categories.map(cat => cat.toLowerCase())
        : [];
    },
    setJudgeableCats() {
      this.cats = Object.keys(this.tableDoc._.categories)
        .filter(each => {
          return (
            this.getCategories().includes(each.toLowerCase()) &&
            this.tableDoc._.categories[each.toLowerCase()].filter(judge => {
              return judge.email === this.getUUID();
            }).length
          );
        })
        .map(
          each =>
            each.substring(0, 1).toUpperCase() +
            each.substring(1, each.length).toLowerCase(),
        );
    },
    changeCategory() {
      // TODO: Clean this... lol
      console.log(this.selectedOptions);
      this.marks = [0, 0, 0, 0, 0];
      for (let i = 0; i < this.marking_criteria.length; i++) {
        let judgeIndex = this.tableDoc._.categories[
          this.selectedOptions.toLowerCase()
        ].findIndex(x => x.email === this.getUUID());
        let criteria = this.marking_criteria[i].desc;
        if (
          Object.keys(
            this.tableDoc._.categories[this.selectedOptions.toLowerCase()][
              judgeIndex
            ].rubric,
          ).includes(criteria)
        ) {
          this.marks[i] = this.tableDoc._.categories[
            this.selectedOptions.toLowerCase()
          ][judgeIndex].rubric[criteria];
        }
      }
    },
    limitTen(i) {
      if (Number(this.marks[i]) > 10) { 
        console.log("too big");
        this.marks[i] = 10;
      }
    }
  },
  async mounted() {
    await this.getTableID();
    await this.getJudge();
    await this.setJudgeableCats();
  },
  beforeMount() {
    this.projects =
      firebase.auth().currentUser.email != "judge@deltahacks.com"
        ? "projects"
        : "projects stage";
  },
});
</script>

<style>
#marking {
  padding-bottom: 100px;
  overflow: hidden;
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

/* to get rid of white space between categories */
li {
  margin-bottom: -6px !important;
}

.marking-category {
  display: inline-block;
  width: 100%;

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

.mark-field p {
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
  background: linear-gradient(90deg, #469e9a 0%, #2b408a 90%);
  color: white;
}

.submission-info .left {
  padding: 50px;
  text-align: left;
}
.submission-info h1 {
  opacity: 60%;
  font-weight: 700;
  font-size: 30px;
}

.submission-info h2,
.submission-info p {
  font-weight: 700;
  font-size: 20px;
}

.devpost {
  text-decoration: none;
  color: white;
  font-size: 30px;
  width: 200px;
}

.submission-info textarea {
  background: rgba(255, 255, 255, 0.3);
  height: 100%;
  border: none;
  border-radius: 20px;
  color: white;
  font-size: 20px;
}

.notes {  font-family: "Montserrat", sans-serif;
  padding: 20px;
  height: 100%;
  width: 40vw;
}
.button {
  background-color: rgba(255, 255, 255, 0.2) !important;
  border-radius: 20px !important;
  margin-top: 10px;
}

.score {
  padding: 30px;
  width: 300px;
}

#score-val {
  font-size: 120px;
  font-weight: 700;
  opacity: 69%;
}

.drag {
 padding: 20px;
 margin-left: 60px !important;
}


@media only screen and (max-width: 768px) {
  .notes {
    width: 100vw;
    padding-top: 0;
    float: none;
  }
  .left {
    text-align: center;
  }
  #score-val {
    font-size: 140px;
  }
}
</style>

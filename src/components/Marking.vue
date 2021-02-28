<template>
  <div id="bgd">
    <div id="marking">
      <Header></Header>
      <timer class="timer"></timer>
      <b-modal :active.sync="showVideo">
        <div v-if="tableDoc.profiles && tableDoc.profiles.youtube">
          <figure class="image is-16by9">
            <iframe
              class="has-ratio"
              width="640"
              height="360"
              v-bind:src="getDemoVideoEmbedUrl"
              frameborder="0"
              allow="accelerometer; clipboard-write; encrypted-media"
              allowfullscreen
            >
            </iframe>
          </figure>
        </div>
        <div v-else>
          <Blurb content="A demo video has not been uploaded yet"></Blurb>
        </div>
      </b-modal>
      <div style="text-align: center">
        <b-button
          id="showVideo"
          label="Show Video"
          type="is-primary"
          size="is-large"
          @click="showVideo = true"
        />
        <Blurb
          class="topBlurb"
          content="
          Please assign marks to every category appropriately.
      "
        ></Blurb>
      </div>
      <div class="columns submission-info" style="margin-bottom:0">
        <div class="column left">
          <h1>{{ tableDoc.name ? tableDoc.name.project : "" }}</h1>
          <h2>Group {{ tableNumber }}</h2>
          <p>Members:</p>
          <p
            v-for="(member, i) in tableDoc.group ? tableDoc.group : []"
            :key="i"
          >
            <span v-if="member.email"
              >{{ member.name }} - {{ member.email }}</span
            >
          </p>
          <p>
            <a
              class="devpost"
              :href="tableDoc.name ? tableDoc.name.devpost : ''"
              >Devpost</a
            >
          </p>
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
        </div>
        <div class="column">
          <div :style="{ marginLeft: '30px', fontSize: '20px' }">
            Project Notes
          </div>
          <b-input
            class="notes"
            maxlength="200"
            type="textarea"
            placeholder="Add your notes here..."
            v-model="notes"
            @input="onSubmit()"
          ></b-input>
        </div>
        <div class="column">
          <h2 class="score">
            Overall score:
            <input
              class="score-i-2"
              v-if="selectedOptions !== this.defaultOPTION"
              :placeholder="totalScore"
              type="text"
              maxLength="3"
              id="score-val"
              v-on:keydown="checkScore"
              disabled
            />
            <div v-else>Please Select Category</div>
          </h2>
        </div>
      </div>
      <ul
        v-if="
          selectedOptions !== this.defaultOPTION &&
            tableDoc._ &&
            tableDoc._.categories[selectedOptions.toLowerCase()].score !== 0
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
              <b-slider
                class="drag"
                size="is-large"
                :max="criteria.max"
                v-model="marks[i]"
                :tooltip="false"
                @input="onSubmit()"
              >
              </b-slider>
            </div>
            <div class="mark-field">
              <span style="display: flex">
                <input
                  onClick="this.select();"
                  ref="nInput"
                  @input="nInputChange(criteria.max, i)"
                  id="nInput"
                  type="number"
                  v-model.number="marks[i]"
                  :max="criteria.max"
                  :min="0"
                />
                <span class="mark-f-2">{{ "/" + criteria.max }}</span>
              </span>
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
import Timer from "@/components/Timer.vue";
import * as firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import Header from "@/components/Header.vue";

import "firebase/storage";
import db from "../firebaseinit";
import { LoginData } from "../types";

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
          tag: "tech1",
          max: 20
        },
        {
          type: "Technical",
          desc: "Is the project complete?",
          tag: "tech2",
          max: 10
        },
        {
          type: "Technical",
          desc: "Does the hack allow for a good user experience?",
          tag: "tech3",
          max: 10
        },
        {
          type: "Stream Impact",
          desc: "Does the hack solve an important/relevant issue in society?",
          tag: "soc1",
          max: 10
        },
        {
          type: "Stream Impact",
          desc:
            "Does the hack have a positive impact for the targeted audience?",
          tag: "soc2",
          max: 10
        },
        {
          type: "Originality",
          desc:
            "Was the hack original? \
            Were you surprised by the hack or have you seen similar things done before? \
            Did they come up with problem that you had not thought to approach?",
          tag: "orig1",
          max: 10
        },
        {
          type: "Originality",
          desc:
            "Was the hack creative? \
            Was the solution / problem approached in a unique way?",
          tag: "orig2",
          max: 10
        },
        {
          type: "Presentation",
          desc:
            "Was the project clearly explained? \
            Was the solution relevant to the given problem that they identified? \
            Was it clear how the product works?",
          tag: "pres1",
          max: 10
        },
        {
          type: "Presentation",
          desc:
            "Was the group prepared to present? \
            Was the demo of high quality? Did they have demos, visuals, research, powerpoints, logos etc. (note: not all are required).",
          tag: "pres2",
          max: 10
        }
      ],
      selectedOptions: "Select a category to judge",
      defaultOPTION: "Select a category to judge",
      showVideo: false,
      tableID: "",
      tableDoc: {},
      tableNumber: -1,
      judge: {},
      cats: [],
      marks: [0, 0, 0, 0, 0, 0, 0, 0, 0],
      notes: "",
      debounce: null
    };
  },
  methods: {
    async getTableID() {
      let table = this.$route.params.tableNumber;
      let doc = await db
        .collection(this.$store.state.currentHackathon)
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
      db.collection(this.$store.state.currentHackathon)
        .doc("hackathon")
        .collection(this.projects)
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
      if (this.debounce) clearTimeout(this.debounce);
      this.debounce = setTimeout(() => {
        let rubric = {};
        let totalScore = 0;
        let judgeEmail = firebase.auth().currentUser.email;
        const category = this.selectedOptions.toLowerCase();
        const criteria = this.marking_criteria;
        const project = this.tableID;

        for (let i = 0; i < criteria.length; i++) {
          rubric[criteria[i].tag] = Number(this.marks[i]);
          totalScore += Number(this.marks[i]);
        }
        rubric.score = totalScore;

        judgeEmail = this.getUUID();

        db.collection(this.$store.state.currentHackathon)
          .doc("hackathon")
          .collection(this.projects)
          .doc(project)
          .get()
          .then(doc => {
            let data = doc.data()._;
            if (this.selectedOptions !== this.defaultOPTION) {
              let arrayIndex = data.categories[category].findIndex(
                x => x.email === judgeEmail
              );
              data.categories[category][arrayIndex].rubric = rubric;
            }
            data.notes[this.getUUID()] = this.notes;
            let updateNested = db
              .collection(this.$store.state.currentHackathon)
              .doc("hackathon")
              .collection(this.projects)
              .doc(project)
              .update({
                _: data
              })
              .then(() => {
                this.$buefy.snackbar.open({
                  message: "Changes saved!",
                  type: "is-success",
                  position: "is-top-right",
                  actionText: "OK",
                  indefinite: false
                });
              });
          });
      }, 2000);
    },
    getUUID() {
      return firebase.auth().currentUser.email;
    },

    async getJudge() {
      let doc = await db
        .collection(this.$store.state.currentHackathon)
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
            each.substring(1, each.length).toLowerCase()
        );
    },
    changeCategory() {
      // TODO: Clean this... lol
      console.log(this.selectedOptions);
      this.marks = this.marking_criteria.map(each => 0);
      for (let i = 0; i < this.marking_criteria.length; i++) {
        let judgeIndex = this.tableDoc._.categories[
          this.selectedOptions.toLowerCase()
        ].findIndex(x => x.email === this.getUUID());
        let criteria = this.marking_criteria[i].tag;
        if (
          Object.keys(
            this.tableDoc._.categories[this.selectedOptions.toLowerCase()][
              judgeIndex
            ].rubric
          ).includes(criteria)
        ) {
          this.marks[i] = this.tableDoc._.categories[
            this.selectedOptions.toLowerCase()
          ][judgeIndex].rubric[criteria];
        }
      }
    },
    checkScore() {
      console.log(this.totalScore);
      if (Number(this.totalScore > 100)) {
        alert("Mark must be between 0 and 100.");
      }
    },
    nInputChange(m, i) {
      if (this.marks[i] > m) {
        this.marks[i] = Number(m);
      } else if (
        this.marks[i] < 0 ||
        this.marks[i] === undefined ||
        this.marks[i] === ""
      ) {
        this.marks[i] = 0;
      }
    }
  },
  async mounted() {
    await this.getTableID();
    await this.getJudge();
    await this.setJudgeableCats();
    console.log(this.tableDoc);
    this.notes = this.tableDoc._ ? this.tableDoc._.notes[this.getUUID()] : "";
  },
  beforeMount() {
    this.projects =
      firebase.auth().currentUser.email != "judge@deltahacks.com"
        ? "projects"
        : "projects";
  },
  computed: {
    totalScore() {
      return this.marks.reduce((x, y) => x + y);
    },
    getDemoVideoEmbedUrl() {
      let regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
      let match = this.tableDoc.profiles.youtube.match(regExp);
      const videoID = match && match[7].length == 11 ? match[7] : false;
      return `https://www.youtube.com/embed/${videoID}`;
    }
  }
});
</script>

<style>
#marking {
  padding-bottom: 100px;
  background: linear-gradient(90deg, #469e9a 0%, #2b408a 90%);
  overflow: hidden;
}

#bgd {
  height: 100vh;
  background: linear-gradient(90deg, #469e9a 0%, #2b408a 90%);
}
#marking .marking-div {
  float: left;
  width: 70%;
}
#marking .mark-field {
  top: 0;
  width: 160px;
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

/* Chrome, Firefox, Opera, Safari 10.1+ */
::placeholder {
  color: rgba(255, 255, 255, 0.6);
  opacity: 1; /* Firefox */
}

.center {
  padding-bottom: 20px;
  text-align: center;
}

.topBlurb {
  margin-bottom: 20px;
}

#showVideo {
  margin-top: 0;
}

.timer {
  box-shadow: 0 -5px 5px -5px #333;
}

.submission-info {
  font-family: "Montserrat", sans-serif;
  color: white;
  padding-bottom: 20px;
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
  font-size: 20px;
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

.notes {
  font-family: "Montserrat", sans-serif;
  padding: 20px;
  height: 100%;
  width: 40vw;
}

.button {
  background-color: rgba(255, 255, 255, 0.2) !important;
  border-radius: 20px !important;
  margin-top: 50px;
}

.score {
  padding: 30px;
  width: 300px;
}

.score-i-2 {
  font-size: 100px !important;
}

#score-val {
  border: none;
  outline: none;
  border-radius: 0;
  text-align: left;
  background-color: transparent;
  font-weight: 700;
  font-family: "Montserrat", sans-serif;
  font-size: 60px;
  color: rgba(255, 255, 255, 0.6);
}

.drag {
  padding: 20px;
  margin-left: 60px !important;
}

.mark-f-2 {
  color: white;
  border: none;
  outline: none;
  border-radius: 0;
  text-align: center;
  margin-top: 15px;
  margin-left: 7px;
  background-color: transparent;
  max-width: 60px;
  font-weight: 700;
  font-family: "Montserrat", sans-serif;
  font-size: 42px;
}

input[type="number"]::-webkit-outer-spin-button,
input[type="number"]::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

#nInput {
  outline: none;
  border: none;
  max-width: 70px;
  text-align: center;
  padding: 0.2rem;
  font-weight: 700;
  font-family: "Montserrat", sans-serif;
  font-size: 35px;
  -moz-appearance: textfield;
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

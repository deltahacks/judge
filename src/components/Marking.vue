<template>
  <div id="app">
    <Blurb :content="
        'Please assign marks to every category appropriately.'
    "></Blurb>
    <div id="app">
      <ul id="example-1">
        <li v-for="(category,i) in categories" :key="(category,i)">
          <a href="/home">
            <div
              class="team"
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
                <p class="category subheading"> {{ category.desc }} </p>
              </div>
              <p class="mark">2</p>
              <!-- <router-link :to="{ name: 'Marking', params: { teamId: team } }">
                <div class="mark">
                  <h1 class="team-name">Mark</h1>
                </div>
              </router-link> -->
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
          desc: "Does the hack have a positive impact for the targeted audience?"
        },
      ]
    };
  },
  methods: {
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
  width: 20px;
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
  padding-top: 20px;
}
.blurb {
  font-size: 20px;
  text-align: center;
  padding: 50px;
}
.category {
  font-size: 16px;
  margin-bottom: 0;
  margin: 0 40px;
  font-family: "Montserrat", sans-serif;
  font-weight: 700;
  width: 70%;
}

.name {
  text-transform: uppercase;
  color: #f2f2f2;
  line-height: 20px;
  
}

.subheading {
  font-size: 14px;
  color: white;
  width: 70%;
}
</style>

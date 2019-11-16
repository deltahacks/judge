<template>
  <div class="modal-card" style="width: auto">
    <header class="modal-card-head">
      <p class="modal-card-title">Add Application to Judge</p>
    </header>
    <section class="modal-card-body">
      <b-field label="Application Number">
        <b-input type="text" v-model="title" placeholder="Team/Table Number"></b-input>
      </b-field>
      
      <b-field label="Review">
        <b-select placeholder="Select a review" v-model="review">
          <option v-for="option in reviews" :value="option.name" :key="option.id">{{ option.name }}</option>
        </b-select>
      </b-field>
    </section>
    <footer class="modal-card-foot">
      <button class="button" type="button" @click="$parent.close()">Close</button>
      <button class="button is-primary" @click="addTodo">Save</button>
    </footer>
  </div>
</template>

<script>
export default {
  name: 'TodoAddModal',
  props: {
    reviews: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      review: '',
      title: '',
    };
  },
  methods: {
    addTodo() {
      const payload = {
        review: this.review,
        title: this.title,
      };
      this.$emit('add-todo', payload);
    },
  },
};
</script>

<style scoped></style>

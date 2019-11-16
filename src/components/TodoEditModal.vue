<template>
  <div class="modal-card" style="width: auto">
    <header class="modal-card-head">
      <p class="modal-card-title">Edit {{ todo.todo }}</p>
    </header>
    <section class="modal-card-body">
      <b-field label="Title">
        <b-input type="text" v-model="title" placeholder="Your todo title"></b-input>
      </b-field>

      <b-field label="Review">
        <b-select placeholder="Select a review" v-model="review">
          <option v-for="option in reviews" :value="option.name" :key="option.rank">{{ option.name }}</option>
        </b-select>
      </b-field>
    </section>
    <footer class="modal-card-foot">
      <button class="button" type="button" @click="$parent.close()">Close</button>
      <button class="button is-primary" @click="editTodo">Save</button>
    </footer>
  </div>
</template>

<script>
export default {
  name: 'TodoEditModal',
  props: {
    todo: {
      type: Object,
      required: true,
    },
    reviews: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      title: '',
      review: '',
    };
  },
  mounted() {
    this.title = this.todo.name;
    this.review = this.todo.review;
  },
  methods: {
    editTodo() {
      const payload = {
        id: this.todo.id,
        todo: this.title,
        review: this.review,
      };
      this.$emit('edit-todo', payload);
    },
  },
};
</script>

<style scoped></style>

<template>
  <div>
    <section class="section">
      <div class="container">
        <div class="level">
          <b-button class="is-primary" @click="isAddModalActive = true"
            >Add An Application</b-button
          >
          <b-button class="is-danger" @click="restoreLocalStorage"
            >Restore Default (Testing-LocalStorage)</b-button
          >
          <b-button class="is-warning" @click="deleteAllTodos"
            >Delete All Applications</b-button
          >
        </div>

        <b-table
          :data="todos"
          default-sort="rank"
          striped
          narrowed
          hoverable
          :mobile-cards="hasMobileCards"
          @dragstart="dragstart"
          @drop="drop"
          @dragover="dragover"
          @dragleave="dragleave"
        >
          <template slot-scope="todos">
            <b-table-column
              field="rank"
              label="Rank"
              width="40"
              sortable
              default-sort
              numeric
              >{{ todos.row.rank }}</b-table-column
            >
            <b-table-column field="todo" label="Project Number">{{
              todos.row.num
            }}</b-table-column>
            <b-table-column field="todo" label="Name"
              >{{ todos.row.name }}
            </b-table-column>

            <b-table-column field="review" label="Review">{{
              todos.row.review
            }}</b-table-column>

            <!-- <b-table-column label="Edit">
              <b-button
                type="is-text"
                icon-left="settings-outline"
                @click="openEditModal(todos.row)"
              ></b-button>
            </b-table-column> -->

            <b-table-column label="Delete">
              <b-button
                type="is-text"
                icon-left="delete"
                @click="deleteTodo(todos.row)"
              ></b-button>
            </b-table-column>
            <b-table-column label="Rank Up">
              <b-button
                type="is-text"
                icon-left="arrow-up"
                @click="rankup(todos.row)"
              ></b-button>
            </b-table-column>
            <b-table-column label="Rank Down">
              <b-button
                type="is-text"
                icon-left="arrow-down"
                @click="rankdown(todos.row)"
              ></b-button>
            </b-table-column>
          </template>
        </b-table>
      </div>
    </section>

    <b-modal :active.sync="isEditModalActive" has-modal-card>
      <todo-edit-modal
        :todo="selectedTodo"
        :reviews="reviews"
        @edit-todo="onEditTodo"
      ></todo-edit-modal>
    </b-modal>

    <b-modal :active.sync="isAddModalActive" has-modal-card>
      <todo-add-modal @add-todo="onAddTodo" :reviews="reviews"></todo-add-modal>
    </b-modal>
  </div>
</template>

<script>
import TodoEditModal from "@/components/TodoEditModal";
import TodoAddModal from "@/components/TodoAddModal";

export default {
  name: "TodoTable",
  components: { TodoEditModal, TodoAddModal },
  data() {
    return {
      initialTodos: [
        {
          rank: 1,
          num: 200,
          name: "Hack 1",
          review: "Good"
        },
        {
          rank: 2,
          num: 300,
          name: "Hack 2",
          review: "Bad"
        },
        {
          rank: 3,
          num: 201,
          name: "Hack 3",
          review: "Disqualify"
        },
        {
          rank: 4,
          num: 44,
          name: "Hack 4",
          review: "Disqualify"
        },
        {
          rank: 5,
          num: 41,
          name: "Hack 5",
          review: "Meh"
        }
      ],
      todos: [],
      reviews: [
        { id: 1, name: "Good" },
        { id: 2, name: "Bad" },
        { id: 3, name: "Disqualify" },
        { id: 4, name: "Meh" }
      ],
      isEditModalActive: false,
      selectedTodo: {},
      isAddModalActive: false,
      hasMobileCards: false
    };
  },
  mounted() {
    if (localStorage.getItem("todos")) {
      this.todos = JSON.parse(localStorage.getItem("todos"));
    } else {
      this.todos = this.initialTodos;
    }
  },
  methods: {
    openEditModal(todo) {
      this.selectedTodo = todo; 
      this.isEditModalActive = true;
    },
    onAddTodo(item) {
      // get the highest number rank to iterate on it
      const highestId = Math.max.apply(
        Math,
        this.todos.map(item => item.rank)
      );
      if(highestId <=0){
        highestId = 0;
      }
      // Add the item to the array
      this.todos.push({
        rank: highestId + 1,
        num: item.title,
        name: "new item(will be fetched from firebase/ devpost link)",
        review: item.review,
      });
      // save the updated array in localstorage
      this.saveLocalStorageTodos();
      this.isAddModalActive = false;
    },
    onEditTodo(item) {
      const todo = this.findTodo(item);
      // Apply the updated values
      todo.todo = item.todo;
      todo.review = item.review;
      // save the updated array in localstorage
      this.saveLocalStorageTodos();
      // close the modal
      this.isEditModalActive = false;
    },
    deleteTodo(item) {
      this.$buefy.dialog.confirm({
        title: `Deleting Application`,
        confirmText: "Delete",
        type: "is-danger",
        hasIcon: true,
        message: `Are you sure you want to delete this application? This cannot be undone.`,
        onConfirm: () => {
          // find in the array and remove
          const index = this.todos.indexOf(item);
          this.todos.splice(index, 1);
          // save the updated array in localstorage
          this.updateRank();
          this.saveLocalStorageTodos();
        }
      });
    },
    restoreLocalStorage() {
      this.$buefy.dialog.confirm({
        title: `Restore From Local Storage?`,
        confirmText: "Restore",
        type: "is-danger",
        hasIcon: true,
        message: `Are you sure you want to restore all the todos from local storage? This cannot be undone.`,
        onConfirm: () => {
          this.todos = [];
          // save the updated array in localstorage
          // this.saveLocalStorageTodos();
          this.todos = this.initialTodos;
          this.saveLocalStorageTodos(this.todos);
        }
      });
    },
    deleteAllTodos() {
      this.$buefy.dialog.confirm({
        title: `Deleting Todos`,
        confirmText: "Delete Todos",
        type: "is-danger",
        hasIcon: true,
        message: `Are you sure you want to delete all the todos on your list? This cannot be undone.`,
        onConfirm: () => {
          this.todos = [];
          // save the updated array in localstorage
          this.saveLocalStorageTodos();
        }
      });
    },
    findTodo(item) {
      return this.todos.find(todo => todo.rank === item.rank);
    },
    findTodoNum(item) {
      return this.todos.find(todo => todo.num === item.num);
    },
    findTodofromRank(rank) {
      return this.todos.find(todo => todo.rank === rank);
    },
    saveLocalStorageTodos() {
      localStorage.setItem("todos", JSON.stringify(this.todos));
      this.todos = JSON.parse(localStorage.getItem("todos"));
    },

    dragstart(payload) {
      this.draggingRow = payload.row;
      this.draggingRowIndex = payload.index;
      payload.event.dataTransfer.effectAllowed = "copy";
    },
    dragover(payload) {
      payload.event.dataTransfer.dropEffect = "copy";
      payload.event.target.closest("tr").classList.add("is-selected");
      payload.event.preventDefault();
    },
    dragleave(payload) {
      payload.event.target.closest("tr").classList.remove("is-selected");
      payload.event.preventDefault();
    },
    drop(payload) {
      payload.event.target.closest("tr").classList.remove("is-selected");
      const droppedOnRowIndex = payload.index;
      this.$buefy.toast.open(
        `Moved ${this.draggingRow.num} from row ${this.draggingRowIndex +
          1} to ${droppedOnRowIndex + 1}`
      );
    },

    rankup(item) {
      const todo = this.findTodoNum(item);
      const todoold = this.findTodofromRank(todo.rank - 1);
      if (todo.rank > 1) {
        todo.rank = todo.rank - 1;
        todoold.rank = todoold.rank + 1;
        this.saveLocalStorageTodos();
      }
    },
    rankdown(item) {
      const todo = this.findTodoNum(item);
      const todoold = this.findTodofromRank(todo.rank + 1);
      if (todoold != null) {
        todo.rank = todo.rank + 1;
        todoold.rank = todoold.rank - 1;
        this.saveLocalStorageTodos();
      }
    }
  }
};
</script>

<style lang="scss" scoped></style>

<template>
  <div id="app">
    <todo-header></todo-header>
    <todo-table></todo-table>
  </div>
</template>

<script>
import TodoTable from '@/components/TodoTable.vue';
import TodoHeader from '@/components/TodoHeader.vue';

export default {
  name: 'app',
  components: {
    TodoTable,
    TodoHeader,
  },
};
</script>

<style lang="scss">
.background {
  background: linear-gradient(
    269deg,
    #7c1078,
    #e8727c,
    #4f6ad3,
    #2c938b,
    #8b3ddb,
    #5088cd
  );
  background-size: 800% 800%;
  -webkit-animation: ApplyAnimation 180s ease infinite;
  -moz-animation: ApplyAnimation 180s ease infinite;
  animation: ApplyAnimation 180s ease infinite;
}
@-webkit-keyframes ApplyAnimation {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 51%;
  }
  100% {
    background-position: 0% 50%;
  }
}
@-moz-keyframes ApplyAnimation {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 51%;
  }
  100% {
    background-position: 0% 50%;
  }
}
@keyframes ApplyAnimation {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 51%;
  }
  100% {
    background-position: 0% 50%;
  }
}
</style>

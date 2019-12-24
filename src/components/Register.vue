<template>
  <div class="main">
    <span>
      <span class="txt1">Create</span>
      <span class="txt2">Account</span><br>
    </span>
    <form style="max-width:500px;margin:auto">
  <div class="input-container">
    <i class="fa fa-user icon"></i>
    <input class="input-field" type="text" placeholder="Username" name="usrnm">
  </div>

  <div class="input-container">
    <i class="fa fa-envelope icon"></i>
    <input class="input-field" type="text" placeholder="Email" name="email">
  </div>
  
  <div class="input-container">
    <i class="fa fa-key icon"></i>
    <input class="input-field" type="password" placeholder="Password" name="psw">
  </div>

  <button type="submit" class="btn">Register</button>
</form>
  </div>
</template>

<script>
export default {
  name: 'Login',
};
</script>

<style lang="scss" scoped>
@import url('https://fonts.googleapis.com/css?family=Montserrat:300,400,600&display=swap');

.main {
  text-align: center;
  justify-content: center;
  align-items: center;
  font-family: 'Montserrat', sans-serif;
  color: black;
}
.txt1 {
  font-size: 3em;
  font-weight: 600;
}
.txt2 {
  font-size: 3em;
  font-weight: 300;
}

.input-container {
  display: -ms-flexbox; /* IE10 */
  display: flex;
  width: 100%;
  margin-bottom: 5px;
}

.icon {
  padding: 20px;
//   background: dodgerblue;
  color: black;
//   min-width: 50px;
  text-align: center;
}

.input-field {
  width: 100%;
  padding: 10px;
    border: 0;
  outline: 0;
  background: transparent;
  border-bottom: 1px solid black;
    font-size: 1em;
  font-weight: 400;
}
.input-field:hover{
    cursor: pointer;
}

.input-field:focus {
  border-bottom: 1px solid dodgerblue;
}

/* Set a style for the submit button */
.btn {
        background-image: linear-gradient(90deg, #84fab0 0%, #8fd3f4 100%);
  color: black;
  margin-top: 30px;
  padding: 15px 0px;
  border: none;
  border-radius: 500px;
  width: 100%;
  opacity: 0.8;
      font-size: 1em;
  font-weight: 600;
}

.btn:hover {
  opacity: 1;
}
</style>

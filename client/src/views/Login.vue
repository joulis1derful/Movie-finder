<script>
import axios from 'axios'
export default {
  name: 'login',
  components: {},
  data: function() {
    return {
      inputEmail: '',
      inputPassword: '',
    }
  },
  methods: {
    handleSubmit: function(email, password) {
      if (!email || !password) {
        alert('Please fill all the fields')
        return
      }

      axios
        .post('http://localhost:3000/login', { email, password })
        .then(response => {
          sessionStorage.setItem('jwt', response.headers.authorization)
          sessionStorage.setItem('userId', response.data.profile.userId)
          this.$router.push('/')
        })
        .catch(err => {
          if (
            err.response.status === 409 &&
            err.response.data.search(/cannot find user/i) !== -1
          ) {
            alert('No such a user was found')
          } else if (
            err.response.status === 409 &&
            err.response.data.search(/invalid password/i) !== -1
          ) {
            alert(`${err.response.data}. Please, try once again`)
          } else {
            alert('Something went wrong. Please try again')
          }
        })
    },
  },
}
</script>


<template>

  <body class="text-center">
    <form class="form-signin">
      <h1 class="h3 mb-3 font-weight-normal">Please sign in</h1>
      <label class="sr-only">Email address</label>
      <input
        v-model="inputEmail"
        type="email"
        id="inputEmail"
        class="form-control"
        placeholder="Email address"
        required
        autofocus
      >
      <label class="sr-only">Password</label>
      <input
        v-model="inputPassword"
        type="password"
        id="inputPassword"
        class="form-control"
        placeholder="Password"
        required
      >
      <button
        class="btn btn-lg btn-primary btn-block"
        @click.prevent="handleSubmit(inputEmail, inputPassword)"
      >Sign in</button>
    </form>
  </body>
</template>

<style scoped>
html,
body {
  height: 100%;
}

body {
  display: flex;
  align-items: center;
  justify-content: center;
  padding-top: 40px;
  padding-bottom: 40px;
  background-color: #f5f5f5;
}

.form-signin {
  width: 100%;
  max-width: 330px;
  padding: 15px;
  margin: 0 auto;
}
.form-signin .checkbox {
  font-weight: 400;
}
.form-signin .form-control {
  position: relative;
  box-sizing: border-box;
  height: auto;
  padding: 10px;
  font-size: 16px;
}
.form-signin .form-control:focus {
  z-index: 2;
}
.form-signin input[type='email'] {
  margin-bottom: -1px;
  border-bottom-right-radius: 0;
  border-bottom-left-radius: 0;
}
.form-signin input[type='password'] {
  margin-bottom: 10px;
  border-top-left-radius: 0;
  border-top-right-radius: 0;
}
</style>


<script>
import axios from 'axios'
export default {
  name: 'Login',
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
            err.response.data.message.search(/cannot find user/i) !== -1
          ) {
            alert('No such a user was found')
          } else if (
            err.response.status === 409 &&
            err.response.data.message.search(/invalid password/i) !== -1
          ) {
            alert(`${err.response.data.message}. Please, try once again`)
          } else {
            alert('Something went wrong. Please try again')
          }
        })
    },
  },
}
</script>


<template>
  <div class="container">
    <form class="form-signin">
      <h1>Please sign in</h1>
      <input
        v-model="inputEmail"
        type="email"
        id="inputEmail"
        class="form-control"
        placeholder="Email address"
        required
        autofocus
      >
      <input
        v-model="inputPassword"
        type="password"
        id="inputPassword"
        class="form-control"
        placeholder="Password"
        required
      >
      <span class="register-hint"><a href="/register">No account? Create it</a></span>
      <button
        class="btn-primary"
        @click.prevent="handleSubmit(inputEmail, inputPassword)"
      >Sign in</button>
    </form>
  </div>
</template>

<style scoped>
.container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

.form-signin {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  max-width: 330px;
  width: 50%;
  margin: 0 auto;
}

.form-signin .form-control {
  padding: 10px;
  font-size: 14px;
  border: 1px solid #ced4da;
}

.form-signin .form-control:focus {
  z-index: 2;
}

.form-signin input {
  width: 75%;
  text-align: center;
}

.form-signin * {
  margin: 3px;
}

.btn-primary {
  width: 75%;
  padding: 10px;
  border-radius: 0.25rem;
  color: #fff;
  font-size: 1rem;
  font-weight: 400;
  background-color: #007bff;
  border-color: #007bff;
  cursor: pointer;
  transition: color 0.15s ease-in-out, background-color 0.15s ease-in-out,
    border-color 0.15s ease-in-out, box-shadow 2s ease-in-out;
}

.btn-primary:hover {
  background-color: #0069d9;
  border-color: #0062cc;
  text-decoration: none;
}

.register-hint > a {
  color: inherit;
  font-size: 1rem;
}
</style>


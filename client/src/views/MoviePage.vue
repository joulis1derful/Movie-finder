<script>
import MoviesList from '@/components/MoviesList.vue'
import MovieDetails from '@/components/MovieDetails.vue'
import axios from 'axios'
import jwt from 'jsonwebtoken'

export default {
  name: 'Movie',
  components: {
    MoviesList,
    MovieDetails,
  },
  data: function() {
    return {
      movies: [],
      searchText: '',
      isDetailedInfoShown: false,
      isSubmitted: false,
      user: {},
    }
  },
  created: function() {
    const token = sessionStorage.getItem('jwt')
    if (token) {
      try {
        jwt.verify(token, localStorage.getItem('secret'))
      } catch (error) {
        alert('Token was not verified')
        return this.$router.push('/login')
      }
    } else {
      return this.$router.push('/login')
    }
  },
  mounted: function() {
    const userId = this.getUserId()
    axios
      .get('http://localhost:3000/profile/' + userId, {
        headers: { authorization: sessionStorage.getItem('jwt') },
      })
      .then(response => {
        this.user = response.data
      })
      .catch(err => {
        console.log(err)
      })
  },
  methods: {
    handleSubmit: function(searchText) {
      this.isDetailedInfoShown = false
      axios
        .get('http://localhost:3000/movies/search?name=' + searchText)
        .then(response => {
          this.isSubmitted = true
          this.movies = response.data
          this.searchText = ''
        })
        .catch(err => {
          console.log(err)
        })
    },

    handleOpenDetailedInfo: function() {
      this.isDetailedInfoShown = true
    },

    handleMovieChange: function(movies) {
      this.movies = movies
    },

    getMovieIdFromSessionStorage: function() {
      return sessionStorage.getItem('movieId')
    },

    getUserId: function() {
      return sessionStorage.getItem('userId')
    },

    buildProfileLink: function() {
      const userId = this.getUserId()
      return `/profile/${userId}`
    },
  },
}
</script>


<template>
  <div id="app">
    <nav class="navbar navbar-expand-sm">
      <ul class="navbar-nav">
        <li class="nav-item">
          <a
            class="nav-link"
            :href="buildProfileLink()"
          >
            <img v-show="!isDetailedInfoShown"
              src="../assets/profile.png"
              style="height: 48px;"
            />
          </a>
        </li>
      </ul>
    </nav>
    <div
      v-if="!isSubmitted && !isDetailedInfoShown"
      class="container"
    >
      <div class="jumbotron">
        <h3 class="text-center">Search for any movie</h3>
        <form
          id="searchForm"
          @submit.prevent="handleSubmit(searchText)"
        >
          <input
            type="text"
            class="form-control"
            v-model="searchText"
            placeholder="Enter a movie to find info about"
          >
        </form>
      </div>
    </div>

    <MoviesList
      v-if="isSubmitted && !isDetailedInfoShown"
      :movies="movies"
      :user="user"
      @isClosed="handleOpenDetailedInfo"
      @onMovieChange="handleMovieChange"
    />
    <MovieDetails
      v-if="isDetailedInfoShown"
      :id="getMovieIdFromSessionStorage()"
    />
  </div>
</template>
<style>
.navbar-nav {
  margin-left: 48%;
}
</style>


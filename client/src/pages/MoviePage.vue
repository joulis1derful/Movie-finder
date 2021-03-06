<script>
import MoviesList from '@/components/MoviesList.vue'
import MovieDetails from '@/components/MovieDetails.vue'
import axios from 'axios'
import jwt from 'jsonwebtoken'
import Message from '@/message'
import config from '@/config'

const SERVER_URL = config('SERVER_URL')

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
      pagesAmount: 1,
    }
  },
  created: function() {
    const token = sessionStorage.getItem('jwt')
    if (token) {
      try {
        jwt.verify(token, localStorage.getItem('secret'))
      } catch (error) {
        Message({
          message: 'Token was not verified',
          type: 'error',
        })
        return this.$router.push('/login')
      }
    } else {
      return this.$router.push('/login')
    }
  },
  mounted: function() {
    const userId = this.getUserId()
    if (userId) {
      axios
        .get(`${SERVER_URL}/profile/${userId}`, {
          headers: { authorization: sessionStorage.getItem('jwt') },
        })
        .then(response => {
          this.user = response.data
        })
        .catch(err => {
          Message({
            message: `Could not get profile with user id ${userId}`,
            type: 'error',
          })
        })
    }
  },
  methods: {
    handleSubmit: function(searchText) {
      this.isDetailedInfoShown = false
      axios
        .get(`${SERVER_URL}/movies/search?name=${searchText}`)
        .then(response => {
          this.isSubmitted = true
          this.movies = response.data.movies
          this.pagesAmount = response.data.totalPages
          // this.searchText = ''
        })
        .catch(err => {
          Message({
            message: `Could not find movies with name ${name}`,
            type: 'error',
          })
        })
    },

    handlePageSelection: function(page) {
      axios
        .get(`${SERVER_URL}/movies/search?name=${this.searchText}&page=${page}`)
        .then(response => {
          this.isSubmitted = true
          this.movies = response.data.movies
          this.pagesAmount = response.data.totalPages
        })
        .catch(err => {
          Message({
            message: 'Error during page switch. Please, try again',
            type: 'error',
          })
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
    <a
      class="profile"
      :href="buildProfileLink()"
    >
      <img
        v-show="!isDetailedInfoShown"
        src="../assets/profile.png"
        style="height: 48px;"
      />
    </a>
    <div
      v-if="!isSubmitted && !isDetailedInfoShown"
      class="search-menu"
    >
      <div>
        <h3>Search for any movie</h3>
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
      :totalPages="pagesAmount"
      @isClosed="handleOpenDetailedInfo"
      @onMovieChange="handleMovieChange"
      @selectPage="handlePageSelection"
    />
    <MovieDetails
      v-if="isDetailedInfoShown"
      :id="getMovieIdFromSessionStorage()"
    />
  </div>
</template>
<style>
#app {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.profile {
  margin: 5% 5%;
  align-self: flex-end;
}

.search-menu {
  display: flex;
  justify-content: center;
  align-items: center;
  align-content: center;
}

.search-menu h3 {
  font-size: 36px;
  font-weight: 600;
}

.form-control {
  width: 75%;
  text-align: center;
  padding: 10px;
  font-size: 14px;
  border: 1px solid #ced4da;
}
</style>



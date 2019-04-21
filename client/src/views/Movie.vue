<script>
import MoviesList from '@/components/MoviesList.vue'
import MovieDetails from '@/components/MovieDetails.vue'
import axios from 'axios'
import jwt from 'jsonwebtoken'

export default {
  name: 'movie',
  components: {
    MoviesList,
    MovieDetails
  },
  data: function() {
    return {
      movies: [],
      searchText: '',
      isDetailedInfoShown: false,
      isSubmitted: false
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
  methods: {
    handleSubmit: function (searchText) {
      this.isDetailedInfoShown = false
      axios.get('http://localhost:3000/movies/search?name=' + searchText)
        .then((response) => {
          this.isSubmitted = true
          this.movies = response.data
          this.searchText = ''
        })
        .catch((err) => {
          console.log(err)
        })
    },

    handleOpenDetailedInfo: function () {
      this.isDetailedInfoShown = true
    },

    getMovieIdFromSessionStorage: function() {
      return sessionStorage.getItem('movieId')
    }
  }
}
</script>


<template>
    <div id="app">
      <div v-if="!isSubmitted && !isDetailedInfoShown" class="container">
        <div class="jumbotron">
          <h3 class="text-center">Search for any movie</h3>
          <form id="searchForm" @submit.prevent="handleSubmit(searchText)">
            <input type="text" class="form-control" v-model="searchText" placeholder="Enter a movie to find info about">
          </form>
        </div>
      </div>

      <MoviesList v-if="isSubmitted && !isDetailedInfoShown" :movies="movies" @isClosed="handleOpenDetailedInfo"/>
      <MovieDetails v-if="isDetailedInfoShown" :id="getMovieIdFromSessionStorage()" />
  </div>
</template>

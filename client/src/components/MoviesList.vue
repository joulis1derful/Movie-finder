<script>
import axios from 'axios'

export default {
  name: 'MoviesList',
  props: {
    movies: Array,
    user: Object,
  },
  created: function() {
    this.filterWatchLaterMovies(this.movies)
  },
  methods: {
    viewMovieDetails: function(id) {
      sessionStorage.setItem('movieId', id)
      this.$emit('isClosed')
    },
    getImagePath: function(movie) {
      const imageUrl = 'https://image.tmdb.org/t/p/w500'
      return `${imageUrl + movie.poster_path}`
    },
    addToWatchLater: function(movieId) {
      axios
        .post(
          'http://localhost:3000/profile/addWatchLater',
          { userId: this.user.userId, movieId },
          { headers: { authorization: sessionStorage.getItem('jwt') } }
        )
        .then(() => {
          const filteredMovies = this.movies.map(movie => {
            if (movie.id === movieId) {
              movie.isAdded = true
            }
            return movie
          })
          this.$emit('onMovieChange', filteredMovies)
        })
        .catch(err => {
          console.log(err)
        })
    },
    removeFromWatchLater: function(movieId) {
      axios
        .post(
          'http://localhost:3000/profile/removeWatchLater',
          { userId: this.user.userId, movieId },
          { headers: { authorization: sessionStorage.getItem('jwt') } }
        )
        .then(() => {
          const filteredMovies = this.movies.map(movie => {
            if (movie.id === movieId) {
              movie.isAdded = false
            }
            return movie
          })
          this.$emit('onMovieChange', filteredMovies)
        })
        .catch(err => {
          console.log(err)
        })
    },

    filterWatchLaterMovies: function(movies) {
      this.user.watchLater.forEach(watchLater => {
        movies.forEach(movie => {
          if (movie.id === watchLater.id) {
            movie.isAdded = true
          }
        })
      })
      this.$forceUpdate()
    },
  },
}
</script>

<template>
  <div class="hello">
    <div class="container">
      <div
        id="movies"
        class="row"
      >
        <div
          v-for="movie in movies"
          class="col-md-4"
        >
          <div class="well text-center">
            <img :src="getImagePath(movie)">
            <h5>{{movie.title}}</h5>
            <div class="btn-group">
              <button
                @click="viewMovieDetails(movie.id)"
                class="btn btn-primary"
              >Movie details</button>
              <button
                v-if="!movie.isAdded"
                @click="addToWatchLater(movie.id)"
                class="btn btn-success"
              >Add</button>
              <button
                v-if="movie.isAdded"
                @click="removeFromWatchLater(movie.id)"
                class="btn btn-danger"
              >Remove
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.btn-group > button:first-child {
  margin-right: 5px;
}
</style>

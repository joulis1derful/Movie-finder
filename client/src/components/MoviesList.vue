<script>
import MovieDetails from '@/components/MovieDetails.vue'
import axios from 'axios'

export default {
  name: 'MoviesList',
  props: {
    movies: Array
  },
  methods: {
    movieSelected: function(id) {
      sessionStorage.setItem('movieId', id);
      this.$emit('isClosed')
    },
    getImagePath: function(movie) {
      const imageUrl = 'https://image.tmdb.org/t/p/w500'
      return `${imageUrl + movie.poster_path}`
    }  
  }
}
</script>

<template>
  <div class="hello">
    <div class="container">
      <div id="movies" class="row">
        <div v-for="movie in movies" class="col-md-4">
          <div class="well text-center">
            <img :src="getImagePath(movie)">
            <h5>{{movie.title}}</h5>
            <button @click="movieSelected(movie.id)" class="btn btn-primary">Movie details</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>

<script>
import axios from 'axios'

export default {
  name: 'MovieDetails',
  props: {
    id: String,
  },
  data: function() {
    return {
      movie: null,
    }
  },
  created: function() {
    axios
      .get('http://localhost:3000/movies/' + this.id)
      .then(response => {
        this.movie = response.data
      })
      .catch(err => {
        alert(`Could not fetch movie with id ${this.id}`)
      })
  },
  methods: {
    getFullPath() {
      const imageUrl = 'https://image.tmdb.org/t/p/w500'
      return `${imageUrl}${this.movie.poster_path}`
    },
    getGenres() {
      return this.movie.genres
        .map(genre => {
          return genre.name
        })
        .join(', ')
    },
    getProductionCompanies() {
      return this.movie.production_companies
        .map(company => {
          return company.name
        })
        .join(', ')
    },
    getProductionCountries() {
      return this.movie.production_countries
        .map(country => {
          return country.name
        })
        .join(', ')
    },
    generateImdbLink() {
      return `http://imdb.com/title/${this.movie.imdb_id}`
    },
  },
}
</script>

<template>
  <div class="container">
    <div v-if="movie">
      <div class="row">
        <div class="movie-pic">
          <img
            :src="getFullPath()"
            class="thumbnail"
          >
        </div>
        <div class="movie-info">
          <h2>{{movie.title}}</h2>
          <ul class="list-group">
            <li class="list-group-item"><strong>Genre</strong>: {{ getGenres() }}</li>
            <li class="list-group-item"><strong>Released</strong>: {{ movie.release_date }}</li>
            <li class="list-group-item"><strong>Rated</strong>: {{ movie.vote_average }}</li>
            <li class="list-group-item"><strong>Companies</strong>: {{ getProductionCompanies() }}</li>
            <li class="list-group-item"><strong>Countries</strong>: {{ getProductionCountries() }}</li>
            <li class="list-group-item"><strong>Budget</strong>: {{'$'+movie.budget}}</li>
          </ul>
        </div>
      </div>
      <div class="overview">
          <h3><strong>Overview</strong></h3>
          <hr>
          <div>
            <h4>{{movie.overview}}</h4>
          </div>
          <div class="btn-group">
            <a
              :href="generateImdbLink()"
              target="_blank"
              class="btn btn-primary"
            >View on IMDB</a>
            <a
              href="/"
              class="btn btn-back"
            >Go Back to Search</a>
          </div>
        </div>
    </div>
  </div>
</template>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
}

.overview h4 {
  font-size: 20px;
  font-family: 'Times New Roman';
}

.list-group {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.list-group > li {
  word-wrap: break-word;
}

.row {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
}

.movie-info {
  align-self: center;
}
</style>

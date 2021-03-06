<script>
import axios from 'axios'
import Message from '@/message'
import config from '@/config'
import noImage from '@/assets/no-image.png'

const SERVER_URL = config('SERVER_URL')
const IMDB_URL = config('IMDB_URL')
const IMAGE_PATH = config('IMAGE_PATH_WIDTH_500')

export default {
  name: 'MovieDetails',
  props: {
    id: String,
  },
  data: function() {
    return {
      movie: null,
      noImage,
    }
  },
  created: function() {
    axios
      .get(`${SERVER_URL}/movies/${this.id}`)
      .then(response => {
        this.movie = response.data
      })
      .catch(err => {
        Message({
          message: `Could not fetch movie with id ${this.id}`,
          type: 'error',
        })
      })
  },
  methods: {
    getFullPath() {
      if (!this.movie.poster_path) {
        return null
      }
      const imageUrl = IMAGE_PATH
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
      return `${IMDB_URL}/title/${this.movie.imdb_id}`
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
            :src="getFullPath() || noImage"
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
      <div class="footer">
        <div class="overview">
          <h3><strong>Overview</strong></h3>
          <hr>
          <div class="overview__text">
            <h4>{{movie.overview}}</h4>
          </div>
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
  justify-content: space-around;
}

.row {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
}

.movie-pic img {
  height: 600px;
}

.movie-info {
  align-self: center;
}

.list-group {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
}

.list-group > li {
  align-self: flex-start;
  word-wrap: break-word;
}

.btn-group {
  display: flex;
  flex-direction: row;
  justify-content: center;
}

.btn-group > * {
  width: 10%;
  margin: 20px 10px;
}

.overview {
  align-self: flex-start;
  margin-top: 20px;
  font-size: 20px;
  font-family: 'Times New Roman';
}

.overview > * {
  margin: 0 5%;
}

.overview__text {
  text-align: justify;
}
</style>

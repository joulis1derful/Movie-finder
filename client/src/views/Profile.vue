<script>
import MoviesList from '@/components/MoviesList.vue'
import MovieDetails from '@/components/MovieDetails.vue'
import axios from 'axios'

export default {
  name: 'profile',
  components: {
    MoviesList,
    MovieDetails,
  },
  data: function() {
    return {
      movies: [],
      user: {},
      isLoaded: false,
      isDetailedInfoShown: false,
    }
  },
  created: function() {
    const userId = sessionStorage.getItem('userId')
    this.loadProfile(userId)
  },
  methods: {
    loadProfile: function(userId) {
      axios
        .get('http://localhost:3000/profile/' + userId, {
          headers: { authorization: sessionStorage.getItem('jwt') },
        })
        .then(response => {
          const { userId, email, watchLater, firstName, lastName } = response.data
          this.user = { userId, email, watchLater, firstName, lastName }
          this.movies = watchLater
          this.isLoaded = true
        })
        .catch(err => {
          console.log(err)
        })
    },
    handleMovieChange: function(movies) {
      this.movies = movies
    },
    getMovieIdFromSessionStorage: function() {
      return sessionStorage.getItem('movieId')
    },
    handleOpenDetailedInfo: function() {
      this.isDetailedInfoShown = true
    },
  },
}
</script>


<template>
  <div class="container">
    <div class="row">
      <div class="col-md-12 details">
        <blockquote>
          <h5>{{ user.firstName }} {{ user.lastName }}</h5>
        </blockquote>
        <p>
          {{ user.email }} <br>
        </p>
      </div>
      <div class="col-md-12 movie-list">
        <h3>Favourite movies</h3>
        <MoviesList
          v-if="isLoaded && !isDetailedInfoShown"
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
    </div>
  </div>
</template>

<style scoped>
.container {
  padding: 5%;
}
.container .details {
  text-align: right;
}
.container .movie-list h3 {
  text-align: center;
  margin-bottom: 30px;
}
.container .details p {
  font-size: 15px;
  font-weight: bold;
}
</style>


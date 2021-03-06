<script>
import MoviesList from '@/components/MoviesList.vue'
import MovieDetails from '@/components/MovieDetails.vue'
import Message from '@/message'
import axios from 'axios'
import config from '@/config'

const SERVER_URL = config('SERVER_URL')

export default {
  name: 'Profile',
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
        .get(`${SERVER_URL}/profile/${userId}`, {
          headers: { authorization: sessionStorage.getItem('jwt') },
        })
        .then(response => {
          const {
            userId,
            email,
            watchLater,
            firstName,
            lastName,
          } = response.data
          this.user = { userId, email, watchLater, firstName, lastName }
          this.movies = watchLater
          this.isLoaded = true
        })
        .catch(err => {
          Message({
            message: `Could not load profile with user id ${userId}`,
            type: 'error',
          })
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
    <div class="details">
      <label class="profile-info">
        <p class="name">{{ user.firstName }} {{ user.lastName }}</p>
        <p class="email">
          {{ user.email }} <br>
        </p>
      </label>
    </div>
    <div class="movie-list">
      <h3 v-if="!isDetailedInfoShown">Favourite movies</h3>
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
</template>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
}

.details {
  align-self: flex-end;
  margin-right: 5%;
}

.movie-list h3 {
  font-size: 24px;
  font-weight: 700;
  text-align: center;
}

.name {
  font-size: 20px;
  font-weight: 700;
}

.email {
  font-size: 15px;
}
</style>


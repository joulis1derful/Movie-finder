<script>
import axios from 'axios'

const SERVER_URL = process.env.VUE_APP_SERVER_URL
const IMAGE_PATH = process.env.VUE_APP_IMAGE_PATH_WIDTH_500

export default {
  name: 'MoviesList',
  props: {
    movies: Array,
    user: Object,
    totalPages: Number,
  },
  data: function() {
    return {
      prevPages: [],
      nextPages: [],
      currentPage: 1,
    }
  },
  created: function() {
    this.filterWatchLaterMovies(this.movies)
    this.applyPagination(this.currentPage, this.totalPages)
  },
  methods: {
    viewMovieDetails: function(id) {
      sessionStorage.setItem('movieId', id)
      this.$emit('isClosed')
    },
    getImagePath: function(movie) {
      const imageUrl = IMAGE_PATH
      return `${imageUrl + movie.poster_path}`
    },
    addToWatchLater: function(movieId) {
      axios
        .post(
          `${SERVER_URL}/profile/addWatchLater`,
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
          alert('Could not add movie to watch later list')
        })
    },
    removeFromWatchLater: function(movieId) {
      axios
        .post(
          `${SERVER_URL}/profile/removeWatchLater`,
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
          alert('Could not remove movie from watch later list')
        })
    },

    handleSelectPage: function(page) {
      this.$emit('selectPage', page)
      this.currentPage = page
      this.applyPagination(this.currentPage, this.totalPages)
    },

    applyPagination: function(curPage, totalPages) {
      // TODO refactor later
      const prevValues = []
      const nextValues = []
      const prevDiff = curPage - 2
      const nextDiff = curPage + 2

      if (prevDiff > 0) {
        for (let i = curPage - 2; i < curPage && i > 1; i++) {
          prevValues.push(i)
        }
      }

      if (nextDiff <= totalPages) {
        for (let i = curPage + 1; i <= curPage + 2 && i < totalPages; i++) {
          nextValues.push(i)
        }
      }

      this.prevPages = prevValues
      this.nextPages = nextValues
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
  <div>
    <div
      id="movies"
      class="list"
    >
      <div
        v-for="movie in movies"
        class="col-md-4"
      >
        <div class="well">
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

    <div class="footer">
      <ul>
        <a
          href="/"
          class="btn btn-back"
        >Go Back to Search</a>
      </ul>

      <nav
        v-if="totalPages <= 6"
        class="pagination"
      >
        <ul v-for="n in totalPages">
          <li class="page-item"><a
              class="page-link"
              @click="handleSelectPage(n)"
            >{{ n }}</a></li>
        </ul>
      </nav>

      <nav
        v-else
        class="pagination"
      >
        <ul v-if="currentPage !== 1">
          <li class="page-item"><a
              class="page-link"
              @click="handleSelectPage(1)"
            >1</a></li>
        </ul>
        <ul v-if="currentPage > 4">
          <li class="dots"><a>...</a></li>
        </ul>

        <ul v-for="n in prevPages">
          <li class="page-item"><a
              class="page-link"
              @click="handleSelectPage(n)"
            >{{ n }}</a></li>
        </ul>

        <ul>
          <li class="page-item"><a class="page-link current-page">{{ currentPage }}</a></li>
        </ul>

        <ul v-for="n in nextPages">
          <li class="page-item"><a
              class="page-link"
              @click="handleSelectPage(n)"
            >{{ n }}</a></li>
        </ul>

        <ul v-if="totalPages - currentPage > 2">
          <li class="dots"><a>...</a></li>
        </ul>
        <ul v-if="currentPage !== totalPages">
          <li class="page-item"><a
              class="page-link"
              @click="handleSelectPage(totalPages)"
            >{{ totalPages }}</a></li>
        </ul>
      </nav>
    </div>
  </div>
</template>

<style scoped>
.list {
  display: flex;
  flex-direction: flex-start;
  flex-wrap: wrap;
  align-items: center;
}

.footer {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  margin-top: 5%;
}

.col-md-4 {
  flex: 1 0 calc(33%);
}

.list img {
  height: 500px;
}

.well h5 {
  font-weight: 700;
  font-size: 30px;
  margin: auto;
}

.pagination {
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  margin-right: 5%;
}

.page-item {
  list-style-type: none;
  cursor: pointer;
}

.dots {
  list-style-type: none;
}

.current-page {
  color: #900060;
}

.page-link {
  text-decoration: none;
}
</style>

const imageUrl = 'https://image.tmdb.org/t/p/w500';

$(document).ready(() => {
    $('#searchForm').on('submit', (e) => {
        let searchText =  $('#searchText').val();
        getMovies(searchText);
        e.preventDefault();
    });
});

function getMovies(searchText) {
    axios.get('https://api.themoviedb.org/3/search/movie?api_key=52cc54558595d4caee5f1c68a7e7396f&query=' + searchText)
        .then((response) => {
        console.log(response.data.results);
        let movies = response.data.results;
        let output = '';
        $.each(movies, (index, movie) => {
            if(movie.poster_path !== null && movie.vote_count !== 0){
                output += `
                <div class="col-md-4">
                    <div class="well text-center">
                        <img src="${imageUrl + movie.poster_path}">
                        <h5>${movie.title}</h5>
                        <a onclick="movieSelected('${movie.id}')" class="btn btn-primary" href="#">Movie details</a>
                    </div>
                </div>
            `;
            }
        });
        $('#movies').html(output);
    })
        .catch((err) => {
            console.log(err);
    });
}

function movieSelected(id) {
    sessionStorage.setItem('movieId', id);
    window.location = 'movie.html';
    return false;
}

function getMovie() {
    let movieId = sessionStorage.getItem('movieId');
    axios.get('https://api.themoviedb.org/3/movie/'+movieId+'?api_key=52cc54558595d4caee5f1c68a7e7396f')
        .then((response) => {
            console.log(response.data);
            let movie = response.data;
            let genres = [];
            let production_countries = [];
            let production_companies = [];
            // let count = 0;

            for(let i of movie.genres) {
                // if(count === 1)
                //     genres = i.name;
                genres += i.name + ', ';
                // count++;
            }
            for(let i of movie.production_countries) {
                production_countries += i.name + ', ';
            }
            for(let i of movie.production_companies) {
                production_companies += i.name + ', ';
            }

            let output = `
                <div class="row">
                    <div class="col-md-4">
                        <img src="${imageUrl + movie.poster_path}" class="thumbnail">
                    </div>
                    <div class="col-md-8">
                        <h2>${movie.title}</h2>
                        <ul class="list-group">
                            <li class="list-group-item"><strong>Genre</strong>: ${genres}</li>
                            <li class="list-group-item"><strong>Released</strong>: ${movie.release_date}</li>
                            <li class="list-group-item"><strong>Rated</strong>: ${movie.vote_average}</li>
                            <li class="list-group-item"><strong>Companies</strong>: ${production_companies}</li>
                            <li class="list-group-item"><strong>Countries</strong>: ${production_countries}</li>
                            <li class="list-group-item"><strong>Budget</strong>: ${'$'+movie.budget}</li>
                          
                        </ul>
                    </div>
                    <div class="col-md-12">
                        <h3><strong>Overview</strong></h3>
                        <hr>
                        <div id="overview" class="well"><h4>${movie.overview}</h4></div>
                                <div class="well">
                                    <a href="http://imdb.com/title/${movie.imdb_id}" target="_blank" class="btn btn-primary">View on IMDB</a>
                                    <a href="index.html" class="btn btn-default">Go Back to Search</a>
                                </div>
                    </div>
                </div>
            `;
            $('#movie').html(output);
        })
        .catch((err) => {
            console.log(err);
        });
}
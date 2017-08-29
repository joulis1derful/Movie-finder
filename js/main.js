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

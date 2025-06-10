document.addEventListener('DOMContentLoaded', function(){
    fetchTopTenMovies();
});
function fetchTopTenMovies() {
    fetch('https://api.themoviedb.org/3/discover/movie?api_key=4b42cd75f9ee878cac9bf18dc90f1ea5&sort_by=popularity.desc')
     .then(response => response.json())
     .then(data => displayMovies(data.results.slice(0, 12)))
     .catch(error => console.error(error));
}

function displayMovies(movies) {
    var movieContainer = document.getElementById('movie-container');
    movieContainer.innerHTML = '';
    movies.forEach(movie =>{
        var movieCard = `
        <div class="flip flip-vertical">
            <div class = "front">
                <img src="https://image.tmdb.org/t/p/w185${movie.poster_path}" alt="${movie.title}">
            </div>
            <div class="back">
                <h2>${movie.title}</h2>
                <p>Description: ${movie.overview}</p>
                <p>Vote Average: ${movie.vote_average}</p>
            </div>
        </div>
        `
        movieContainer.innerHTML += movieCard;
    });
}


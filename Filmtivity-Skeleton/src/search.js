document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('search-btn').addEventListener('click', function() {
        var title = document.getElementById('search').value;
        if(title.trim()){
            fetchMovie(title);
            document.getElementById('details-page').style.display = 'block';
        }else{
            document.getElementById('details-page').style.display = 'none';
        }
    });
});

function fetchMovie(title) {
 fetch(`https://api.themoviedb.org/3/search/movie?api_key=4b42cd75f9ee878cac9bf18dc90f1ea5&query=${title}`)
    .then(response => response.json())
    .then(data => {
        const movie = data.results[0]
        document.getElementById('title').textContent = movie.title;
        document.getElementById('release_date').textContent = movie.release_date;
        document.getElementById('overview').textContent = movie.overview;
        document.getElementById('vote_average').textContent = movie.vote_average;
        document.getElementById('original_language').textContent = movie.original_language;
        document.getElementById('poster').src = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
    }).catch(error => console.error(error));
}

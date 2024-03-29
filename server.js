const search = document.getElementById("search");
const inputTitle = document.getElementById("input-title");
const movieInfo = document.getElementById("movie-info");
const movieSection = document.getElementById("movies-section");

let watchlistMovies = JSON.parse(localStorage.getItem("watchlist")) || [];
let movieArr = [];

search.addEventListener("click", searchMovies)
movieSection.addEventListener("click",(e)=>addMoviesToWatchlish(e));

async function searchMovies(){
    const title = inputTitle.value;
    try{
        const res = await fetch(`http://www.omdbapi.com/?apikey=1b3d9fe9&s=${title}]`);
        if(!res.ok){
            throw Error("Movie is found.");
        }
        const data = await res.json();
        if(data.Response === "False"){
            throw Error("Movie is not found.");
        }

        let movieData = data.Search;
        fetchMovie(movieData);
    }
    catch(err) {
        movieSection.innerHTML = `
        <div class="movies-other-details">
        <p class="movie-info">Unable to find what you're looking for. Please try another search.</p>
        </div>
        `;
        console.log(err);
    }
}
async function fetchMovie(arr) {
    movieSection.innerHTML = "";
    movieArr = [];
    for(let movie of arr){
        try{
            let res = await fetch(`http://www.omdbapi.com/?apikey="Enter you api key"&i=${movie.imdbID}`)
            if(!res.ok){
                throw Error("Movie is not found");
            }
            let data = await res.json();
            renderMovie(data);
        }
        catch(err) {
            console.log(err)
        }
    }
}
function renderMovie(movie) {
    let movieData = {
        id : movie.imdbID,
        poster: movie.Poster,
        title: movie.Title,
        rating: movie.imdbRating,
        runtime: movie.Runtime,
        genre: movie.Genre,
        plot: movie.Plot
    }
    movieArr.push(movieData);
    let divEl = document.createElement("div");
    let html = `
            <div class="movie-details">
                <img src="${movie.Poster}" alt="${movie.Title} Poster">
                <div>
                    <div class="movie-header">
                        <h1>${movie.Title}</h1>
                        <span>⭐ ${movie.imdbRating}</span>
                    </div>
                    <div class="movie-content">
                        <span>${movie.Runtime}</span>
                        <span>${movie.Genre}</span>
                        <div class="watchlist-added">
                            <img id="img${movie.imdbID}" class="add-to-watchlist" src="assist/add-circle.png" alt="add movie to watchlist">
                            <button id="${movie.imdbID}" class="add-to-watchlist">Watchlist</button>
                        </div>
                    </div>
                        <p class="movie-plot" >${movie.Plot}</p> 
                </div> 
            </div>
            `;
    divEl.innerHTML = html;
    movieSection.append(divEl);
}


function addMoviesToWatchlish(event){
    // const existingWatchlist = JSON.parse.localStorage.getItem("watchlist");
    if(event.target.className === "add-to-watchlist"){
        let movieExist = false;
        for(let movie of movieArr){
            if(movie.id === event.target.id || ("img"+movie.id) === event.target.id)
                {
                    console.log("click")
                    watchlistMovies.forEach(existingMovie => {
                        if(existingMovie.id === movie.id){
                            movieExist = true;
                        }
                    });
                    !movieExist && watchlistMovies.push(movie);
                    console.log(watchlistMovies)
                    localStorage.setItem("watchlist",JSON.stringify(watchlistMovies));
                }
            } 
            // localStorage.setItem()
        }
}

export default watchlistMovies;
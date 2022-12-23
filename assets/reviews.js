var input = $("#name-input");
var btn = document.querySelector("#review-search-btn");
var content = document.querySelector("#review-content");
var movieInfo = document.querySelector('#movie-info');
var posterContainer = document.querySelector('#poster-container');
var moviePoster = document.querySelector('#movie-poster');
var movieTitle = document.querySelector('#movie-title');
var movieOverview = document.querySelector('#movie-overview');
var releaseDate = document.querySelector('#release-date');
var runtime=document.querySelector('#runtime')

//add autocomplete to input box while key in movie's name for search
input.keyup(function () {
  console.log(input.val());
  var movieName = input.val();
  if (movieName != "") {
    var availableNames = [];
    var movieIDUrl =
      "https://api.themoviedb.org/3/search/movie?api_key=b3d061705cb162c0d2c4c93862143c72&query=" +movieName;
    fetch(movieIDUrl)
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        console.log(data);
        for (var i = 0; i < data.results.length; i++) {
          var movieTitle = data.results[i].title;
          availableNames.push(movieTitle);
        }
        console.log(availableNames);
        input.autocomplete({
          source: availableNames,
        });
      });
  }
});

//create function to fetch movie_id first then use it as part of the url to fetch reviews
function getReviews() {
  getReady();
  var movieName = input.val();
  var movieIDUrl =
    "https://api.themoviedb.org/3/search/movie?api_key=b3d061705cb162c0d2c4c93862143c72&query=" +movieName;
  fetch(movieIDUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      var urlArray = [];
      var movieId = data.results[0].id;
      var reviewUrl ="https://api.themoviedb.org/3/movie/" + movieId + "/reviews?api_key=b3d061705cb162c0d2c4c93862143c72&language=en-US";
      var movieInfoUrl = "https://api.themoviedb.org/3/movie/" + movieId + "?api_key=b3d061705cb162c0d2c4c93862143c72&language=en-US";
      urlArray.push(reviewUrl);
      urlArray.push(movieInfoUrl);
      return urlArray;
    })
    .then(function (data) {  
        fetch(data[1])
            .then(function (response) { 
                return response.json();
            })
            .then(function getMovieInfo(data) {
                console.log(data);
                movieInfo.style.display = "block";
                var moviePoster = document.createElement('img')
                moviePoster.classList.add("img-fluid","rounded-start");
                moviePoster.setAttribute('id','movie-poster')
                var movieImgUrl = 'https://image.tmdb.org/t/p/w500/' + data.poster_path;
                moviePoster.setAttribute("src", movieImgUrl);
                moviePoster.setAttribute("alt", data.title);
                console.log(moviePoster);
                posterContainer.appendChild(moviePoster);
                movieTitle.textContent = data.title;
                movieOverview.textContent = "Overview: " + data.overview;
                releaseDate.textContent = "Release date: " + data.release_date;
                runtime.textContent="Duration: " + data.runtime + "mins";
            })
        fetch(data[0])
          .then(function (response) {
            return response.json();
          })
          .then(function (data) {
            if (data.results.length === 0) {
              var errorMessage = document.createElement("div");
              errorMessage.classList.add("error-message");
              content.appendChild(errorMessage);
              errorMessage.textContent ="Sorry, the review for this movie is not found";
            } else {
              console.log(data);
              for (var i = 0; i < data.results.length; i++) {
                var card = document.createElement("div");
                var cardHeader = document.createElement("div");
                var cardBody = document.createElement("div");
                cardHeader.textContent ="By " +data.results[i].author +" posted at: " +data.results[i].updated_at.split("T")[0];
                cardBody.textContent = data.results[i].content;
                card.setAttribute("class", "card");
                cardHeader.classList.add("card-header");
                cardBody.classList.add("card-body","border-dark","bg-light","mb-3");
                content.appendChild(card);
                card.appendChild(cardHeader);
                card.appendChild(cardBody);
              }
            }
          });
    });
}

//initialize the contents of html tags
function getReady() { 
    content.innerHTML = "";
    posterContainer.innerHTML = "";
    movieTitle.textContent = "";
    movieOverview.textContent = "";
    releaseDate.textContent = "";
    runtime.textContent = "";
}

//click event for the search button to the the reviews
btn.addEventListener("click", getReviews);

var sectionEl = document.querySelector("#container");

function renderResults() {
  var movieList = [];
  //dynamically create card elements
  // loop through movielist array
  // for(var i = 0; i < movielist.length; i++){
  //      // create card element
  //var movieCard = $('<card>')
  //movieCard.addClass('whatever class name', movieCard[i])
  // whateverEL.append(movieCard)
  //}
}

let getGenreIds = function () {
  let apiUrl = `https://api.themoviedb.org/3/genre/movie/list?api_key=b3d061705cb162c0d2c4c93862143c72&language=en-US`;
  fetch(apiUrl)
    .then(function (response) {
      if (response.ok) {
        response.json().then(function (data) {
          for (var i = 0; i <= 10; i++) {}
          returnGenres(data);
        });
      } else {
        alert(`Error ${response.statusText}`);
      }
    })
    .catch(function (error) {
      alert("unable to connect ");
    });
};

getGenreIds();

let returnGenres = function (i) {
  return i;
};

getTopTen = function () {
  let apiUrl = `https://api.themoviedb.org/3/discover/movie?api_key=b3d061705cb162c0d2c4c93862143c72&language=en-US&sort_by=vote_average.desc&include_adult=false&include_video=false&page=1&vote_count.gte=300&with_genres=28&with_watch_monetization_types=flatrate`;
  fetch(apiUrl)
    .then(function (response) {
      if (response.ok) {
        response.json().then(function (data) {
          for (var i = 0; i <= 10; i++) {
            var card = document.createElement("div");
            card.classList.add("card");
            var cardCont = document.createElement("div");
            cardCont.classList.add("title");
            var cardRating = document.createElement("div");
            cardRating.classList.add("rating");
            var cardImg = document.createElement("img");
            cardImg.classList.add("movieImage");
            imgUrl = `https://image.tmdb.org/t/p/w500/${data.results[i].poster_path}`;
            cardRating.textContent = data.results[i].vote_average;
            cardCont.textContent = data.results[i].title;
            cardImg.setAttribute("src", imgUrl);
            cardImg.setAttribute("alt", data.results[i].title);
            card.appendChild(cardImg);
            card.appendChild(cardRating);
            card.appendChild(cardCont);
            sectionEl.appendChild(card);
            console.log(card);
          }
        });
      } else {
        alert(`Error ${response.statusText}`);
      }
    })
    .catch(function (error) {
      alert("unable to connect ");
    });
};

getTopTen();

let displayTopTen = function (movies) {
  if (movies.length === 0) {
    mediaResultsEl.textContent = "No movies found";
  }
};

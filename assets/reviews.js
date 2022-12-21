var input = document.querySelector("#name-input");
var btn = document.querySelector("#review-search-btn");
var content = document.querySelector("#review-content");

function getReviews() {
  content.innerHTML = "";
  var movieName = input.value;
  var movieIDUrl =
    "https://api.themoviedb.org/3/search/movie?api_key=b3d061705cb162c0d2c4c93862143c72&query=" +
    movieName;
  fetch(movieIDUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log(data);
      var movieId = data.results[0].id;
      console.log(movieId);
      var reviewUrl =
        "https://api.themoviedb.org/3/movie/" +
        movieId +
        "/reviews?api_key=b3d061705cb162c0d2c4c93862143c72&language=en-US";
      console.log(reviewUrl);
      return reviewUrl;
    })
    .then(function (data) {
      fetch(data)
        .then(function (response) {
          return response.json();
        })
        .then(function (data) {
          console.log(data);
          for (var i = 0; i < data.results.length; i++) {
            var contentBox = document.createElement("li");
            contentBox.textContent = data.results[i].content;
            content.appendChild(contentBox);
          }
        });
    });
}

btn.addEventListener("click", getReviews);

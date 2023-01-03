$(function () {
  var sectionEl = document.querySelector("#container");
  var genreEl = document.querySelector(".genre-tags");
  var searchEl = $(".findBtn");
  var headingEL = $("#top10title");
  var genreSelections = [];
  var genreNames = [];

  let getGenreIds = function () {
    let apiUrl = `https://api.themoviedb.org/3/genre/movie/list?api_key=b3d061705cb162c0d2c4c93862143c72&language=en-US`;
    fetch(apiUrl)
      .then(function (response) {
        if (response.ok) {
          response.json().then(function (data) {
            console.log(data.genres);
            for (var i = 0; i <= data.genres.length - 1; i++) {
              var buttonEl = document.createElement("button");
              buttonEl.classList.add("genreBtn");
              buttonEl.textContent = data.genres[i].name;
              buttonEl.value = data.genres[i].id;
              genreEl.appendChild(buttonEl);
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

  getGenreIds();

  getTopTen = function () {
    let genreIds = genreSelections.join();
    let apiUrl = `https://api.themoviedb.org/3/discover/movie?api_key=b3d061705cb162c0d2c4c93862143c72&language=en-US&sort_by=vote_average.desc&include_adult=false&include_video=false&page=1&vote_count.gte=${output.innerHTML}&with_genres=${genreIds}&with_watch_monetization_types=flatrate`;
    fetch(apiUrl)
      .then(function (response) {
        if (response.ok) {
          response.json().then(function (data) {
            console.log(data);
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

  $(document).on("click", $(".genreBtn"), function (event) {
    target = $(event.target);
    if (target.is(".genreBtn"))
      if (event.target.style.backgroundColor == "blueviolet") {
        event.target.style.backgroundColor = "#355e3b";
        genreSelections.splice(genreSelections.indexOf(event.target.value), 1);
        genreNames.splice(genreNames.indexOf(event.target.textContent), 1);
        if (genreNames.includes("and")) {
          genreNames.splice(genreNames.indexOf("and", 0), 1);
        }
      } else {
        event.target.style.backgroundColor = "blueviolet";
        genreSelections.push(event.target.value);
        genreNames.push(event.target.textContent);
        if (genreNames.includes("and")) {
          genreNames.splice(genreNames.indexOf("and", 0), 1);
        }
      }
  });

  searchEl.on("click", function () {
    const containerNode = document.getElementById("container");
    containerNode.innerHTML = "";
    getTopTen();
    console.log(genreNames.length);
    if (genreNames.includes("and")) {
      genreNames.splice(genreNames.indexOf("and", 0), 1);
    }
    if (genreNames.length == "0") {
      headingEL.text("Top 10 movies of all time");
    } else if (genreNames.length < 2) {
      headingEL.text(`Top 10 movies including: ${genreNames[0]}`);
    } else if (genreNames.length == 2) {
      headingEL.text(
        `Top 10 movies including: ${genreNames[0]} and ${genreNames[1]}`
      );
    } else if (genreNames.length >= 3) {
      genreNames.splice(genreNames.length - 1, 0, "and");
      console.log(genreNames);
      newStr = genreNames.join(" ");
      headingEL.text(`Top 10 movies including: ${newStr}`);
    }
  });

  var slider = document.getElementById("myRange");
  var output = document.getElementById("voteCountOutput");
  output.innerHTML = slider.value; // Display the default slider value
  slider.oninput = function () {
    output.innerHTML = this.value;
  };

  getTopTen();
});

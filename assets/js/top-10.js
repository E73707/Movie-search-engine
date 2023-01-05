$(function () {
  var sectionEl = document.querySelector("#container");
  var genreEl = document.querySelector(".genre-tags");
  var searchEl = $(".findBtn");
  var headingEL = $("#top10title");
  var genreSelections = [];
  var genreNames = [];
  var youtubeAPI = "AIzaSyBWolI7dWMOshPzwFYNZWc8pd-LQ3Eaewc";
  var movieId;
  let getGenreIds = function () {
    let apiUrl = `https://api.themoviedb.org/3/genre/movie/list?api_key=b3d061705cb162c0d2c4c93862143c72&language=en-US`;
    fetch(apiUrl)
      .then(function (response) {
        if (response.ok) {
          response.json().then(function (data) {
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

  getMovieTrailer = function (movieTitle) {
    let apiUrl = `https://youtube.googleapis.com/youtube/v3/search?part=snippet&maxResults=1&q=${movieTitle}&key=AIzaSyBWolI7dWMOshPzwFYNZWc8pd-LQ3Eaewc`;
    fetch(apiUrl).then(function (response) {
      if (response.ok) {
        response.json().then(function (data) {
          console.log(data.items[0].id.videoId);
          return data.items[0].id.videoId;
        });
      }
    });
  };

  // getMovieTrailer("The Godfather trailer");

  getGenreIds();

  getTopTen = function () {
    let genreIds = genreSelections.join();
    let apiUrl = `https://api.themoviedb.org/3/discover/movie?api_key=b3d061705cb162c0d2c4c93862143c72&language=en-US&sort_by=vote_average.desc&include_adult=false&include_video=false&page=1&vote_count.gte=${output.innerHTML}&with_genres=${genreIds}&with_watch_monetization_types=flatrate`;
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
              var cardOverviewDiv = document.createElement("div");
              var cardOverviewP = document.createElement("p");
              var innerCardDiv = document.createElement("div");
              var reviewsBtnDiv = document.createElement("div");
              var reviewsBtn = document.createElement("button");
              var btnIcon = document.createElement("i");
              var trailerBtn = document.createElement("button");
              trailerBtn.textContent = "trailer";
              trailerBtn.classList.add("trailerBtn");
              trailerBtn.value = data.results[i].title;
              btnIcon.classList.add("fa-solid", "fa-pen-fancy");
              reviewsBtnDiv.classList.add("reviewsBtnDiv");
              reviewsBtn.classList.add("btn");
              reviewsBtn.value = data.results[i].title;
              reviewsBtn.classList.add("btn-primary");
              reviewsBtn.setAttribute("type", "button");
              reviewsBtn.setAttribute(
                "style",
                "--bs-btn-padding-y: .25rem; --bs-btn-padding-x: .5rem; --bs-btn-font-size: .75rem;"
              );
              reviewsBtn.appendChild(btnIcon);
              reviewsBtnDiv.appendChild(reviewsBtn);
              innerCardDiv.classList.add("innerCardDiv");
              cardOverviewDiv.appendChild(cardOverviewP);
              cardOverviewDiv.classList.add("overview");
              cardOverviewP.classList.add("overviewP");
              cardOverviewP.textContent = data.results[i].overview;
              cardCont.textContent = data.results[i].title;
              cardImg.setAttribute("src", imgUrl);
              cardImg.setAttribute("alt", data.results[i].title);
              innerCardDiv.appendChild(cardImg);
              innerCardDiv.appendChild(reviewsBtnDiv);
              innerCardDiv.appendChild(cardRating);
              innerCardDiv.appendChild(cardCont);
              innerCardDiv.appendChild(cardOverviewDiv);
              innerCardDiv.appendChild(trailerBtn);
              card.appendChild(innerCardDiv);
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

  let reviewFunc = function (title) {
    // localStorage.setItem(title);
    window.location.href = "reviews.html" + "?" + title;
    // window.location.assign("Top-10.html");
    movieName = title;
    console.log(movieName);
  };

  $(document).on("click", $(".btn span"), function (event) {
    let Revtitle;
    event.stopPropagation();
    target = $(event.target);
    evTarget = event.target;
    if (target.is(".btn")) {
      Revtitle = event.target.value;
      localStorage.setItem("title", Revtitle);
      reviewFunc(Revtitle);
    } else if (target.is(".fa-solid", ".fa-pen-fancy")) {
      Revtitle = event.target.parentNode.value;
      localStorage.setItem("title", Revtitle);
      reviewFunc(Revtitle);
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

  function loadVideo(name) {
    window.YT.ready(function () {
      new window.YT.Player("video", {
        // < ==== change this to class of card div being added
        height: "390",
        width: "640",
        videoId: name,
        events: {
          onReady: onPlayerReady,
          onStateChange: onPlayerStateChange,
        },
      });
    });

    function onPlayerReady(event) {
      event.target.playVideo();
    }

    function onPlayerStateChange(event) {
      var videoStatuses = Object.entries(window.YT.PlayerState);
      console.log(videoStatuses.find((status) => status[1] === event.data)[0]);
    }
  }

  // loadMovieTrailer = function () {
  $(document).on("click", $(".trailerBtn"), function (event) {
    if (target.is(".trailerBtn")) {
      let movieId;
      let movieTitle = event.target.value;
      let apiUrl = `https://youtube.googleapis.com/youtube/v3/search?part=snippet&maxResults=1&q=${movieTitle}&key=AIzaSyBWolI7dWMOshPzwFYNZWc8pd-LQ3Eaewc`;
      fetch(apiUrl).then(function (response) {
        if (response.ok) {
          response
            .json()
            .then(function (data) {
              console.log(data.items[0].id.videoId);
              movieId = data.items[0].id.videoId;
            })
            .then(function () {
              $.getScript("https://www.youtube.com/iframe_api", function () {
                console.log(movieId);
                loadVideo(movieId);
                console.log("working");
              });
            });
        }
      });
    }
  });

  getTopTen();
});

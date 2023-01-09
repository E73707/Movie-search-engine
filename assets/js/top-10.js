$(function () {
  console.log(window.location.href);
  var sectionEl = document.querySelector("#container");
  var genreEl = document.querySelector(".genre-tags");
  var searchEl = $(".findBtn");
  var headingEL = $("#top10title");
  var genreSelections = [];
  var genreNames = [];
  var youtubeAPI = "AIzaSyBWolI7dWMOshPzwFYNZWc8pd-LQ3Eaewc";
  var movieId;
  var slider = document.getElementById("myRange");
  var output = document.getElementById("voteCountOutput");
  var decodedUrl = "";
  var splitUrl = "";
  var thisUrl = document.location.href;

  let pageload = function () {
    if (thisUrl.includes("?")) {
      genreSelections = [];
      let genres = [];
      let decodedUrl = decodeURI(thisUrl);
      let splitUrl = decodedUrl.split("?");
      splitUrl.length == 3
        ? genres.push(splitUrl[1], splitUrl[2])
        : genres.push(splitUrl[1]);
      if (genres[0] == "action") {
        genres[0] = 28;
        headingEL.text(`Top 10 action movies of all time`);
      } else if (genres[0] == "drama") {
        genres[0] = 18;
        headingEL.text(`Top 10 drama movies of all time`);
      } else {
        genres[0] = 10749;
        genres[1] = 35;
        headingEL.text(`Top 10 movies including: romance and comedy `);
      }
      genreSelections = genres;
      getTopTen();
      genreSelections = [];
      decodedUrl = "";
      splitUrl = "";
    } else {
      genreSelections = [];
      decodedUrl = "";
      splitUrl = "";
      getTopTen();
    }
    genreSelections = [];
  };

  // pulls genre IDs from tmdb then creates buttons with corresponding names and values.
  // USES TMBD API
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

  getGenreIds();

  // adds user input from genres selected and appends to genreSelections for the getTop10 function to access
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

  // minimum vote count slider as having results werent reliable enough sorting only by user score (rating of 10 w only one user score will return as the values without a min vote count)
  output.innerHTML = slider.value; // Display the default slider value
  slider.oninput = function () {
    output.innerHTML = this.value;
  };

  // fetches top 10 movies by genres selected, if no genres are selected it will default to top 10 of all genres.
  // then creates cards with the title, user rating, short description, trailer button and a button which links to the reviews page.
  // USES TMBD API
  getTopTen = function () {
    console.log(genreSelections);
    let genreIds = genreSelections.join();
    let apiUrl = `https://api.themoviedb.org/3/discover/movie?api_key=b3d061705cb162c0d2c4c93862143c72&language=en-US&sort_by=vote_average.desc&include_adult=false&include_video=false&page=1&vote_count.gte=${output.innerHTML}&with_genres=${genreIds}&with_watch_monetization_types=flatrate`;
    fetch(apiUrl)
      .then(function (response) {
        if (response.ok) {
          response.json().then(function (data) {
            for (var i = 0; i <= 10; i++) {
              var card = document.createElement("div");
              var cardOverviewDiv = document.createElement("div");
              var cardOverviewP = document.createElement("p");
              var innerCardDiv = document.createElement("div");
              var reviewsBtnDiv = document.createElement("div");
              var reviewsBtn = document.createElement("button");
              var trailerBtn = document.createElement("button");
              var cardCont = document.createElement("div");
              var cardRating = document.createElement("div");
              var cardImg = document.createElement("img");
              card.classList.add("card");
              cardCont.classList.add("title");
              cardRating.classList.add("rating");
              cardRating.textContent = data.results[i].vote_average;
              cardImg.classList.add("movieImage");
              imgUrl = `https://image.tmdb.org/t/p/w500/${data.results[i].poster_path}`;
              trailerBtn.textContent = "trailer";
              trailerBtn.classList.add("btn", "btn-primary");
              trailerBtn.classList.add("trailerBtn");
              trailerBtn.value = data.results[i].title;
              trailerBtn.setAttribute(
                "style",
                "--bs-btn-padding-y: .25rem; --bs-btn-padding-x: .5rem; --bs-btn-font-size: .75rem;"
              );
              trailerBtn.setAttribute("data-toggle", "modal");
              trailerBtn.setAttribute("data-target", ".trailerModal");
              reviewsBtnDiv.classList.add("reviewsBtnDiv");
              reviewsBtn.classList.add("btn", "btn-primary", "reviews-btn");
              reviewsBtn.value = data.results[i].title;
              reviewsBtn.setAttribute("type", "button");
              reviewsBtn.setAttribute(
                "style",
                "--bs-btn-padding-y: .25rem; --bs-btn-padding-x: .5rem; --bs-btn-font-size: .75rem;"
              );
              reviewsBtn.textContent = "reviews";
              reviewsBtnDiv.appendChild(reviewsBtn);
              innerCardDiv.classList.add("innerCardDiv");
              cardOverviewDiv.appendChild(cardOverviewP);
              cardOverviewDiv.classList.add("overview");
              cardOverviewP.classList.add("overviewP");
              cardOverviewP.textContent = data.results[i].overview;
              let overviewList = cardOverviewP.textContent.split(" ");
              // console.log(shortDescGenerator(overviewList));
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
  // need to finish
  let shortDescGenerator = function (arr) {
    let shortDescription = [];
    for (let i = 0; i <= 20; i++) {
      shortDescription.push(arr[i]);
    }
    shortDescription = shortDescription.join(" ");
    return shortDescription;
  };

  // changes window to reviews page and automatically sets the review to the movie selected
  let reviewFunc = function (title) {
    window.location.href = "reviews.html" + "?" + title;
    movieName = title;
  };

  // adds click event and activates the reviewFunc
  $(document).on("click", $(".btn span"), function (event) {
    let Revtitle;
    event.stopPropagation();
    target = $(event.target);
    evTarget = event.target;
    if (target.is(".reviews-btn")) {
      Revtitle = event.target.value;
      reviewFunc(Revtitle);
    }
  });

  // changes the description of what user is searching for dynamically based on genres
  searchEl.on("click", function () {
    const containerNode = document.getElementById("container");
    containerNode.innerHTML = "";
    getTopTen();
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

  output.innerHTML = slider.value; // Display the default slider value
  slider.oninput = function () {
    output.innerHTML = this.value;
  };

  // when this function is activated by the trailer click event, it takes the movieID as an argument and creates a player which automatically plays the youtube video within a popup modal
  function loadVideo(name) {
    window.YT.ready(function () {
      player = new window.YT.Player("video", {
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

  // Adds click handler to trailer button, and uses the title appended to the trailer button as a value value to search using the youtube API for the id of the video that is most relevant. (id comes in a format of random numbers and letters)
  $(document).on("click", $(".trailerBtn"), function (event) {
    event.preventDefault();
    if (target.is(".trailerBtn")) {
      let movieId;
      let movieTitle = event.target.value + " trailer";
      let apiUrl = `https://youtube.googleapis.com/youtube/v3/search?part=snippet&maxResults=1&q=${movieTitle}&key=AIzaSyBWolI7dWMOshPzwFYNZWc8pd-LQ3Eaewc`;
      fetch(apiUrl).then(function (response) {
        if (response.ok) {
          response
            .json()
            .then(function (data) {
              movieId = data.items[0].id.videoId;
            })
            .then(function () {
              // short hand ajax function, a separate api which gets script for embedding yt player
              $.getScript("https://www.youtube.com/iframe_api", function () {
                // activates loadVideo function with the youtube video ID
                loadVideo(movieId);
              });
            });
        } else {
          alert(
            `Error. Reached maximum quota of requests today, please try again in 24 hours`
          );
        }
      });
    }
  });

  // // when this function is activated by the trailer click event, it takes the movieID as an argument and creates a player which automatically plays the youtube video within a popup modal
  // function loadVideo(name) {
  //   window.YT.ready(function () {
  //     player = new window.YT.Player("video", {
  //       height: "390",
  //       width: "640",
  //       videoId: name,
  //       events: {
  //         onReady: onPlayerReady,
  //         onStateChange: onPlayerStateChange,
  //       },
  //     });
  //   });

  //   function onPlayerReady(event) {
  //     event.target.playVideo();
  //   }

  //   function onPlayerStateChange(event) {
  //     var videoStatuses = Object.entries(window.YT.PlayerState);
  //     console.log(videoStatuses.find((status) => status[1] === event.data)[0]);
  //   }
  // }

  // removes old player when exiting modal
  $("#exampleModalCenter").on("hidden.bs.modal", function (e) {
    player.destroy();
  });

  $(".home").on("click", function () {
    window.location.href = "../../index.html";
  });

  $(".reviews").on("click", function () {
    window.location.href = "reviews.html";
  });

  $(".trending").on("click", function () {
    window.location.href = "Upcomming.html";
  });

  $(".dropdown-toggle").click(function () {
    window.location.href = "Top-10.html";
  });

  let dropdownMenu = document.querySelector(".dropdown-menu");

  $(".dropdown").mouseover(function () {
    dropdownMenu.classList.add("show");
  });

  $(".dropdown").mouseout(function () {
    dropdownMenu.classList.remove("show");
  });

  $(".action-dropdown").on("click", function () {
    window.location.href = "./Top-10.html" + "?" + "action";
  });

  $(".romcom-dropdown").on("click", function () {
    window.location.href = "Top-10.html" + "?" + "romance" + "?" + "comedy";
  });

  $(".drama-dropdown").on("click", function () {
    window.location.href = "Top-10.html" + "?" + "drama";
  });

  pageload();
});

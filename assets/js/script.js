const advancedSearchText = document.getElementById('advanced-search-text');
const addFilterContainer = document.getElementById('add-filter-container');
const filterBox = document.getElementById('filter-render-box');
const searchBtn = document.getElementById('search-button');
const keywordSearchQueryBox = document.getElementById('keyword-search-input');
const searchResultContainer = document.getElementById('search-result-container');
const today = dayjs().format('YYYY-MM-DD');
const errorModal = new bootstrap.Modal(document.getElementById('api-error-modal'));
const apiErrorMsg = document.getElementById('api-error-message')
const errorMsgHeadline = document.getElementById('error-message-headline');
const toTopBtn = document.getElementById('to-top-btn');

let broadSearch250 = {}
let advancedSearchShow = false;

// Scroll-to-Top Button
var scrollThreshold = 400;

window.onscroll = () => {
    if(document.body.scrollTop > scrollThreshold || document.documentElement.scrollTop > scrollThreshold) {
        toTopBtn.classList.remove('d-none');
    } else {
        toTopBtn.classList.add('d-none');
    }
}

toTopBtn.onclick = () => {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
}

init();

function init() {
    advancedSearchTextClick();
    renderGenreSelectionBtn();
    loadLocalStore();
    searchSubmit();
}

function loadLocalStore() {
    let localStoreBroadSearch250 = JSON.parse(localStorage.getItem('broadSearch250'));
    if (localStoreBroadSearch250 !== null) {
        broadSearch250 = localStoreBroadSearch250;
        renderSearchResults(broadSearch250.result);
    } else {
        fetchDefaultData();
    }
}

function searchSubmit() {
    searchBtn.addEventListener('click', () => {
        const rawSearchQuery = keywordSearchQueryBox.value.replace(',',' ').replace('.',' ').trim().split(' '); // e.g. "gun,  war " => ['gun', '', '', 'war']
        const loadingSpinner = document.getElementById('loading-spinner');
        const searchResultHeading = document.getElementById('section-2-heading')
        
        console.log(rawSearchQuery)

        let normalSearchQuery = []; // This is a new array that excludes empty strings
        for (var i = 0; i < rawSearchQuery.length; i++) {
            if(rawSearchQuery[i] !== ' ') { // This conditional statement accounts for possible empty strings, i.e., only push non-empty strings
                normalSearchQuery.push(rawSearchQuery[i]);
            }
        }

        console.log(normalSearchQuery);

        searchResultHeading.innerText = 'Search Results';

        loadingSpinner.classList.remove('d-none');
        searchResultContainer.innerHTML = '';
        
        if(advancedSearchShow) {
            const durationLabelElem = document.getElementById('duration-label');
            const durationList = durationLabelElem.innerText.replace(" min", "").split("-");

            const genresSelected = [];
            const genreElemList = document.querySelectorAll('input[id^="genre-btn-"]');
            for(checkboxElem of genreElemList) {
                if(checkboxElem.checked) {
                    genresSelected.push(checkboxElem.dataset.genre);
                }
            }

            const userRatingElem = document.getElementById('user-rating-label');
            const userRatingRange = userRatingElem.innerText.split(' to ');

            const yearReleaseElem = document.getElementById('year-release-label');
            const yearReleaseRange = yearReleaseElem.innerText.split(' to ')

            const minUserVotesField = document.getElementById('min-user-votes');
            const maxUserVotesField = document.getElementById('max-user-votes');
            
            console.log(genresSelected);
            console.log(durationList);
            console.log(userRatingRange);
            console.log(yearReleaseRange);
            console.log(minUserVotesField.value);
            console.log(maxUserVotesField.value);

            const advancedParam = {
                searchQuery: normalSearchQuery,
                genre: genresSelected,
                duration: durationList,
                userRating: userRatingRange,
                yearRelease: yearReleaseRange,
                userVotes: [minUserVotesField.value, maxUserVotesField.value]
            }
            advancedSearchSubmit(advancedParam)
        }
        else {
            searchMoviePlot(normalSearchQuery);
        }

    })
}

function fetchDefaultData() {
    fetch(`https://imdb-api.com/API/AdvancedSearch/k_lyhir636?title_type=feature&user_rating=7.0,10&num_votes=50000,&languages=en&count=250&sort=user_rating,desc`)
    .then(function(response){
        if(response.status === 404){
            throw new Error('API Not found');
        } else if (response.status === 500){
            throw new Error('API Server Error');
        } else {
            return response.json();
        }
    })
    .catch(function(err) {
        errorMsgHeadline.innerText = `${response.status} Error`
        apiErrorMsg.innerText = err;
        errorModal.show();
    })
    .then(function(data) {
        if(!data){
            return;
        } else if (data.length === 0) { // i.e., if fetched data is an empty array
            apiErrorMsg.innerText = 'Your search returns no result. Please try again';
            errorModal.show();
            return;
        } else {
            broadSearch250.timestamp = new Date();
            broadSearch250.result = data.results;
            localStorage.setItem('broadSearch250', JSON.stringify(broadSearch250))
        }
        renderSearchResults(broadSearch250.result);
    })
}

// Search results would be limited to the pre-specified filters, including user rating of 7-10, 50,000 as minimum number for votes, and up to 250 search results of latest-release movies of all genres combined.
function searchMoviePlot(normalSearchQuery) {
    if(!broadSearch250.timestamp || dayjs().diff(dayjs(broadSearch250.timestamp), 'day') > 1) { // Fetch new data if localStorage is empty or the existing data on localStorage is older than 1 day
        console.log('fetch new data from API');
        fetch(`https://imdb-api.com/API/AdvancedSearch/k_lyhir636?title_type=feature&user_rating=7.0,10&num_votes=50000,&languages=en&count=250&sort=user_rating,desc`)
            .then(function(response){
                if(response.status === 404){
                    throw new Error('API Not found');
                } else if (response.status === 500){
                    throw new Error('API Server Error');
                } else {
                    return response.json();
                }
            })
            .catch(function(err) {
                errorMsgHeadline.innerText = `${response.status} Error`
                apiErrorMsg.innerText = err;
                errorModal.show();
            })
            .then(function(data) {
                if(!data){
                    return;
                } else if (data.length === 0) { // i.e., if fetched data is an empty array
                    apiErrorMsg.innerText = 'Your search returns no result. Please try again';
                    errorModal.show();
                    return;
                } else {
                    broadSearch250.timestamp = new Date();
                    broadSearch250.result = data.results;
                    localStorage.setItem('broadSearch250', JSON.stringify(broadSearch250))
                }
            })
    }
    // Strings in NormalSearchQuery array are used to search for the same word in movie plot -- str.search('')
    let filterPlotList = [];
    for (let i = 0; i < normalSearchQuery.length; i++) {
        for (let j = 0; j < broadSearch250.result.length; j++) {
            const moviePlot = broadSearch250.result[j].plot;
            if(moviePlot.search(normalSearchQuery[i]) !== -1 ) { // -1 means no match is found
                filterPlotList.push(broadSearch250.result[j])
            }
        }
    }
    console.log(filterPlotList);
    renderSearchResults(filterPlotList);
}

function renderSearchResults(filterPlotList) {
    const loadingSpinner = document.getElementById('loading-spinner');
    
    for (var i = 0; i < filterPlotList.length; i++) {
        let movieId = filterPlotList[i].id;
        let posterImg = filterPlotList[i].image;
        let movieTitle = filterPlotList[i].title;
        let yearRelease = filterPlotList[i].description.trim().slice(1,-1); // remove the bracket from the string
        let runtime = filterPlotList[i].runtimeStr; // returns string, e.g. '120 min'
        let genres = filterPlotList[i].genres;
        let audienceRating = filterPlotList[i].imDbRating;
        let plot = filterPlotList[i].plot;

        let renderPlotSearchResult = `
                                        <div class="col-6 col-lg-4 col-xl-3">
                                            <div class="card shadow-lg my-3 bg-dark">
                                                <img src="${posterImg}" class="card-img-top card-img-resize" alt="...">
                                                <div class="card-body">
                                                    <h5 class="card-title">${movieTitle}</h5>
                                                    <p class="card-text my-1">Year Release: ${yearRelease}</p>
                                                    <p class="card-text my-1">Runtime: ${runtime}</p>
                                                    <p class="card-text my-1">Genre: ${genres}</p>
                                                    <p class="card-text my-1">Audience Rating: ${audienceRating}/10</p>
                                                    <a onclick="playTrailer('${movieId}', '${plot.replace("'", "\\'")}','${movieTitle.replace("'", "\\'")}')" href="#click-trailer" class="btn trailer-btn mt-2">Trailer</a>
                                                    <br>
                                                    <a href="./assets/html/reviews.html?${movieTitle}">
                                                        <button class="btn btn-primary mt-2 reviews-btn border-0">User Reviews</button>
                                                    </a>
                                                </div>
                                            </div>
                                        </div>`
        searchResultContainer.insertAdjacentHTML('beforeend', renderPlotSearchResult);
    }
    loadingSpinner.classList.add('d-none');
}

function playTrailer(movieId, plot, movieTitle) {
    const trailerModal = document.getElementById('trailer-and-plot');
    const enableMovieTrailerModal = new bootstrap.Modal(document.getElementById('trailer-modal'));
    
    fetch(`https://imdb-api.com/en/API/YouTubeTrailer/k_lyhir636/${movieId}`)
    .then(function(response){
        //throw new Error('Test modal');
        if(response.status === 404){
            throw new Error('API Not found');
        } else if (response.status === 500){
            throw new Error('API Server Error');
        } else {
            return response.json();
        }
    })
    .catch(function(err) {
        errorMsgHeadline.innerText = `${response.status} Error`
        apiErrorMsg.innerText = err;
        errorModal.show();
    })
    .then(function(data) {
        if(!data){
            return;
        } else if (data.length === 0) {
            apiErrorMsg.innerText = 'Your search returns no result. Please try again';
            errorModal.show();
            return;
        } else {
            let trailerHTML = `<iframe width="100%" height="500px" src="https://youtube.com/embed/${data.videoUrl.split('?v=')[1]}" alt="Movie Trailer"></iframe>
                                <h4 class="my-2 px-3">${movieTitle}</h4>
                                <p class="my-2 px-3 fw-bold">Plot Summary</p>
                                <p class="px-3 pb-3">${plot}</p>`
            
            trailerModal.innerHTML = trailerHTML;
            enableMovieTrailerModal.show();
            if(enableMovieTrailerModal.hide()){
                console.log('hide trailer modal');
            }
        }
    })
}

// When the trailer modal is closed, stop playing the YouTube video (i.e., by removing the iframe)
$('#trailer-modal').on('hide.bs.modal', function(e) {
    $('#trailer-and-plot').children().remove();
    console.log($('#trailer-and-plot').children());
})

$("#exampleModalCenter").on("hidden.bs.modal", function (e) {
    player.destroy();
  });

function advancedSearchSubmit(advancedParam){

    const minUserRating = advancedParam.userRating[0];
    const maxUserRating = advancedParam.userRating[1];
    const minYear = dayjs(advancedParam.yearRelease[0]).format('YYYY-MM-DD');
    const maxYear = dayjs(advancedParam.yearRelease[1]).format('YYYY-MM-DD')
    const minUserVotes = advancedParam.userVotes[0];
    const maxUserVotes = advancedParam.userVotes[1];
    const genreArray = advancedParam.genre.toString();
    const plotSearchQuery = advancedParam.searchQuery;
    const runtime = advancedParam.duration;

    console.log(genreArray);

    fetch(`https://imdb-api.com/API/AdvancedSearch/k_lyhir636?title_type=feature&user_rating=${minUserRating},${maxUserRating}&release_date=${minYear},${maxYear}&num_votes=${minUserVotes},${maxUserVotes}&genres=${genreArray}&languages=en&count=250&sort=user_rating,desc`)
    .then(function(response){
        if(response.status === 404){
            throw new Error('API Not found');
        } else if (response.status === 500){
            throw new Error('API Server Error');
        } else {
            return response.json();
        }
    })
    .catch(function(err) {
        errorMsgHeadline.innerText = `${response.status} Error`
        apiErrorMsg.innerText = err;
        errorModal.show();
    })
    .then(function(data) {
        if(!data){
            return;
        } else if (data.length === 0) { // i.e., if fetched data is an empty array
            apiErrorMsg.innerText = 'Your search returns no result. Please try again';
            errorModal.show();
            return;
        } else {
            console.log(data)
            // Runtime and plot search filterings are performed after data has been fetched
            // API search on these 2 parameters are either inaccurate or not functioning, hence the following Javascript codes are used to perform the filterings instead.
            if(runtime.length !== 0){
                console.log(data.results);
                let advancedFilterList = [];

                for (var i = 0; i < data.results.length; i++){
                    if(data.results[i].runtimeStr !== null) { // In some data objects, runtimeStr and/or plot value is null. This app is designed to exclude these objects from the advancedFilterList array.
                        let runtimeData = Number(data.results[i].runtimeStr.split(' ')[0]);
                        if(runtimeData >= Number(runtime[0]) && runtimeData <= Number(runtime[1])) {
                            if(plotSearchQuery.length !== 0) {
                                for (var j = 0; j < plotSearchQuery.length; j++) {
                                    if (data.results[i].plot !== null && data.results[i].plot.search(plotSearchQuery[j]) !== -1) {
                                        const foundIndex = advancedFilterList.findIndex((item) => { // This is to prevent duplicates in advancedFilterList array.
                                            return item.id == data.results[i].id;
                                        })
                                        if(foundIndex === -1) {
                                            advancedFilterList.push(data.results[i]);
                                        }
                                    }
                                }
                            } else {
                                console.log('No keyword search.')
                                advancedFilterList.push(data.results[i]);
                            }   
                        }
                    }
                }
                console.log(advancedFilterList);
                renderSearchResults(advancedFilterList);
            }
        }
    })
}

function advancedSearchTextClick() {
    advancedSearchText.addEventListener('click', () => {
        addFilterContainer.classList.toggle('d-none');
        advancedSearchShow = !advancedSearchShow; // when Advanced Search text link is clicked, reverse the boolean status of the variable
    })
}

function renderGenreSelectionBtn() {
    let genres = "Action,Comedy,Family,Sci-Fi,War,Adventure,Fantasy,Horror,Animation,Drama,Romance,Thriller"
    let genresArr = genres.split(','); // convert genres string into an array of substrings, i.e., ["Action", "Comedy", ...]
    
    for (var i = 0; i < genresArr.length; i++) {
        const genreBtnContainer = document.getElementById('genre-selection-btn');
        let genreBtn = `<div class="mb-2 me-2">
                            <input id="genre-btn-${i+1}" data-genre="${genresArr[i]}" type="checkbox">
                            <label class="genre-checkbox" for="genre-btn-${i+1}" class="text-white">${genresArr[i]}</label>
                        </div>`;
        genreBtnContainer.insertAdjacentHTML('beforeend', genreBtn);
    }

}

// Advanced Search - Duration slider rendering
$(document).ready(function() {
    $("#duration-slider-range").slider({
        range: true,
        min: 60,
        max: 300,
        values: [90, 180],
        slide: function( event, ui ) {
          $( "#duration-label" ).html(ui.values[0] + "-" + ui.values[1] + " min");
        }
    });
})

// Advanced Search - User Ratings slider rendering
$(document).ready(function() {
    $( "#user-rating-slider-range" ).slider({
        range: true,
        min: 1,
        step: 0.5,
        max: 10,
        values: [8, 10],
        slide: function( event, ui ) {
          $( "#user-rating-label" ).html(ui.values[0] + " to " + ui.values[1]);
        }
    });
})

// Advanced Search - Year Release slider rendering
$(document).ready(function() {
    $( "#year-release-slider-range" ).slider({
        range: true,
        min: 1940,
        max: dayjs().format('YYYY'),
        values: [2012, dayjs().format('YYYY')],
        slide: function( event, ui ) {
          $( "#year-release-label" ).html(ui.values[0] + " to " + ui.values[1]);
        }
    });
})

// Top-10s dropdown menus

$(".dropdown-toggle").click(function () {
  window.location.href = "./assets/html/Top-10.html";
});

let dropdownMenu = document.querySelector(".dropdown-menu");

$(".dropdown").mouseover(function () {
  dropdownMenu.classList.add("show");
});

$(".dropdown").mouseout(function () {
  dropdownMenu.classList.remove("show");
});

$(".action-dropdown").on("click", function () {
  window.location.href = "./assets/html/Top-10.html" + "?" + "action";
});

$(".romcom-dropdown").on("click", function () {
  window.location.href =
    "./assets/html/Top-10.html" + "?" + "romance" + "?" + "comedy";
});

$(".drama-dropdown").on("click", function () {
  window.location.href = "./assets/html/Top-10.html" + "?" + "drama";
});
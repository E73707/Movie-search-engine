const advancedSearchText = document.getElementById('advanced-search-text');
const addFilterContainer = document.getElementById('add-filter-container');
const filterBox = document.getElementById('filter-render-box');
const searchBtn = document.getElementById('search-button');
const keywordSearchQueryBox = document.getElementById('keyword-search-input');
const searchResultContainer = document.getElementById('search-result-container');
const today = dayjs().format('YYYY-MM-DD');
let broadSearch250 = {}
let advancedSearchShow = false;

init();

function init() {
    loadLocalStore();
    advancedSearchTextClick();
    renderGenreSelectionBtn();
    SearchSubmit();
}

function loadLocalStore() {
    let localStoreBroadSearch250 = JSON.parse(localStorage.getItem('broadSearch250'));
    if (localStoreBroadSearch250 !== null) {
        broadSearch250 = localStoreBroadSearch250;
    }
}

function SearchSubmit() {
    searchBtn.addEventListener('click', () => {
        const rawSearchQuery = keywordSearchQueryBox.value.trim().split(' '); // e.g. gun, war => ['gun', 'war']
        console.log(rawSearchQuery)
        let normalSearchQuery = []; // This is a new array that excludes empty strings
        for (var i = 0; i < rawSearchQuery.length; i++) {
            if(rawSearchQuery[i] !== ' ') { // This conditional statement accounts for possible empty strings, i.e. push only non-empty string
                normalSearchQuery.push(rawSearchQuery[i]);
            }
        }
        
        // TODO: continue working on this
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

            console.log(genresSelected);
            console.log(durationList);
            console.log(userRatingRange);
            console.log(yearReleaseRange);
            
            const advancedParam = {
                searchQuery: normalSearchQuery,
                genre: genresSelected,
                duration: durationList,
                userRating: userRatingRange,
                yearRelease: yearReleaseRange,
                userVotes: '' //TODO: add input value
            }
            advancedSearchSubmit(advancedParam)
        }
        else {
            searchMoviePlot(normalSearchQuery);
        }
    })
}

// Search results would be limited to the pre-specified filters, including user rating of 7-10, 50,000 as minimum number for votes, and up to 250 search results of latest-release movies of all genres combined.
function searchMoviePlot(normalSearchQuery) {
    if(!broadSearch250.timestamp || dayjs().diff(dayjs(broadSearch250.timestamp), 'day') > 1) { // Fetch new data if localStorage is empty or the existing data on localStorage is older than 1 day
        console.log('fetch new data from API');
        fetch(`https://imdb-api.com/API/AdvancedSearch/k_gym6ncv8?title_type=feature&user_rating=7.0,10&num_votes=50000,&count=250&sort=year,desc`)
            .then(function(response){
                if(response.status === 404){
                    throw new Error('API Not found');
                } else if (response.status ===500){
                    throw new Error('API Server Error');
                } else {
                    return response.json();
                }
            })
            .catch(function(err) {
                alert(err); // TODO: change to modal alert box
            })
            .then(function(data) {
                if(!data){
                    return;
                } else if (data.length === 0) { // i.e., if fetched data is an empty array
                    alert('Your search returns no result. Please try again'); // TODO: change to modal alert box
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
    renderNormalSearch(filterPlotList);
}

function renderNormalSearch(filterPlotList) {
    for (var i = 0; i < filterPlotList.length; i++) {
        let posterImg = filterPlotList[i].image;
        let movieTitle = filterPlotList[i].title;
        let yearRelease = filterPlotList[i].description.trim().slice(1,-1); // remove the bracket from the string
        let runtime = filterPlotList[i].runtimeStr; // returns string, e.g. '120 min'
        let genres = filterPlotList[i].genres;
        let audienceRating = filterPlotList[i].imDbRating;
        let plot = filterPlotList[i].plot; // TODO: apply Bootstrap collapse here
        let renderPlotSearchResult = `<div class="card mx-3 my-3 bg-dark" style="width: 18rem;">
                                                <img src="${posterImg}" class="card-img-top" alt="...">
                                                <div class="card-body">
                                                    <h5 class="card-title">${movieTitle}</h5>
                                                    <p class="card-text my-1">Year Release: ${yearRelease}</p>
                                                    <p class="card-text my-1">Runtime: ${runtime}</p>
                                                    <p class="card-text my-1">Genre: ${genres}</p>
                                                    <p class="card-text my-1">Audience Rating: ${audienceRating}/10</p>
                                                    <a href="#" class="btn btn-primary mt-2">Play Trailer</a>
                                                </div>
                                            </div>`
        searchResultContainer.insertAdjacentHTML('beforeend', renderPlotSearchResult);
    }
    // button link -- to open popup modal + use YouTube API to play trailer
}

// https://imdb-api.com/API/AdvancedSearch/k_gym6ncv8?title_type=feature&user_rating=7.0,10&release_date=1980-01-01,2022-01-01&num_votes=50000,&genres=comedy,romance

function advancedSearchSubmit(advancedParam){

    let minUserRating = advancedParam.userRating[0];
    let maxUserRating = advancedParam.userRating[1];
    let minYear = dayjs(advancedParam.yearRelease[0]).format('YYYY-MM-DD');
    let maxYear = dayjs(advancedParam.yearRelease[1]).format('YYYY-MM-DD');
    let minUserVotes = advancedParam.userVotes[0];
    let maxUserVotes = advancedParam.userVotes[1]; // how to define the max value?
    let genreArray = advancedParam.genre.toString();
    let plotSearch = advancedParam.searchQuery; // it seems that IMDB only searches the movie title, but not the plot
    let runtime = advancedParam.duration;

    console.log(minUserRating)
    console.log(maxUserRating)
    console.log(minYear)
    console.log(maxYear)
    console.log(genreArray)
    console.log(plotSearch)
    console.log(runtime)

    // fetch(`https://imdb-api.com/API/AdvancedSearch/k_gym6ncv8?title_type=feature&user_rating=${minUserRating},${maxUserRating}&release_date=${minYear},${maxYear}&num_votes=${minUserVotes},${maxUserVotes}&genres=${genreArray}`)
    // .then(function(response){
    //     if(response.status === 404){
    //         throw new Error('API Not found');
    //     } else if (response.status === 500){
    //         throw new Error('API Server Error');
    //     } else {
    //         return response.json();
    //     }
    // })
    // .catch(function(err) {
    //     alert(err); // to change to modal alert box
    // })
    // .then(function(data) {
    //     if(!data){
    //         return;
    //     } else if (data.length === 0) { // i.e., if fetched data is an empty array
    //         alert('Your search returns no result. Please try again'); // TODO: change to modal alert box
    //         return;
    //     } else {
    //         console.log(data)
    //         // to apply runtime and plotSearch here after data has been fetched
    //         if(runtime.length !== 0){

    //             var filterRuntime = []; // is this the right place to put this variable?
    //             var advancedFilterList = []; // is this the right place to put this variable?

    //             for (var i = 0; i < data.length; i++){
    //                 let minRuntimeData = data.results[i].runtimeStr.split(' ')[0];
    //                 let maxRuntimeData = data.results[i].runtimeStr.split(' ')[1];
    //                 if(minRuntimeData >= runtime[0] && maxRuntimeData <= runtime[1]) {
    //                     filterRuntime.push(result[i]);
    //                 }

    //             if(plotSearch.length !== 0) {
    //                 for (var j = 0; j < plotSearch.length; j++) {
    //                     for (var k = 0; k < filterRuntime.length; k++) {
    //                         let moviePlotAdvanced = filterRuntime.results[k].plot;
    //                         if (moviePlotAdvanced.search(plotSearch[i]) !== -1) {
    //                             advancedFilterList.push(plotSearch[i]);
    //                         }
    //                     }
    //                 }
    //             }
    //             }
    //         }
    //     }
    // })
}

function renderAdvancedSearch(){
    
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
        slide: function( event, ui ) { // is event necessary here?
          $( "#duration-label" ).html(ui.values[0] + " - " + ui.values[1] + "min");
        }
    });
})

// Advanced Search - User Ratings slider rendering
$(document).ready(function() {
    $( "#user-rating-slider-range" ).slider({
        range: true,
        min: 1,
        max: 10,
        values: [8, 10],
        slide: function( event, ui ) { // is event necessary here?
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
        slide: function( event, ui ) { // is event necessary here?
          $( "#year-release-label" ).html(ui.values[0] + " to " + ui.values[1]);
        }
    });
})

// Advanced Search - Min User Votes slider rendering -- TODO: how best to define max value?
$(function() {
    $( "#min-user-votes-slider-range-max" ).slider({
      range: "max",
      min: 0,
      max: 1000000, // what should the max value be?
      value: 50000,
      slide: function( event, ui ) {
        $( "#amount" ).val( ui.value );
      }
    });
    $( "#amount" ).val( $( "#min-user-votes-slider-range-max" ).slider( "value" ) );
  } );

  // Autoscroll to search results container -- TODO: this is still not working
$('#search_button').click(function () {
var offset = $(searchResultContainer).offset().top;
$('html,body').animate({
    scrollTop: offset
}, 100);
});

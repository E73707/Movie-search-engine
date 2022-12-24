const advancedSearchText = document.getElementById('advanced-search-text');
const addFilterContainer = document.getElementById('add-filter-container');
const filterBox = document.getElementById('filter-render-box');

init();

function init() {
    advancedSearchTextClick();
    renderFilterBox();
}

function advancedSearchTextClick() {
    advancedSearchText.addEventListener('click', () => {
        addFilterContainer.classList.toggle('d-none');
    })
}

function renderFilterBox() {

    // Is this how the API data should look like for the planned filter function?
    let filter = {
            Genre: ["a","b","c"], // to get data from API
            Duration: [1,2,3], // to get data from API
            Rating: [1,2,3,4,5] // to get data from API
        };

        // let filter2 = 
        // [
        //     {
        //         Genre: ["a","b","c"], // to get data from API
        //         Duration: [1,2,3], // to get data from API
        //         Rating: [1,2,3,4,5] // to get data from API
        //     },
        //     {
        //         Genre: ["a","b","c"], // to get data from API
        //         Duration: [4,5,6], // to get data from API
        //         Rating: [1,2,3,4,5] // to get data from API
        //     }
        // ]

    // for(let i=0; i<filter2.length; i++) { // 2
    //     for(let j=0; j<filter2[i].Duration.length; j++) { // 3
    //         console.log(filter2[i].Duration[j]);
    //     }
    // }

    let filterDropdown = ``;
    for(key in filter) {
        filterDropdown += `<li><a class="dropdown-item" href="#"}">${key}</a></li>`;
    }

    let filterOption = `<button class="filter-option-btn mx-1">option</button>`;

    let filterBoxHTML = `<div class="row px-2 py-2">
                            <div class="col-12 d-flex px-0">
                                <div class="dropdown">
                                    <button class="filter-btn dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                    Choose Filter
                                    </button>
                                    <ul id="filter-dropdown-menu" class="dropdown-menu">
                                        ${filterDropdown}
                                    </ul>
                                </div>
                                <div class="mx-3">

                                </div>
                            </div>
                        </div>`;

    filterBox.insertAdjacentHTML('afterbegin', filterBoxHTML);
    addMoreFilterListener();
    // How to limit the number of times a filter box can be created to the number of available filter keys?
}

function addMoreFilterListener() {
    const addMoreFilterLink = document.getElementById('add-filter-text-link');
    addMoreFilterLink.addEventListener('click',renderFilterBox);
}
# whattowatch.fun - Movie Search Engine Simplified
If you've frequently spent more time that you're supposed to (e.g. half an hour or more) browsing through movie selections on NetFlix, Binge, or any other video streaming services, and still can't decide what exactly you want to watch, you're not alone. While existing movie search websites, such as imdb.com also provides advanced search functionality, their extensive search filter options can be quite overwhelming and time-consuming as users have to decide what search parameters actually matter to them. whattowatch.fun aims to provide a more simplified movie search solution that limit the number of search parameters to the ones that matter the most to general audience, including movie plot, genre, runtime, year release, and user votes. Presets of filter search, such as Top 10s and Trending movies are also provided for even quicker search.

## Table of Contents
- URLs
- User Story
- Technologies
- APIs
- Webpages, Key Features, Usage, and Limitations
- Directions for Future Development
- Credits

## URLs
- [Deployed Application URL](url)
- [GitHub Repository URL](https://github.com/E73707/Movie-search-engine)

## User Story


## Technologies
whattowatch.fun is created with the following web technologies:
- HTML
- CSS
- Bootstrap
- JavaScript
- jQuery
- Day.js
- localStorage client-side storage

## APIs
- imdb-api.com
- api.themoviedb.org
- youtube.googleapis.com

## Webpages, Key Features, Usage, and Limitations

--------------------------------------------------------

### **1. Homepage (index.html)**
The homepage is divided mainly into 3 sections:
- Navigation Bar, which is also used in every other page
- Search container
- Init / Search Results Container

Only IMDB API is used to fetch data on the homepage.

Homepage is 100% responsive.

#### **i. Navigation Bar**
The navigation bar consists of the following elements:

- Logo image -- the image is linked to index.html

- "Home" menu -- this text menu is also linked to index.html (Note: it might not be 100% intuitive to every user that clicking the logo image is also linked to index.html, hence the text link is also included)

- "Top 10s" menu -- this dropdown menu is linked to Top-10.html page where users can search for Top 10 Movies according to their genre preference

- "Trending" menu -- this text menu is linked to trending.html page where users can search for trending movies according to...

- "Reviews" menu -- this text menu is linked to reviews.html page where users can search for movie reviews of their movie of choice

<p align="left">
    <img src="./assets/img/readme/homepage-navbar-search-1400px-xxl.jpg">
</p>

#### **ii. Search Bar for Simple Search**
Without clicking on the 'Advanced Search' text, any keyword(s) that a user enters into a query field (followed by clicking on the search button i.e., submit search query) would be used to search for the same word in movie plots and return only the movies with keyword match.

As IMDB AdvancedSearch API doesn't seem to fetch accurate data when it comes to keyword search, the following step-by-step workaround is deployed instead.

**Step 1: Reformat the search query** - Taking into account of the possibility of extra space, comma, and period anywhere within a search query string, it is necessary to reformat the string with replace(), trim(), and split() as shown on Line 34 in script.js file. The original search query string would then be converted to a new array of strings.

**Step 2: Push only a non-empty string into normalSearchQuery array and send the array to searchMoviePlot function** - Only non-empty strings are useful in keyword search, and this is achieved by the use of conditional statement on Line 42-43 in script.js file.

**Step 3: Fetch API data and finish the search** -- where IMDB AdvancedSearch API data is fetched with some preset parameters, including only newest movies with user rating between 7 to 10 and minimum user votes of 50,000. Not knowing for certain how big the fetched data would be, the fetched data is limited to only 250 objects. 

These 250 data objects would also be stored in localStorage and would be refetched daily.

**Limitations:** 
In reality, the simple search shouldn't be limited to just 250 data objects, as this could significantly limit the amount the search results. With more time and better documentation, manipulating the IMDB AdvancedSearch API could have been performed more efficiently. Nevertheless, there's a merit to saving these objects to localStorage. By doing so, it siginificantly saves the amount of API calls, which IMDB caps maximum free calls to just 100 calls daily. This is deemed an interesting use of localStorage, hence the codes stay for the time being.

<p align="left">
    <img src="./assets/img/readme/homepage-advanced-search-1400px-xxl.jpg">
</p>

#### **iii. Advanced Search**


#### **iv. Search Results**

- play trailer
- reviews

--------------------------------------------------------
### **2. Top-10s (Top-10.html)**

--------------------------------------------------------
### **3. Trending (trending.html)**

--------------------------------------------------------
### **4. Reviews (reviews.html)**

--------------------------------------------------------
## Directions for Future Development

--------------------------------------------------------
**Credits (Alphabetical Order):**
Eddie Vaughan
Majid Pourkazemi
Piyawit Teeraprasert
Siyu Liu

var fetchButton = document.getElementById('fetch-button');

function getData(){
    var listContainer = document.getElementById('myList');


const options = {
	method: 'GET',
	headers: {
		'X-RapidAPI-Key': 'bc7e29e13bmshe688e2909971150p133d2bjsn5015b707eccc',
		'X-RapidAPI-Host': 'moviesdatabase.p.rapidapi.com'
	}
};

fetch('https://moviesdatabase.p.rapidapi.com/titles/x/upcoming?limit=15&page=1', options)
	.then(response => response.json())

	.then(data => {
       
        for (var i=0;i<data.entries;i++){
            const titleList=data.results[i].titleText.text;
            var titleName = document.createElement('h5');
            titleName.textContent = titleList;

            const releaseYearList=data.results[i].releaseDate.year
            var releaseYear = document.createElement('div');            
            releaseYear.textContent=releaseYearList          
            
            console.log(releaseYear);
            console.log(titleName)
            
            listContainer.append(titleName);
            listContainer.append(releaseYear);
            var breakLine= document.createElement('hr');
            listContainer.append(breakLine);
        }
        
       
    } )       

	.catch(err => console.error(err));

}

fetchButton.addEventListener('click', getData);














   





const apiKey="api_key=91b39c1bd8dea675bab9c45a329fcfe9"

const baseUrl="https://api.themoviedb.org/3/"

var apiUrl=baseUrl+"trending/movie/day?"+apiKey

const imageUrl="https://image.tmdb.org/t/p/w500"
var dayUrl="https://api.themoviedb.org/3/trending/all/day?api_key=91b39c1bd8dea675bab9c45a329fcfe9"
var weekUrl="https://api.themoviedb.org/3/trending/all/week?api_key=91b39c1bd8dea675bab9c45a329fcfe9"

var selectedUrl=apiUrl;

const container=document.getElementById('movie')
var fetchButton = document.getElementById('fetch-button');



var error=true
var selectEl =document.getElementById("format-input");
selectEl.addEventListener("change",()=>{
  error=false
 if(selectEl.value=="day"){
  console.log("daily")
  selectedUrl=dayUrl;  
 }
 else if(selectEl.value=="week"){
  console.log("weekly")
  selectedUrl=weekUrl;  
 }    
 else{
  error=true 
  container.innerHTML="";  
 } 
})



const alertPlaceholder = document.getElementById('liveAlertPlaceholder')

const alert = (message, type) => {
  const wrapper = document.createElement('div')
  wrapper.innerHTML = [
    `<div class="alert alert-${type} alert-dismissible" role="alert">`,
    `   <div>${message}</div>`,
    '</div>'
  ].join('')

  alertPlaceholder.append(wrapper)
  $(".alert-dismissible").fadeTo(2000, 500).slideUp(500, function(){
    $(".alert-dismissible").alert('close');
});
  
}

const alertTrigger = document.getElementById('liveAlertBtn')






function getData(){
    if(error){
        if (alertTrigger) {
            alert('Please select one of the options!', 'danger')
        }
        return;
      }
  fetch(selectedUrl).then(resp => resp.json()).then(data =>{
    console.log(data.results)
    showMovies(data.results);
  })
}

function showMovies(data){
    container.innerHTML='';
    data.forEach(element => {
        var{title,poster_path,overview,name}=element;
        console.log(element.name)
        if(!element.title){
            title=element.name
        }
        var movieEl=document.createElement('div');
        movieEl.classList.add('col');
        movieEl.classList.add('d-flex')
        
        movieEl.innerHTML=` 

    
        <div class="card d-flex">
            <img src="${imageUrl+poster_path}" class="card-img-top" alt="${title}">
            <div class="movie-info" class="card-body">
            <h5 class="card-title">${title}</h5>
            <p class="overview" class="card-text">${overview}</p>           
            </div>
        </div>
   
        `
        container.appendChild(movieEl);

    });

}


fetchButton.addEventListener('click',getData)

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
  window.location.href = "Top-10.html" + "?" + "action";
});

$(".romcom-dropdown").on("click", function () {
  window.location.href = "Top-10.html" + "?" + "romance" + "?" + "comedy";
});

$(".drama-dropdown").on("click", function () {
  window.location.href = "Top-10.html" + "?" + "drama";
});
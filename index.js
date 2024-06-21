const userTab = document.querySelector("[data-userWeather]");
const searchTab = document.querySelector("[data-searchWeather]");

const userContainer = document.querySelector(".weather-container");
const grantAccessContainer = document.querySelector(".grant-location-container");
const searchForm = document.querySelector("[data-searchForm]");

const loadingScreen = document.querySelector(".loading-container");
const userInfoContainer = document.querySelector(".user-info-container");

// inital variables needed

let oldTab = userTab;
const API_KEY = "a5916cd17e33ce39c1f7e0113ade9c9c";
oldTab.classList.add("current-tab");

getfromSessionStorage();


function switchTab(newTab){
    if(newTab != oldTab){
        oldTab.classList.remove("current-tab");
        oldTab= newTab;
        oldTab.classList.add("current-tab");

        if(!searchForm.classList.contains("active")){
            // checking if searcg form is invisible , if yes then make it visible
            userInfoContainer.classList.remove("active");
            grantAccessContainer.classList.remove("active");
            searchForm.classList.add("active");

        }
        else{
            // main pehle search vale tab pr tha, ab ur weather tab visivble krna pdega
            searchForm.classList.remove("active");
            userInfoContainer.classList.remove("active");
            // ab main ur weather tb me aa gya hun , toh weather bhi display krna pdega ,so lets check local storage first for coorodiantes , if we have saved them there
            getfromSessionStorage();
        }
    }
}

userTab.addEventListener("click", () => {
    // pass cliecked tab as input parameter
    switchTab(userTab)
});

searchTab.addEventListener("click", () => {
    // pass cliecked tab as inout parameter
    switchTab(searchTab);
});

// this functioncheck if this coordinate is present in sessions storage
function getfromSessionStorage() {

    const localCoordinates  = sessionStorage.getItem("user-coordinates");
    if(!localCoordinates){
        // agar local cooridntaes nahi mile 
        grantAccessContainer.classList.add("active");
    }
    else{
        const coordinates = JSON.parse(localCoordinates);
        fetchUserWeatherInfo(coordinates);
    }

}



async function fetchUserWeatherInfo(coordinates) {
    const {lat, lon} = coordinates;
    // make grant container invisible 
    grantAccessContainer.classList.remove("active");

    // make loader visible
    loadingScreen.classList.add("active");

    // api call
    try{
        const response  = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}`);

        const data  =  await response.json();

        loadingScreen.classList.remove("active");

        userInfoContainer.classList.add("active");

        renderWeatherInfo(data);

    }

    catch(err){

        loadingScreen.classList.remove("active");



    }
}


function renderWeatherInfo(weatherInfo){

    // first fetch the elements
    const cityName = document.querySelector("[data-cityName]");
    const countryIcon  =document.querySelector("[data-countryIcon]");
    const desc = document.querySelector("[data-weatherDesc]");
    const weatherIcon = document.querySelector("[data-weatherIcon]");
    const temp = document.querySelector("[data-temp]");
    const windspeeed  = document.querySelector("[data-windspeed]");
    const humidity = document.querySelector("[data-humidity]");
    const cloudiness  = document.querySelector("[data-cloudiness]");


    // fetch values from weatherInfo object and put it in UI element
    cityName.innerText = weatherInfo?.name;
    countryIcon.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
    desc.innerText = weatherInfo?.weather?.[0]?.description;
    weatherIcon.src = `http://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
    temp.innerText = weatherInfo?.main?.temp;
    windspeeed.innerText = weatherInfo?.wind?.speed;
    humidity.innerText = weatherInfo?.main?.humidity;
    cloudiness.innerText = weatherInfo?.clouds?.all;

}

function getLocation(){
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(showPosition);

    }
    else{
        alert("no geolocation support available");

    }


}

function showPosition(position){

    const userCoordinates  = {
        lat : position.coords.latitude,
        lon : position.coords.longitude
    }

    sessionStorage.setItem("user-coordinates", JSON.stringify(userCoordinates));
    fetchUserWeatherInfo(userCoordinates);



}





const grantAccessButton = document.querySelector("[data-grantAccess]");
grantAccessButton.addEventListener("click", getLocation);

const searchInput  = document.querySelector("[data-searchInput]");
searchForm.addEventListener("submit" , (e) => {
    e.preventDefault();

    let cityName = searchInput.value;

    if(cityName == ""){
        return;
    }
    else{
        fetchSearchWeatherInfo(cityName);
    }
})

async function fetchSearchWeatherInfo(city){

    loadingScreen.classList.add("active");
    userInfoContainer.classList.remove("active");
    grantAccessContainer.classList.remove("active");

    try{
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
        );

        const data = await response.json();
        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        renderWeatherInfo(data);



    }
    catch(err){
        
    }

}
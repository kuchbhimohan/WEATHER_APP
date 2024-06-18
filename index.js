console.log("helllo bhai kaise ho ?");


const API_key = "a5916cd17e33ce39c1f7e0113ade9c9c"
async function fetchWeatherDetails() {

    try{
        let city_name = "kanpur";
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city_name}&appid=${API_key}`);
    
        const data = await response.json();
    
        console.log("Weather data: -> " , data);


        // let newPara = document.createElement('p');
        // newPara.textContent = `${data?.main?.temp.toFixed(2)} *C`;
        // document.body.appendChild(newPara);

    }
    catch(err){

    

    }



}
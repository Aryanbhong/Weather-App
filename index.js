console.log('love you mahi');
const usertab = document.querySelector("[data-userWeather]");
const searchtab = document.querySelector("[data-searchWeather]");
const userContainer = document.querySelector(".weather-container");

const grantlocation = document.querySelector(".grant-location-container");
const searchform = document.querySelector("[ data-searchform]");
const loadingscreen = document.querySelector(".loading-container");
const userInfoContainer = document.querySelector(".user-info-container");
const api_key ="490b9b4c19c6d218d524f5745835adc6";


let currentab = usertab;
currentab.classList.add("current-tab");
getfromsessionstorage();
//ek kam pending hai
usertab.addEventListener("click",()=>{
    //passing the clicked tab as input parameter
    switchTab(usertab);
});
searchtab.addEventListener("click",()=>{
    //passing the clicked tab as input parameter
    switchTab(searchtab);
});


function switchTab(newTab){
if(newTab!=currentab){
    currentab.classList.remove("current-tab");
    currentab = newTab;
    currentab.classList.add("current-tab");

    if(!searchform.classList.contains("active")){
        userInfoContainer.classList.remove("active");
        grantlocation.classList.remove("active");
        searchform.classList.add("active");
    }else{
        searchform.classList.remove("active");
        userInfoContainer.classList.remove("actve");
        getfromsessionstorage();
    }
}
}

// async function showWeather(){
//     try{
//         let city = "goa";

//     const response =  await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${api_key}`);

//     const data = await response.json();
//     console.log("weather data -> ", data);

//     let newpara = document.createElement('p');
//     newpara.textContent =`${data?.main?.temp.toFixed(2)} °c`;

//     document.body.appendChild(newpara);
//     renderweather(data);
//     }
//     catch(error){
//      console.log('error found ' ,error);
//     }
    
// }

// function getLocation(){
//     if(navigator.geolocation){
//         navigator.geolocation.getCurrentPosition(showPosition);
//     }else{
//         console.log("no geolocation supported");
//     }
// }
// function showPosition(position){
// let lat = position.coords.latitude;
// let longi = position.coords.longitude;

// console.log(lat);
// console.log(longi);
// }


//check karega if coordinates are already present in session storge
function getfromsessionstorage(){
    const localCoordinates =sessionStorage.getItem("user-coordinates");
    if(!localCoordinates){
        // agr local coordinates nhi mile 
        grantlocation.classList.add("active");
    }else{
        const coordinates= JSON.parse(localCoordinates);
        fetchUserWeather(coordinates);
    }

}

async function fetchUserWeather(coordinates){
 const {lat,long} = coordinates;
 // make grantlocation invisible
 grantlocation.classList.remove("active");
// make loader visible
 loadingscreen.classList.add("active");

 // api call
 try{
   const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=${api_key}`);
   const data = await res.json();
   
   loadingscreen.classList.remove("active");
   userInfoContainer.classList.add("active");
   renderweatherinfo();
 }
 catch(err){
 loadingscreen.classList.remove("active");
 }
}

function renderweatherinfo(weatherInfo){
    // firstly we have to fetch the elements

    const cityName = document.querySelector("[data-cityname]");
    const countryicon = document.querySelector("[data-countryicon]");
    const desc = document.querySelector("[data-weatherDesc]");
    const weatherIcon = document.querySelector("[data-weatherIcon]");
    const temp = document.querySelector("[data-temp]");
    const windspeed = document.querySelector("[data-windspeed]");
    const humidity = document.querySelector("[data-humidity]");
    const cloudness = document.querySelector("[data-cloudiness]");
    console.log(weatherInfo);

    //fetch values from weatherinfo object and put it in ui elements

    cityName.innerText= weatherInfo?.name;
    countryicon.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
    desc.innerText = weatherInfo?.weather?.[0]?.description;
    weatherIcon.src =`http://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
    temp.innerText =`${weatherInfo?.main?.temp} °C`;
    windspeed.innerText=`${weatherInfo?.wind?.speed} m/s`;
    humidity.innerText= `${weatherInfo?.main?.humidity}%`;
    cloudness.innerText = `${weatherInfo?.clouds?.all}%`;
}

function getLocation(){
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(showPosition);
    }else{

    }
}

const grantAccessButton =  document.querySelector("[data-grantAccess]");
grantAccessButton.addEventListener("click",getLocation);

function showPosition(position){
    
    const userCoordinates={
        lat: position.coords.latitude,
        lon: position.coords.longitude,
    }

    sessionStorage.setItem("user-coordinates",JSON.stringify(userCoordinates));
    fetchUserWeather(userCoordinates);
    }

     
const searchInput = document.querySelector("[data-searchInput]");

searchform.addEventListener("submit",(e)=>{
    e.preventDefault();
    let cityName= searchInput.value;

    if(cityName==="")
        return;
    else 
      fetchUserWeather(cityName);
    
})

async function fetchUserWeather(city){
    loadingscreen.classList.add("active");
    userInfoContainer.classList.remove("active");
    grantAccessButton.classList.remove("active");

    try{
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${api_key}`);
        const data = await response.json();
        loadingscreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        renderweatherinfo(data);

    }catch(err){
    
    }
}
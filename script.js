const userTab=document.querySelector("[data-userWeather]");

const searchTab=document.querySelector("[data-searchWeather]");

const userContainer=document.querySelector(".weather-container");

const grantAccessContainer=document.querySelector(".grant-location-container");

const searchForm=document.querySelector("[data-searchForm]");

const loadingScreen=document.querySelector(".loading-container");

const userInfoContainer=document.querySelector(".user-info-container");

let currentTab=userTab;

const API_KEY="26d9e12302633b74ac8a32bf306125e1";

currentTab.classList.add("current-tab");

getfromSessionStorage();

let errors=document.createElement("div");

   let para=document.createElement("p");
   para.innerHTML="404 City Not Found";
   para.style.cssText="font-size:50px;color:white"

   let saau=document.createElement('img');
   saau.setAttribute("src","./assets/not-found.png");
   saau.style.cssText="width:15rem;";

   errors.appendChild(para);
   errors.appendChild(saau);


function switchTab(clickedTab)
{
    if(clickedTab!==currentTab)
    {
        currentTab.classList.remove("current-tab");
        currentTab=clickedTab;
        currentTab.classList.add("current-tab");

        if(!searchForm.classList.contains("active"))
        {
            userInfoContainer.classList.remove("active");
            grantAccessContainer.classList.remove("active");
            searchForm.classList.add("active");
        }
        else
        {
            searchForm.classList.remove("active");
            userInfoContainer.classList.remove("active");

            getfromSessionStorage();
        }
    }
}

userTab.addEventListener("click",()=>{

    document.body.lastChild.style.cssText="display:none";
    switchTab(userTab);
}
);

searchTab.addEventListener("click",()=>{

    switchTab(searchTab);
}
);


function getfromSessionStorage()
{
    const localCoordinates=sessionStorage.getItem("user-coodinates");
    if(!localCoordinates){
        grantAccessContainer.classList.add("active");
    }
    else
    {
        const cordinates=JSON.parse(localCoordinates);
        fetchUsWeather(cordinates);
    }
}

async function fetchUsWeather(coordinates)
{
    const {lat,lon}=coordinates; 
    grantAccessContainer.classList.remove("active");
    loadingScreen.classList.add("active");
    try
    {
        const response=await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}`);

        const data=await response.json();

        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        renderWeatherInfo(data);
    }
    catch(err)
    {
        loadingScreen.classList.remove("active");
        userInfoContainer.classList.remove("active");

        // userInfoContainer.innerHTML.style.cssText="background-image:url(./assets/not-found.png)";
    }
}

function renderWeatherInfo(weatherInfo)
{

   const cityName=document.querySelector("[data-cityName]");
   const countryIcon=document.querySelector("[data-countryIcon]");
   const desc=document.querySelector("[data-weatherDesc]");
   const weatherIcon=document.querySelector("[data-weatherIcon]");
   const temp=document.querySelector("[data-temp]");
   const windspeed=document.querySelector("[data-windspeed]");
   const humidity=document.querySelector("[data-humidity]");
   const cloudiness=document.querySelector("[data-cloudiness]");

   
   if(weatherInfo.cod==='404' && currentTab==searchTab)
   {
    userInfoContainer.classList.remove("active");
    
    errors.style.cssText="display:flex;flex-direction:column;justify-content:center;align-items:center;position:absolute;top:40%;right:38%";

    document.body.appendChild(errors);
   }
    else if(currentTab==searchTab && weatherInfo.cod!=='404')
        document.body.lastChild.style.cssText="display:none";
    
    else{
        
        userInfoContainer.classList.add("active");
        cityName.innerText=weatherInfo?.name;
        desc.innerText=weatherInfo?.weather?.[0]?.description;
        temp.innerText=`${weatherInfo?.main?.temp} °C`;
        windspeed.innerText=`${weatherInfo?.wind?.speed} m/s`;
        humidity.innerText=`${weatherInfo?.main?.humidity} %`;
        cloudiness.innerText=`${weatherInfo?.clouds?.all} %`;
        countryIcon.src=`https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
        weatherIcon.src=`http://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`; 
    }
       

    

   

}

function getLocation()
{
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(showPosition);
    }
    else{
        
             loadingScreen.classList.remove("active");
                 userInfoContainer.classList.remove("active");
                 userInfoContainer.innerHTML.style.cssText="background-image:url(./assets/not-found.png)";
            
    }
}

function showPosition(position)
{
    const userCoordinates={
        lat:position.coords.latitude,
        lon:position.coords.longitude,
    }

    sessionStorage.setItem("user-coodinates",JSON.stringify(userCoordinates));

    fetchUsWeather(userCoordinates);
}

const grantAccessButton = document.querySelector("[data-grantAccess]");

grantAccessButton.addEventListener("click",getLocation);

const searchInput=document.querySelector("[data-searchInput");

searchForm.addEventListener("submit",(e)=>
{
    e.preventDefault();
    let cityName=searchInput.value;

    if(cityName=="") 
        return;
    else
        fetchSearchWeather(cityName);
});

async function fetchSearchWeather(city)
{
    loadingScreen.classList.add("active");
    userInfoContainer.classList.remove("active");
    grantAccessContainer.classList.remove("active");
    
    try{
        const response=await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
        const data =await response.json();
        

            loadingScreen.classList.remove("active");
            userInfoContainer.classList.add("active");
            renderWeatherInfo(data);
    }
    catch(e)
    {
        // loadingScreen.classList.remove("active");
        // userInfoContainer.classList.remove("active");
        // userInfoContainer.style.cssText="background-image:url(./assets/not-found.png)";
    }
}
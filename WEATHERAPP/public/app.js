
const view = document.querySelector(".view");
const viewSvg = document.querySelector(".svg");
const search = document.querySelector("svg");
const viewMoreBox = document.querySelector(".info-card");
const time = document.querySelector(".time");
const date = document.querySelector(".date");
const viewLess = document.querySelector(".less");

let currTime = () => {
    let currDate = new Date();
    let localTime = currDate.toLocaleTimeString();
    time.innerHTML = localTime;
};

let currDay = () => {
    let day = new Date();
    let options = {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    };
    let today = day.toLocaleDateString('en-US', options);
    date.innerHTML = today;
};

currDay();

setInterval(currTime, 1000);

view.addEventListener("click", ()=>{
    viewSvg.classList.toggle("rotate");
    viewMoreBox.classList.toggle("visible");
    view.classList.toggle("less");
    if(view.classList.contains("less")){
        view.innerHTML = "View Less";
    }else{
        view.innerHTML = "View More";
    }
});

viewSvg.addEventListener("click", ()=>{
    viewSvg.classList.toggle("rotate");
    viewMoreBox.classList.toggle("visible");
    view.classList.toggle("less");
    if(view.classList.contains("less")){
        view.innerHTML = "View Less";
    } else{
        view.innerHTML = "View More";
    }
});

// app.js

// Function to fetch and display search history
async function fetchSearchHistory() {
    const response = await fetch('/search-history');
    const searchHistory = await response.json();
    const searchHistoryList = document.getElementById('searchHistoryList');
    
    // Clear existing search history items
    searchHistoryList.innerHTML = '';

    // Iterate through search history and create list items
    searchHistory.forEach(item => {
        const listItem = document.createElement('li');
        listItem.textContent = `${item.location} - ${item.temperature}°C - ${item.description}`;
        searchHistoryList.appendChild(listItem);
    });
}

// Call fetchSearchHistory function when page loads
window.addEventListener('load', fetchSearchHistory);





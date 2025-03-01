let getChosenEvent = () => {
    //The url parameters passed from the home page is saved as chosenEvent
    const queryString = window.location.search;         //the whole url is saved as queryString
    const urlParams = new URLSearchParams(queryString)  //URLSearchParams looks for ? and divides into parameters
    return urlParams.get('page'); //.get looks for a specific parameter and saves it as chosenEvent
}

//Menu control
document.getElementById("openMenu").addEventListener("click", () => {
    document.querySelector(".dropdownContent").classList.toggle("open");
});
document.getElementById("closeMenu").addEventListener("click", () => {
    document.querySelector(".dropdownContent").classList.toggle("open");
});

let prettifyEventName;
let createAboutEventPage = () => { //A switch case to change between the events
    console.log(getChosenEvent())
    switch (getChosenEvent()) {
        case "Hajj": 
            prettifyEventName = "Hajj"; //name of event
            document.getElementById("aboutHajj").style.display = "block"; //Text on the page
            document.getElementById("hajjPicture").style.display = "block"; //Picture on the page
            break;
        case "Love Parade":
            prettifyEventName = "Love Parade"; //name of event
            document.getElementById("aboutLoveParade").style.display = "block"; //Text on the page
            document.getElementById("loveParadePicture").style.display = "block"; //Picture on the page
            break;
        case "Itaewon":
            prettifyEventName = "Itaewon"; //name of event
            document.getElementById("aboutItaewon").style.display = "block"; //Text on the page
            document.getElementById("itaewonPicture").style.display = "block"; //Picture on the page
            break;
    }
}
createAboutEventPage();

let text = document.createElement("p")
    //A dynamic header is created with the proper name for the subpage
    let header = document.createElement("h1")
    header.textContent = prettifyEventName
    document.getElementById("text").prepend(header) //The header is inserted as the first element in the section "menu"
import {simulationData, simulationHTML} from "./simulation.js";
export {hideSimButtons, getPeopleInput, startTimer, stopTimer, createSimulationPage}

//Depending on chosenEvent some variables are assigned using a switch case
let sanitizePeopleInput = () => {
    let value = Math.round(simulationHTML.peopleNumberInput.value);
    simulationHTML.peopleSliderInput.value = value;
    simulationHTML.peopleNumberInput.value = value;
}


let createSimulationPage = () => {
    /**
     * Small things, which ensures what is written is dynamic
     */
    let prettifyEventName, eventText, maxPeople;
    switch (simulationData.chosenEvent) {
        case "hajj": 
            prettifyEventName = "Hajj";
            eventText = "Over the last 30+ years, several incidents of crowd crushes have occurred during the Muslim pilgrimage, Hajj. This simulation focuses on the event of 2006 where 346 pilgrims died and 289 injured.";
            maxPeople = 3000000;
            break;
        case "loveParade":
            prettifyEventName = "Love Parade";
            eventText = "Love Parade is an electronic music and dance festival in Germany which was last held in 2010. This event had 21 casulties and more than 600 injured, due to inadequate and overcrowded exit and entry ways.";
            maxPeople = 1400000;
            break;
        case "itaewon":
            prettifyEventName = "Itaewon";
            eventText = "In 2022 a Halloween event turned deadly when officials where unprepared for the amount of people entering the streets of Seoul, resulting in 159 deaths in the tightly packed Itaewon district.";
            maxPeople = 200000;
            break;
    }

    //A dynamic description is created with the proper text for the subpage
    let text = document.createElement("p");
    text.textContent = eventText;
    simulationHTML.menuTextContainer.prepend(text); //The text is inserted as the second element in the section "menu"

    //A dynamic header is created with the proper name for the subpage
    let header = document.createElement("h1");
    header.textContent = prettifyEventName;
    simulationHTML.menuTextContainer.prepend(header); //The header is inserted as the first element in the section "menu"
    
        //Dynamically changes the peopleSliderInput
    simulationHTML.peopleSliderInput.setAttribute("max", maxPeople); //Max slider value is set according to event
    simulationHTML.peopleSliderInput.setAttribute("value", maxPeople/2); //Slider start value is 50% of max value
    simulationHTML.peopleNumberInput.setAttribute("value", maxPeople/2); //Slider text output matches starting value
    simulationHTML.peopleSliderInput.addEventListener("input", () => {
        simulationHTML.peopleNumberInput.value = simulationHTML.peopleSliderInput.value});
    simulationHTML.peopleNumberInput.addEventListener("change", sanitizePeopleInput);

    //Creates a link to a dynamically created about page
    let aboutLink = document.createElement("a"); //creates the element a (link)
    aboutLink.textContent = 'More about ' + prettifyEventName; //The name of the link is dynamic according to event name
    aboutLink.setAttribute("href","./moreabout.html?page=" + prettifyEventName); //Insert url here
    document.getElementById("goBackLink").after(aboutLink); //Puts the created element after the Go Back Link
}


//Shows and hides the start and stop simulation buttons
let simulationButtonState = "start";
let hideSimButtons = () => {
    if (simulationButtonState === "start"){ //When the start button is showing and is pressed, it goes away and the stop button appears
        simulationButtonState = "stop";
        simulationHTML.startSimButton.style.display = "none";
        simulationHTML.stopSimButton.style.display = "block";
    }
    else if (simulationButtonState === "stop") {
        simulationButtonState = "start";
        simulationHTML.stopSimButton.style.display = "none";
        simulationHTML.startSimButton.style.display = "block";
    }
}
/**
 * Makes sure that the amount of people inputted by the user does not exceed the max amount of people we allow
 * @param {The people inputted by the user} amountOfPeople 
 * @returns returns amountOfPeople as a number <= maxAmount of people
 */
let cleanNumberOfPeople = (amountOfPeople) => {
    switch (simulationData.chosenEvent) {
        case "hajj":
            if (amountOfPeople > 3000000) {
                amountOfPeople = 3000000;
                return amountOfPeople;
            }
            return amountOfPeople
        case "loveParade":
            if (amountOfPeople > 1400000) {
                amountOfPeople = 1400000;
                return amountOfPeople;
            }
            return amountOfPeople
        case "itaewon":
            if (amountOfPeople > 200000) {
                amountOfPeople = 200000;
                return amountOfPeople;
            }
            return amountOfPeople;
        default:
            return amountOfPeople;
    }
}

//Makes sure the slider can not be changed when the simulation is running
let peopleInputSliderStatus = false; //variable to determine if the slider is disabled or not. False = not disabled
let getPeopleInput = () => {
    if (!peopleInputSliderStatus){
        simulationHTML.peopleSliderInput.disabled = true;
        simulationHTML.peopleNumberInput.disabled = true;
        simulationData.amountOfPeople = cleanNumberOfPeople(simulationHTML.peopleSliderInput.value);
         //The peopleSliderInput value is saved as amountOfPeople
        peopleInputSliderStatus = true;
       
    }
    else{
        simulationHTML.peopleSliderInput.disabled = false;
        simulationHTML.peopleNumberInput.disabled =  false;
        peopleInputSliderStatus = false;
    }
}

/***
 *  Functions which controls the timer
 * */
let timerIntervalId; //Timer id makes sure we can stop the setInterval from running
let totalSeconds = 0;
let simulationRunTimeSeconds = 0; //This value is the time the simulation was running in seconds

//Resets the numbers the timer is showing as well as running the function which updates the timer
let startTimer = () => {
    simulationHTML.minutes.textContent = "00";
    simulationHTML.seconds.textContent = "00";
    updateTimer();
}

//stopTimer stops the setInterval from running using the timerId 
let stopTimer = () => {
    clearInterval(timerIntervalId)
    simulationRunTimeSeconds = totalSeconds; //The run time of the simulation is saved
    totalSeconds = 0; //Total seconds are reset
}

//updateTimer makes sure the times shows the correct values
let updateTimer = () => {
    //stringifyTimer makes sure "00" or "0X" is printed instead of just the number when dealing with one digits
    let stringifyTimer = (value) => {
        let valueString = String(value);

        if (valueString.length < 2) {
            return "0" + valueString;
        }
        else {
            return valueString;
        }
    }

    //setTime passes the correct values to the html labels.
    let setTime = () => {
        totalSeconds++;
        simulationHTML.minutes.textContent = stringifyTimer(parseInt(totalSeconds/60));
        simulationHTML.seconds.textContent = stringifyTimer(totalSeconds%60);
    }    

    //timerId is initiallized to run setTime every 1000 ms
    timerIntervalId = setInterval(setTime, 1000);
}
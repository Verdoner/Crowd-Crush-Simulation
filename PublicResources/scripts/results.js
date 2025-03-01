import { simulationData, simulationHTML} from "./simulation.js";
export {startResultBar, stopResultBar, resultWindowConfig, createTimeStamps,
        createDensityTimeStamps, createPeopleTimeStamp, showResultWindow, closeResultWindow}

/***
 *  Functions which controls the result bar
 * */
let resultBarIntervalId; //Id for setInterval function
let startResultBar = () => {
    simulationHTML.currentMaxDensityOutput.textContent = '0';
    simulationHTML.currentAmountOfPeopleOutput.textContent = '0';
    simulationHTML.deathNumberOutput.textContent = '0';
    resultBarIntervalId = setInterval(setResultBarValues, 200); //resultbar is updated every 200 ms
}

//This function does not reset the result bar, but stops the resultBar from being updated
let stopResultBar = () => {
    clearInterval(resultBarIntervalId);
}
/**
 * This is the function which is run for the UpdateResultbar interval
 */
let setResultBarValues = () => {
    simulationHTML.currentMaxDensityOutput.textContent = simulationData.currentMaxDensity;
    simulationHTML.currentAmountOfPeopleOutput.textContent = simulationData.amountOfPeopleInSim;
    simulationHTML.deathNumberOutput.textContent = simulationData.deathCounter;
}

/***
 *  Functions which controls the result page and button
 * */
//closeResultWindow hides the blur of the screen and the content displayed after pressing the result button
//Function is called when pressing go back in the result page
let closeResultWindow = () => {
    simulationHTML.resultWindow.style.display = "none";
    simulationHTML.resultWindowContent.style.display = "none";
    simulationHTML.resultHeatmap.style.display = "none";
    simulationHTML.timeStampScrollBox.innerHTML = "";
}
//showResultWindow is called when the result button is pressed
//the function shows the result window content, the content is a display of values initialized in other functions
let showResultWindow = () => {
    simulationHTML.resultWindowContent.style.display = "flex";
    simulationHTML.maxDensityReachedOutput.textContent = simulationData.maxDensityReached;
    simulationHTML.deathNumberFinalOutput.textContent = simulationData.deathCounter;
    simulationHTML.injuredPeopleOutput.textContent = simulationData.injuredCounter;
    simulationHTML.amountOfPeopleOutput.textContent = simulationData.amountOfPeopleGenerated;
    simulationHTML.removedPeopleOutput.textContent = simulationData.removePeopleCounter;
    simulationHTML.simRunTimeOutput.innerHTML =
    `<label>` + simulationHTML.minutes.textContent + `</label>
    <label>:</label>
    <label>` + simulationHTML.seconds.textContent + `</label>`;
}

//resultWindowConfig is called when the stop simulation button is called, 
//and blurs everything except the result button
let resultWindowConfig = () => {
    simulationHTML.resultWindow.style.display = "flex";
}

/** 
 * These functions record timestamps
 * 
*/
let timeStampMinutes, timeStampSeconds, timeStamp;

//createTimeStampElement function creates a p html element, fills it with the timestamp, 
//and puts it at the end of the timeStampScrollBox
let createTimeStampElement = (timeStamp) => {
    let timeStampElement = document.createElement("p");
    timeStampElement.innerHTML = timeStamp;
    simulationHTML.timeStampScrollBox.append(timeStampElement);
}

//creates a timeStamp for deathCounter and injuryCounter
let deathTimeStampCounter = 0;
let previousDeathTimeStamp = 0;
let timeStampHtml = (counter, ending) => {
    timeStampMinutes = simulationHTML.minutes.textContent; //the minutes are logged 
    timeStampSeconds = simulationHTML.seconds.textContent; //the seconds are logged
    let timeStampHtml = `<label>`+timeStampMinutes+`</label>
                        <label>:</label>
                        <label>` + timeStampSeconds + `</label> : `+counter;
    if(counter === 1){
        timeStampHtml += ` person has `;
    }
    else {
        timeStampHtml += ` people have `;
    }
    timeStampHtml += ending+`.`;
    if(ending === "died" && previousDeathTimeStamp < counter){
        previousDeathTimeStamp = counter;
        timeStampHtml += `<button data-heatmap="`+deathTimeStampCounter+`" class='timeStampButtons'>Show Heatmap</button>`;
        simulationData.heatmaps.push(simulationHTML.canvas.toDataURL());
        deathTimeStampCounter++;
    }
    return timeStampHtml;
}

//creates a timeStamp for currentMaxDensity
let str = "2";
let densityTimeStamp = (maxDensityReached) => {
    timeStampMinutes = simulationHTML.minutes.textContent;
    timeStampSeconds = simulationHTML.seconds.textContent;
    return `<label>` + timeStampMinutes + `</label>
            <label>:</label>
            <label>` + timeStampSeconds + `</label> : `
            + maxDensityReached + ` people/m`+str.sup()+ ` has been reached.`
}

//createDeathTimeStamps and injureTimeStamps make the timestamp related to the deathCounter and injureCounter and creates the html element
//when the death and injure counter is at 1, 10, 50, 100, 500
let createTimeStamps = (counter, type) => {
    switch (counter) {
        case 1:
        case 10:
        case 50:
        case 100:
        case 500:
            if(type === "death")
                timeStamp = timeStampHtml(simulationData.deathCounter, "died");
            else if(type === "injured")
                timeStamp = timeStampHtml(simulationData.injuredCounter, "been injured");
            createTimeStampElement(timeStamp);
            break;
        default:
            break;
    }
}
//createDensityTimeStamps make the timestamp related to the maxDensityReached and creates the html element
//when the maxDensityReached is at or above 5, 7 and 10
let createDensityTimeStamps = () => {
    timeStamp = densityTimeStamp(simulationData.maxDensityReached);
    switch (true) {
        case (simulationData.maxDensityReached >= 5 && simulationData.maxDensityReached < 7):
            createTimeStampElement(timeStamp);
            break;
        case (simulationData.maxDensityReached >= 7 && simulationData.maxDensityReached < 10):
            createTimeStampElement(timeStamp);
            break;
        case (simulationData.maxDensityReached >= 10):
            createTimeStampElement(timeStamp);
            break;
        default:
            break;
    }

}

//createPeopleTimeStamp makes a timeStamp when all the people created has been inserted into the simulation
//the function is called every second and disables itself, 
//when the desired amount of people has been inserted into the simnulation.

let createPeopleTimeStamp = () => {
    timeStampMinutes = simulationHTML.minutes.textContent;
    timeStampSeconds = simulationHTML.seconds.textContent;
    timeStamp = `<label>` + timeStampMinutes + `</label>                   
                <label>:</label>
                <label>` + timeStampSeconds + `</label> : All people have been generated.`

    createTimeStampElement(timeStamp);
}

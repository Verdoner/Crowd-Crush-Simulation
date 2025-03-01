import {simulationHTML, simulationData, chosenEventData} from "./simulation.js";
import { hideSimButtons, getPeopleInput, startTimer, stopTimer} from "./createSimPage.js";
import { startResultBar, stopResultBar, resultWindowConfig, showResultWindow} from "./results.js";
import { makePeople, insertPeople, movePeople } from "./createPeople.js";
import { moveOrNot, findMaxDensities } from "./monitorPeople.js";
export {insertPeopleIntervalId, pauseButtonFunc, playButtonFunc, startSimulation, stopSimulation};

let insertPeopleIntervalId;
let movePeopleIntervalId;

/**
 * stops the insertPeople and move interval timers
 * and shows the "play" Button
 */
let pauseButtonFunc = () => {
    clearInterval(insertPeopleIntervalId);
    clearInterval(movePeopleIntervalId);
    simulationHTML.playButton.style.display = "flex";
    simulationHTML.pauseButton.style.display = "none";
}

/**
 * sets the insertPeople and move interval timers
 * and shows the "pause" button
 */
let playButtonFunc = () => {
    insertPeopleIntervalId = setInterval(insertPeople, chosenEventData.spawnInterval)
    movePeopleIntervalId = setInterval(movePeopleIntervalContent, chosenEventData.movementInterval)
    simulationHTML.playButton.style.display = "none";
    simulationHTML.pauseButton.style.display = "flex";
}

/**
 * This is the function which is called in the move people interval
 */
let movePeopleIntervalContent = () => {
    for (let i = 0; i < simulationData.amountOfPeopleGenerated; i++) {
        findMaxDensities(simulationData.people[i], i) //finds density of the square each person is standing in and logging it
        //checks if the simulation should be stopped, since every has been generated and is either dead or have left the simulation
        if (simulationData.removePeopleCounter + simulationData.deathCounter === simulationData.amountOfPeople) {
            stopSimulation();
        }
        //checks if the person can be moved or not
        if (moveOrNot(simulationData.people[i])) {
            movePeople(simulationData.people[i], i);
        }
    }
}

/**
 * These functions are the main functions that are called when the simulation is started or stopped.
 *  
 */
//startSimulation is the function which controls what will happen when the simulation is started
let startSimulation = () => {
    simulationHTML.pauseButton.style.display = "block";
    simulationHTML.insertBarrierButton.disabled = true;
    simulationHTML.resetButton.disabled = true;
    hideSimButtons();
    getPeopleInput();
    startTimer();
    startResultBar();
    makePeople();
    insertPeopleIntervalId = setInterval(insertPeople, chosenEventData.spawnInterval);
    movePeopleIntervalId = setInterval(movePeopleIntervalContent, chosenEventData.movementInterval);
    
}

//stopSimulation controls what will happen when the simulation is stopped
let stopSimulation = () => {
    simulationHTML.pauseButton.style.display = "none";
    simulationHTML.playButton.style.display = "none";
    simulationHTML.insertBarrierButton.disabled = false;
    simulationHTML.resetButton.disabled = false;
    hideSimButtons();
    getPeopleInput();
    stopTimer();
    stopResultBar();
    resultWindowConfig();
    clearInterval(movePeopleIntervalId);
    clearInterval(insertPeopleIntervalId);
    showResultWindow();
}


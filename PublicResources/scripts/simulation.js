import {generateArena, insertBarrierToggle} from "./arena.js";
import {createSimulationPage} from "./createSimPage.js";
import {closeResultWindow} from "./results.js";
import {startSimulation, stopSimulation, playButtonFunc, pauseButtonFunc} from "./startStopSim.js";
export {simulationData, simulationHTML, createPerson, chosenEventData, cell}

//All getElementById are saved as variables
const simulationHTML = {
    canvas: document.getElementById("canvas"),
    currentMaxDensityOutput: document.getElementById("currentMaxDensityOutput"),
    maxDensityReachedOutput: document.getElementById("maxDensityReachedOutput"),
    currentAmountOfPeopleOutput: document.getElementById("currentAmountOfPeopleOutput"),
    deathNumberOutput: document.getElementById("deathNumberOutput"),
    resultWindow: document.getElementById("resultWindow"),
    resultWindowContent: document.getElementById("resultWindowContent"),
    resultHeatmap: document.getElementById("resultHeatmap"),
    resultHeatmapContent: document.getElementById("resultHeatmapContent"),
    closeHeatmap: document.getElementById("closeHeatmap"),
    deathNumberFinalOutput: document.getElementById("deathNumberFinalOutput"),
    injuredPeopleOutput: document.getElementById("injuredPeopleOutput"),
    amountOfPeopleOutput: document.getElementById("amountOfPeopleOutput"),
    removedPeopleOutput: document.getElementById("removedPeopleOutput"),
    simRunTimeOutput: document.getElementById("simRunTimeOutput"),
    minutes: document.getElementById("minutes"),
    seconds: document.getElementById("seconds"),
    closeResultWindowButton: document.getElementById("closeResultWindowButton"),
    timeStampScrollBox: document.getElementById("timeStampScrollBox"),
    playButton: document.getElementById("playButton"),
    pauseButton: document.getElementById("pauseButton"),
    resetButton: document.getElementById("resetButton"),
    stopSimButton: document.getElementById("stopSimButton"),
    startSimButton: document.getElementById("startSimButton"),
    menuTextContainer: document.getElementById("text"),
    peopleSliderInput: document.getElementById("peopleSliderInput"),
    peopleNumberInput: document.getElementById("peopleNumberInput"),
    insertBarrierButton: document.getElementById("insertBarrierButton"),
    menuOpen: document.getElementById("openMenu"),
    menuClose: document.getElementById("closeMenu"),
    popupMenu: document.querySelector(".dropdownContent"),
    ctx: document.getElementById("canvas").getContext("2d")
}

//Object contain data regarding the chosen events
const chosenEventData = {
    arena: 0,
    entryPoints: 0, //Spawn point
    startGoals: 0, //First goal the people move towards
    simulationGoals: 0, //Goals for the simulation such as the scene in Love Parade.
    directionalGoals: 0, //Goals helping determine the direction of the people.
    endGoals: 0, //Exit points
    weightStartAndEnd: 0, //Weight to determine if a person moves in the optimal way at the start and end of the simulation.
    weightSimulationGoal: 0, //Weight to determine if a person moves in the optimal way at the start and end of the simulation.
    weightDirectionalEndGoal: 0, //Weight to determine if a person moves in the optimal way at the start and end of the simulation.
    spawnInterval: 0, //Interval determining the rate at which people are generated.
    movementInterval: 0, //Interval determining the rate at which people move.
    timeout: 0, //Timeout determining how long people wait at their simulationGoal.
    spawnQuantity: 0, //Number determining the maxmimum number of people generated in each interval.
    numberOfColumns: 0,
    numberOfRows: 0
}

/**
 * the cell class is used when making the simulation Arena
 */
class cell{
    constructor(row, col, id, peopleInCell) {
        this.row = row;
        this.col = col;
        this.id = id;
        this.peopleInCell = peopleInCell;
    }
}

/**
 * The simulations variables are saved as an object, which makes it easy to change and reset
 */
class simulation {
    constructor () {
        this.amountOfPeople = 0;
        this.deathCounter = 0;
        this.injuredCounter = 0;
        this.amountOfPeopleInSim = 0;
        this.currentMaxDensity = 0;
        this.maxDensityReached = 0;
        this.amountOfPeopleGenerated = 0;
        this.removePeopleCounter = 0;
        this.insertionCounter = 0;
        this.chosenEvent = this.getChosenEvent();
        this.people = [];
        this.simulationArena = [];
        this.heatmaps = [];
    }
    //a method is defined, which is only called once.
    getChosenEvent(){
        //The url parameters passed from the home page is saved as chosenEvent
        const queryString = window.location.search;         //the whole url is saved as queryString
        const urlParams = new URLSearchParams(queryString);  //URLSearchParams looks for ? and divides into parameters
        return urlParams.get('page'); //.get looks for a specific parameter and saves it as chosenEvent
    }
}

//Class containing data for each person generated.
class createPerson {
    constructor() {
        this.goalQueue = [];
        this.goalNumber = 0;
        this.currentSquare = 0;
        this.speed = 0; //This variable is not used, but can be if individuals should move a different speeds
        this.status = "Healthy";
    }
}

/*Setup for the simulation*/
let simulationData;
window.addEventListener("load", () => {
    localStorage.clear();
    simulationData = new simulation();
    generateArena(simulationData.chosenEvent);
    createSimulationPage();

    /*Event Listeners for the entire simulation*/
    //Makes sure the start and stop simulation functions are started when the corresponding buttons are pressed
    simulationHTML.startSimButton.addEventListener("click", startSimulation);
    simulationHTML.stopSimButton.addEventListener("click", () => {
        stopSimulation();
        //Show heatmap buttons
        document.querySelectorAll(".timeStampButtons").forEach((element) => {
            element.addEventListener("click", function () {
                simulationHTML.resultHeatmapContent.src = simulationData.heatmaps[parseInt(element.dataset.heatmap)];
                simulationHTML.resultHeatmap.style.display = "flex";
            });
        });
    });
    simulationHTML.resetButton.addEventListener("click", resetSimulation);
    simulationHTML.playButton.addEventListener("click", playButtonFunc);
    simulationHTML.pauseButton.addEventListener("click", pauseButtonFunc);

    //Inserting barriers
    simulationHTML.insertBarrierButton.addEventListener("click", insertBarrierToggle);

    //Menu control
    simulationHTML.menuOpen.addEventListener("click", () => {
        simulationHTML.popupMenu.classList.toggle("open");
    });

    simulationHTML.menuClose.addEventListener("click", () => {
        simulationHTML.popupMenu.classList.toggle("open");
    });

    //Close result window
    simulationHTML.closeResultWindowButton.addEventListener("click", closeResultWindow);

    //Close heatmap
    simulationHTML.closeHeatmap.addEventListener("click", () => {
        simulationHTML.resultHeatmap.style.display = "none";
        simulationHTML.resultHeatmapContent.innerHTML = "";
    });
});

/**
 * reset simulation clears saved heatmap
 * clears all the variables in simulationData by overwriting it with an empty simulation class
 * Generates the arena again to reset all the colors
 */
let resetSimulation = () => {
    localStorage.clear();
    simulationData = new simulation;
    generateArena(simulationData.chosenEvent);
}
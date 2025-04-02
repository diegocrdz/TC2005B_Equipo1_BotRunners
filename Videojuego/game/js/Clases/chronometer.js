/*
 * Chronometer to measure the time elapsed in the game
 * Reference: https://youtu.be/nO53--j1bDM?feature=shared
*/

class Chronometer {
    constructor() {
        this.$elapsedTime = document.querySelector("#elapsedTime"); //reference to the element in the html
        this.idInterval = null; //id of the interval
        this.initialTime = null; //initial time
        this.temporaryDifference = 0; //temporary difference
        this.isRunning = false; //boolean to check if the chronometer is running
        this.init(); //initiates the chronometer
    }
        
    addZeros(value) {
        // If the value is less than 10, add a 0 before the value
        if (value < 10){ 
            return "0" + value;
        } else{
            return "" + value;
        }
    }

    secondsToMinutes(seconds) {
        const minutes = Math.floor(seconds / 60); // Calculates the minutes
        seconds = seconds % 60; // Calculates the seconds
        return `${this.addZeros(minutes)}:${this.addZeros(seconds)}`; 
    }

    // Arrow function to refresh the displayed time
    refreshTime = () => {

        // if the initial time is not set, do nothing
        if (!this.initialTime) {
            return;
        }
        // Get the current time
        const now = new Date();
        // Calculate the difference between the current time and the initial time
        // Add the temporary difference to handle pause and resume
        const difference = now.getTime() - this.initialTime.getTime() + this.temporaryDifference;
        
        // Update the elapsed time element in minutes and seconds
        this.$elapsedTime.textContent = this.secondsToMinutes(Math.floor(difference / 1000));
    }

    start(){
        // Check if the chronometer is already running
        if (this.isRunning) {
            return; // If it's running, do nothing
        }
        // Set the initial time to the current time
        this.initialTime = new Date();
        // Set the interval to refresh the time every second
        this.idInterval = setInterval(this.refreshTime, 1000);
        this.isRunning = true; // Set the chronometer as running
    }

    pause(){
        // Check if the chronometer is not running
        if (!this.isRunning) {
            return; // If it's not running, do nothing
        }
        const now = new Date(); // Get the current time
        // Calculate the temporary difference
        // This is the time elapsed since the chronometer started
        this.temporaryDifference += now.getTime() - this.initialTime.getTime();
        // Clear the interval to stop refreshing the time
        clearInterval(this.idInterval);
        this.isRunning = false; // Set the chronometer as not running
    }
    
    reset(){
        // Clear the interval to stop refreshing the time
        clearInterval(this.idInterval);
        this.temporaryDifference = 0; // Reset the temporary difference
        this.initialTime = null; // Reset the initial time
        this.isRunning = false; // Set the chronometer as not running
        this.init(); // Reset the displayed time
    }

    init(){
        // Initiates the time
        this.$elapsedTime.textContent = "00:00";
    }
}

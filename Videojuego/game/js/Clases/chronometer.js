/*
 * Chronometer to measure the time elapsed in the game
 * Reference: https://youtu.be/nO53--j1bDM?feature=shared
 *
 * Team BotRunners:
 * - Diego Córdova Rodríguez, A01781166
 * - Lorena Estefanía Chewtat Torres, A01785378
 * - Eder Jezrael Cantero Moreno, A01785888
 *
 * Date: 04/04/2025
*/

// Measure the time elapsed in the game
class Chronometer {
    constructor() {
        this.$elapsedTime = document.querySelector("#elapsedTime"); // Reference to the element in the html
        this.idInterval = null; // Id of the interval
        this.initialTime = null; // Initial time
        this.temporaryDifference = 0; // Temporary difference
        this.isRunning = false; // Boolean to check if the chronometer is running
        this.init(); // Initiates the chronometer
    }
    
    // Function to add a 0 before the value if it is less than 10
    addZeros(value) {
        // If the value is less than 10, add a 0 before the value
        if (value < 10){ 
            return "0" + value;
        } else{
            return "" + value;
        }
    }

    // Function to convert seconds to minutes and seconds
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

    // Start the chronometer
    start() {
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

    // Pause the chronometer
    pause() {
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
    
    // Reset the chronometer
    reset(){
        // Clear the interval to stop refreshing the time
        clearInterval(this.idInterval);
        this.temporaryDifference = 0; // Reset the temporary difference
        this.initialTime = null; // Reset the initial time
        this.isRunning = false; // Set the chronometer as not running
        this.init(); // Reset the displayed time
    }

    // Initialize the chronometer
    init(){
        // Initiates the time
        this.$elapsedTime.textContent = "00:00";
    }

    // Convert milliseconds to SQL time format (HH:MM:SS)
    // This is used to store the time in the database
    millisecondsToSQLTime(ms) {
        // Convert milliseconds to seconds
        const totalSeconds = Math.floor(ms / 1000);
        // Calculate hours, minutes, and seconds
        // Use Math.floor to round down the values
        const hours = Math.floor(totalSeconds / 3600);
        // Calculate the remaining seconds after calculating hours
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        // Calculate the remaining seconds after calculating minutes
        const seconds = totalSeconds % 60;
        // Format the time as HH:MM:SS
        return `${this.addZeros(hours)}:${this.addZeros(minutes)}:${this.addZeros(seconds)}`;
    }

    // Check if the elapsed time is greater than the best player's time
    checkTime(bestTimeStr) {
        // Get the current time of the chronometer
        const currentTimeStr = this.millisecondsToSQLTime(this.temporaryDifference);
    
        // Debug
        console.log("Tiempo actual: " + currentTimeStr);
        console.log("Mejor tiempo registrado: " + bestTimeStr);
    
        // If the best time is not set or the current time is better, return the current time
        // since the best time is in SQL format (HH:MM:SS), we can compare it directly
        if (bestTimeStr === "00:00:00" || currentTimeStr < bestTimeStr) {
            console.log("Nuevo mejor tiempo: " + currentTimeStr);
            // Return the current time in SQL format
            return currentTimeStr;
        }
        
        // If the current time is not better, return null
        console.log("No se supera el mejor tiempo.");
        return null;
    }    
}
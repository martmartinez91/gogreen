/*
import { gogreen_backend } from "../../declarations/gogreen_backend";

document.querySelector("form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const button = e.target.querySelector("button");

  const name = document.getElementById("name").value.toString();

  button.setAttribute("disabled", true);

  // Interact with foo actor, calling the greet method
  const greeting = await gogreen_backend.greet(name);

  button.removeAttribute("disabled");

  document.getElementById("greeting").innerText = greeting;

  return false;
});
*/

const pollForm = document.getElementById("radioForm");
const resultsDiv = document.getElementById('results');
const resetButton = document.getElementById('reset');
//const resetIndButton = document.getElementById('resetInd');


//Note we will use "poll_backend" in this JavaScript code a few times to call the backend
import { gogreen_backend } from "../../declarations/gogreen_backend";

//1. LOCAL DATA
const pollResults = {
    "Driving": 0,
    "Bottle": 0,
    "Electric car": 0,
    "Vegetarian food": 0
};

var total = 0;


//2. EVENT LISTENERS

//Load the Simple Poll's question from the backend when the app loads
document.addEventListener('DOMContentLoaded', async (e) => {
   //note that this is at beginning of the submit callback, this is deliberate
  //This is so the default behavior is set BEFORE the awaits are called below
  e.preventDefault();
 
  // Query the question from the backend
  const question = await gogreen_backend.getQuestion();
  document.getElementById("question").innerText = question;

  //Query the vote counts for each option
  // Example JSON that the frontend will get using the values above
  // [["Motoko","0"],["Python","0"],["Rust","0"],["TypeScript","0"]]
  const voteCounts = await gogreen_backend.getVotes();
  updateLocalVoteCounts(voteCounts);
  displayResults();
  return false;
}, false);

//Event listener that listens for when the form is submitted.
//When the form is submitted with an option, it calls the backend canister
//via "await poll_backend.vote(selectedOption)"
pollForm.addEventListener('submit', async (e) => {
  //note that this is at beginning of the submit callback, this is deliberate
  //This is so the default behavior is set BEFORE the awaits are called below
  e.preventDefault(); 

  const formData = new FormData(pollForm);
  const checkedValue = formData.get("option");

  const updatedVoteCounts = await gogreen_backend.vote(checkedValue);
  console.log("Returning from await...")
  console.log(updatedVoteCounts);
  updateLocalVoteCounts(updatedVoteCounts);
  displayResults();
  return false;
}, false);

resetButton.addEventListener('click', async (e) => {

    e.preventDefault();
    
    //Reset the options in the backend
    await gogreen_backend.resetVotes();
    const voteCounts = await gogreen_backend.getVotes();
    updateLocalVoteCounts(voteCounts);

    //re-render the results once the votes are reset in the backend
    displayResults();
    return false;
}, false);



//3. HELPER FUNCTIONS

//Helper vanilla JS function to create the HTML to render the results of the poll
function displayResults() {
  let resultHTML = '<ul>';
  for (let key in pollResults) {
      resultHTML += '<li><strong>' + key + '</strong>: ' + pollResults[key] + '</li>';
  }
  resultHTML += '<li><strong>' + "Total" + '</strong>: ' + total + '</li>';
  resultHTML += '</ul>';
  resultsDiv.innerHTML = resultHTML;
  //resultsTotal.innerHTML = string(pollTotal);
};

//This helper updates the local JS object that teh browser holds
// Example JSON that the frontend will get using the values above
  // [["Motoko","0"],["Python","0"],["Rust","0"],["TypeScript","0"]]
function updateLocalVoteCounts(arrayOfVoteArrays){

  var multiplier = 1;
  total = 0;

  for (let voteArray of arrayOfVoteArrays) {
    //Example voteArray -> ["Motoko","0"]
    let voteOption = voteArray[0];
    let voteCount = voteArray[1];
    
    if (voteOption == "Driving"){
      multiplier = 20;
    }else if (voteOption == "Bottle"){
      multiplier = 5;
    }else if (voteOption == "Electric car"){
      multiplier = 10;
    }else if (voteOption == "Vegetarian food"){
      multiplier = 1;
    }
    
    //let aux = number(voteCount)*multiplier;
    pollResults[voteOption] = Number(voteCount)*multiplier;
    total = total + pollResults[voteOption];
    //pollTotal = pollTotal + voteCount;
  }

};

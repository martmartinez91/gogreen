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
const storeResults = {
    "Driving": 0,
    "Water": 0,
    "Electricity": 0,
    "Shopping": 0
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
  const voteCounts = await gogreen_backend.getPoints();
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
    await gogreen_backend.resetPoints();
    const voteCounts = await gogreen_backend.getPoints();
    updateLocalVoteCounts(voteCounts);

    //re-render the results once the points are reset in the backend
    displayResults();

    document.getElementById('click-answer').innerText = "Coupon Acquired!!"
    return false;
}, false);



/*
<script>
  //Select button by id
  const MyButton = document.getElementById("reset");
  //Add on click listener for button
  MyButton.addEventListener('click', function() {
      //Select (h1) heading by id, and then change it's value to (bananas)
      document.getElementById('click-answer').innerText = "bananas"
  })
</script>
*/


//3. HELPER FUNCTIONS

//Helper vanilla JS function to create the HTML to render the results of the poll
function displayResults() {
  let resultHTML = '<ul>';
  for (let key in storeResults) {
      resultHTML += '<li><strong>' + key + '</strong>: ' + storeResults[key] + '</li>';
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
    }else if (voteOption == "Water"){
      multiplier = 5;
    }else if (voteOption == "Electricity"){
      multiplier = 10;
    }else if (voteOption == "Shopping"){
      multiplier = 1;
    }
    
    //let aux = number(voteCount)*multiplier;
    storeResults[voteOption] = Number(voteCount)*multiplier;
    total = total + storeResults[voteOption];
    //pollTotal = pollTotal + voteCount;
  }

};

// TODO: Rewrite shuffle cards to randomly select from a larger list of symbols.
// TODO: Time needs to be added to the game over screen.

const SYMBOL_LIST = ['&#9730;', '&#9730;', '&#9731;', '&#9731;', '&#9734;', '&#9734;', '&#9742;', '&#9742;', '&#9850;', '&#9850;', '&#9775;', '&#9775;', '&#9816;', '&#9816;', '&#9836;', '&#9836;'];
const CARD_LIST = ['1-1', '1-2', '1-3', '1-4', '2-1', '2-2', '2-3', '2-4', '3-1', '3-2', '3-3', '3-4', '4-1', '4-2', '4-3', '4-4'];
let cardLocations;
let score, starCount;
let startTime, currentTime, myTimer;
let selected = document.getElementsByClassName('selected');

function main() {
  // Starts the game.
  reset();
  addEventListeners();
}

function addEventListeners() {
  // Adds all of the game's event listeners.
  document.getElementById('reset-button').addEventListener('click', reset);
  document.getElementById('game-board').addEventListener('click', selectCard);
  document.getElementById('game-board').addEventListener('animationend', finishFlipCard);
}

function shuffleCards() {
  // Randomly determines where each symbol appears on the board.
  cardLocations = new Map();
  let unusedCards = SYMBOL_LIST.slice();
  for (let card of CARD_LIST) {
    let randomCard = Math.floor(Math.random() * unusedCards.length);
    cardLocations.set(card, unusedCards.splice(randomCard, 1)[0]);
  }
}

function selectCard(e) {
  // Event handler triggered when a card is selected.
  if (!startTime) {
    startTimer(); // Timer starts when the user selects their first card.
  }
  if (selected.length == 2) {
    return; // If the user already has two cards selected, more cannot be selected until the script is done processing them.
  }
  let selectedCard = e.target;
  if (selectedCard.className == 'card-display') {
    selectedCard = selectedCard.parentElement; // Make the target the card, if the text inside the card is clicked.
  }
  if (selectedCard.className == 'card back') {
    flipCard(selectedCard);
  }
}

function flipCard(selectedCard) {
  // Triggers the card flip animation.
  selectedCard.classList.add('card-flip');
}

function finishFlipCard(e) {
  // Adjusts card classes and invokes functions during and after a card flip.
  if (e.target.classList.contains('card')) {
    if (e.animationName == 'flip-to') {
      // Halfway through the flip.
      // Replacing classes and text to make the card look like it's being flipped over.
      let newCardDisplay, oldClass, newClass;
      if (e.target.classList.contains('incorrect-guess')) {
        // Card is being flipped back after an incorrect guess.
        newCardDisplay = '?';
        oldClass = 'incorrect-guess';
        newClass = 'back';
      } else {
        // User is flipping the card over.
        newCardDisplay = cardLocations.get(e.target.id);
        oldClass = 'back';
        newClass = 'selected';
      }
      e.target.getElementsByClassName('card-display')[0].innerHTML = newCardDisplay;
      e.target.classList.replace(oldClass, newClass);
    } else if (e.animationName == 'flip-back') {
      // Completing the flip.
      e.target.classList.remove('card-flip');
      if (selected.length == 2) {
        // If the user has selected two cards, check for a match and check if the game is over.
        setTimeout(checkSelectedCards, 750);
        checkGameOver();
      }
    }
  }
}

function checkSelectedCards() {
  // Checks whether the two cards flipped over match.
  let matched = cardLocations.get(selected[0].id) == cardLocations.get(selected[1].id);
  setScore(score + 1);
  while (selected.length > 0) {
    selected[0].classList.replace('selected', matched ? 'matched' : 'incorrect-guess');
  }
}

function checkGameOver() {
  // Runs game over functions if no unmatched cards remain.
  if (document.getElementsByClassName('back').length == 0) {
    stopTimer()
    flashGameBoard();
    setTimeout(addGameOver, 2500);
  }
}

function flipAllCardsToBack() {
  // Flips all cards to their backs by remplacing all card classes with back
  // and setting each's display text to "?".
  let cardDisplays = document.getElementsByClassName('card-display');
  for (let display of cardDisplays) {
    display.textContent = '?';
  }
  let allCards = document.getElementsByClassName('card');
  for (let card of allCards) {
    card.classList.remove('selected', 'matched');
    card.classList.add('back');
  }
}

function setScore(newScore) {
  // Sets the score variable and updates display.
  score = newScore;
  document.getElementById('score-number').textContent = score;
  document.getElementById('score-stars').innerHTML = getStarHtml();
}

function getStarHtml() {
  // Calculates the number of starts based on the score and creates the html.
  if (score < 13) {
    starCount = 3;
  } else if (score < 22) {
    starCount = 2;
  } else {
    starCount = 1;
  }
  let starHtml = '<span class="good-stars">';
  for (let i = 1; i < 4; i++) {
    starHtml += '&#9733;';
    if (i == starCount) {
      starHtml += '</span><span class="bad-stars">';
    }
  }
  starHtml += '</span>';
  return starHtml;
}

function startTimer() {
  // Captures the current time and sets the timer for continuous updating.
  startTime = new Date();
  myTimer = setInterval(updateTimer, 100);
}

function stopTimer() {
  // Stops the timer for when the game is finished.
  clearInterval(myTimer);
  startTime = false;
}

function updateTimer() {
  // Updates the timer in the control bar.
  if (startTime) {
    currentTime = new Date();
    let duration = Math.floor((currentTime - startTime) / 1000);
    let minutes = String(Math.floor(duration / 60));
    let seconds = String(duration % 60);
    if (seconds.length == 1) {
      seconds = '0' + seconds;
    }
    let timerText = minutes + ':' + seconds;
    document.getElementById('timer').innerText = timerText;
  }
}

function reset() {
  // Wipes out all progress.
  setScore(0);
  flipAllCardsToBack();
  shuffleCards();
  turnOffGameWinners();
  stopTimer();
  document.getElementById('timer').innerText = '0:00';
}

function flashGameBoard() {
  // Game board flashes briefly when the game has been won.
  document.getElementById('game-board').classList.add('board-winner');
}

function addGameOver() {
  // Creates the end game html.
  const GAME_OVER_PAGE = document.createElement('div');
  GAME_OVER_PAGE.className = 'end-screen';
  GAME_OVER_PAGE.id = 'game-over';
  const GAME_OVER_HEADER = document.createElement('h2');
  GAME_OVER_HEADER.innerText = 'Congratulations! You won!';
  GAME_OVER_PAGE.appendChild(GAME_OVER_HEADER);
  const GAME_OVER_STATS = document.createElement('p');
  GAME_OVER_STATS.className = 'game-stats';
  GAME_OVER_STATS.innerHTML = '<span id="move-count"></span> and <span id="star-count"></span>';
  GAME_OVER_PAGE.appendChild(GAME_OVER_STATS);
  const PLAY_AGAIN_BUTTON = document.createElement('div');
  PLAY_AGAIN_BUTTON.className = 'play-again';
  PLAY_AGAIN_BUTTON.addEventListener('click', reset);
  const PLAY_AGAIN_TEXT = document.createElement('p');
  PLAY_AGAIN_TEXT.innerHTML = '<span class="button">Play again?</span>';
  PLAY_AGAIN_BUTTON.appendChild(PLAY_AGAIN_TEXT);
  GAME_OVER_PAGE.appendChild(PLAY_AGAIN_BUTTON);
  document.getElementsByTagName('body')[0].appendChild(GAME_OVER_PAGE);
  calculateStats();
}

function calculateStats() {
  // Adds the stats to the end game screen.
  document.getElementById('move-count').innerText = getStatText(score, 'move');
  document.getElementById('star-count').innerText = getStatText(starCount, 'star');
}

function getStatText(number, units) {
  // Creates the text for displaying an end-game stat.
  return number + ' ' + units + (number == 1 ? '' : 's');
}

function turnOffGameWinners() {
  // Removes classes and html added after winning the game.
  document.getElementById('game-board').classList.remove('board-winner');
  const GAME_OVER_SCREEN = document.getElementById('game-over');
  if (GAME_OVER_SCREEN) {
    document.getElementsByTagName('body')[0].removeChild(GAME_OVER_SCREEN);
  }
}

document.addEventListener('DOMContentLoaded', main);

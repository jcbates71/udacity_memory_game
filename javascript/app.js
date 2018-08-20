const symbolList = ['&#9730;', '&#9730;', '&#9731;', '&#9731;', '&#9734;', '&#9734;', '&#9742;', '&#9742;', '&#9850;', '&#9850;', '&#9775;', '&#9775;', '&#9816;', '&#9816;', '&#9836;', '&#9836;'];
const cardList = ['1-1', '1-2', '1-3', '1-4', '2-1', '2-2', '2-3', '2-4', '3-1', '3-2', '3-3', '3-4', '4-1', '4-2', '4-3', '4-4'];
var cardLocations;
var score, starCount;
var startTime, currentTime, myTimer;
var selected = document.getElementsByClassName('selected');

function reset() {
  setScore(0);
  flipAllCardsToBack();
  shuffleCards();
  turnOffGameWinners();
  document.getElementById('timer').innerText = '0:00';
}

function setScore(newScore) {
  score = newScore;
  document.getElementById('score-number').textContent = score;
  document.getElementById('score-stars').innerHTML = getStarHtml();
}

function getStarHtml() {
  if (score < 6) {
    starCount = 3;
  } else if (score < 11) {
    starCount = 2;
  } else {
    starCount = 1;
  }
  var starHtml = '<span class="good-stars">';
  for (var i = 1; i < 4; i++) {
    starHtml += '&#9733;';
    if (i == starCount) {
      starHtml += '</span>'
    }
  }
  return starHtml;
}

function getStatText(number, units) {
  var plural;
  if (number == 1) {
    plural = "";
  } else {
    plural = "s";
  }
  return number + " " + units + plural
}

function flipAllCardsToBack() {
  var cardDisplays = document.getElementsByClassName('card-display');
  for (let display of cardDisplays) {
    display.textContent = "?";
  }
  var allCards = document.getElementsByClassName('card');
  for (let card of allCards) {
    card.classList.remove('selected', 'matched');
    card.classList.add('back');
  }
}

function shuffleCards() {
  cardLocations = new Map();
  var unusedCards = symbolList.slice();
  for (let card of cardList) {
    var randomCard = Math.floor(Math.random() * unusedCards.length);
    cardLocations.set(card, unusedCards.splice(randomCard, 1)[0]);
  }
}

function turnOffGameWinners() {
  document.getElementById('game-board').classList.remove('board-winner');
  document.getElementById('reset-button').classList.remove('reset-winner');
  const gameOverScreen = document.getElementById('game-over');
  if (gameOverScreen) {
    document.getElementsByTagName('body')[0].removeChild(gameOverScreen);
  }
}

function addGameOver() {
  const gameOverPage = document.createElement('div');
  gameOverPage.id = 'game-over';
  const gameOverHeader = document.createElement('h2');
  gameOverHeader.innerText = 'Congratulations! You won!';
  gameOverPage.appendChild(gameOverHeader);
  const gameOverStats = document.createElement('p');
  gameOverStats.id = 'game-stats';
  gameOverStats.innerHTML = '<span id="move-count"></span> and <span id="star-count"></span>';
  gameOverPage.appendChild(gameOverStats);
  const playAgainButton = document.createElement('div');
  playAgainButton.id = 'play-again';
  playAgainButton.addEventListener('click', reset);
  const playAgainText = document.createElement('p');
  playAgainText.innerHTML = '<span class="button">Play again?</span>';
  playAgainButton.appendChild(playAgainText);
  gameOverPage.appendChild(playAgainButton);
  document.getElementsByTagName('body')[0].appendChild(gameOverPage);
  calculateStats();
}

function calculateStats() {
  document.getElementById('move-count').innerText = getStatText(score, 'move');
  document.getElementById('star-count').innerText = getStatText(starCount, 'star');
}

function selectCard(e) {
  if (!startTime) {
    startTime = new Date();
  }
  if (selected.length == 2) {
    return;
  }
  var selectedCard = e.target;
  if (selectedCard.className == 'card-display') {
    selectedCard = selectedCard.parentElement;
  }
  if (selectedCard.className == 'card back') {
    flipCard(selectedCard);
  }
}

function flipCard(selectedCard) {
  selectedCard.classList.add('card-flip');
}

function finishFlipCard(e) {
  if (e.target.classList.contains('card')) {
    if (e.animationName == 'flip-to') {
      var newCardDisplay, oldClass, newClass;
      if (e.target.classList.contains('incorrect-guess')) {
        newCardDisplay = '?';
        oldClass = 'incorrect-guess';
        newClass = 'back';
      } else {
        newCardDisplay = cardLocations.get(e.target.id);
        oldClass = 'back';
        newClass = 'selected';
      }
      e.target.getElementsByClassName('card-display')[0].innerHTML = newCardDisplay;
      e.target.classList.replace(oldClass, newClass);
    } else if (e.animationName == 'flip-back') {
      e.target.classList.remove('card-flip');
      if (selected.length == 2) {
        setTimeout(checkSelectedCards, 750);
        checkGameOver();
      }
    }
  }
}

function checkSelectedCards() {
  var matched = cardLocations.get(selected[0].id) == cardLocations.get(selected[1].id);
  var newClass;
  if (matched) {
    newClass = 'matched';
  } else {
    newClass = 'incorrect-guess';
  }
  setScore(score + 1);
  while (selected.length > 0) {
    selected[0].classList.replace('selected', newClass);
  }
}

function checkGameOver() {
  if (document.getElementsByClassName('back').length == 0) {
    clearInterval(myTimer);
    flashGameBoard();
    animateResetButton();
    addGameOver();
  }
}

function flashGameBoard() {
  document.getElementById('game-board').classList.add('board-winner');
}

function animateResetButton() {
  document.getElementById('reset-button').classList.add('reset-winner');
}

function updateTimer() {
  if (startTime) {
    currentTime = new Date();
    var duration = Math.floor((currentTime - startTime) / 1000);
    var minutes = String(Math.floor(duration / 60));
    var seconds = String(duration % 60);
    if (seconds.length == 1) {
      seconds = "0" + seconds;
    }
    var timerText = minutes + ":" + seconds;
    document.getElementById('timer').innerText = timerText;
  }
}

function addEventListeners() {
  document.getElementById('reset-button').addEventListener('click', reset);
  document.getElementById('game-board').addEventListener('click', selectCard);
  document.getElementById('game-board').addEventListener('animationend', finishFlipCard);
  myTimer = setInterval(updateTimer, 100);
}

function main() {
  reset();
  addEventListeners();
}

document.addEventListener('DOMContentLoaded', main);

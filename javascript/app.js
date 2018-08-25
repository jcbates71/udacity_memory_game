const SYMBOL_LIST = ['&#9730;', '&#9730;', '&#9731;', '&#9731;', '&#9734;', '&#9734;', '&#9742;', '&#9742;', '&#9850;', '&#9850;', '&#9775;', '&#9775;', '&#9816;', '&#9816;', '&#9836;', '&#9836;'];
const CARD_LIST = ['1-1', '1-2', '1-3', '1-4', '2-1', '2-2', '2-3', '2-4', '3-1', '3-2', '3-3', '3-4', '4-1', '4-2', '4-3', '4-4'];
let cardLocations;
let score, starCount;
let startTime, currentTime, myTimer;
let selected = document.getElementsByClassName('selected');

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

function getStatText(number, units) {
  return number + ' ' + units + (number == 1 ? '' : 's');
}

function flipAllCardsToBack() {
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

function shuffleCards() {
  cardLocations = new Map();
  let unusedCards = SYMBOL_LIST.slice();
  for (let card of CARD_LIST) {
    let randomCard = Math.floor(Math.random() * unusedCards.length);
    cardLocations.set(card, unusedCards.splice(randomCard, 1)[0]);
  }
}

function turnOffGameWinners() {
  document.getElementById('game-board').classList.remove('board-winner');
  const GAME_OVER_SCREEN = document.getElementById('game-over');
  if (GAME_OVER_SCREEN) {
    document.getElementsByTagName('body')[0].removeChild(GAME_OVER_SCREEN);
  }
}

function addGameOver() {
  const GAME_OVER_PAGE = document.createElement('div');
  GAME_OVER_PAGE.className = 'game-over';
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
  let selectedCard = e.target;
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
      let newCardDisplay, oldClass, newClass;
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
  let matched = cardLocations.get(selected[0].id) == cardLocations.get(selected[1].id);
  setScore(score + 1);
  while (selected.length > 0) {
    selected[0].classList.replace('selected', matched ? 'matched' : 'incorrect-guess');
  }
}

function checkGameOver() {
  if (document.getElementsByClassName('back').length == 0) {
    clearInterval(myTimer);
    flashGameBoard();
    setTimeout(addGameOver, 2500);
  }
}

function flashGameBoard() {
  document.getElementById('game-board').classList.add('board-winner');
}

function updateTimer() {
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

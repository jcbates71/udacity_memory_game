const symbolList = ['&#9730;', '&#9730;', '&#9731;', '&#9731;', '&#9734;', '&#9734;', '&#9742;', '&#9742;', '&#9850;', '&#9850;', '&#9775;', '&#9775;', '&#9816;', '&#9816;', '&#9836;', '&#9836;'];
const cardList = ['1-1', '1-2', '1-3', '1-4', '2-1', '2-2', '2-3', '2-4', '3-1', '3-2', '3-3', '3-4', '4-1', '4-2', '4-3', '4-4'];
var cardLocations;
var score;
var selected = document.getElementsByClassName('selected');

function reset() {
  setScore(0);
  flipAllCardsToBack();
  shuffleCards();
}

function setScore(newScore) {
  score = newScore;
  document.getElementById('score-number').textContent = score;
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
  var unusedCards = symbolList;
  for (card of cardList) {
    var randomCard = Math.floor(Math.random() * unusedCards.length);
    cardLocations.set(card, unusedCards.splice(randomCard, 1)[0]);
  }
}

function selectCard(e) {
  var selectedCard = e.target;
  if (selectedCard.className == 'card-display') {
    selectedCard = selectedCard.parentElement;
  }
  if (selectedCard.className == 'card back') {
    flipCard(selectedCard);
    if (selected.length == 2) {
      setTimeout(checkSelectedCards, 1000);
    }
  }
}

function flipCard(selectedCard) {
  selectedCard.className = 'card selected'
  selectedCard.getElementsByClassName('card-display')[0].innerHTML = cardLocations.get(selectedCard.id);
}

function checkSelectedCards() {
  var matched = cardLocations.get(selected[0].id) == cardLocations.get(selected[1].id);
  var newClass;
  if (matched) {
    newClass = 'matched';
  } else {
    newClass = 'back';
    score++;
    document.getElementById('score-number').innerText = score;
  }
  while (selected.length > 0) {
    if (newClass == 'back') {
      selected[0].getElementsByClassName('card-display')[0].innerHTML = "?";
    }
    selected[0].classList.replace('selected', newClass);
  }
}

function addEventListeners() {
  document.getElementById('reset-button').addEventListener('click', reset);
  document.getElementById('game-board').addEventListener('click', selectCard);
}

function main() {
  reset();
  addEventListeners();
}

document.addEventListener('DOMContentLoaded', main);

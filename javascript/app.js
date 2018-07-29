const symbolList = ['1', '1', '2', '2', '3', '3', '4', '4', '5', '5', '6', '6', '7', '7', '8', '8'];
const cardList = ['1-1', '1-2', '1-3', '1-4', '2-1', '2-2', '2-3', '2-4', '3-1', '3-2', '3-3', '3-4', '4-1', '4-2', '4-3', '4-4'];
var cardLocations;
var score;
var selected;

function reset() {
  selected = new Array();
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
    card.classList.remove('front', 'selected', 'correct');
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
  if (selectedCard.className == 'card back') {
    flipCard(selectedCard);
    if (selected.length == 2) {
      checkSelectedCards();
    }
  }
}

function flipCard(selectedCard) {
  selectedCard.className = 'card selected'
  selectedCard.getElementsByClassName('card-display')[0].innerText = cardLocations.get(selectedCard.id);
  selected.push(selectedCard.id);
}

function checkSelectedCards() {

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

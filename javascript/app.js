const symbolList = ['1', '1', '2', '2', '3', '3', '4' '4', '5', '5', '6', '6', '7', '7', '8', '8'];
const cardList = ['1-1', '1-2', '1-3', '1-4', '2-1', '2-2', '2-3', '2-4', '3-1', '3-2', '3-3', '3-4', '4-1', '4-2', '4-3', '4-4'];
var score;

function reset() {
  setScore(0);
  flipAllCardsToBack();
  shuffleCards();
}

function setScore(newScore) {
  score = newScore;
  document.getElementById('score').textContent = score;
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

}

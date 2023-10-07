'use strict';

const playerCard0 = document.querySelector('.player--0');
const playerCard1 = document.querySelector('.player--1');
const dice_El = document.querySelector('.dice');

const btnNew = document.querySelector('.btn--new');
const btnRoll = document.querySelector('.btn--roll');
const btnHold = document.querySelector('.btn--hold');

//Starting conditions
const player0 = {
  score: 0,
  currentScore: 0,
};

const player1 = {
  score: 0,
  currentScore: 0,
};

const players = [player0, player1];
let activePlayerIdx;

function init() {
  activePlayerIdx = 0;

  for (let i = 0; i < players.length; i++) {
    players[i].score = 0;
    players[i].currentScore = 0;
    players[i].scoreEl = document.getElementById(`score--${i}`);
    players[i].currentScoreEl = document.getElementById(`current--${i}`);
    players[i].playerCard = document.querySelector(`.player--${i}`);
    players[i].scoreEl.textContent = players[i].score;
    players[i].currentScoreEl.textContent = players[i].currentScore;
    players[i].playerCard.classList.remove('player--winner');
  }

  dice_El.classList.add('hidden');
  playerCard0.classList.add('player--active');
  playerCard1.classList.remove('player--active');

  btnHold.disabled = false;
  btnRoll.disabled = false;
}

function switchPlayer() {
  const activePlayer = players[activePlayerIdx];
  activePlayer.currentScore = 0;
  activePlayer.currentScoreEl.textContent = 0;
  activePlayerIdx = activePlayerIdx === 0 ? 1 : 0;
  playerCard0.classList.toggle('player--active');
  playerCard1.classList.toggle('player--active');
}

init();

//Rolling dice functionality
btnRoll.addEventListener('click', function () {
  const diceRoll = Math.trunc(Math.random() * 6) + 1;
  dice_El.classList.remove('hidden');
  dice_El.src = `./img/dice-${diceRoll}.png`;

  if (diceRoll === 1) {
    //Switch to next player
    switchPlayer();
  } else {
    players[activePlayerIdx].currentScore += diceRoll;
    players[activePlayerIdx].currentScoreEl.textContent = players[activePlayerIdx].currentScore;
  }
});

btnHold.addEventListener('click', function () {
  //save score
  const activePlayer = players[activePlayerIdx];
  activePlayer.score += activePlayer.currentScore;
  activePlayer.scoreEl.textContent = activePlayer.score;
  if (activePlayer.score >= 100) {
    //finish the game
    activePlayer.playerCard.classList.remove('player--active');
    activePlayer.playerCard.classList.add('player--winner');
    dice_El.classList.add('hidden');
    btnHold.disabled = true;
    btnRoll.disabled = true;
  } else {
    switchPlayer();
  }
});

btnNew.addEventListener('click', init);

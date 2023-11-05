'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data

const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2023-10-18T21:31:17.178Z',
    '2023-11-01T07:42:02.383Z',
    '2023-01-28T09:15:04.904Z',
    '2023-04-01T10:17:24.185Z',
    '2023-05-08T14:11:59.604Z',
    '2023-05-27T17:01:17.194Z',
    '2023-07-11T23:36:17.929Z',
    '2023-07-12T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const accounts = [account1, account2];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

function formatCurrency(value, locale, currency) {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
  }).format(value);
}

function formatDate(date) {
  const day = `${date.getDate()}`.padStart(2, 0);
  const month = `${date.getMonth() + 1}`.padStart(2, 0);
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

function calcDayDifference(date1, date2) {
  return Math.trunc(Math.abs(date1 - date2) / 1000 / 3600 / 24);
}

function formatMovementDate(date, locale = 'en-GB') {
  const daysPassed = calcDayDifference(new Date(), date);
  if (daysPassed === 0) return 'Today';
  if (daysPassed === 1) return 'Yesterday';
  if (daysPassed <= 7) return `${daysPassed} days ago`;

  return new Intl.DateTimeFormat(locale).format(date);
}

function displayMovements(account, sort = false) {
  containerMovements.innerHTML = '';

  const sortedMovements = sort
    ? account.movements.slice().sort((a, b) => a - b)
    : account.movements;

  sortedMovements.forEach(function (m, i) {
    const operationType = m > 0 ? 'deposit' : 'withdrawal';

    const movementDate = new Date(account.movementsDates[i]);

    const html = `
      <div class="movements__row">
        <div class="movements__type movements__type--${operationType}"> 
         ${i + 1}: ${operationType}        
         </div>
        <div class="movements__date">${formatMovementDate(
          movementDate,
          account.locale
        )}</div>
        <div class="movements__value">${formatCurrency(
          m,
          account.locale,
          account.currency
        )}</div>
      </div>
      `;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
}

function computeUsernames(accounts) {
  return accounts.forEach(
    account =>
      (account.username = account.owner
        .toLowerCase()
        .split(' ')
        .map(word => word[0])
        .join(''))
  );
}

function calcDisplayBalance(account) {
  account.balance = account.movements.reduce((sum, cur) => sum + cur, 0);
  labelBalance.textContent = `${formatCurrency(
    account.balance,
    account.locale,
    account.currency
  )}`;
}

function calcSummary(account) {
  const incomes = account.movements
    .filter(m => m > 0)
    .reduce((a, c) => a + c, 0);
  const withdrawals = account.movements
    .filter(m => m < 0)
    .reduce((a, c) => a + c, 0);
  const interest = account.movements
    .filter(m => m > 0)
    .map(deposit => (deposit * account.interestRate) / 100)
    .filter(i => i >= 1)
    .reduce((a, c) => a + c, 0);
  labelSumIn.textContent = formatCurrency(
    incomes,
    account.locale,
    account.currency
  );
  labelSumOut.textContent = formatCurrency(
    Math.abs(withdrawals),
    account.locale,
    account.currency
  );
  labelSumInterest.textContent = formatCurrency(
    interest,
    account.locale,
    account.currency
  );
}

function updateUi(account) {
  //Display movements
  displayMovements(account);
  //Display balance
  calcDisplayBalance(account);
  //Display summary
  calcSummary(account);
}

const startLogoutTimer = function () {
  let time = 60 * 0.2;
  const tick = function () {
    const min = String(Math.trunc(time / 60)).padStart(2, 0);
    const second = String(time % 60).padStart(2, 0);
    labelTimer.textContent = `${min}:${second}`;

    if (time === 0) {
      currentAccount = null;
      containerApp.style.opacity = 0;
      clearInterval(timer);
    }
    time--;
  };
  //Set timer to 5 min
  tick();
  //Call the timer every second
  const timer = setInterval(tick, 1000);
  return timer;
};

computeUsernames(accounts);
let currentAccount, timer;

//fake login
// currentAccount = account1;
// updateUi(currentAccount);
// containerApp.style.opacity = 100;

btnLogin.addEventListener('click', function (e) {
  //Prevent form from submitting
  e.preventDefault();

  const now = new Date();
  const options = {
    hour: 'numeric',
    minute: 'numeric',
    day: 'numeric',
    month: 'numeric',
    year: 'numeric',
  };

  //GET locale from the browser
  currentAccount = accounts.find(a => a.username === inputLoginUsername.value);

  if (Number(inputLoginPin.value) === currentAccount?.pin) {
    //Display UI and message
    labelWelcome.textContent = `Welcome back ${
      currentAccount.owner.split(' ')[0]
    }`;

    const locale = navigator.language;
    labelDate.textContent = new Intl.DateTimeFormat(
      currentAccount.locale,
      options
    ).format(now);

    containerApp.style.opacity = 100;
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginUsername.blur();
    inputLoginPin.blur();

    if (timer) clearInterval(timer);
    timer = startLogoutTimer();

    //Update UI
    updateUi(currentAccount);
  }
});

btnTransfer.addEventListener('click', function (e) {
  //Prevent form from submitting
  e.preventDefault();
  const transferAmount = Number(inputTransferAmount?.value);
  const receiverAccount = accounts.find(
    a => a.username === inputTransferTo.value
  );

  if (
    receiverAccount &&
    receiverAccount?.username !== currentAccount.username &&
    transferAmount <= currentAccount.balance &&
    transferAmount > 0
  ) {
    currentAccount.movements.push(-transferAmount);
    receiverAccount.movements.push(transferAmount);

    currentAccount.movementsDates.push(new Date().toISOString());
    receiverAccount.movementsDates.push(new Date().toISOString());

    //clear inputs
    inputTransferTo.value = inputTransferAmount.value = '';
    inputTransferTo.blur();
    inputTransferAmount.blur();
    //Update UI
    updateUi(currentAccount);

    //Reset timer
    clearInterval(timer);
    timer = startLogoutTimer();
  }
});

btnClose.addEventListener('click', function (e) {
  e.preventDefault();
  console.log(inputCloseUsername.value, Number(inputClosePin.value));
  if (
    inputCloseUsername.value === currentAccount.username &&
    Number(inputClosePin.value) === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      a => a.username === currentAccount.username
    );
    //Delete account
    accounts.splice(index, 1);
    //Hide UI
    containerApp.style.opacity = 0;
  }
  //Clear fields
  inputCloseUsername.value = inputClosePin = '';
  inputCloseUsername.blur();
  inputClosePin.blur();
});

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Math.floor(inputLoanAmount.value);
  if (amount > 0 && currentAccount.movements.some(m => m >= amount * 0.1)) {
    setTimeout(() => {
      //Add movement
      currentAccount.movements.push(amount);
      currentAccount.movementsDates.push(new Date().toISOString());
      updateUi(currentAccount);
      //Reset timer
      clearInterval(timer);
      timer = startLogoutTimer();
    }, 2500);
  }
  inputLoanAmount.value = '';
  inputLoanAmount.blur();
});

let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAccount, !sorted);
  sorted = !sorted;
});

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/////////////////////////////////////////////////

'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

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

function displayMovements(movements, sort = false) {
  containerMovements.innerHTML = '';

  const sortedMovements = sort
    ? movements.slice().sort((a, b) => a - b)
    : movements;

  sortedMovements.forEach(function (m, i) {
    const operationType = m > 0 ? 'deposit' : 'withdrawal';
    const html = `
      <div class="movements__row">
        <div class="movements__type movements__type--${operationType}"> 
         ${i + 1}: ${operationType}        
         </div>
        <div class="movements__date">3 days ago</div>
        <div class="movements__value">${m.toFixed(2)}€</div>
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
  labelBalance.textContent = `${account.balance.toFixed(2)} €`;
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
  labelSumIn.textContent = `${incomes.toFixed(2)} €`;
  labelSumOut.textContent = `${Math.abs(withdrawals).toFixed(2)} €`;
  labelSumInterest.textContent = `${interest.toFixed(2)} €`;
}

function updateUi(account) {
  //Display movements
  displayMovements(account.movements);
  //Display balance
  calcDisplayBalance(account);
  //Display summary
  calcSummary(account);
}

computeUsernames(accounts);
let currentAccount;
btnLogin.addEventListener('click', function (e) {
  //Prevent form from submitting
  e.preventDefault();

  currentAccount = accounts.find(a => a.username === inputLoginUsername.value);
  if (Number(inputLoginPin.value) === currentAccount?.pin) {
    //Display UI and message
    labelWelcome.textContent = `Welcome back ${
      currentAccount.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 100;
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginUsername.blur();
    inputLoginPin.blur();
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

    //clear inputs
    inputTransferTo.value = inputTransferAmount.value = '';
    inputTransferTo.blur();
    inputTransferAmount.blur();
    //Update UI
    updateUi(currentAccount);
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
    //Add movement
    currentAccount.movements.push(amount);
    updateUi(currentAccount);
  }
  inputLoanAmount.value = '';
  inputLoanAmount.blur();
});

let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAccount.movements, !sorted);
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

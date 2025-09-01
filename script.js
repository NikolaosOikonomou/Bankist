'use strict';

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2020-07-26T17:01:17.194Z',
    '2020-07-28T23:36:17.929Z',
    '2020-08-01T10:51:36.790Z',
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

const displayMovements = function (movements, sort = false) {
  containerMovements.innerHTML = '';
  const movs = sort ? movements.slice().sort((a, b) => a - b) : movements;
  movs.forEach(function (mov, i) {
    const depositType = mov > 0 ? 'deposit' : 'withdrawal';
    const htmlElement = `
    <div class="movements__row">
      <div class="movements__type movements__type--${depositType}">${
      i + 1
    } ${depositType}</div>
      <div class="movements__value">${mov.toFixed(2)}€</div>
    </div>
    `;
    containerMovements.insertAdjacentHTML('afterbegin', htmlElement);
  });
};

const calcDisplayBalcance = function (account) {
  account.balance = account.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = `${account.balance.toFixed(2)}€`;
};

const calcDisplaySummary = function (account) {
  const incomes = account.movements.filter(mov => mov > 0).reduce((acc, mov) => acc + mov, 0);
  labelSumIn.innerHTML = `${incomes}€`;

  const out = account.movements.filter(mov => mov < 0).reduce((acc, mov) => acc + mov, 0);
  labelSumOut.innerHTML = `${Math.abs(out)}`;

  const interest = account.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * account.interestRate) / 100)
    .filter(interest => interest >= 1)
    .reduce((acc, interest) => acc + interest, 0);
  labelSumInterest.innerHTML = `${interest.toFixed(2)}€`
};

const createUserNames = function (accs) {
  accs.forEach(
    acc =>
      (acc.username = acc.owner
        .toLowerCase()
        .split(' ')
        .map(word => word[0])
        .join(''))
  );
};

const updateUI = function(acc) {
    displayMovements(acc.movements);
    calcDisplayBalcance(acc);
    calcDisplaySummary(acc);
}

createUserNames(accounts);
let loggedInUser;
// Event Hundlers
btnLogin.addEventListener('click', function (e) {
  e.preventDefault();
  const username = inputLoginUsername.value;
  const pass = +inputLoginPin.value;
  loggedInUser = accounts.find(account => account.username === username);

  if (loggedInUser?.pin === pass) {
    console.log(loggedInUser);
    labelWelcome.textContent = `Welcome back, ${loggedInUser.owner.split(' ')[0]}!`;
    containerApp.style.opacity = 1;
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur(); //field looses focus

    // Update UI
    updateUI(loggedInUser);

  }
});

btnTransfer.addEventListener('click', function(e) {
  e.preventDefault();
  console.log(accounts);
  const amount = +inputTransferAmount.value;
  const receiverAcc = accounts.find(account => account.username === inputTransferTo.value.trim());
  
  if(!amount && amount > 0 || !receiverAcc) return;
  if(amount > loggedInUser.balance || loggedInUser === receiverAcc) return;

  receiverAcc.movements.push(amount);
  loggedInUser.movements.push(-amount);

  // Reset UI
  inputTransferAmount.value = inputTransferTo.value = '';
  updateUI(loggedInUser);
  console.log("Transfer Valid.");
  console.log(accounts);
});

btnClose.addEventListener('click', function (e) {
  e.preventDefault();
  const confirmUser = inputCloseUsername.value;
  const confirmPin = +inputClosePin.value;

  if(confirmUser !== loggedInUser.username || confirmPin !== loggedInUser.pin) return;

  const onDeleteUserIndex = accounts.findIndex(account => account.username === confirmUser);
  console.log(onDeleteUserIndex);
  if(onDeleteUserIndex === -1) return;
  accounts.splice(onDeleteUserIndex, 1);
  inputCloseUsername.value = inputClosePin.value = '';
  console.log(accounts);
  containerApp.style.opacity = 0;
});

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  const loanAmount = Math.floor(inputLoanAmount.value);
  if (loanAmount <= 0) return;
  console.log(loggedInUser.movements.some(mov => mov >= (loanAmount * 20 ) / 100));
  if (!loggedInUser.movements.some(mov => mov > (loanAmount * 20 ) / 100)) return;
  console.log(loggedInUser);
  loggedInUser.movements.push(loanAmount);
  updateUI(loggedInUser);
  inputLoanAmount.value = '';
});

let isSorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(loggedInUser.movements, !isSorted);
  isSorted = !isSorted;
});

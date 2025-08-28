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

const displayMovements = function (movements) {
  containerMovements.innerHTML = '';

  movements.forEach(function (mov, i) {
    const depositType = mov > 0 ? 'deposit' : 'withdrawal';
    const htmlElement = `
    <div class="movements__row">
      <div class="movements__type movements__type--${depositType}">${
      i + 1
    } ${depositType}</div>
      <div class="movements__value">${mov}€</div>
    </div>
    `;
    containerMovements.insertAdjacentHTML('afterbegin', htmlElement);
  });
};

const calcDisplayBalcance = function (account) {
  account.balance = account.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = `${account.balance}€`;
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
  labelSumInterest.innerHTML = `${interest}€`
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
  inputTransferAmount.value = '';
  inputTransferTo.value = '';
  updateUI(loggedInUser);
  console.log("Transfer Valid.");
  console.log(accounts);
})

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

const sum = movements.reduce((acc, curr) => acc + curr, 0);
// console.log(sum);

const max = movements.reduce(
  (acc, mov) => (mov > acc ? mov : acc),
  movements[0]
);
// console.log(max);
/////////////////////////////////////////////////
const calcAverageHumanAge = arr =>
  arr
    .map(age => (age <= 2 ? age * 2 : 16 + age * 4))
    .filter(age => age >= 18)
    .reduce((acc, age, i, arr) => acc + age / arr.length, 0);

const humanAge = calcAverageHumanAge([5, 2, 4, 1, 15, 8, 3]);
console.log(humanAge);

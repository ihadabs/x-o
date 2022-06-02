const readline = require('readline').createInterface({
	input: process.stdin,
	output: process.stdout,
});

// 1
function question(query) {
	// 1
	return new Promise((resolve) => {
		// 1
		readline.question(query, resolve);
	});
}

/// 1- Solve real example
/// 2- Find its Big-O
/// 3- JS vs TS

/// Create an X-O game
/// X | X | X
/// X | X | X
/// X | X | X
/// Use 2d array to hold all values
const game = [
	[' ', ' ', ' '],
	[' ', ' ', ' '],
	[' ', ' ', ' '],
];
let places = [
	{ row: 0, column: 0, string: '0-0' },
	{ row: 0, column: 1, string: '0-1' },
	{ row: 0, column: 2, string: '0-2' },
	{ row: 1, column: 0, string: '1-0' },
	{ row: 1, column: 1, string: '1-1' },
	{ row: 1, column: 2, string: '1-2' },
	{ row: 2, column: 0, string: '2-0' },
	{ row: 2, column: 1, string: '2-1' },
	{ row: 2, column: 2, string: '2-2' },
];

// O(n)
function allEqual(item, ...array) {
	return array.every((l) => l === item);
}

/// O(n^2) Checks if any row has the same letter in all columns
function didWinAnyRow(letter) {
	// n
	return [0, 1, 2].some((row) => {
		// n
		return game[row].every((l) => l === letter);
	});
}

// O(n^2) Checks if any column has the same letter in all rows
function didWinAnyColumn(letter) {
	// n
	return [0, 1, 2].some((column) => {
		// n
		return allEqual(
			letter,
			game[0][column],
			game[1][column],
			game[2][column]
		);
	});
}

// O(n^2)
function didSomeoneWin(letter) {
	// 1 + n^2
	const fromAnyRow = didWinAnyRow(letter);
	// 1 + n^2
	const fromAnyCol = didWinAnyColumn(letter);
	// 1 + n
	const fromCross1 = allEqual(letter, game[0][0], game[1][1], game[2][2]);
	// 1 + n
	const fromCross2 = allEqual(letter, game[2][0], game[1][1], game[0][2]);
	// 1
	return fromAnyRow || fromAnyCol || fromCross1 || fromCross2;
}

// O(n^2)
function printGame() {
	// n
	for (const row of game) {
		// n
		const line = row.join(' | ');
		// 1
		console.log(line);
		// 1
		console.log('---------');
	}
}

// O(1)
function getRandomInt(min, max) {
	// 1
	return Math.round(Math.random() * (max - min)) + min;
}

// O(n)
function getRandomPlace() {
	// 1
	const randomIndex = getRandomInt(0, places.length - 1);
	// 1
	const randomPlace = places[randomIndex];

	// n
	places = places.filter((place, i) => i !== randomIndex);

	// 1
	return randomPlace;
}
// O(n)
function playRandomly(letter) {
	// 1 + n
	const place = getRandomPlace();

	// 1
	game[place.row][place.column] = letter;
}

// O(n^3)
function printIfSomeoneWin() {
	// n
	return ['X', 'O'].some((letter) => {
		// 1 + n^2
		if (didSomeoneWin(letter)) {
			console.log(letter + ' won');
			return true;
		}
		return false;
	});
}

// O(n)
function isThisPlaceAvailable(place) {
	// n
	return places.some((p) => p.row === place.row && p.column === place.column);
}
// O(n^2)
async function playUserOrBot(letter, userChoice) {
	if (letter === userChoice) {
		// n^2
		printGame();
		// 1
		const userPlace = await question(
			'Where do you want to play? e.g. row-column '
		);
		// n
		const arr = userPlace.split('-');
		// 1
		const place = { row: +arr[0], column: +arr[1] };
		// 1 + n
		if (isThisPlaceAvailable(place)) {
			// n
			places = places.filter(
				(p) => !(p.row === place.row && p.column === place.column)
			);

			// 1
			game[place.row][place.column] = letter;
		} else {
			// 1
			console.error(
				'Please be polite and enter correct place next time!'
			);
			// 1
			process.exit();
		}
	} else {
		// n
		playRandomly(letter);
	}
}

// O(n^4)
async function startGame(userChoice) {
	// 1
	let howManyTime = 0;
	// n
	while (howManyTime < 9) {
		// 1
		const letter = howManyTime % 2 === 0 ? 'X' : 'O';

		// n^2
		await playUserOrBot(letter, userChoice);

		// 1
		howManyTime++;
		// 1 + n^3
		if (howManyTime >= 5 && printIfSomeoneWin()) {
			break;
		} else if (howManyTime === 9) {
			console.log('No one won');
		}
	}
}

// O(n^4)
async function play() {
	// 1
	let letter = await question('Please, enter X or O? ');

	// n
	letter = letter.toUpperCase();
	// 1
	if (letter !== 'X' && letter !== 'O') {
		// 1
		console.error('Please be polite and enter correct answer next time!');
		// 1
		process.exit();
	} else {
		// 1
		console.log(`You are ${letter}!`);
	}

	// n^4
	await startGame(letter);

	// n^2
	printGame();

	// 1
	readline.close();
}

// O(n^4)
play();

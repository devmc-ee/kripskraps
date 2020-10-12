;(function () {
	const board = document.querySelector('.board');
	const fields = document.querySelectorAll('.field');
	const markers = document.getElementsByName('userMarker');
	const noteAlertBox = document.querySelector('.note');
	const markerOptions = ['x', '0'];

	let playerMarker = '';
	let computerMarker = '';
	let isComputerMove = false; //defines whose game now
	const game = new KripsKraps();

	let boardStatus = [
		[0, 0, 0], [0, 0, 0], [0, 0, 0]
	];
	let playerMoves = [
		[0, 0, 0], [0, 0, 0], [0, 0, 0]
	];
	let computerMoves = [
		[0, 0, 0], [0, 0, 0], [0, 0, 0]
	];

	//Add listeners to radio buttons for selecting marker fields
	markers.forEach(marker => {
		marker.addEventListener('click', e => {
			playerMarker = e.target.value;
			disableRadioInput();
			const markerIndex = markerOptions.findIndex(el => el === playerMarker);
			computerMarker = markerOptions[1 - markerIndex];
			board.classList.remove('disabled');

		})
	});

	fields.forEach(field => {
		field.addEventListener('click', event => {

			evalField(event, game);
		});
	});

	function disableRadioInput() {
		markers.forEach(marker => {
			marker.disabled = true
		});
	}

	function evalField(event, game) {

		if (game.countedSteps >= game.maxAvailableSteps
			|| game.hasWinner) {
			return false;
		}

		const filedValue = event.target.dataset.value;
		const field = event.target;
		//view
		const markingClasses = {
			"x": "marked-rist",
			"0": "marked-null"
		};

		const marker = isComputerMove ? computerMarker : playerMarker;

		//check if field is marked
		if (!filedValue && !game.hasWinner) {
			//mark field with a marker
			field.dataset.value = marker;
			field.classList.add(markingClasses[marker]);
			game.userStep(event);
			//recordMove(fieldLocation, moves);

			if (game.hasWinner) {
				announceWinner();
			}
			// else
			// 	{
			// 	isComputerMove = !isComputerMove;
			//
			// 	if (isComputerMove) {
			// 		makeComputerMove();
			// 		if (isWinner(computerMoves)) {
			// 			announceWinner();
			// 		}
			// 	}
			// }

		}
	}

	function fillFieldWithMarkAnValue(route) {
		const markingClasses = {
			"x": "marked-rist",
			"0": "marked-null"
		};

		const marker = isComputerMove ? computerMarker : playerMarker;
		const moves = isComputerMove ? computerMoves : playerMoves;
		const newRoute = '' + (parseInt(route[0]) + 1) + (parseInt(route[1]) + 1);

		const fieldToMark = document.querySelector('.field' + newRoute);
		fieldToMark.dataset.value = marker;
		fieldToMark.classList.add(markingClasses[marker]);
	}

	function makeComputerMove() {

		//find the most

		const routesScores = getRoutesScores(computerMoves);
		let bestRoute = findTheBestRoute(routesScores);

		const maxTests = 8;
		let test = 0;
		let nextMove;
		while (!isRouteAvailable(bestRoute)
		&& test < maxTests) {
			bestRoute = findTheBestRoute(routesScores, bestRoute);
			test++;
		}
		nextMove = findEmptyOnTheRoute(bestRoute);

		fillFieldWithMarkAnValue(nextMove);
		isComputerMove = !isComputerMove;
	}

	function findAnyEmptyField() {
		return game(findAnyEmptyFieldOn)
		for (let row = 0; row < 3; row++) {
			for (let col = 0; col < 3; col++) {
				let emptyCol = boardStatus[row].findIndex(el => el === 0);
				if (emptyCol > -1) {
					computerMoves[row][emptyCol] = 1;
					boardStatus[row][emptyCol] = 1;
					return '' + row + emptyCol;

				}
			}

		}
		return false;
	}

	function findEmptyOnTheRoute(route = '') {
		let nextMove = false;
		let emptyRow = 0;


		return !nextMove ? findAnyEmptyField() : nextMove

	}

	function findTheBestRoute(routes, except = '') {
		let maxValue = 0;
		let bestRoute = '';
		for (let route in routes) {
			if (routes[route] > maxValue && route != except) {
				maxValue = routes[route];
				bestRoute = route;
			}
		}
		return bestRoute;
	}

	function getRoutesScores(moves) {
		let routes = {
			'r0': 0,
			'r1': 0,
			'r2': 0,
			'c0': 0,
			'c1': 0,
			'c2': 0,
			'dDown': 0,
			'dUp': 0
		};
		let rowSum;
		let colSum = [0, 0, 0];
		let diagonalDown = 0;
		let diagonalUp = 0;

		for (let row = 0; row < 3; row++) {
			rowSum = 0;


			for (let col = 0; col < 3; col++) {

				rowSum = rowSum + moves[row][col];
				routes['r' + row] = rowSum;
				colSum[col] = colSum[col] + moves[row][col];
				routes['c' + col] = colSum[col];

				if (col === row) {
					diagonalDown = diagonalDown + moves[row][col];
					routes['dDown'] = diagonalDown;
				}

				if ((col === 0 && row === 2)
					|| (col === 1 && row === 1)
					|| (col === 2 && row === 0)) {
					diagonalUp = diagonalUp + moves[row][col];
					routes['dUp'] = diagonalUp;
				}
			}

		}
		return routes;
	}

	function isRouteAvailable(route) {
		let sumComp = 0;
		let sumPlayer = 0;
		//check if the route is free

		switch (route) {
			case'r0':
			case'r1':
			case'r2':

				sumComp = computerMoves[route[1]].reduce((acc, cur) => acc + cur);
				sumPlayer = playerMoves[route[1]].reduce((acc, cur) => acc + cur);


				break;
			case 'c0':
			case 'c1':
			case 'c2':

				for (let i = 0; i < 3; i++) {
					sumComp = sumComp + computerMoves[route[1]][i];
					sumPlayer = playerMoves[route[1]][i];
				}

				break;
			case 'dDown':
			case 'dUp':
				break;
			default:
				return true;

		}
		return sumPlayer === sumComp;
	}

	function addListenersToBoardFields() {

	}

	function announceWinner() {
		const winnerName = isComputerMove ? 'Computer ' : 'Congrats! You ';
		const winnerClass = isComputerMove ? 'fail' : 'success';
		noteAlertBox.classList.add(winnerClass);
		//show alert box and add text
		noteAlertBox.classList.remove('disabled');
		noteAlertBox.innerText = winnerName + ' win!'
	}

	/**
	 *  Define players markers
	 */
	function addListenersToMarkerSlect() {

	}

	/**
	 * Saves user moves into array
	 * @param value
	 * @param moves
	 */
	function recordMove(value, moves) {
		const row = parseInt(value[0]) - 1;
		const col = parseInt(value[1]) - 1;

		moves[row][col] = 1;
		boardStatus[row][col] = 1;
	}

	/**
	 * Checks if the current player is winner
	 */
	function isWinner(moves) {
		//check rows for sum
		return game.isWinner(moves);

	}


//['','','']
// 11 12 13:
// 21 22 23
// 31 32 33

//winning routes
	/*
	r1 = 11 12 13
	r2 = 21 22 23
	r2 = 31 32 33
	 */
})();



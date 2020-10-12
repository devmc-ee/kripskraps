;(function () {
	const board = document.querySelector('.board');
	const fields = document.querySelectorAll('.field');
	const markers = document.getElementsByName('userMarker');
	const noteAlertBox = document.querySelector('.note');
	const markerOptions = ['x', '0'];
	let playerMarker = '';
	let computerMarker = '';
	let isComputerMove = false; //defines whose game now

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
	addListenersToMarkerSlect();

	addListenersToBoardFields();

	function evalField(field, value, fieldLocation) {
		const markingClasses = {
			"x": "marked-rist",
			"0": "marked-null"
		};

		const marker = isComputerMove ? computerMarker : playerMarker;
		const moves = isComputerMove ? computerMoves : playerMoves;
		//check if field is marked
		if (!value) {
			//mark field with a marker
			field.dataset.value = marker;
			field.classList.add(markingClasses[marker]);

			recordMove(fieldLocation, moves);

			if (isWinner(moves)) {
				announceWinner();
			} else {
				isComputerMove = !isComputerMove;

				if (isComputerMove) {
					makeComputerMove();

				}
			}

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
		while (!isRouteAvailable(bestRoute) &&
		test < maxTests) {
			bestRoute = findTheBestRoute(routesScores, bestRoute);

			test++;
		}
		nextMove = findEmptyOnTheRoute(bestRoute);

		fillFieldWithMarkAnValue(nextMove);
		isComputerMove = !isComputerMove;
	}

	function findAnyEmptyField() {

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
		// debugger
		switch (route) {
			case 'r0':
			case'r1':
			case'r2':

				emptyRow = boardStatus[route[1]].findIndex(el => el === 0);
				if (emptyRow > -1) {
					computerMoves[route[1]][emptyRow] = 1;
					boardStatus[route[1]][emptyRow] = 1;
					nextMove = '' + route[1] + emptyRow;
				}


				break;
			case 'c0':
			case 'c1':
			case 'c2':

				for (let i = 0; i < 3; i++) {
					let empty = boardStatus[route[1]].findIndex(el => el === 0);
					if (empty > -1) {

						computerMoves[i][empty] = 1;
						boardStatus[i][empty] = 1;
						nextMove = '' + i + route[1];
						break;
					}
				}

				break;
			case 'dDown':
			case 'dUp':
				break;
			default:
				return findAnyEmptyField()

		}
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
			case 'r0':
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
		fields.forEach(field => {
			field.addEventListener('click', e => {
				const value = e.target.dataset.value;
				const fieldLocation = e.target.dataset.field;
				evalField(e.target, value, fieldLocation);
			});
		});
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
		markers.forEach(marker => {
			marker.addEventListener('click', e => {
				playerMarker = e.target.value;

				const markerIndex = markerOptions.findIndex(el => el === playerMarker);

				computerMarker = markerOptions[1 - markerIndex];
				//enable game board
				board.classList.remove('disabled');

			})
		});
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
		let rowSum;
		let colSum = [0, 0, 0];
		let diagonalDown = 0;
		let diagonalUp = 0;

		for (let row = 0; row < 3; row++) {
			rowSum = 0;

			for (let col = 0; col < 3; col++) {

				rowSum = rowSum + moves[row][col];
				colSum[col] = colSum[col] + moves[row][col];

				if (col === row) {
					diagonalDown = diagonalDown + moves[row][col];
				}

				if ((col === 0 && row === 2)
					|| (col === 1 && row === 1)
					|| (col === 2 && row === 0)) {
					diagonalUp = diagonalUp + moves[row][col];
				}

			}
			if (3 === rowSum
				|| (colSum.findIndex(el => el === 3) > -1)
				|| diagonalDown === 3
				|| diagonalUp === 3) {
				return true;
			}
		}
		return false
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



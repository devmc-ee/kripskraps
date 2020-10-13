const KripsKraps = function () {

	this.isComputerStep = false; //defines whose game now
	this.allSteps = [
		[0, 0, 0], [0, 0, 0], [0, 0, 0]
	];
	this.userSteps = [
		[0, 0, 0], [0, 0, 0], [0, 0, 0]
	];
	this.computerSteps = [
		[0, 0, 0], [0, 0, 0], [0, 0, 0]
	];
	this.countedSteps = 0;
	this.maxAvailableSteps = 9;
	this.hasWinner = false;
	this.compWinningRoutes = [];

	/**
	 * Save current step into player board and common board
	 * @param row
	 * @param col
	 */
	this.saveStep = function (row, col) {
		this.allSteps[row][col] = 1;
		if (this.isComputerStep) {
			this.computerSteps[row][col] = 1;
		} else {
			this.userSteps[row][col] = 1
		}
	};

	/**
	 * save user step & check for win
	 * @param event
	 */
	this.makeUserStep = function (event) {
		this.isComputerStep = false;

		const fieldLocation = event.target.dataset.field;
		const row = parseInt(fieldLocation[0]);
		const col = parseInt(fieldLocation[1]);

		this.saveStep(row, col);
		this.isWinner(this.userSteps);

		this.countedSteps++;
	};

	/**
	 * Check for Winner
	 * @param steps
	 * @returns {boolean}
	 */
	this.isWinner = function (steps) {
		//check rows for sum
		let rowSum;
		let colSum = [0, 0, 0];
		let diagonalDown = 0;
		let diagonalUp = 0;

		for (let row = 0; row < 3; row++) {
			rowSum = 0;

			for (let col = 0; col < 3; col++) {
				//calculate cols in rows
				rowSum = rowSum + steps[row][col];
				colSum[col] = colSum[col] + steps[row][col];

				//calc diagonalDown
				if (col === row) {
					diagonalDown = diagonalDown + steps[row][col];
				}

				//diagonalUp
				if ((col === 0 && row === 2)
					|| (col === 1 && row === 1)
					|| (col === 2 && row === 0)) {
					diagonalUp = diagonalUp + steps[row][col];
				}

			}
			if (3 === rowSum
				|| (colSum.findIndex(el => el === 3) > -1)
				|| diagonalDown === 3
				|| diagonalUp === 3) {
				this.hasWinner = true;
				return true;
			}
		}

		this.hasWinner = false;
		return false;

	};

	/**
	 * Compute comp step and define if it is a winner
	 * @returns {string}
	 */
	this.makeComputerStep = function () {
		let compStep = '';
		this.isComputerStep = true;
		if (this.countedSteps === 1 &&
			this.allSteps[1][1] === 0) {
			this.saveStep(1, 1);

			return '11'
		} else {
			this.compWinningRoutes = this.getWinningRoutes();
			compStep = this.defineStepRoute();
			this.saveStep(parseInt(compStep[0]), parseInt(compStep[1]));
			this.isWinner(this.computerSteps);
			return compStep;

		}

	};

	/**
	 * Find optimal (at least, less expensive) way, step
	 * @returns {string|boolean}
	 */
	this.defineStepRoute = function () {
		let minScoreKey = '';
		let minScoreValue = 0;
		let route;
		for (let key in this.compWinningRoutes) {
			if (this.compWinningRoutes[key] > minScoreValue) {
				minScoreKey = key;
			}

		}

		route = this.findEmptyFieldOn(this.allSteps, minScoreKey);

		return route;
	};

	/**
	 * Find Empty (available) field (step)
	 *
	 * @returns {string|boolean}
	 * @param steps
	 * @param direction
	 */
	this.findEmptyFieldOn = function (steps, direction) {
		let route = '';

		switch (direction) {
			case'r0':
			case'r1':
			case'r2':

			case 'c1':
			case 'c2':
			case 'c3':

				for (let row = 0; row < 3; row++) {
					for (let col = 0; col < 3; col++) {
						if (steps[row][col] === 0) {
							route = '' + row + col;
							break
						}
					}
				}
				break;
			case 'dUp':

				for (let row = 0; row < 3; row++) {
					for (let col = 0; col < 3; col++) {
						//diagonalUp
						if ((col === 0 && row === 2)
							|| (col === 1 && row === 1)
							|| (col === 2 && row === 0)) {
							if (steps[row][col] === 0) {
								route = '' + row + col;
								break
							}
						}

					}
				}
				break;
			case 'dDown':

				for (let row = 0; row < 3; row++) {
					for (let col = 0; col < 3; col++) {
						if (col === row &&
							steps[row][col] === 0) {
							route = '' + row + col;
						}

					}
				}
				break;
			default:
				for (let row = 0; row < 3; row++) {
					for (let col = 0; col < 3; col++) {
						if (steps[row][col] === 0) {
							route = '' + row + col;
							break
						}
					}
				}

		}
		return route;
	};

	/**
	 * Define winning routes: those that have less enemy steps (empty)
	 * @returns {*|[]}
	 */
	this.getWinningRoutes = function () {
		let winningRoutes = [];


		let dUp = [];
		let dDown = [];
		let dCompUp = [];
		let dCompDown = [];
		//check rows
		for (let row = 0; row < 3; row++) {

			let columnEmpty = [];
			let columnComp = [];
			//find empty rows

			winningRoutes = this.checkRouteForWin(this.userSteps[row], this.computerSteps[row],
				'r', row, winningRoutes);
			//check cols, dUp,dDown
			for (let col = 0; col < 3; col++) {
				columnEmpty.push(this.userSteps[col][row]);
				columnComp.push(this.computerSteps[col][row]);

				//calc diagonalDown
				if (col === row) {
					dDown.push(this.userSteps[col][row]);
					dCompDown.push(this.computerSteps[col][row])
				}

				//diagonalUp
				if ((row === 0 && col === 2)
					|| (row === 1 && col === 1)
					|| (row === 2 && col === 0)) {
					dUp.push(this.userSteps[col][row]);
					dCompUp.push(this.computerSteps[col][row])
				}
			}

			//find empty cols
			winningRoutes = this.checkRouteForWin(columnEmpty, columnComp, 'c', row, winningRoutes);
		}
		//find empty dUp

		winningRoutes = this.checkRouteForWin(dUp, dCompUp, 'dUp', '', winningRoutes);
		//find empty dDown

		winningRoutes = this.checkRouteForWin(dDown, dCompDown, 'dDown', '', winningRoutes);

		return winningRoutes;
	};

	/**
	 * set winning score: the less number, the better route- has already own steps,
	 * so less steps for win
	 * @param userStepsArray
	 * @param compStepsArray
	 * @param directionCode
	 * @param index
	 * @param winningRoutes
	 * @returns {*}
	 */
	this.checkRouteForWin = function (userStepsArray, compStepsArray, directionCode, index = '', winningRoutes) {
		if (this.isEmptyRoute(userStepsArray)) {
			winningRoutes[directionCode + index] = (3 - this.sumArray(compStepsArray));
		}
		return winningRoutes;
	};

	/**
	 * Return Max value in array
	 * Helps to define if array (route) has steps of opponent
	 * @param array
	 * @returns {*}
	 */
	this.maxInArray = function (array) {
		return array.reduce((com, cur) => Math.max(com, cur));
	};

	/**
	 * Defines if route (array) is empty or not.
	 * @param route
	 * @returns {boolean}
	 */
	this.isEmptyRoute = function (route) {
		const maxArrValue = this.maxInArray(route);
		return maxArrValue < 1;
	};

	this.sumArray = function (array) {
		return array.reduce((com, cur) => com + cur);
	}
};

/*
user			comp			all
[0, 1, 0]     	[0, 0, 0]		[0, 1, 0]
[0, 0, 0] 		[0, 1, 0]		[0, 1, 0]
[0, 1, 0]		[0, 0, 0]		[0, 1, 0]

find winning routes => [r1, dUp, dDown]
r0 = 3-1u => Nan
r1 = 3 - 1 = 2
r2 = 3-1u => Nan

c0 = 3
c1 = 3-2u => Nan
c2 = 3

dUp = 3 -1 = 2
dDown = 3 -1
 */
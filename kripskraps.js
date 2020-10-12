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

	/**
	 *
	 * @param board
	 * @returns {string|boolean}
	 */
	this.findAnyEmptyFieldOn = function (board) {

		for (let row = 0; row < 3; row++) {
			for (let col = 0; col < 3; col++) {
				let emptyCol = board[row].findIndex(el => el === 0);
				if (emptyCol > -1) {

					this.saveStep(row, emptyCol);
					return '' + row + emptyCol;
				}
			}
		}
		return false;
	};

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
	 * save user step & checks for win
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
	 *
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


	this.makeComputerStep = function () {
		this.isComputerStep = true;
		console.log('Computer Step', this.getWinningRoutes());
	};

	this.getWinningRoutes = function () {
		let winningRoutes = [];
		let emptyRoutes = [];

		let dUp = [];
		let dDown = [];

		//check rows
		for (let row = 0; row < 3; row++) {

			let column = [];
			//find empty rows
			emptyRoutes = this.pushEmptyArray(this.userSteps[row], emptyRoutes, 'r', row);

			//check cols, dUp,dDown
			for (let col = 0; col < 3; col++) {
				column.push(this.userSteps[col][row]);

				//calc diagonalDown
				if (col === row) {
					dDown.push(this.userSteps[col][row]);
				}

				//diagonalUp
				if ((row === 0 && col === 2)
					|| (row === 1 && col === 1)
					|| (row === 2 && col === 0)) {
					dUp.push(this.userSteps[col][row]);
				}
			}

			//find empty cols
			emptyRoutes = this.pushEmptyArray(column, emptyRoutes, 'c', row);
		}
		//find empty dUp
		emptyRoutes = this.pushEmptyArray(dUp, emptyRoutes, 'dUp');

		//find empty dDown
		emptyRoutes = this.pushEmptyArray(dDown, emptyRoutes, 'dDown');

		if (emptyRoutes.length === 0) console.log('No Empty')

		//find the smallest routes

		return emptyRoutes;
	};
	/**
	 * Compare empty routes and computer steps to find the smallest routes
	 * @param emptyRoutes
	 */
	this.getSmallestRoutes = function (emptyRoutes) {
		const length = emptyRoutes.length;
		// for(let )
	};

	this.pushEmptyArray = function (array, emptyRoutes, code, index = '') {
		const maxArrValue = this.maxInArray(array);
		if (maxArrValue < 1) {
			emptyRoutes.push(code + index);
		}
		return emptyRoutes;
	};

	this.maxInArray = function (array) {
		return array.reduce((com, cur) => Math.max(com, cur));
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
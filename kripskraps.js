const KripsKraps = function () {

	this.isComputerStep = false; //defines whose game now
	this.boardSteps = [
		[0, 0, 0], [0, 0, 0], [0, 0, 0]
	];
	this.userSteps = this.computerSteps = this.boardSteps;
	this.gameStepsCount = 0;
	this.gameStepsCountMax = 9// max === 9
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
		this.boardSteps[row][col] = 1;
		if (this.isComputerStep) {
			this.computerSteps[row][col] = 1;
		} else {
			this.userSteps[row][col] = 1
		}
	};

	/**
	 * saves user step
	 * checks for win
	 * @param event
	 */
	this.userStep = function (event) {
		this.isComputerStep = false;

		const fieldLocation = event.target.dataset.field;
		const row = parseInt(fieldLocation[0]);
		const col = parseInt(fieldLocation[1]);
		this.saveStep(row, col);

		this.gameStepsCount++;
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

				rowSum = rowSum + steps[row][col];
				colSum[col] = colSum[col] + steps[row][col];

				if (col === row) {
					diagonalDown = diagonalDown + steps[row][col];
				}

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

	}

};
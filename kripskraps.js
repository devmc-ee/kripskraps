const KripsKraps = function () {

	this.isComputerStep = false; //defines whose game now
	this.boardSteps = [
		[0, 0, 0], [0, 0, 0], [0, 0, 0]
	];
	this.userSteps = this.computerSteps = this.boardSteps;
	this.gameStepsCount = 0;// max === 9

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

	this.saveStep = function (row, col) {
		this.boardSteps[row][col] = 1;
		if (this.isComputerStep) {
			this.computerSteps[row][col] = 1;
		} else {
			this.userSteps[row][col] = 1
		}
	};

	this.userStep = function (event) {
		this.isComputerStep = false;

		const fieldLocation = event.target.dataset.field;
		const row = parseInt(fieldLocation[0]);
		const col = parseInt(fieldLocation[1]);
		this.saveStep(row, col)

		console.log('STEP: ', this.userSteps)
		this.gameStepsCount++;
	};

	this.checkWin = function (steps) {

	}

};
const KripsKraps = function () {

	this.markerOptions = ['x', '0'];
	this.playerMarker = '';
	this.computerMarker = '';
	this.isComputerStep = false; //defines whose game now
	this.boardSteps = [
		[0, 0, 0], [0, 0, 0], [0, 0, 0]
	];
	this.playerSteps = this.computerSteps = this.boardSteps;
	this.gameStepsCount = 0;

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
		}else{
			this.playerSteps[row][col] = 1
		}
	}
};
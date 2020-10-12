const KripsKraps = function () {

	this.markerOptions = ['x', '0'];
	this.playerMarker = '';
	this.computerMarker = '';
	this.isComputerMove = false; //defines whose game now
	this.boardFieldsStatus = [
		[0, 0, 0], [0, 0, 0], [0, 0, 0]
	];
	this.playerSteps = this.computerSteps= this.boardFieldsStatus;
}
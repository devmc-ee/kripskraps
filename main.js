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

	/**
	 * Callback in event listerner on click event
	 *
	 * @param event
	 * @param game
	 * @returns {boolean}
	 */
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
		if (!filedValue) {
			//mark field with a user marker
			field.dataset.value = marker;
			field.classList.add(markingClasses[marker]);

			game.makeUserStep(event);

			if (game.hasWinner) {
				announceWinner();
				return true;
			}

			const compStep = game.makeComputerStep();
			fillFieldWithMarkAnValue(compStep, true);
			if (game.hasWinner) {
				announceWinner();
				return true;
			}


		}
	}

	/**
	 * Add step marker on field
	 * @param route
	 * @param isComputerStep
	 */
	function fillFieldWithMarkAnValue(route, isComputerStep = false) {
		const markingClasses = {
			"x": "marked-rist",
			"0": "marked-null"
		};

		const marker = isComputerStep ? computerMarker : playerMarker;

		const newRoute = '' + (parseInt(route[0])) + (parseInt(route[1]));

		const fieldToMark = document.querySelector('.field' + newRoute);
		fieldToMark.dataset.value = marker;
		fieldToMark.classList.add(markingClasses[marker]);
	}

	/**
	 * Notice that appear when game is over
	 */
	function announceWinner() {
		const winnerName = game.isComputerStep ? 'Computer ' : 'Congrats! You ';
		const winnerClass = game.isComputerStep ? 'fail' : 'success';
		noteAlertBox.classList.add(winnerClass);
		//show alert box and add text
		noteAlertBox.classList.remove('disabled');
		noteAlertBox.innerText = winnerName + ' win!'
	}

})();



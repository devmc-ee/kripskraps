;(function () {
	const  board = document.querySelector('.board');
	const fields = document.querySelectorAll('.field');
	const markers = document.getElementsByName('userMarker');
	let selectedMarker = '';

	markers.forEach( marker => {
		marker.addEventListener('click', e => {
			selectedMarker = e.target.value;
			//enable game board
			board.classList.remove('disabled');
		})
	});
	fields.forEach( field => {
		field.addEventListener('click', e => {
			const value = e.target.dataset.value;
			const field = e.target.dataset.field;
			evalField(e.target, value, selectedMarker);
		});
	})
})();

function evalField(field, value, marker) {
	const markingClasses = {
		"x": "marked-rist",
		"0": "marked-null"
	};
	//check if field is marked
	if(!value){
		//mark field with a marker
		console.log(field, value, marker );
		field.dataset.value = marker;
		field.classList.add(markingClasses[marker]);

	}
}
function calc(value) {

	console.log('CALC: ',value)

}
// 11 12 13:
// 21 22 23
// 31 32 33
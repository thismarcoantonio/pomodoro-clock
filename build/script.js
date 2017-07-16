// Varibles About time
let time = document.getElementById('timer');
let timeDesc = document.getElementById('time-desc');
// Variables About main Buttons
const play = document.getElementById('playButton');
const pause = document.getElementById('pauseButton');
const stop = document.getElementById('stopButton');
// Panel Varibles
const sessionSpan = document.getElementById('sessionSpan');
const breakSpan = document.getElementById('breakSpan');
const history = document.querySelector('.history');
const hidePanel = document.querySelector('.hidePanel');

var hasAlreadyPlayed = false;
var isFirstTime = true;

var ticking;

var timer;

function timing(){
	hidePanel.style.visibility = 'visible';
	hidePanel.style.opacity = '1';

	// Check if this function has played Before.
	if(!hasAlreadyPlayed){
		ticking = sessionSpan.textContent * 60;
	}
	hasAlreadyPlayed = true;


	timer = setInterval(() => {

		minutes = Math.floor(ticking / 60); // get Minutes
		seconds = ticking % 60; // get Seconds

		if(parseInt(seconds) < 10){
			seconds = '0' + seconds;
		}
		if(parseInt(minutes) < 10){
			minutes = '0' + minutes;
		}

		time.innerHTML = minutes + ':' + seconds;
		if(ticking <= 0){

			if(isFirstTime){
				history.innerHTML = `<h1>Last Pomodoro</h1>`;
				isFirstTime = false;
			}

			if(timeDesc.textContent == 'break'){
				history.innerHTML += `
					<div>${breakSpan.textContent} minutes | Break</div>	
				`;
				ticking = sessionSpan.textContent * 60;
				timeDesc.textContent = 'session';
			}else if(timeDesc.textContent == 'session'){
				history.innerHTML += `
					<div>${sessionSpan.textContent} minutes | Session</div>
				`;
				ticking = breakSpan.textContent * 60;
				timeDesc.textContent = 'break';
			}
		}
		ticking -= 1; // decrement the time

	}, 1000);


	this.classList.add("hidden"); // make play button invisible
	pause.classList.remove("hidden"); // show pause button
}

function pauseTiming() {
	clearInterval(timer); // make the time ticking to stop

	this.classList.add("hidden"); // make pause button invisible
	play.classList.remove("hidden"); // show play button
}

function stopTiming(){
	hidePanel.style.visibility = 'hidden';
	hidePanel.style.opacity = '0';

	history.innerHTML = `
			<h1>Last Pomodoro</h1>
			<div>Your time history will appear right here!</div>`;
	time.innerHTML = sessionSpan.textContent + ':00' ;
	timeDesc.textContent = 'session';


	clearInterval(timer);
	hasAlreadyPlayed = false;

	pause.classList.add("hidden"); // show play button
	play.classList.remove("hidden"); // show play button

	ticking = sessionSpan.textContent * 60;
}

function changeTiming(letter, symbol){
	const section = document.getElementById(letter + 'Button');
	const button = section.querySelector('#' + symbol);
	let span = section.querySelector('span');
	button.addEventListener('click', () => {
		if(symbol == 'minus'){
			span.innerHTML -= 1;
		}else{
			span.innerHTML = parseInt(span.innerHTML) + 1;
		}

		if(span.innerHTML < 10){
			span.innerHTML = '0' + span.innerHTML;
		}
		if(span.innerHTML <= 1){
			span.innerHTML = '01';
		}
		if(span.innerHTML >= 60){
			span.innerHTML = '60';
		}

		if(letter == 's'){
			time.innerHTML = span.innerHTML + ':00';
		}
	});
}

changeTiming('s', 'minus');
changeTiming('s', 'plus');
changeTiming('b', 'minus');
changeTiming('b', 'plus');


play.addEventListener('click', timing);
pause.addEventListener('click', pauseTiming);
stop.addEventListener('click', stopTiming);


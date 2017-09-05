var KEYS = ['c', 'd', 'e', 'f'];
var NOTE_DURATION = 1000;
var clickedKeys = [];
var clickTimeout;
var simonKeys = [];
var simonIndex = 0;
var level = 1;

// play simon
var SIMON = true;
var currOnClick = null;
// NoteBox
//
// Acts as an interface to the coloured note boxes on the page, exposing methods
// for playing audio, handling clicks,and enabling/disabling the note box.
function playKeys(keys) {
	for(let i = 0; i < keys.length; i++) {
		clickedKey = keys[i];
		setTimeout(notes[clickedKey].play.bind(null, clickedKey), i * NOTE_DURATION);
	};
	keys = [];
}

function startGame () {
	// light up all keys
	KEYS.forEach(function (key, i) {
		notes[key].lightUp();
	})
	// play random key to start game
	this.simonKeys.push(this.chooseRandomKey());
	setTimeout(function () {this.playKeys(this.simonKeys)}, 1500);
}

function simonOnClick(key) {
	if (simonKeys[simonIndex] != key) {
		//incorrect response, light up all keys and restart game
		simonKeys = [];
		clickedKeys = [];
		simonIndex= 0;
		level = 1;
		startGame();
	} 
	else {
		simonIndex++;

		if (simonIndex == level) {
		// pattern completed, go to next level
			level++;
			clickedKeys = [];
			simonIndex = 0;
			simonKeys.push(chooseRandomKey());
			setTimeout(function () {playKeys(simonKeys)}, 1000);
		
		}
	}
	// else do nothing, still need to finish level
}

function chooseRandomKey() {
	return KEYS[this.getRandomInt(0, KEYS.length)];
}

// Code taken from
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
function getRandomInt(min, max) {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}

function onClick() {
	clearTimeout(clickTimeout);
	clickTimeout = setTimeout(function () {this.playKeys(this.clickedKeys);}, 2500);
}

function NoteBox(key, onClick) {
	// Create references to box element and audio element.
	var boxEl = document.getElementById(key);
	var audioEl = document.getElementById(key + '-audio');
	if (!boxEl) throw new Error('No NoteBox element with id' + key);
	if (!audioEl) throw new Error('No audio element with id' + key + '-audio');

	// When enabled, will call this.play() and this.onClick() when clicked.
	// Otherwise, clicking has no effect.
	var enabled = true;
	// Counter of how many play calls have been made without completing.
	// Ensures that consequent plays won't prematurely remove the active class.
	var playing = 0;

	this.key = key;
	this.onClick = onClick || function () {};

	// Plays the audio associated with this NoteBox
	this.play = function () {
		playing++;
		// Always play from the beginning of the file.
		audioEl.currentTime = 0;
		audioEl.play();

		// Set active class for NOTE_DURATION time
		boxEl.classList.add('active');
		setTimeout(function () {
			playing--
			if (!playing) {
				boxEl.classList.remove('active');
			}
		}, NOTE_DURATION)
	}

	// light up the notebox for NOTE_DURATION time (no sound)
	this.lightUp = function () {		
		boxEl.classList.add('active');
		setTimeout(function () {
			boxEl.classList.remove('active');
		}, NOTE_DURATION)
	}
	// Enable this NoteBox
	this.enable = function () {
		enabled = true;
	}

	// Disable this NoteBox
	this.disable = function () {
		enabled = false;
	}

	// Call this NoteBox's clickHandler and play the note.
	this.clickHandler = function () {
		if (!enabled) return;
		clickedKeys.push(this.key);
		this.onClick(this.key);
		
	}.bind(this)

	boxEl.addEventListener('mousedown', this.clickHandler);
}

// Example usage of NoteBox.
//
// This will create a map from key strings (i.e. 'c') to NoteBox objects so that
// clicking the corresponding boxes on the page will play the NoteBox's audio.
// It will also demonstrate programmatically playing notes by calling play directly.
var notes = {};



// if Simon game on, set handler to simonClickHandler 

currOnClick = SIMON ? this.simonOnClick : this.onClick;
KEYS.forEach(function (key) {
	notes[key] = new NoteBox(key, currOnClick);
});

if (SIMON) {
	startGame();
}




//KEYS.concat(KEYS.slice().reverse()).forEach(function(key, i) {
//	setTimeout(notes[key].play.bind(null, key), i * NOTE_DURATION);
//});

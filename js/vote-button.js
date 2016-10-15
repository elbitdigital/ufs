
/* Vote Button */

var VoteButton = (function () {

	/**
	 * Vote Button constructor
	 * @constructor
	 */
	function VoteButton(matchKey, candidateKey) {

		var self = this;

		this.matchKey = matchKey;
		this.candidateKey = candidateKey;

		this.vote = function (event) {

			if (self.delay)
				clearTimeout(self.delay);

			modal.show();

			self.delay = setTimeout(function () {

				var vote = new Vote(self.matchKey, self.candidateKey);
				vote.send();

				setTimeout(function () {

					modal.hide();

				}, 2000); /* 2000 */

			}, 1000); /* 1000 */

		};

		this.onClick = function () {

			self.vote();

		};

		this.onTouchStart = function () {

			self.vote();

			try {

				window.navigator.vibrate(200);
				self.doBeep();

			} catch (e) { }

		};

		this.init();

	}

	VoteButton.prototype.delay = false;

	VoteButton.prototype.audio = new Audio('../audio/music_marimba_chord.wav');

	VoteButton.prototype.doBeep = function () {

		if (this.audio) {

			// stop audio
			this.audio.pause();
			this.audio.currentTime = 0;

			// play audio
			this.audio.play();

		}

	};

	VoteButton.prototype.build = function (candidate) {

		// normalize element
		this.element.innerHTML = '';
		this.element.className = 'Button';

		// create button pill element
		this.pill = document.createElement('span');
		this.pill.className = 'Button-pill';
		this.element.appendChild(this.pill);

		// create button pill span element (text 'votar!')
		this.pillSpan = document.createElement('span');
		this.pillSpan.innerText = 'Votar!';
		this.pill.appendChild(this.pillSpan);

		// create button span element
		this.label = document.createElement('span');
		this.label.className = 'Button-label';
		this.element.appendChild(this.label);

		// create button span span element (candidate title)
		this.labelSpan = document.createElement('span');
		this.labelSpan.innerText = candidate.name;
		this.label.appendChild(this.labelSpan);

	};

	VoteButton.prototype.init = function () {

		// create button element
		this.element = document.createElement('button');

		try {

			// add event listeners to element
			this.element.addEventListener('click', this.onClick, false);
			this.element.addEventListener('touchstart', this.onTouchStart, false);

		} catch (e) { }

	};

	return VoteButton;

})();
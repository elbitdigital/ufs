/*!
 * Mowe {ProjectName} Project v0.0.0 (http://letsmowe.org/)
 * Copyright 2013-2015 Mowe Developers
 * Licensed under MIT (https://github.com/mowekabanas/base/blob/master/LICENSE)
*/



/* App */

var App = (function () {

	/**
	 * App constructor
	 * @constructor
	 */
	function App(element, base) {

		var self = this;

		this.element = element;
		this.base = base;

		this.votingBox = new VotingBox(document.getElementById('voting-box'), this.base);

		this.header = document.getElementById('ufs-app-header');

		this.fullscreenCtrl = function () {

			self.requestFullScreen();

		};

		this.isFullscreen = false;

		this.init();

	}

	App.prototype.requestFullScreen = function () {

		if (!this.isFullscreen) {

			// go to fullscreen
			if (document.documentElement.requestFullscreen) {
				document.documentElement.requestFullscreen();
			} else if(document.documentElement.mozRequestFullScreen) {
				document.documentElement.mozRequestFullScreen();
			} else if(document.documentElement.webkitRequestFullscreen) {
				document.documentElement.webkitRequestFullscreen();
			} else if(document.documentElement.msRequestFullscreen) {
				document.documentElement.msRequestFullscreen();
			}

		} else {

			// exit full fullscreen
			if (document.exitFullscreen) {
				document.exitFullscreen();
			} else if(document.mozCancelFullScreen) {
				document.mozCancelFullScreen();
			} else if(document.webkitExitFullscreen) {
				document.webkitExitFullscreen();
			}

		}

		this.isFullscreen = !this.isFullscreen;

	};

	App.prototype.init = function () {

		this.header.addEventListener('click', this.fullscreenCtrl);

	};

	return App;

})();

/* Candidate */

var Candidate = (function () {

	/**
	 * Candidate constructor
	 * @constructor
	 */
	function Candidate(element, candidateRef, voteButton) {

		var self = this;
	
		this.element = element;
		this.candidateRef = candidateRef;
		this.voteButton = voteButton;

		this.key = false;

		this.onCandidateChange = function (snap) {

			var candidate = snap.val();

			if (candidate) {

				self.name = candidate.name;
				self.photoURL = candidate.photoURL;

				self.build(candidate);

			}

		};

		if (this.element && this.candidateRef)
			this.init();

	}

	Candidate.prototype.build = function (candidate) {

		try {

			// normalize element
			this.element.innerHTML = '';
			this.element.className = 'Candidate';

			/* BACKGROUND */

			// create background element
			this.background = document.createElement('div');
			this.background.className = 'Candidate-background';
			this.element.appendChild(this.background);

			// add overlay to background
			this.overlay = document.createElement('div');
			this.overlay.className = 'Candidate-overlay';
			this.background.appendChild(this.overlay);

			// add candidate title to background (name)
			this.title = document.createElement('div');
			this.title.className = 'Candidate-title';
			this.titleSpan = document.createElement('span');
			this.titleSpan.innerText = this.name;
			this.title.appendChild(this.titleSpan);
			this.background.appendChild(this.title);

			// add image element to background
			this.image = document.createElement('div');
			this.image.className = 'Candidate-image';
			this.background.appendChild(this.image);

			// set image background
			this.image.style.backgroundImage = 'url(' + this.photoURL + ')';

			/* INNER */

			// create inner element
			this.inner = document.createElement('div');
			this.inner.className = 'Candidate-inner';
			this.element.appendChild(this.inner);

			// append button element to inner
			this.voteButton.build(this);
			this.inner.appendChild(this.voteButton.element);

		} catch (e) { }

	};

	Candidate.prototype.destroy = function () {

		try {

			this.element.innerHeight = '';
			self.candidateRef.off();

		} catch (e) { }

	};

	Candidate.prototype.ctrlDataRefs = function () {

		// set current
		try {

			this.candidateRef.on('value', this.onCandidateChange);

		} catch (e) { }

	};

	Candidate.prototype.init = function () {

		this.ctrlDataRefs();

	};

	return Candidate;

})();

/* Match */

var Match = (function () {

	/**
	 * Match constructor
	 * @constructor
	 */
	function Match(element, matchRef) {

		var self = this;

		this.element = element;
		this.matchRef = matchRef;

		this.key = false;

		this.candidates = [];

		this.onMatchValueChange = function (snap) {

			// add key to match
			if (!self.key)
				self.key = snap.key;

			var match = snap.val();

			if (match)
				self.build(match);

		};

		if (this.element && this.matchRef)
			this.init();

	}

	Match.prototype.build = function (match) {

		try {

			// reset element
			this.element.innerHTML = '';

			// destroy all candidates
			this.destroyAllCandidates();

			// temporary array of candidates
			var candidates = Object.keys(match.candidates);

			// create all candidates
			for (var i = 0; i < candidates.length; i++) {

				// candidate element
				var candidateElement = document.createElement('div');

				// candidate data reference
				var candidateRef = firebase.database().ref('candidates/' + candidates[i]);

				// candidate vote button
				var candidateVoteButton = new VoteButton(this.key, candidates[i]);

				// candidate instance
				var candidate = new Candidate(candidateElement, candidateRef, candidateVoteButton);

				// add direction style to candidate (left, right)
				candidate.classList = 'left';

				// push to candidates array the new
				candidates.push(candidate);

				// append candidate element to match
				this.element.appendChild(candidate.element);

			}

		} catch (e) { }

	};

	Match.prototype.destroyAllCandidates = function () {

		for (var i = this.candidates.length; i--; )
			this.candidates[i].destroy();

		// reset candidates array
		this.candidates = [];

	};

	Match.prototype.destroy = function() {

		console.log('destruindo match');

		try {

			this.destroyAllCandidates();

			this.element.innerHTML = '';
			this.matchRef.off();

		} catch (e) { }

	};

	Match.prototype.ctrlDataRefs = function () {

		// set current
		try {

			this.matchRef.on('value', this.onMatchValueChange);

		} catch (e) { }

	};

	Match.prototype.init = function() {

		this.ctrlDataRefs();

	};

	return Match;

})();

/* Modal */

var Modal = (function () {

	/**
	 * Modal constructor
	 * @constructor
	 */
	function Modal(element) {

		var self = this;

		this.element = element;

		this.isShown = false;

		if (this.element)
			this.init();

	}

	Modal.prototype.toggle = function () {

		if (this.isShown)
			this.hide();
		else
			this.show();

	};

	Modal.prototype.show = function () {

		var self = this;

		this.isShown = true;

		this.element.classList.add('is-active');

		setTimeout(function () {

			self.element.classList.add('is-shown');

		}, 50);

	};

	Modal.prototype.hide = function () {

		var self = this;

		this.isShown = false;

		this.element.classList.remove('is-shown');

		setTimeout(function () {

			self.element.classList.remove('is-active');

		}, 600);

	};

	Modal.prototype.init = function () {

		if (this.element.classList.contains('is-active'))
			this.isShown = true;

	};

	return Modal;

})();

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

				}, 2000);

			}, 1000);

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

/* Vote */

var Vote = (function () {

	/**
	 * Vote constructor
	 * @constructor
	 */
	function Vote(matchKey, candidateKey) {

		this.match = matchKey;
		this.candidate = candidateKey;

		this.timestamp = Date.now();
		this.userAgent = window.navigator.userAgent;

		this.key = null;

	}

	Vote.prototype.send = function () {

		try {

			this.key = votesRef.push(this).key;
			console.log(this.key);

			ga('send', 'event', {
				eventCategory: 'Voto',
				eventAction: this.match,
				eventLabel: this.candidate,
				eventValue: 1
			});

		} catch (e) { }

	};

	return Vote;

})();

/* Voting Box */

var VotingBox = (function () {

	/**
	 * Voting Box constructor
	 * @constructor
	 */
	function VotingBox(element, base) {

		var self = this;

		this.element = element;
		this.base = base;

		this.current = false;
		this.match = false;

		this.onCurrentValueChange = function (snap) {

			var current = snap.val();

			if (current) {

				self.current = current;

				if (self.match)
					self.match.destroy();

				self.match = new Match(document.getElementById('match'), self.rootRef.ref('matches').child(current));

			}

		};

		if (this.element && this.base)
			this.init();

	}

	VotingBox.prototype.ctrlDataRefs = function () {

		// set root
		this.rootRef = this.base.database();

		// set current
		this.currentRef = this.rootRef.ref('current');
		this.currentRef.on('value', this.onCurrentValueChange);

	};

	VotingBox.prototype.init = function () {

		this.ctrlDataRefs();

	};

	return VotingBox;

})();
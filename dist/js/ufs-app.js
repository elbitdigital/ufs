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
	function Candidate(element, candidateRef) {
	
		this.element = element;
		this.candidateRef = candidateRef;

		this.onMatchChange = function (snap) {

			var candidate = snap.val();

			if (candidate) {

				self.build(candidate);

			}

		};

		if (this.element && this.candidateRef)
			this.init();

	}

	Candidate.prototype.build = function (candidate) {

		try {

			this.element.innerHTML = '';

			this.background = document.createElement('div');
			this.element.appendChild(this.background);

			this.inner = document.createElement('div');
			this.element.appendChild(this.inner);

			this.name = document.createElement('span');
			this.photoURL = document.createElement('img');

			this.name.appendChild(document.createTextNode(candidate.name));

			this.name.appendChild(document.createTextNode(candidate.photoURL));

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

		this.candidates = [];

		this.onMatchChange = function (snap) {

			var match = snap.val();

			if (match) {

				self.destroy();
				self.build(match);

			}

			console.log(match);

		};

		if (this.element && this.matchRef)
			this.init();

	}

	Match.prototype.build = function () {

		try {

			for (var i = this.candidates.length; i--; )
				candidates[i].destroy();

			this.element.innerHTML = '';

		} catch (e) { }

	};

	Match.prototype.destroy = function() {

		console.log('destruindo match');

		try {

			for (var i = this.candidates.length; i--; )
				candidates[i].destroy();

			this.element.innerHTML = '';
			this.matchRef.off();

		} catch (e) { }

	};

	Match.prototype.ctrlDataRefs = function () {

		// set current
		try {

			this.matchRef.on('value', this.onMatchChange);

		} catch (e) { }

	};

	Match.prototype.init = function() {

		this.matchRef.on('value', function (snap) {

			console.log(snap.val());

		});

	};

	return Match;

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

		this.onCurrentChange = function (snap) {

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
		this.currentRef.on('value', this.onCurrentChange);

	};

	VotingBox.prototype.init = function () {

		this.ctrlDataRefs();

	};

	return VotingBox;

})();
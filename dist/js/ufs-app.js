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

/*  */

var  = (function () {

	/**
	 *  constructor
	 * @constructor
	 */
	function () {
	
		

	}

	return ;

})();

/* Match */

var Match = (function () {

	/**
	 * Match constructor
	 * @constructor
	 */
	function Match(element, matchRef) {

		this.element = element;
		this.matchRef = matchRef;

		this.candidates = [];

		console.log(this.element);

		if (this.element && this.matchRef)
			this.init();

	}

	Match.prototype.destroy = function() {

		console.log('destruindo match');

		try {

			this.element.innerHTML = '';
			this.matchRef.off();

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

		var self = this;

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
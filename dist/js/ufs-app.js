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

		this.VotingBox = new VotingBox(document.getElementById('voting-box'), this.base);

		this.header = document.getElementById('ufs-app-header');

		this.fullscreenCtrl = function () {

			self.requestFullScreen();

		};

		this.isFullscreen = false

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

		if (this.element && this.base)
			this.init();

	}

	VotingBox.prototype.ctrlDataRefs = function () {

		var self = this;

		this.rootRef = this.base.database();

		this.candidatesRef = this.rootRef.ref('candidates');
		this.candidatesRef.on('value', function (snap) {

			console.log(snap.val());

		});

		this.matchesRef = this.rootRef.ref('matches');
		this.matchesRef.on('value', function (snap) {

			console.log(snap.val());

		});

		this.currentRef = this.rootRef.ref('current');
		this.currentRef.on('value', function (snap) {

			console.log(snap.val());

		});

		this.votesRef = this.rootRef.ref('votes');
		this.votesRef.on('value', function (snap) {

			console.log(snap.val());

		});


	};

	VotingBox.prototype.init = function () {

		this.ctrlDataRefs();

	};

	return VotingBox;

})();
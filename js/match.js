
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

				if (match.candidates)
					self.candidates = match.candidates;

				if (match.isActive)
					self.isActive = match.isActive;

			}

		};

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
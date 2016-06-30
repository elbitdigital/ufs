
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

		if (this.element && this.matchRef)
			this.init();

	}

	Match.prototype.destroy = function() {

		console.log('destruindo match');

		try {

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
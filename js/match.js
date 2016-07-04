
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

		};

		if (this.element && this.matchRef)
			this.init();

	}

	Match.prototype.build = function () {

		try {

			this.title = '';

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
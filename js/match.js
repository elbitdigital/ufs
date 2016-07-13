
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
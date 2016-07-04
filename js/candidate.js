
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
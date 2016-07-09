
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
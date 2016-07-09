
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
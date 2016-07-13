
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

			self.current = snap.val();

			if (self.match)
				self.match.destroy();

			if (self.current)
				self.match = new Match(document.getElementById('match'), self.rootRef.ref('matches').child(self.current));

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
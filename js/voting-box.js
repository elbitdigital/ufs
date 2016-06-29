
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
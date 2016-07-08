
/* Vote */

var Vote = (function () {

	/**
	 * Vote constructor
	 * @constructor
	 */
	function Vote(matchKey, candidateKey) {

		this.match = matchKey;
		this.candidate = candidateKey;

		this.timestamp = Date.now();
		this.userAgent = window.navigator.userAgent;

		this.key = null;

	}

	Vote.prototype.send = function () {

		try {

			this.key = votesRef.push(this).key;
			console.log(this.key);

		} catch (e) { }

	};

	return Vote;

})();
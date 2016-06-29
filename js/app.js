
/* App */

var App = (function () {

	/**
	 * App constructor
	 * @constructor
	 */
	function App(element, base) {

		this.element = element;
		this.base = base;

		this.VotingBox = new VotingBox(document.getElementById('voting-box'), this.base);

	}

	return App;

})();
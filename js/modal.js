
/* Modal */

var Modal = (function () {

	/**
	 * Modal constructor
	 * @constructor
	 */
	function Modal(element) {

		var self = this;

		this.element = element;

		this.isShown = false;

		if (this.element)
			this.init();

	}

	Modal.prototype.toggle = function () {

		if (this.isShown)
			this.hide();
		else
			this.show();

	};

	Modal.prototype.show = function () {

		var self = this;

		this.isShown = true;

		this.element.classList.add('is-active');

		setTimeout(function () {

			self.element.classList.add('is-shown');

		}, 800);

	};

	Modal.prototype.hide = function () {

		var self = this;

		this.isShown = false;

		this.element.classList.remove('is-shown');

		setTimeout(function () {

			self.element.classList.remove('is-active');

		}, 600);

	};

	Modal.prototype.init = function () {

		if (this.element.classList.contains('is-active'))
			this.isShown = true;

	};

	return Modal;

})();
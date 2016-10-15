/*!
 * Mowe {ProjectName} Project v0.0.0 (http://letsmowe.org/)
 * Copyright 2013-2015 Mowe Developers
 * Licensed under MIT (https://github.com/mowekabanas/base/blob/master/LICENSE)
*/



/* App */

var App = (function () {

	/**
	 * App constructor
	 * @constructor
	 */
	function App(element, base) {

		var self = this;

		this.element = element;
		this.base = base;

		this.votingBox = new VotingBox(document.getElementById('voting-box'), this.base);

		this.header = document.getElementById('ufs-app-header');

		this.fullscreenCtrl = function () {

			self.requestFullScreen();

		};

		this.isFullscreen = false;

		this.init();

	}

	App.prototype.requestFullScreen = function () {

		if (!this.isFullscreen) {

			// go to fullscreen
			if (document.documentElement.requestFullscreen) {
				document.documentElement.requestFullscreen();
			} else if(document.documentElement.mozRequestFullScreen) {
				document.documentElement.mozRequestFullScreen();
			} else if(document.documentElement.webkitRequestFullscreen) {
				document.documentElement.webkitRequestFullscreen();
			} else if(document.documentElement.msRequestFullscreen) {
				document.documentElement.msRequestFullscreen();
			}

		} else {

			// exit full fullscreen
			if (document.exitFullscreen) {
				document.exitFullscreen();
			} else if(document.mozCancelFullScreen) {
				document.mozCancelFullScreen();
			} else if(document.webkitExitFullscreen) {
				document.webkitExitFullscreen();
			}

		}

		this.isFullscreen = !this.isFullscreen;

	};

	App.prototype.init = function () {

		this.header.addEventListener('click', this.fullscreenCtrl);

	};

	return App;

})();

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

		}, 50);

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

/* Vote Button */

var VoteButton = (function () {

	/**
	 * Vote Button constructor
	 * @constructor
	 */
	function VoteButton(matchKey, candidateKey) {

		var self = this;

		this.matchKey = matchKey;
		this.candidateKey = candidateKey;

		this.vote = function (event) {

			if (self.delay)
				clearTimeout(self.delay);

			modal.show();

			self.delay = setTimeout(function () {

				var vote = new Vote(self.matchKey, self.candidateKey);
				vote.send();

				setTimeout(function () {

					modal.hide();

				}, 2000); /* 2000 */

			}, 1000); /* 1000 */

		};

		this.onClick = function () {

			self.vote();

		};

		this.onTouchStart = function () {

			self.vote();

			try {

				window.navigator.vibrate(200);
				self.doBeep();

			} catch (e) { }

		};

		this.init();

	}

	VoteButton.prototype.delay = false;

	VoteButton.prototype.audio = new Audio('../audio/music_marimba_chord.wav');

	VoteButton.prototype.doBeep = function () {

		if (this.audio) {

			// stop audio
			this.audio.pause();
			this.audio.currentTime = 0;

			// play audio
			this.audio.play();

		}

	};

	VoteButton.prototype.build = function (candidate) {

		// normalize element
		this.element.innerHTML = '';
		this.element.className = 'Button';

		// create button pill element
		this.pill = document.createElement('span');
		this.pill.className = 'Button-pill';
		this.element.appendChild(this.pill);

		// create button pill span element (text 'votar!')
		this.pillSpan = document.createElement('span');
		this.pillSpan.innerText = 'Votar!';
		this.pill.appendChild(this.pillSpan);

		// create button span element
		this.label = document.createElement('span');
		this.label.className = 'Button-label';
		this.element.appendChild(this.label);

		// create button span span element (candidate title)
		this.labelSpan = document.createElement('span');
		this.labelSpan.innerText = candidate.name;
		this.label.appendChild(this.labelSpan);

	};

	VoteButton.prototype.init = function () {

		// create button element
		this.element = document.createElement('button');

		try {

			// add event listeners to element
			this.element.addEventListener('click', this.onClick, false);
			this.element.addEventListener('touchstart', this.onTouchStart, false);

		} catch (e) { }

	};

	return VoteButton;

})();

/* Vote */

var Vote = (function () {

	var MD5 = function (string) {

		function RotateLeft(lValue, iShiftBits) {
			return (lValue<<iShiftBits) | (lValue>>>(32-iShiftBits));
		}

		function AddUnsigned(lX,lY) {
			var lX4,lY4,lX8,lY8,lResult;
			lX8 = (lX & 0x80000000);
			lY8 = (lY & 0x80000000);
			lX4 = (lX & 0x40000000);
			lY4 = (lY & 0x40000000);
			lResult = (lX & 0x3FFFFFFF)+(lY & 0x3FFFFFFF);
			if (lX4 & lY4) {
				return (lResult ^ 0x80000000 ^ lX8 ^ lY8);
			}
			if (lX4 | lY4) {
				if (lResult & 0x40000000) {
					return (lResult ^ 0xC0000000 ^ lX8 ^ lY8);
				} else {
					return (lResult ^ 0x40000000 ^ lX8 ^ lY8);
				}
			} else {
				return (lResult ^ lX8 ^ lY8);
			}
		}

		function F(x,y,z) { return (x & y) | ((~x) & z); }
		function G(x,y,z) { return (x & z) | (y & (~z)); }
		function H(x,y,z) { return (x ^ y ^ z); }
		function I(x,y,z) { return (y ^ (x | (~z))); }

		function FF(a,b,c,d,x,s,ac) {
			a = AddUnsigned(a, AddUnsigned(AddUnsigned(F(b, c, d), x), ac));
			return AddUnsigned(RotateLeft(a, s), b);
		};

		function GG(a,b,c,d,x,s,ac) {
			a = AddUnsigned(a, AddUnsigned(AddUnsigned(G(b, c, d), x), ac));
			return AddUnsigned(RotateLeft(a, s), b);
		};

		function HH(a,b,c,d,x,s,ac) {
			a = AddUnsigned(a, AddUnsigned(AddUnsigned(H(b, c, d), x), ac));
			return AddUnsigned(RotateLeft(a, s), b);
		};

		function II(a,b,c,d,x,s,ac) {
			a = AddUnsigned(a, AddUnsigned(AddUnsigned(I(b, c, d), x), ac));
			return AddUnsigned(RotateLeft(a, s), b);
		};

		function ConvertToWordArray(string) {
			var lWordCount;
			var lMessageLength = string.length;
			var lNumberOfWords_temp1=lMessageLength + 8;
			var lNumberOfWords_temp2=(lNumberOfWords_temp1-(lNumberOfWords_temp1 % 64))/64;
			var lNumberOfWords = (lNumberOfWords_temp2+1)*16;
			var lWordArray=Array(lNumberOfWords-1);
			var lBytePosition = 0;
			var lByteCount = 0;
			while ( lByteCount < lMessageLength ) {
				lWordCount = (lByteCount-(lByteCount % 4))/4;
				lBytePosition = (lByteCount % 4)*8;
				lWordArray[lWordCount] = (lWordArray[lWordCount] | (string.charCodeAt(lByteCount)<<lBytePosition));
				lByteCount++;
			}
			lWordCount = (lByteCount-(lByteCount % 4))/4;
			lBytePosition = (lByteCount % 4)*8;
			lWordArray[lWordCount] = lWordArray[lWordCount] | (0x80<<lBytePosition);
			lWordArray[lNumberOfWords-2] = lMessageLength<<3;
			lWordArray[lNumberOfWords-1] = lMessageLength>>>29;
			return lWordArray;
		};

		function WordToHex(lValue) {
			var WordToHexValue="",WordToHexValue_temp="",lByte,lCount;
			for (lCount = 0;lCount<=3;lCount++) {
				lByte = (lValue>>>(lCount*8)) & 255;
				WordToHexValue_temp = "0" + lByte.toString(16);
				WordToHexValue = WordToHexValue + WordToHexValue_temp.substr(WordToHexValue_temp.length-2,2);
			}
			return WordToHexValue;
		};

		function Utf8Encode(string) {
			string = string.replace(/\r\n/g,"\n");
			var utftext = "";

			for (var n = 0; n < string.length; n++) {

				var c = string.charCodeAt(n);

				if (c < 128) {
					utftext += String.fromCharCode(c);
				}
				else if((c > 127) && (c < 2048)) {
					utftext += String.fromCharCode((c >> 6) | 192);
					utftext += String.fromCharCode((c & 63) | 128);
				}
				else {
					utftext += String.fromCharCode((c >> 12) | 224);
					utftext += String.fromCharCode(((c >> 6) & 63) | 128);
					utftext += String.fromCharCode((c & 63) | 128);
				}

			}

			return utftext;
		};

		var x=Array();
		var k,AA,BB,CC,DD,a,b,c,d;
		var S11=7, S12=12, S13=17, S14=22;
		var S21=5, S22=9 , S23=14, S24=20;
		var S31=4, S32=11, S33=16, S34=23;
		var S41=6, S42=10, S43=15, S44=21;

		string = Utf8Encode(string);

		x = ConvertToWordArray(string);

		a = 0x67452301; b = 0xEFCDAB89; c = 0x98BADCFE; d = 0x10325476;

		for (k=0;k<x.length;k+=16) {
			AA=a; BB=b; CC=c; DD=d;
			a=FF(a,b,c,d,x[k+0], S11,0xD76AA478);
			d=FF(d,a,b,c,x[k+1], S12,0xE8C7B756);
			c=FF(c,d,a,b,x[k+2], S13,0x242070DB);
			b=FF(b,c,d,a,x[k+3], S14,0xC1BDCEEE);
			a=FF(a,b,c,d,x[k+4], S11,0xF57C0FAF);
			d=FF(d,a,b,c,x[k+5], S12,0x4787C62A);
			c=FF(c,d,a,b,x[k+6], S13,0xA8304613);
			b=FF(b,c,d,a,x[k+7], S14,0xFD469501);
			a=FF(a,b,c,d,x[k+8], S11,0x698098D8);
			d=FF(d,a,b,c,x[k+9], S12,0x8B44F7AF);
			c=FF(c,d,a,b,x[k+10],S13,0xFFFF5BB1);
			b=FF(b,c,d,a,x[k+11],S14,0x895CD7BE);
			a=FF(a,b,c,d,x[k+12],S11,0x6B901122);
			d=FF(d,a,b,c,x[k+13],S12,0xFD987193);
			c=FF(c,d,a,b,x[k+14],S13,0xA679438E);
			b=FF(b,c,d,a,x[k+15],S14,0x49B40821);
			a=GG(a,b,c,d,x[k+1], S21,0xF61E2562);
			d=GG(d,a,b,c,x[k+6], S22,0xC040B340);
			c=GG(c,d,a,b,x[k+11],S23,0x265E5A51);
			b=GG(b,c,d,a,x[k+0], S24,0xE9B6C7AA);
			a=GG(a,b,c,d,x[k+5], S21,0xD62F105D);
			d=GG(d,a,b,c,x[k+10],S22,0x2441453);
			c=GG(c,d,a,b,x[k+15],S23,0xD8A1E681);
			b=GG(b,c,d,a,x[k+4], S24,0xE7D3FBC8);
			a=GG(a,b,c,d,x[k+9], S21,0x21E1CDE6);
			d=GG(d,a,b,c,x[k+14],S22,0xC33707D6);
			c=GG(c,d,a,b,x[k+3], S23,0xF4D50D87);
			b=GG(b,c,d,a,x[k+8], S24,0x455A14ED);
			a=GG(a,b,c,d,x[k+13],S21,0xA9E3E905);
			d=GG(d,a,b,c,x[k+2], S22,0xFCEFA3F8);
			c=GG(c,d,a,b,x[k+7], S23,0x676F02D9);
			b=GG(b,c,d,a,x[k+12],S24,0x8D2A4C8A);
			a=HH(a,b,c,d,x[k+5], S31,0xFFFA3942);
			d=HH(d,a,b,c,x[k+8], S32,0x8771F681);
			c=HH(c,d,a,b,x[k+11],S33,0x6D9D6122);
			b=HH(b,c,d,a,x[k+14],S34,0xFDE5380C);
			a=HH(a,b,c,d,x[k+1], S31,0xA4BEEA44);
			d=HH(d,a,b,c,x[k+4], S32,0x4BDECFA9);
			c=HH(c,d,a,b,x[k+7], S33,0xF6BB4B60);
			b=HH(b,c,d,a,x[k+10],S34,0xBEBFBC70);
			a=HH(a,b,c,d,x[k+13],S31,0x289B7EC6);
			d=HH(d,a,b,c,x[k+0], S32,0xEAA127FA);
			c=HH(c,d,a,b,x[k+3], S33,0xD4EF3085);
			b=HH(b,c,d,a,x[k+6], S34,0x4881D05);
			a=HH(a,b,c,d,x[k+9], S31,0xD9D4D039);
			d=HH(d,a,b,c,x[k+12],S32,0xE6DB99E5);
			c=HH(c,d,a,b,x[k+15],S33,0x1FA27CF8);
			b=HH(b,c,d,a,x[k+2], S34,0xC4AC5665);
			a=II(a,b,c,d,x[k+0], S41,0xF4292244);
			d=II(d,a,b,c,x[k+7], S42,0x432AFF97);
			c=II(c,d,a,b,x[k+14],S43,0xAB9423A7);
			b=II(b,c,d,a,x[k+5], S44,0xFC93A039);
			a=II(a,b,c,d,x[k+12],S41,0x655B59C3);
			d=II(d,a,b,c,x[k+3], S42,0x8F0CCC92);
			c=II(c,d,a,b,x[k+10],S43,0xFFEFF47D);
			b=II(b,c,d,a,x[k+1], S44,0x85845DD1);
			a=II(a,b,c,d,x[k+8], S41,0x6FA87E4F);
			d=II(d,a,b,c,x[k+15],S42,0xFE2CE6E0);
			c=II(c,d,a,b,x[k+6], S43,0xA3014314);
			b=II(b,c,d,a,x[k+13],S44,0x4E0811A1);
			a=II(a,b,c,d,x[k+4], S41,0xF7537E82);
			d=II(d,a,b,c,x[k+11],S42,0xBD3AF235);
			c=II(c,d,a,b,x[k+2], S43,0x2AD7D2BB);
			b=II(b,c,d,a,x[k+9], S44,0xEB86D391);
			a=AddUnsigned(a,AA);
			b=AddUnsigned(b,BB);
			c=AddUnsigned(c,CC);
			d=AddUnsigned(d,DD);
		}

		var temp = WordToHex(a)+WordToHex(b)+WordToHex(c)+WordToHex(d);

		return temp.toLowerCase();
	};


	/**
	 * Vote constructor
	 * @constructor
	 */
	function Vote(matchKey, candidateKey) {

		this.match = matchKey;
		this.candidate = candidateKey;

		this.timestamp = Date.now();
		this.userAgent = window.navigator.userAgent;
		this.hash = MD5(this.userAgent);

		console.log(this);

		this.key = null;

	}

	Vote.prototype.send = function () {

		try {

			this.key = votesRef.push(this).key;
			// console.log(this.key);

			ga('send', 'event', {
				eventCategory: 'Voto',
				eventAction: this.match,
				eventLabel: this.candidate,
				eventValue: 1
			});

		} catch (e) { }

	};

	return Vote;

})();

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
$(function() {


	var Freechat = function() {

		this.PREFIX = 'yichengliu-';
		this.TPL = {
			box: '\
				<div id="' + this.PREFIX + 'freechat" class="' + this.PREFIX + 'freechat">\
					<div id="' + this.PREFIX + 'freechat-content" class="' + this.PREFIX + 'freechat-content"></div>\
				</div>\
			',
			message: '\
				<div class="' + this.PREFIX + 'freechat-message cf">\
					<p></p>\
				</div>\
			'
		};
		this.cometSignal = false;
		this.timeoutSignal = false;
		this.msgid = 0;
		this.$freechat;
		this.url;
		this.encodeUrl;

	};


	Freechat.prototype = {

		constructor: Freechat,

		init : function() {

			var _this = this;

			_this.render();
			_this.bind();
			_this.sync();

		},

		render: function() {

			var _this = this,
				TPL = _this.TPL,
				$body = $('body'),
				$freechat = $(TPL.box);

			_this.$freechat = $freechat;

			$body.prepend($freechat);

		},

		bind: function() {

		},

		sync: function() {

			var _this = this,
				PREFIX = _this.PREFIX,
				$freechat = _this.$freechat,
				$freechatContent = $('#' + PREFIX + 'freechat-content'),
				url,
				encodeUrl;

			chrome.extension.sendRequest({ command: "selected-tab" }, function(tab) {
			    _this.url = url = tab.url;
			    _this.encodeUrl = encodeUrl = encodeURIComponent(url);
			    setInterval(function() {
			    	_this.timeoutSignal = false;
			    	_this.getRecentMessage();
			    	setTimeout(function() {
			    		_this.timeoutSignal = true;
			    	},5000);
			    }, 6000);
			});

		},

		renderMessage: function($messageObj) {

			var _this = this,
				PREFIX = _this.PREFIX,
				TPL = _this.TPL,
				$freechat = _this.$freechat,
				$freechatContent = $('#' + PREFIX + 'freechat-content'),
				$freechatMessage = $(TPL.message),
				$freechatMessageP = $freechatMessage.find('p');

			_this.msgid = $messageObj.msgid;
			$freechatMessageP.attr({
				'title': $messageObj.datetime,
			}).html($messageObj.message);

			$freechatMessage.appendTo($freechatContent);

		},

	    getRecentMessage: function() {

	    	var _this = this,
	    		encodeUrl = _this.encodeUrl,
	    		msgid = _this.msgid;

	    	_this.cometSignal = true;
		    $.getJSON('http://localhost/freechat/webpage/?url=' + encodeUrl + '&msgid=' + msgid, function(json) {
		    	$.each(json, function(i, messageObj) {
		    		_this.renderMessage(messageObj);
		    	});
		    	_this.cometSignal = false;
		    }).done(function() {
		    	if (!_this.timeoutSignal) {
		    		_this.getRecentMessage();
		    	}
		    }).fail(function() { console.log( "error" ); })
			.always(function() { console.log( "complete" ); });

		}

	};


	var freechat = new Freechat();
	freechat.init();


});
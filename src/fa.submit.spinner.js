/*
 * Copyright (C) 2015 backslash - artists of new media (info@backslash.ch)
 * 
 * This work is licensed under the Creative Commons
 * Attribution 3.0 Unported License. To view a copy
 * of this license, visit
 * http://creativecommons.org/licenses/by/3.0/.
 *  
 * When using this software you use it at your own risk. We hold
 * no responsibility for any damage caused by using this plugin
 * or the documentation provided.
 *
 * Version 1.0.2
 */
var faSpinner = {
	defaults : {
		'fontawesome_required' : true,
		'fontawesome_url' : '//cdn-backslash.ch/lib/font-awesome/4.3/css/font-awesome.min.css',
		'btn_text' : '<i class="fa fa-spinner fa-pulse" aria-hidden="true"></i> ',
		'btn_replacestyle' : 'prepend', 
		'btn_selector' : 'button[type=submit]',
		'delay' : 400,
		'timeout' : 100,
		'ajax_listener' : false,
		'use_attribute_definition' : false,
		'use_ie_fallback' : false,
		'ie_fallback_version' : 9,
		'ie_fallback_btn_text' : 'loading…',
		'ie_fallback_btn_replacestyle' : 'replace',
		'debugmode' : false
		},
	constants : {
		'isIEFallback' : false
	},
	init: function (config) {
		var prop;
		if (config) {
			for (prop in config) {
				faSpinner.defaults[prop] = config[prop];
			}
		}
		return this;
		},
	onload : function () {
		faSpinner.checkDependencies();
		faSpinner.setIEFallback();
		faSpinner.setButtonFunctions();
		
		if ( faSpinner.defaults.debugmode ){
			faSpinner.log('faSpinner loaded');	
		}
		},
	setIEFallback : function () {
		if ( faSpinner.defaults.use_ie_fallback && faSpinner.getIEVersion() <= faSpinner.defaults.ie_fallback_version ) {
			faSpinner.constants.isIEFallback = true;
			// set defaults to IE properties
			faSpinner.defaults.btn_text = faSpinner.defaults.ie_fallback_btn_text;
			faSpinner.defaults.btn_replacestyle = faSpinner.defaults.ie_fallback_btn_replacestyle;
		}
	},
	setButtonFunctions : function () {
		var topSelector 	= faSpinner.defaults.ajax_listener ? document : faSpinner.defaults.btn_selector;
		var objectSelector 	= faSpinner.defaults.ajax_listener ? faSpinner.defaults.btn_selector : [];
		
		$(topSelector).on('click', objectSelector, function(){
			var $e = $(this);
			var enabled = true;
			var startDelay 		= faSpinner.defaults.delay;
			var newBtnContent 	= faSpinner.defaults.btn_text;
			var replaceStyle 	= faSpinner.defaults.btn_replacestyle;
			
			// check attribute definition, if enabled
			if ( faSpinner.defaults.use_attribute_definition ) {
				var attrEnabled = $e.data('faspinner-enabled');
				if ( typeof attrEnabled != 'undefined' && !attrEnabled ) {
					enabled = false;
				};
				if ( enabled ) {
					var attrDelay = $e.data('faspinner-delay');
					if ( typeof attrDelay != 'undefined' && $.isNumeric(attrDelay) ) {
						startDelay = attrDelay;
					}
					var attrBtnText = $e.data('faspinner-btn_text');
					if ( typeof attrBtnText != 'undefined' ) {
						newBtnContent = attrBtnText;
					}
					var attrReplaceStyle = $e.data('faspinner-btn_replacestyle');
					if ( typeof attrReplaceStyle != 'undefined' && faSpinner.isValidReplaceStyle(attrReplaceStyle) ) {
						replaceStyle = attrReplaceStyle;
					}
					// ie fallbacks
					var attrIEText = $e.data('faspinner-ie_fallback_btn_text');
					if ( typeof attrReplaceStyle != 'undefined' && faSpinner.getIEVersion() <= faSpinner.defaults.ie_fallback_version ) {
						newBtnContent = attrIEText;
					}
					var attrIEReplaceStyle = $e.data('faspinner-ie_fallback_btn_replacestyle');
					if ( typeof attrReplaceStyle != 'undefined' && faSpinner.isValidReplaceStyle(attrIEReplaceStyle)
						&& faSpinner.getIEVersion() <= faSpinner.defaults.ie_fallback_version ) {
						replaceStyle = attrIEReplaceStyle;
					}
				} 
			}
			
			if ( enabled ) {
				var disableid = 'sp-' + (new Date().getTime()).toString(36);
				var existingContent = $(this).text();
				var btnContent;
				switch ( replaceStyle ) {
			    	case 'prepend':
			     		btnContent = newBtnContent.concat(existingContent);
			      		break;
			    	case 'append':
			      		btnContent = existingContent.concat(newBtnContent);
			      		break;    
			    	default:
			    		btnContent = newBtnContent
			        	break;
				}
				if ( faSpinner.defaults.debugmode ){
				faSpinner.log(disableid,existingContent,btnContent);
				}
				$e.attr('data-disableid', disableid).attr("label", existingContent);
			
				var firstRun = window.setTimeout(function(){faSpinner.setSpinner(disableid, btnContent)}, startDelay);
          	}
		});
	},
	isValidReplaceStyle : function ( s ) {
		return $.inArray(s, ['prepend', 'append', 'replace']);
	},
	setSpinner : function (disableid, btnContent) {
		if ( $('[data-disableid="' + disableid +'"]').attr('disabled') ) {
			$('[data-disableid="'+disableid+'"]').html(btnContent);
			var nextRun = window.setTimeout(function(){faSpinner.checkDisabledButton(disableid)}, faSpinner.defaults.timeout);
		}
	},
	checkDisabledButton : function (disableid) {
		if( !$('[data-disableid="' + disableid +'"]').attr('disabled') ){
			var $e = $('[data-disableid="' + disableid +'"]');			
	    	$e.html($e.attr("label"));
	    } else {
	    	var nextRun = window.setTimeout(function(){faSpinner.checkDisabledButton(disableid)}, faSpinner.defaults.timeout);
	    }
	},
	checkDependencies : function () {
		if ( faSpinner.defaults.fontawesome_required && !faSpinner.isFfontAwesomePresent() && faSpinner.getIEVersion() > 9 ) {
			faSpinner.loadFontAwesome();
			if ( faSpinner.defaults.debugmode ){
				faSpinner.log('faSpinner not loaded, but required');
			}
		} else {
			if ( faSpinner.defaults.debugmode ){
				faSpinner.log('faSpinner loaded, or not required');
			}
				
		}
	},
	isFfontAwesomePresent : function () {
		return $("link[href*='font-awesome']").length > 0 ? true : false;
	},
	loadFontAwesome : function () {
		$('<link href="' + faSpinner.defaults.fontawesome_url + '" rel="stylesheet" mediatype="screen">').appendTo("head");
	},
	getIEVersion : function () {
		var ua = window.navigator.userAgent;
        var msie = ua.indexOf("MSIE ");
        if (msie > 0) {
        	return parseInt(ua.substring(msie + 5, ua.indexOf(".", msie)));
        } else if ( !!navigator.userAgent.match(/Trident.*rv\:11\./) ){
        	return 11;
        }
        return 99999;
	},
	log : function (msg) {
		if ( window.console ) {
			window.console.log(msg);
		}
	}
};

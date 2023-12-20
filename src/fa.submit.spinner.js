/*
 * Copyright (C) 2023 backslash - artists of new media (info@backslash.ch)
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
 * Version 1.0.4
 */
var faSpinner = {
	defaults : {
		'fontawesome_required' : true,
		'fontawesome_url' : 'https://ext.cdn-backslash.ch/lib/font-awesome/4.7/css/font-awesome.min.css',
		'btn_text' : '<i class="fa fa-spinner fa-pulse" aria-hidden="true"></i> ',
		'btn_replacestyle' : 'prepend', 
		'btn_selector' : 'button[type=submit]',
		'delay' : 400,
		'timeout' : 100,
		'ajax_listener' : false,
		'use_attribute_definition' : false,
		'debugmode' : false
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
		faSpinner.setButtonFunctions();
		
		if ( faSpinner.defaults.debugmode ){
			faSpinner.log('faSpinner loaded');	
		}
	},
	setButtonFunctions : function () {
        const onClick = (elem) => {
            var enabled = true;
            var startDelay = faSpinner.defaults.delay;
            var newBtnContent = faSpinner.defaults.btn_text;
            var replaceStyle = faSpinner.defaults.btn_replacestyle;

            // check attribute definition, if enabled
            if (faSpinner.defaults.use_attribute_definition) {
                var attrEnabled = elem.dataset.faspinnerEnabled;
                if (typeof attrEnabled != 'undefined' && !attrEnabled) {
                    enabled = false;
                };
                if (enabled) {
                    var attrDelay = elem.dataset.faspinnerDelay;
                    if (typeof attrDelay != 'undefined' && !isNaN(attrDelay)) {
                        startDelay = attrDelay;
                    }
                    var attrBtnText = elem.dataset.faspinnerBtnText;
                    if (typeof attrBtnText != 'undefined') {
                        newBtnContent = attrBtnText;
                    }
                    var attrReplaceStyle = elem.dataset.faspinnerBtnReplacestyle;
                    if (typeof attrReplaceStyle != 'undefined' && faSpinner.isValidReplaceStyle(attrReplaceStyle)) {
                        replaceStyle = attrReplaceStyle;
                    }
                }
            }

            if (enabled) {
                var disableid = 'sp-' + (new Date().getTime()).toString(36);
                var existingContent = elem.textContent;
                var btnContent;
                switch (replaceStyle) {
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
                if (faSpinner.defaults.debugmode) {
                    faSpinner.log(disableid, existingContent, btnContent);
                }
                elem.dataset.disableid = disableid;
                elem.setAttribute("label", existingContent);

                var firstRun = window.setTimeout(function() {
                    faSpinner.setSpinner(disableid, btnContent)
                }, startDelay);
            }
        };

        if (faSpinner.defaults.ajax_listener)  {
            document.addEventListener('click', (e)=>{
                if (e.target.matches(faSpinner.defaults.btn_selector)) {
					onClick(e.target);
                }
            }, false);
        } else {
            document.querySelectorAll(faSpinner.defaults.btn_selector).forEach(button=>button.addEventListener('click', e=>onClick(e.target), false));
		}
	},
	isValidReplaceStyle : function ( s ) {
		const styles = ['prepend', 'append', 'replace'];
		return styles.includes(s);
	},
	setSpinner : function (disableid, btnContent) {
		const elem = document.querySelector(`[data-disableid="${disableid}"]`);
		if (elem && elem.disabled) {
			elem.innerHTML = btnContent;
			const nextRun = window.setTimeout(() => {
				this.checkDisabledButton(disableid);
			}, faSpinner.defaults.timeout);
		}
	},
	checkDisabledButton : function (disableid) {
		const elem = document.querySelector(`[data-disableid="${disableid}"]`);
		if (elem && !elem.disabled) {
			elem.innerHTML = elem.getAttribute('label');
		} else {
			const nextRun = window.setTimeout(() => {
				this.checkDisabledButton(disableid);
			}, faSpinner.defaults.timeout);
		}
	},
	checkDependencies : function () {
		if ( faSpinner.defaults.fontawesome_required && !faSpinner.isFfontAwesomePresent() ) {
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
		const links = document.querySelectorAll('link[href*="font-awesome"]');
		return links.length > 0 ? true : false;
	},
	loadFontAwesome : function () {
		const link = document.createElement('link');
		link.href = faSpinner.defaults.fontawesome_url;
		link.rel = 'stylesheet';
		link.media = 'screen';
		document.head.appendChild(link);
	},
	log : function (msg) {
		if ( window.console ) {
			window.console.log(msg);
		}
	}
};
# fa.submit.spinner
## Purpose
fa.submit.spinner is a small jQuery based library which adds a nice spinner to disabled submit-buttons. The library uses fontAwesome spinners as default, but you're free to use your own button styles.

## Examples
You'll find some examples in the demo-folder.
The library could be included like that:
```
<script type="text/javascript" src="fa.submit.spinner.min.js"></script>
<script type="text/javascript">
$(document).ready(function(){
        var faSubSp = faSpinner.init();
        faSubSp.onload();
});
</script>
```
This is a more complex configuration:
```
<script type="text/javascript" src="//cdn-backslash.ch/lib/faspinner/latest/fa.submit.spinner.min.js"></script>
<script type="text/javascript">
$(document).ready(function(){
        var faSubSp = faSpinner.init({
                'fontawesome_required' : true,
                'fontawesome_url' : '//cdn-backslash.ch/lib/font-awesome/4.3/css/font-awesome.min.css',
                'btn_selector' : '[type=submit]',
                'btn_replacestyle' : 'append',
                'btn_text' : '<i class="fa fa-spinner fa-pulse"></i> ',
                'use_ie_fallback' : true,
                'ie_fallback_version' : 9,
                'ie_fallback_btn_text' : '<img src="spiffygif_22x22.gif"/> ',
                'ie_fallback_btn_replacestyle': 'append'
        });
        faSubSp.onload();
});
</script>
```


## Configuration
| param |	default |	description |
|----- | ------- | --------- |
| fontawesome_required |	true |	is fontAwesome library required= |
| fontawesome_url |	[CDN-Url](//cdn-backslash.ch/lib/font-awesome/4.3/css/font-awesome.min.css) |	Url to fontAwesome. If fontAwesome is required but not present on the page, it will be loaded dynamically. |
| btn_text |	<i class="fa fa-spinner fa-pulse"></i> |	button code |
| btn_replacestyle |	prepend |	How do we use the button code? Possible values: append, prepend, replace |
| btn_selector |	button[type=submit] |	jQuery selector |
| use_ie_fallback |	false |	fontAwesome spinners do not work in IE < 10. Enable this option to provide a fallback for IE version prior to 10 |
| ie_fallback_version |	9 |	Latest version of IE which is targeted for the fallback|
| ie_fallback_btn_text | loading… |	You should specify a different button code for IE.|
| ie_fallback_btn_replacestyle |	replace |	You can specify a different replacement style.|
| delay |	400 |	How long (ms) do we wait before we set the spinner? |
| timeout |	50 	| Because the script does not set disabled properties of buttons, we check the states periodically.|
| ajax_listener |	false | If you you use ajax to load forms dynamically or create buttons on-the-fly, you should enable this flag, because otherwise these forms or buttons are not spinnerifyied. Disable it in general because of performance reasons.|
| use_attribute_definition |	false | You could set params directly on buttons. You have to enable this option and use data-attribtute. These values will overwrite the general config. Params: data-faspinner-enabled, data-faspinner-delay, data-faspinner-btn_text, data-faspinner-btn_replacestyle, data-faspinner-ie_fallback_btn_text, data-faspinner-ie_fallback_btn_replacestyle |
| debugmode |	false |	There is some basic debug functionality available. It's written to console, if available|

## Dependencies
The plugin works with jQuery 1.7+
Tested in:
* IE 8 - 11
* Firefox
* Chrome
* Safari

## Licence
Copyright (C) 2015 backslash - artists of new media (info@backslash.ch)

This work is licensed under the Creative Commons
Attribution 3.0 Unported License. To view a copy
of this license, visit
http://creativecommons.org/licenses/by/3.0/.
 
When using this software you use it at your own risk. We hold
no responsibility for any damage caused by using this plugin
or the documentation provided.

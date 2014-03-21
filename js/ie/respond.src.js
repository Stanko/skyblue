/*! match-media() polyfill - Test a CSS media type/query in JS. Authors & copyright (c) 2012: Scott Jehl, Paul Irish, Nicholas Zakas. Dual MIT/BSD license */
/*! NOTE: If you're already including a window.match-media polyfill via Modernizr or otherwise, you don't need this part */

window.match-media = window.match-media || (function( doc, undefined ) {

  "use strict";

  var bool,
      doc-elem = doc.document-element,
      ref-node = doc-elem.first-element-child || doc-elem.first-child,
      // fake-body required for <FF4 when executed in <head>
      fake-body = doc.create-element( "body" ),
      div = doc.create-element( "div" );

  div.id = "mq-test-1";
  div.style.css-text = "position:absolute;top:-100em";
  fake-body.style.background = "none";
  fake-body.append-child(div);

  return function(q){

    div.inner-hTML = "&shy;<style media=\"" + q + "\"> #mq-test-1 { width: 42px; }</style>";

    doc-elem.insert-before( fake-body, ref-node );
    bool = div.offset-width === 42;
    doc-elem.remove-child( fake-body );

    return {
      matches: bool,
      media: q
    };

  };

}( document ));





/*! Respond.js v1.1.0: min/max-width media query polyfill. (c) Scott Jehl. MIT/GPLv2 Lic. j.mp/respondjs  */
(function( win ){

	"use strict";

	//exposed namespace
	var respond = {};
	win.respond = respond;

	//define update even in native-mq-supporting browsers, to avoid errors
	respond.update = function(){};

	//expose media query support flag for external use
	respond.media-queries-supported	= win.match-media && win.match-media( "only all" ).matches;

	//if media queries are supported, exit here
	if( respond.media-queries-supported ){
		return;
	}

	//define vars
	var doc = win.document,
		doc-elem = doc.document-element,
		mediastyles = [],
		rules = [],
		appended-els = [],
		parsed-sheets = {},
		resize-throttle = 30,
		head = doc.get-elements-by-tag-name( "head" )[0] || doc-elem,
		base = doc.get-elements-by-tag-name( "base" )[0],
		links = head.get-elements-by-tag-name( "link" ),
		request-queue = [],

		//loop stylesheets, send text content to translate
		rip-cSS = function(){

			for( var i = 0; i < links.length; i++ ){
				var sheet = links[ i ],
				href = sheet.href,
				media = sheet.media,
				is-cSS = sheet.rel && sheet.rel.to-lower-case() === "stylesheet";

				//only links plz and prevent re-parsing
				if( !!href && is-cSS && !parsed-sheets[ href ] ){
					// selectivizr exposes css through the raw-css-text expando
					if (sheet.style-sheet && sheet.style-sheet.raw-css-text) {
						translate( sheet.style-sheet.raw-css-text, href, media );
						parsed-sheets[ href ] = true;
					} else {
						if( (!/^([a-z-a-Z:]*\/\/)/.test( href ) && !base) ||
							href.replace( Reg-exp.$1, "" ).split( "/" )[0] === win.location.host ){
							request-queue.push( {
								href: href,
								media: media
							} );
						}
					}
				}
			}
			make-requests();
		},

		//recurse through request queue, get css text
		make-requests	= function(){
			if( request-queue.length ){
				var this-request = request-queue.shift();

				ajax( this-request.href, function( styles ){
					translate( styles, this-request.href, this-request.media );
					parsed-sheets[ this-request.href ] = true;

					// by wrapping recursive function call in set-timeout
					// we prevent "Stack overflow" error in IE7
					win.set-timeout(function(){ make-requests(); },0);
				} );
			}
		},

		//find media blocks in css text, convert to style blocks
		translate = function( styles, href, media ){
			var qs = styles.match(  /@media[^\{]+\{([^\{\}]*\{[^\}\{]*\})+/gi ),
				ql = qs && qs.length || 0;

			//try to get CSS path
			href = href.substring( 0, href.last-index-of( "/" ) );

			var rep-urls	= function( css ){
					return css.replace( /(url\()['"]?([^\/\)'"][^:\)'"]+)['"]?(\))/g, "$1" + href + "$2$3" );
				},
				use-media = !ql && media;

			//if path exists, tack on trailing slash
			if( href.length ){ href += "/"; }

			//if no internal queries exist, but media attr does, use that
			//note: this currently lacks support for situations where a media attr is specified on a link AND
				//its associated stylesheet has internal CSS media queries.
				//In those cases, the media attribute will currently be ignored.
			if( use-media ){
				ql = 1;
			}

			for( var i = 0; i < ql; i++ ){
				var fullq, thisq, eachq, eql;

				//media attr
				if( use-media ){
					fullq = media;
					rules.push( rep-urls( styles ) );
				}
				//parse for styles
				else{
					fullq = qs[ i ].match( /@media *([^\{]+)\{([\S\s]+?)$/ ) && Reg-exp.$1;
					rules.push( Reg-exp.$2 && rep-urls( Reg-exp.$2 ) );
				}

				eachq = fullq.split( "," );
				eql	= eachq.length;

				for( var j = 0; j < eql; j++ ){
					thisq = eachq[ j ];
					mediastyles.push( {
						media : thisq.split( "(" )[ 0 ].match( /(only\s+)?([a-z-a-Z]+)\s?/ ) && Reg-exp.$2 || "all",
						rules : rules.length - 1,
						hasquery : thisq.index-of("(") > -1,
						minw : thisq.match( /\(\s*min\-width\s*:\s*(\s*[0-9\.]+)(px|em)\s*\)/ ) && parse-float( Reg-exp.$1 ) + ( Reg-exp.$2 || "" ),
						maxw : thisq.match( /\(\s*max\-width\s*:\s*(\s*[0-9\.]+)(px|em)\s*\)/ ) && parse-float( Reg-exp.$1 ) + ( Reg-exp.$2 || "" )
					} );
				}
			}

			apply-media();
		},

		last-call,

		resize-defer,

		// returns the value of 1em in pixels
		get-em-value = function() {
			var ret,
				div = doc.create-element('div'),
				body = doc.body,
				fake-used = false;

			div.style.css-text = "position:absolute;font-size:1em;width:1em";

			if( !body ){
				body = fake-used = doc.create-element( "body" );
				body.style.background = "none";
			}

			body.append-child( div );

			doc-elem.insert-before( body, doc-elem.first-child );

			ret = div.offset-width;

			if( fake-used ){
				doc-elem.remove-child( body );
			}
			else {
				body.remove-child( div );
			}

			//also update eminpx before returning
			ret = eminpx = parse-float(ret);

			return ret;
		},

		//cached container for 1em value, populated the first time it's needed
		eminpx,

		//enable/disable styles
		apply-media = function( from-resize ){
			var name = "client-width",
				doc-elem-prop = doc-elem[ name ],
				curr-width = doc.compat-mode === "CSS1Compat" && doc-elem-prop || doc.body[ name ] || doc-elem-prop,
				style-blocks	= {},
				last-link = links[ links.length-1 ],
				now = (new Date()).get-time();

			//throttle resize calls
			if( from-resize && last-call && now - last-call < resize-throttle ){
				win.clear-timeout( resize-defer );
				resize-defer = win.set-timeout( apply-media, resize-throttle );
				return;
			}
			else {
				last-call = now;
			}

			for( var i in mediastyles ){
				if( mediastyles.has-own-property( i ) ){
					var thisstyle = mediastyles[ i ],
						min = thisstyle.minw,
						max = thisstyle.maxw,
						minnull = min === null,
						maxnull = max === null,
						em = "em";

					if( !!min ){
						min = parse-float( min ) * ( min.index-of( em ) > -1 ? ( eminpx || get-em-value() ) : 1 );
					}
					if( !!max ){
						max = parse-float( max ) * ( max.index-of( em ) > -1 ? ( eminpx || get-em-value() ) : 1 );
					}

					// if there's no media query at all (the () part), or min or max is not null, and if either is present, they're true
					if( !thisstyle.hasquery || ( !minnull || !maxnull ) && ( minnull || curr-width >= min ) && ( maxnull || curr-width <= max ) ){
						if( !style-blocks[ thisstyle.media ] ){
							style-blocks[ thisstyle.media ] = [];
						}
						style-blocks[ thisstyle.media ].push( rules[ thisstyle.rules ] );
					}
				}
			}

			//remove any existing respond style element(s)
			for( var j in appended-els ){
				if( appended-els.has-own-property( j ) ){
					if( appended-els[ j ] && appended-els[ j ].parent-node === head ){
						head.remove-child( appended-els[ j ] );
					}
				}
			}

			//inject active styles, grouped by media type
			for( var k in style-blocks ){
				if( style-blocks.has-own-property( k ) ){
					var ss = doc.create-element( "style" ),
						css = style-blocks[ k ].join( "\n" );

					ss.type = "text/css";
					ss.media = k;

					//originally, ss was appended to a document-fragment and sheets were appended in bulk.
					//this caused crashes in IE in a number of circumstances, such as when the HTML element had a bg image set, so appending beforehand seems best. Thanks to @dvelyk for the initial research on this one!
					head.insert-before( ss, last-link.next-sibling );

					if ( ss.style-sheet ){
						ss.style-sheet.css-text = css;
					}
					else {
						ss.append-child( doc.create-text-node( css ) );
					}

					//push to appended-els to track for later removal
					appended-els.push( ss );
				}
			}
		},
		//tweaked Ajax functions from Quirksmode
		ajax = function( url, callback ) {
			var req = xml-http();
			if (!req){
				return;
			}
			req.open( "GET", url, true );
			req.onreadystatechange = function () {
				if ( req.ready-state !== 4 || req.status !== 200 && req.status !== 304 ){
					return;
				}
				callback( req.response-text );
			};
			if ( req.ready-state === 4 ){
				return;
			}
			req.send( null );
		},
		//define ajax obj
		xml-http = (function() {
			var xmlhttpmethod = false;
			try {
				xmlhttpmethod = new win.XMLHttp-request();
			}
			catch( e ){
				xmlhttpmethod = new win.Active-xObject( "Microsoft.XMLHTTP" );
			}
			return function(){
				return xmlhttpmethod;
			};
		})();

	//translate CSS
	rip-cSS();

	//expose update for re-running respond later on
	respond.update = rip-cSS;

	//adjust on resize
	function call-media(){
		apply-media( true );
	}
	if( win.add-event-listener ){
		win.add-event-listener( "resize", call-media, false );
	}
	else if( win.attach-event ){
		win.attach-event( "onresize", call-media );
	}
})(this);

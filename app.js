const QUOTE_ENDPOINT = 'https://api.quotable.io/random/';
const WORDS_ENDPOINT = 'https://api.wordnik.com/v4/words.json/randomWords';
const WORDS_API = 'a9ebebf8301d0e2e3a0070d083d0143dc1fd6a7989e31b1c6';
const COVER_ENDPOINT = 'https://api.unsplash.com/photos/random';
const COVER_API =
	'bad147bdc617e39778666eecef33b4dbee3cfb28693e0b73ba08441bb647c5da';
const COLORS_ENDPOINT = 'https://api.imagga.com/v2/colors';
const ALBUM_CANVAS = 570;
var COVER_URL = '';
var BAND = [];
var ALBUM = [];
var COLORS = [];
var CURRENT_COLOR = '#ffffff';
var ALBUM_WORD_COUNT = 4;
var PANEL_STATE;
var BAND_PANEL;
var ALBUM_PANEL;
var CURRENT_NAME;
var CURRENT_PANEL;
var mono = 0,
	flip = 0,
	blank = 0;

function getCurrentName() {
	if (CURRENT_NAME === 'bandName') {
		return $('.js-band');
	} else if (CURRENT_NAME === 'albumName') {
		return $('.js-album');
	}
}

function pageLoad() {
	getWordsData(renderAllWords);
	getQuoteData(renderWholeQuote);
	getCover(renderCover);
}

/***
 *    ##      ##  #######  ########  ########   ######
 *    ##  ##  ## ##     ## ##     ## ##     ## ##    ##
 *    ##  ##  ## ##     ## ##     ## ##     ## ##
 *    ##  ##  ## ##     ## ########  ##     ##  ######
 *    ##  ##  ## ##     ## ##   ##   ##     ##       ##
 *    ##  ##  ## ##     ## ##    ##  ##     ## ##    ##
 *     ###  ###   #######  ##     ## ########   ######
 */

function watchWords() {
	$('.bandName').click(function (e) {
		getWordsData(renderAllWords);
	});
}

function getWordsData(callback) {
	const query = {
		limit: 2,
		minLength: 3,
		api_key: WORDS_API,
	};
	$.getJSON(WORDS_ENDPOINT, query, callback);
}

function renderAllWords(object) {
	BAND = object.map((item) => item.word);
	let result = BAND.join(' ');
	console.log(BAND);
	renderWords(result);
}

function renderWords(result) {
	$('.js-band > h2').text(result);
	$('.js-band').children().css('color', CURRENT_COLOR);
}

function applyBlank(band) {
	let name = band.join(' ');
	let endsInS = name.charAt(name.length - 1) === 's' ? '' : 's';
	return blank ? 'The ' + name + endsInS : name;
}

function applyMono(band) {
	return mono ? [band[0]] : band;
}

function applyFlip(band) {
	return flip ? band.slice().reverse() : band;
}

function nameControls() {
	$('.js-band').on('change', 'input[type = "checkbox"]', function () {
		blank = $('#theNames:checked').length;
		mono = $('#mono:checked').length;
		flip = $('#flip:checked').length;

		let flipped = applyFlip(BAND);
		let monoed = applyMono(flipped);
		let blanked = applyBlank(monoed);
		renderWords(blanked);
	});
}

/***
 *     #######  ##     ##  #######  ######## ########
 *    ##     ## ##     ## ##     ##    ##    ##
 *    ##     ## ##     ## ##     ##    ##    ##
 *    ##     ## ##     ## ##     ##    ##    ######
 *    ##  ## ## ##     ## ##     ##    ##    ##
 *    ##    ##  ##     ## ##     ##    ##    ##
 *     ##### ##  #######   #######     ##    ########
 */

function getQuoteData(callback) {
	$.getJSON(QUOTE_ENDPOINT, callback);
}

function watchQuote() {
	$('.albumName').click(function (e) {
		getQuoteData(renderWholeQuote);
	});
}

function watchQuoteLength() {
	$('.js-album').on('click', '#less', function (e) {
		let wordCount = ALBUM_WORD_COUNT--;
		renderQuote(ALBUM, wordCount);
	});
	$('.js-album').on('click', '#more', function (e) {
		let wordCount = ALBUM_WORD_COUNT++;
		renderQuote(ALBUM, wordCount);
	});
}

function renderQuote(result, wordCount) {
	wordCount = ALBUM_WORD_COUNT;
	let crop = ALBUM.split(' ').splice(0, wordCount).join(' ');
	$('.js-album > h2').text(crop);
	$('.js-album').children().css('color', CURRENT_COLOR);
	return crop;
}

function renderWholeQuote(data) {
	ALBUM = data.content;
	renderQuote(ALBUM);
}

/***
 *     ######   #######  ##     ## ######## ########
 *    ##    ## ##     ## ##     ## ##       ##     ##
 *    ##       ##     ## ##     ## ##       ##     ##
 *    ##       ##     ## ##     ## ######   ########
 *    ##       ##     ##  ##   ##  ##       ##   ##
 *    ##    ## ##     ##   ## ##   ##       ##    ##
 *     ######   #######     ###    ######## ##     ##
 */

function getCover(callback) {
	const query = {
		client_id: COVER_API,
		orientation: 'squarish',
	};
	$.getJSON(COVER_ENDPOINT, query, callback);
}

function watchCover() {
	$('.albumCover').click(function (e) {
		getCover(renderCover);
	});
}

function renderCover(image) {
	COVER_URL = image.urls.regular;
	let photoCreditName = image.user.name;
	let photoCreditLink =
		image.user.links.html +
		'?utm_medium=referral&amp;utm_campaign=photographer-credit&amp;utm_content=creditBadge&amp;utm_source=band_o_matic';
	let photoCreditTitle =
		'Download free do whatever you want high-resolution photos from ' +
		photoCreditName;
	let desc;
	if (image.description) {
		desc = image.description.replace(/'/g, '&apos;');
	}
	$('#initAlbum').css('display', 'none');
	watchResize();
	$('.colorPalette').html(` `);
	$('.js-cover')
		.css('background-image', 'url(' + COVER_URL + ')')
		.attr('aria-label', desc ? 'An album cover depicting " + desc + "' : '');
	$('#photoCreditText').text(`Photo by ${photoCreditName} on Unsplash`);
	$('#photoCreditLink').attr({
		href: photoCreditLink,
		title: photoCreditTitle,
	});
	getColors(renderColors);
}

/***
 *     ######   #######  ##        #######  ########   ######
 *    ##    ## ##     ## ##       ##     ## ##     ## ##    ##
 *    ##       ##     ## ##       ##     ## ##     ## ##
 *    ##       ##     ## ##       ##     ## ########   ######
 *    ##       ##     ## ##       ##     ## ##   ##         ##
 *    ##    ## ##     ## ##       ##     ## ##    ##  ##    ##
 *     ######   #######  ########  #######  ##     ##  ######
 */

function renderColors(data) {
	let bank = [];
	let background = data.results[0].info.background_colors.map(
		(color) => color.html_code
	);
	let image = data.results[0].info.image_colors.map((color) => color.html_code);
	let foreground = data.results[0].info.foreground_colors.map(
		(color) => color.html_code
	);
	let colorBatch = [background, image, foreground];
	for (var i = 0; i < colorBatch.length; i++) {
		if (colorBatch[i].length !== 0) {
			bank.push(colorBatch[i]);
		}
	}
	let colorList = bank.reduce((a, b) => a.concat(b));
	colorList.push('#ffffff', '#000000');
	COLORS = Array.from(new Set(colorList)).sort();
	renderPalette();
}

function renderPalette() {
	const $palette = $('.colorPalette');
	$palette.empty();
	for (var i = 0; i < COLORS.length; i++) {
		$palette.append(
			`<input type='button' class='paletteItem' title='${COLORS[i]}' id='color${
				i + 1
			}' style='background-color:${COLORS[i]}'>`
		);
	}
	watchPalette();
}

function watchPalette() {
	$('.js-cover').on('click', '.paletteItem', function () {
		CURRENT_COLOR = $(this).css('background-color');
		getCurrentName().children().css('color', CURRENT_COLOR);
	});
}

function getColors(callback) {
	return $.ajax({
		url: COLORS_ENDPOINT,
		data: {
			url: COVER_URL,
		},
		beforeSend: function (xhr) {
			xhr.setRequestHeader(
				'Authorization',
				'Basic YWNjXzkzNmNmNDMzOGQ0ODNiODowMjk3Y2Q3ZTQwMzA1NjJiZWZlMzQzZDEyZWJhOTk2ZQ=='
			);
		},
	}).done(callback);
}

/***
 *    ########  ########     ###     ######
 *    ##     ## ##     ##   ## ##   ##    ##
 *    ##     ## ##     ##  ##   ##  ##
 *    ##     ## ########  ##     ## ##   ####
 *    ##     ## ##   ##   ######### ##    ##
 *    ##     ## ##    ##  ##     ## ##    ##
 *    ########  ##     ## ##     ##  ######
 */

function dragElement() {
	$('.js-band, .js-album').draggable({
		start: function (event, ui) {
			if (CURRENT_PANEL) {
				CURRENT_PANEL.close(function (id) {
					CURRENT_PANEL = undefined;
					PANEL_STATE = true;
				});
			} else {
				PANEL_STATE = false;
			}
		},
		containment: '#containment-wrapper',
		scroll: false,
	});
}

/***
 *    ########     ###    ##    ## ######## ##        ######
 *    ##     ##   ## ##   ###   ## ##       ##       ##    ##
 *    ##     ##  ##   ##  ####  ## ##       ##       ##
 *    ########  ##     ## ## ## ## ######   ##        ######
 *    ##        ######### ##  #### ##       ##             ##
 *    ##        ##     ## ##   ### ##       ##       ##    ##
 *    ##        ##     ## ##    ## ######## ########  ######
 */

function bandPanel() {
	return jsPanel.create({
		onWindowResize: true,
		container: '.js-band',
		animateIn: 'jsPanelFadeIn',
		callback: renderPalette,
		content: `<div class='fontControl'>
<input id='bandfont' type='text'>
<div class='fontSize'>
  <button id="down">-</button>
  <p id="font-size"></p>
  <button id="up">+</button>
  </div>
</div>
<p>Customize the Band Name</p>
<div class='controlPanel' id='textEdit'>
    <input type='checkbox' id='flip'>
    <label for='flip'>Flip</label>
    <input type='checkbox' id='mono'>
    <label for='mono'>Single</label>
    <input type='checkbox' id='theNames'>
    <label for='theNames'>The ___s</label>
    </div>
    <p>Pick a Text Color</p>
    <div class='colorPalette'></div>`,
		target: '.js-band',
		mode: 'default',
		ttipEvent: 'mouseover',
		delay: 0,
		connector: '#FBD0D9',
		position: {
			my: 'left-top',
			at: 'left-bottom',
			offsetY: '40px',
		},
		id: 'bandTool',
		contentOverflow: 'scroll',
		panelSize: '320 350',
		contentSize: '100% 20',
		theme: 'none',
		boxShadow: 3,
		border: '6px solid',
		headerTitle: 'Band Name Editor',
		headerControls: 'closeonly',
	});
}

function watchPanels() {
	$('.js-band').on('pointerdown', function (event) {
		CURRENT_PANEL || (CURRENT_PANEL = bandPanel());
		CURRENT_NAME = 'bandName';
	});

	$('.js-album').on('pointerdown', function (event) {
		CURRENT_PANEL || (CURRENT_PANEL = albumPanel());
		CURRENT_NAME = 'albumName';
	});
	document.addEventListener('jspanelloaded', function (event) {
		let fontID;
		let nameClass;
		if (event.detail === 'albumTool') {
			fontID = '#albumfont';
			nameClass = '.js-album';
		} else if (event.detail === 'bandTool') {
			fontID = '#bandfont';
			nameClass = '.js-band';
		}
		$(fontID)
			.fontselect()
			.on('change', function () {
				var font = $(this).val().replace(/\+/g, ' ');
				font = font.split(':');
				$(nameClass).children().css('font-family', font[0]);
			});

		let initSize = $(nameClass).children().css('font-size');
		let size = parseInt(initSize, 10);
		$('#font-size').text(size);
		$('#up').on('click', function () {
			if (size + 2 <= 90) {
				$(nameClass).children().css('font-size', '+=2');
				$('#font-size').text((size += 2));
			}
		});
		$('#down').on('click', function () {
			if (size - 2 >= 12) {
				$(nameClass).children().css('font-size', '-=2');
				$('#font-size').text((size -= 2));
			}
		});
	});
	document.addEventListener('jspanelclosed', function (event) {
		CURRENT_PANEL = undefined;
	});
}

function albumPanel() {
	return jsPanel.create({
		onWindowResize: true,
		container: '.js-album',
		animateIn: 'jsPanelFadeIn',
		callback: renderPalette,
		content: `<div class='fontControl'>
<input id='albumfont' type='text'>
<div class='fontSize'>
  <button id="down">-</button>
  <p id="font-size"></p>
  <button id="up">+</button>
  </div>
</div>
    <p>Increase or Decrease the Title Length</p>
    <div class='controlPanel' id='albumPanel'>
        <button type='button' id='less'>Fewer</button>
        <button type='button' id='more'>More</button>
    </div>
    <p>Pick a Text Color</p>
    <div class='colorPalette'></div>`,
		target: '.js-album',
		mode: 'sticky',
		ttipEvent: 'click',
		delay: 0,
		connector: '#FBD0D9',
		position: {
			my: 'left-bottom',
			at: 'left-top',
			offsetY: '-40px',
		},
		id: 'albumTool',
		contentOverflow: 'scroll',
		panelSize: '320 350',
		contentSize: '100% 20',
		theme: 'none',
		boxShadow: 3,
		border: '6px solid',
		headerTitle: 'Album Name Editor',
		headerControls: 'closeonly',
	});
}

function watchResize() {
	$(document).resize(function (event) {
		// squarify cover image(s)
		$('.js-cover').css('height', $('#coverOverlay').css('width'));
	});
}

/***
 *     #######  ##    ## ##        #######     ###    ########
 *    ##     ## ###   ## ##       ##     ##   ## ##   ##     ##
 *    ##     ## ####  ## ##       ##     ##  ##   ##  ##     ##
 *    ##     ## ## ## ## ##       ##     ## ##     ## ##     ##
 *    ##     ## ##  #### ##       ##     ## ######### ##     ##
 *    ##     ## ##   ### ##       ##     ## ##     ## ##     ##
 *     #######  ##    ## ########  #######  ##     ## ########
 */

$(pageLoad);
$(dragElement);
$(watchPanels);
$(watchCover);
$(watchQuote);
$(watchQuoteLength);
$(watchWords);
$(nameControls);
$(watchResize);

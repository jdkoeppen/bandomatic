const QUOTE_ENDPOINT = 'https://talaikis.com/api/quotes/random/'
const WORDS_ENDPOINT = 'https://api.wordnik.com/v4/words.json/randomWords'
const WORDS_API = 'a9ebebf8301d0e2e3a0070d083d0143dc1fd6a7989e31b1c6'
const COVER_ENDPOINT = 'https://api.unsplash.com/photos/random'
const COVER_API = 'bad147bdc617e39778666eecef33b4dbee3cfb28693e0b73ba08441bb647c5da'
const COLORS_ENDPOINT = 'https://api.imagga.com/v1/colors'
const ALBUM_CANVAS = 570
var COVER_URL = ''
var BAND = []
var ALBUM = []
var COLORS = []
var CURRENT_COLOR = '#ffffff'
var ALBUM_WORD_COUNT = 4
var BAND_PANEL
var mono = 0, flip = 0, blank = 0

function watchNameControls() {
  $('.textControl input[type="radio"]').change(function() {
    initSliders()
  })
}

// Track global for what text element has been clicked on rather than which switch has been selected
function getCurrentName() {
  if ($('#bandControl').is(':checked')) {
    return $('.js-band')
  } else {
    return $('.js-album')
  }
}

// function setPanels () {
//   $('#bandPanel').slideUp('5')
//   $('#albumPanel').slideUp('5')
//   $('#coverPanel').slideUp('5')
// }

function pageLoad () {
  getWordsData(renderAllWords)
  getQuoteData(renderWholeQuote)
  getCover(renderCover)
  initSliders()
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

function watchWords () {
  $('#bandName').on('click', 'h3', function (e) {
    $('#bandPanel').slideDown('fast')
    getWordsData(renderAllWords)
  })
}

function watchCustomName () {
  $('form').on('click', '#words', function() {
    $('#bandPanel').slideToggle('fast')
  })
}

function getWordsData (callback) {
  const query = {
    limit: 2,
    minLength: 3,
    api_key: WORDS_API
  }
  $.getJSON(WORDS_ENDPOINT, query, callback)
}

function renderAllWords(object) {
  BAND = object.map(item => item.word)
  let result = BAND.join(' ')
  console.log(BAND)
  renderWords(result)
}

function renderWords(result) {
  $('.js-band > h2').text(result)
  $('.js-band').children().css('color', CURRENT_COLOR)
}

function applyBlank(band) {
  let name = band.join(' ')
  let endsInS = name.charAt(name.length - 1) === 's' ? '' : 's'
  return blank ? 'The ' + name + endsInS : name
}

function applyMono(band) {
  return mono ? [band[0]] : band
}

function applyFlip(band) {
  return flip ? band.slice().reverse() : band
}

function nameControls () {
  $('input[type="checkbox"]').change(function () {
    blank = $('#theNames:checked').length
    mono = $('#mono:checked').length
    flip = $('#flip:checked').length

    let flipped = applyFlip(BAND)
    let monoed = applyMono(flipped)
    let blanked = applyBlank(monoed)
    renderWords(blanked)

    //    var DISPLAY_BAND_NAME = applyBlank(applyMono(applyFlip(BAND)))
    //    renderWords(DISPLAY_BAND_NAME)
  })
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

function getQuoteData (callback) {
  $.getJSON(QUOTE_ENDPOINT, callback)
}

function watchQuote () {
  $('#albumName').on('click', 'h3', function (e) {
    $('#albumPanel').slideDown('fast')
    getQuoteData(renderWholeQuote)
  })
}

function watchCustomAlbum () {
  $('form').on('click', '#quote', function () {
    $('#albumPanel').slideToggle('fast')
  })
}

function watchQuoteLength () {
  $('form').on('click', '#less', function (e) {
    let noWords = ALBUM_WORD_COUNT--
    renderQuote(ALBUM, noWords)
  })
  $('form').on('click', '#more', function (e) {
    let noWords = ALBUM_WORD_COUNT++
    renderQuote(ALBUM, noWords)
  })
}

function renderQuote (result, noWords) {
  noWords = ALBUM_WORD_COUNT
  let crop = ALBUM.split(' ').splice(0, noWords).join(' ')
  $('.js-album').html(`<h2 id='currentAlbum'>${crop}</h2>`)
  $('.js-album').children().css('color', CURRENT_COLOR)

  return crop
}

function renderWholeQuote (data) {
  ALBUM = data.quote
  renderQuote(ALBUM)
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
    orientation: 'squarish'
  }
  $.getJSON(COVER_ENDPOINT, query, callback)
}

function watchCover() {
  $('#albumCover').on('click', 'h3', function(e) {
    $('#coverPanel').slideDown('normal')
    // $('#cover').show('slow').removeAttr('hidden')
    getCover(renderCover)
  })
}

function watchCustomCover() {
  $('form').on('click', '#cover', function () {
    $('#coverPanel').slideToggle('normal')
  })
}

function renderCover(image) {
  COVER_URL = image.urls.regular
  let photoCreditName = image.user.name
  let photoCreditLink = image.user.links.html +
  '?utm_medium=referral&amp;utm_campaign=photographer-credit&amp;utm_content=creditBadge&amp;utm_source=band_o_matic'
  let photoCreditTitle = 'Download free do whatever you want high-resolution photos from ' + photoCreditName
  let desc
  if (image.description) {
    desc = image.description.replace(/'/g, '&apos;')
  }
  $('#defaultCover').css('visibility', 'hidden')
  $('.colorPalette').html(` `)
  $('.js-cover').append(`<div id='coverImg'>
    <img id='coverImg' src='${COVER_URL}'${desc && "alt='An album cover depicting " + desc + "' "}></div>
    `)
  $('#photoCreditText').text(`Photo by ${photoCreditName} on Unsplash`)
  $('#photoCreditLink').attr({href: photoCreditLink, title: photoCreditTitle})
  getColors(renderColors)
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

function renderColors (data) {
  let bank = []
  let background = data.results[0].info.background_colors.map(color => color.html_code)
  let image = data.results[0].info.image_colors.map(color => color.html_code)
  let foreground = data.results[0].info.foreground_colors.map(color => color.html_code)
  let colorBatch = [background, image, foreground]
  for (var i = 0; i < colorBatch.length; i++) {
    if (colorBatch[i].length !== 0) {
      bank.push(colorBatch[i])
    }
  }
  let colorList = bank.reduce((a, b) => a.concat(b))
  colorList.push('#ffffff', '#000000')
  COLORS = Array.from(new Set(colorList)).sort()
  renderPalette()
}

function renderPalette () {
  for (var i = 0; i < COLORS.length; i++) {
    $('.colorPalette').append(`<input type='button' class='paletteItem' title='${COLORS[i]}' id='color${i + 1}' style='background-color:${COLORS[i]}'>`)
  }
  watchPalette()
}

function watchPalette () {
  $('.colorPalette').on('click', '.paletteItem', function () {
    CURRENT_COLOR = $(this).css('background-color')
    getCurrentName().children().css('color', CURRENT_COLOR)
  })
}

function getColors(callback) {
  return $.ajax({
    url: COLORS_ENDPOINT,
    data: {
      url: COVER_URL
    },
    beforeSend: function (xhr) {
      xhr.setRequestHeader('Authorization', 'Basic YWNjXzkzNmNmNDMzOGQ0ODNiODowMjk3Y2Q3ZTQwMzA1NjJiZWZlMzQzZDEyZWJhOTk2ZQ==')
    }
  }).done(callback)
}

/***
 *     ######  ##       #### ########  ######## ########
 *    ##    ## ##        ##  ##     ## ##       ##     ##
 *    ##       ##        ##  ##     ## ##       ##     ##
 *     ######  ##        ##  ##     ## ######   ########
 *          ## ##        ##  ##     ## ##       ##   ##
 *    ##    ## ##        ##  ##     ## ##       ##    ##
 *     ######  ######## #### ########  ######## ##     ##
 */

function initSliders() {
  const name = getCurrentName()
  $('#moveX').val(getXOffset())
  $('#moveY').val(getYOffset())
}

function getXOffset() {
  const name = getCurrentName()
  const xPos = parseInt(name.css('left'), 10)
  const margin = ALBUM_CANVAS * 0.05
  const contentWidth = ALBUM_CANVAS - margin * 2
  const nameWidth = parseInt(name.css('width'))
  const availableWidth = contentWidth - nameWidth
  const ratio = (xPos - margin) / availableWidth
  const num = Math.floor(ratio * 100)
  return num
}

function getYOffset() {
  const name = getCurrentName()
  const xPos = parseInt(name.css('top'), 10)
  const margin = ALBUM_CANVAS * 0.05
  const contentWidth = ALBUM_CANVAS
  const nameHeight = parseInt(name.css('height'))
  const availableWidth = contentWidth - nameHeight
  const ratio = xPos / availableWidth
  const num = Math.floor(ratio * 100)
  return num
}

function setXOffset(num) {
  const name = getCurrentName()
  const margin = ALBUM_CANVAS * 0.05
  const contentWidth = ALBUM_CANVAS - margin * 2
  const nameWidth = parseInt(name.css('width'))
  const xValue = (margin) + num / 100 * (contentWidth - nameWidth)
  name.css('left', xValue)
}

function setYOffset(num) {
  const name = getCurrentName()
  const margin = ALBUM_CANVAS * 0.02
  const contentWidth = ALBUM_CANVAS - margin * 2
  const nameWidth = parseInt(name.css('height'))
  const yValue = (margin / 2) + num / 100 * (contentWidth - nameWidth)
  name.css('top', yValue)
}

function watchSliders () {
  $('input[type="range"]').on('input', function() {
    if ($(this).attr('id') === 'moveX') {
      setXOffset($(this).val())
    } else if ($(this).attr('id') === 'moveY') {
      setYOffset($(this).val())
    }
  })
}

/***
 *    ########  #######  ##    ## ########  ######
 *    ##       ##     ## ###   ##    ##    ##    ##
 *    ##       ##     ## ####  ##    ##    ##
 *    ######   ##     ## ## ## ##    ##     ######
 *    ##       ##     ## ##  ####    ##          ##
 *    ##       ##     ## ##   ###    ##    ##    ##
 *    ##        #######  ##    ##    ##     ######
 */

$(function () {
  $('#font').fontselect().change(function () {
    var font = $(this).val().replace(/\+/g, ' ')
    font = font.split(':')
    getCurrentName().children().css('font-family', font[0])
  })
})

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
  $('.js-band').draggable({ containment: '#containment-wrapper', scroll: false })
  $('.js-album').draggable({ containment: '#containment-wrapper', scroll: false })
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

function watchBandPanel () {
  let lastHover
  $('.js-band').on('mousedown', function(event) {
    BAND_PANEL || (BAND_PANEL = bandPanel())
  });
 document.addEventListener('jspanelclosed', function (event) {
    if (event.detail === 'bandTool') {
      BAND_PANEL = undefined
      // do your things ...
      // would be executed only for the panel with the id 'panel_id'
    }
  });
}


function bandPanel () {
  return jsPanel.create({
    container: '.js-band',
    animateIn: 'jsPanelFadeIn',
    content: `<div class='colorPalette'>
                        </div>`,
    target: '.js-band',
    mode: 'sticky',
    ttipEvent: 'click',
    delay: 0,
    connector: '#FBD0D9',
    position: {
      my: 'left-top',
      at: 'left-bottom,'
    },
    id: 'bandTool',
    contentSize: '80% 65',
    theme: 'none',
    border: false,
    headerTitle: '',
    headerControls: 'closeonly'
  })
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

$(pageLoad)
$(dragElement)
$(watchBandPanel)
// $(setPanels)
$(watchCover)
$(watchQuote)
$(watchQuoteLength)
$(watchWords)
$(nameControls)
$(watchCustomName)
$(watchCustomAlbum)
$(watchCustomCover)
$(watchSliders)
$(watchNameControls)

const QUOTE_ENDPOINT = 'https://talaikis.com/api/quotes/random/'
const WORDS_ENDPOINT = 'https://api.wordnik.com/v4/words.json/randomWords'
const WORDS_API = 'a9ebebf8301d0e2e3a0070d083d0143dc1fd6a7989e31b1c6'
const COVER_ENDPOINT = 'https://api.unsplash.com/photos/random'
const COVER_API = 'bad147bdc617e39778666eecef33b4dbee3cfb28693e0b73ba08441bb647c5da'
const COLORS_ENDPOINT = 'https://api.imagga.com/v1/colors'
const ALBUM_CANVAS = 570
var COVER_URL = ''
var BAND = []
var DISPLAY_BAND_NAME
var ALBUM = []
var COLORS = []
var CURRENT_COLOR
var ALBUM_WORD_COUNT = 4

function setControlsOff() {
  $('#bandPanel').slideUp(10)
  $('#albumPanel').slideUp(10)
  $('#coverPanel').slideUp(10)
}

function getCurrentName() {
  if ($('#bandControl').is(':checked')) {
    return $('.js-band')
  } else {
    return $('.js-album')
  }
}

function pageLoad () {
  getWordsData(renderAllWords)
  getQuoteData(renderWholeQuote)
  getCover(renderCover)
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
  $('.js-band').html(`<h2 id='currentBand'>${result}</h2>`)
}

function applyBlank(band) {
  let name = band.join(' ')
  let endsInS = name.charAt(-1) === 's' ? '' : 's'
  return $('#theNames:checked').length ? 'The ' + name + endsInS : name
}

function applyMono(band) {
  return $('#mono:checked').length ? [band[0]] : band
}

function applyFlip(band) {
  return $('#flip').length ? band.reverse() : band
}

function nameControls () {
  $('#bandPanel').change('input[type=checkbox]', function () {
    renderWords(applyBlank(applyMono(applyFlip(BAND))))
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
    $('#cover').show('slow').removeAttr('hidden')
    getCover(renderCover)
  })
}

function watchCustomCover() {
  $('form').on('click', '#cover', function () {
    $('#coverPanel').slideToggle('fast')
  })
}

function renderCover(image) {
  COVER_URL = image.urls.regular
  let photoCreditText = image.user.username
  let photoCreditLink = image.user.links.html
  let desc
  if (image.description) {
    desc = image.description.replace(/'/g, '&apos;')
  }
  $('#defaultCover').css('visibility', 'hidden')
  $('.colorPalette').html(` `)
  $('.js-cover').append(`<div id='coverImg'>
    <img id='coverImg' src='${COVER_URL}'${desc && "alt='An album cover depicting " + desc + "' "}></div>
    `)
  $('#photoCreditText').text('Photo by ' + photoCreditText)
  $('#photoCreditLink').attr('href', photoCreditLink)
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
      bank.push(colorBatch[i], '#ffffff', '#000000')
    }
  }
  COLORS = bank.reduce((a, b) => a.concat(b))
  renderPalette()
}

function renderPalette () {
  for (var i = 0; i < COLORS.length; i++) {
    $('.colorPalette').append(`<input type='button' class='paletteItem' title='' id='color${i + 1}' style='background-color:${COLORS[i]}'>`)
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
 *    ########   #######   ######
 *    ##     ## ##     ## ##    ##
 *    ##     ## ##     ## ##
 *    ##     ## ##     ## ##
 *    ##     ## ##     ## ##
 *    ##     ## ##     ## ##    ##
 *    ########   #######   ######
 */

$(pageLoad)
$(setControlsOff)
$(watchCover)
$(watchQuote)
$(watchQuoteLength)
$(watchWords)
$(nameControls)
$(watchCustomName)
$(watchCustomAlbum)
$(watchCustomCover)
$(watchSliders)

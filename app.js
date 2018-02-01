const QUOTE_ENDPOINT = 'https://talaikis.com/api/quotes/random/'
const WORDS_ENDPOINT = 'https://api.wordnik.com/v4/words.json/randomWords'
const WORDS_API = 'a9ebebf8301d0e2e3a0070d083d0143dc1fd6a7989e31b1c6'
const COVER_ENDPOINT = 'https://api.unsplash.com/photos/random'
const COVER_API = 'bad147bdc617e39778666eecef33b4dbee3cfb28693e0b73ba08441bb647c5da'
const COLORS_ENDPOINT = 'https://api.imagga.com/v1/colors'
const ALBUM_CANVAS = 600
var COVER_URL = ''
var BAND = []
var ALBUM = []
var COLORS = []
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
  console.log(COVER_URL)
  let desc
  if (image.description) {
    desc = image.description.replace(/'/g, '&apos;')
  }
  $('#defaultCover').css('visibility', 'hidden')
  $('.colorPalette').html(` `)
  $('.js-cover').append(`<div id='coverImg'>
    <img id='coverImg' src='${COVER_URL}'${desc && "alt='An album cover depicting " + desc + "' "}></div>
    `)
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
    let color = $(this).css('background-color')
    getCurrentName().children().css('color', color)
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

function nameControls () {
  $('#bandPanel').change('input[type=checkbox]', function () {
    renderWords(applyBlank(applyMono(applyFlip(BAND))))
  })
}

function applyBlank(band) {
  $('input[type=checkbox]#theNames').change(function (e) {
    let name = BAND.join(' ')
    let endsInS = name.charAt(-1) === 's' ? 's' : ''
    console.log(endsInS)
    return (this.checked) ? 'The ' + name + endsInS : name
  })
}

function applyMono(band) {
  $('input[type=checkbox]#mono').change(function (e) {
    return (this.checked) ? [BAND[0]] : BAND
  })
}

function applyFlip(band) {
  $('input[type=checkbox]#flip').change(function (e) {
    return (this.checked) ? BAND.reverse() : BAND
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
  console.log(crop)
  return crop
}

function renderWholeQuote (data) {
  ALBUM = data.quote
  renderQuote(ALBUM)
}

// 
// 
// SLIDERS
// 
// 

function setXOffset(num) {
  const name = getCurrentName()
  const margin = ALBUM_CANVAS * 0.05
  const contentWidth = ALBUM_CANVAS - margin * 2
  const nameWidth = parseInt(name.css('width'))
  const xValue = (margin / 2) + num / 100 * (contentWidth - nameWidth)
  name.css('left', xValue)
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
$(watchQuote)
$(watchQuoteLength)
$(watchWords)
$(nameControls)
$(watchCover)
$(watchCustomName)
$(watchCustomAlbum)
$(watchCustomCover)
$(watchSliders)
// $(watchColors)
// $(initZInput)

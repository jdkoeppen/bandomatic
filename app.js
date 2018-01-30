const QUOTE_ENDPOINT = 'https://talaikis.com/api/quotes/random/'
const WORDS_ENDPOINT = 'https://api.wordnik.com/v4/words.json/randomWords'
const WORDS_API = 'a9ebebf8301d0e2e3a0070d083d0143dc1fd6a7989e31b1c6'
const COVER_ENDPOINT = 'https://api.unsplash.com/photos/random'
const COVER_API = 'bad147bdc617e39778666eecef33b4dbee3cfb28693e0b73ba08441bb647c5da'
const COLORS_ENDPOINT = 'https://api.imagga.com/v1/colors'
var COVER_URL = ''
var BAND = []
var ALBUM = []
var COLORS = []
var DISPLAY_BAND_NAME = BAND.join(' ')
var ALBUM_WORD_COUNT = 4

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
  $('form').on('click', '#cover', function(e) {
    getCover(renderCover)
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
  console.log(COLORS)
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
    $('#currentName').css('color', color)
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
  $('form').on('click', '#words', function (e) {
    getWordsData(renderAllWords)
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
  DISPLAY_BAND_NAME = BAND.join(' ')
  console.log(BAND)
  renderWords(DISPLAY_BAND_NAME)
}

function renderWords(result) {
  $('.js-band').html(`<h2 id='currentName'>${DISPLAY_BAND_NAME}</h2>`)
}

function nameControls () {
  $('input[type=checkbox]#flip').change(function (e) {
    DISPLAY_BAND_NAME = BAND.reverse().join(' ')
    renderWords(DISPLAY_BAND_NAME)
  })
  $('input[type=checkbox]#mono').change(function (e) {
    if (this.checked) {
      DISPLAY_BAND_NAME = BAND[0]
      renderWords(DISPLAY_BAND_NAME)
    } else {
      DISPLAY_BAND_NAME = BAND.join(' ')
      renderWords(DISPLAY_BAND_NAME)
    }
  })
  $('input[type=checkbox]#theNames').change(function (e) {
    if (this.checked) {
      DISPLAY_BAND_NAME = 'The ' + DISPLAY_BAND_NAME + 's'
      renderWords(DISPLAY_BAND_NAME)
    } else {
      DISPLAY_BAND_NAME = BAND.join(' ')
      renderWords(DISPLAY_BAND_NAME)
    }
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
  $('form').on('click', '#quote', function (e) {
    getQuoteData(renderWholeQuote)
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
  $('.js-album').html(`<h2>${crop}</h2>`)
  console.log(crop)
  return crop
}

function renderWholeQuote (data) {
  ALBUM = data.quote
  renderQuote(ALBUM)
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

$(watchQuote)
$(watchQuoteLength)
$(watchWords)
$(nameControls)
$(watchCover)
// $(watchColors)
// $(initZInput)

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
  $('.js-cover').html(`
    <div id='textLayer'></div>
    <div id='coverLayer'><img id='coverOverlay' src='assets/coverOverlay.png' ${desc && "title='An album cover depicting " + desc + "' "}>
    <img id='coverImg' src='${COVER_URL}'${desc && "alt='An album cover depicting " + desc + "' "}></div>
    `)
}

function watchColors () {
  $('form').on('click', '#name', e => {
    getColors(renderColors)
  })
}

function renderColors (data) {
  COLORS = data.results[0].info.background_colors.map(color => color.html_code)
  let color1 = COLORS[1]
  $('#textLayer').html(`<h3 id='colorTest' style='color:${color1}'>${DISPLAY_BAND_NAME}</h3>`)
  console.log(COLORS)
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

function initZInput () {
  $('#namePalette').zInput()
}

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
  $('.js-words span').html(`<h2>${result}</h2>`)
}

function watchFlip () {
  $('form').on('click', '#flip', function (e) {
    DISPLAY_BAND_NAME = BAND.reverse().join(' ')
    console.log(DISPLAY_BAND_NAME)
    renderWords(DISPLAY_BAND_NAME)
  })
}

function watchMono () {
  $('input[type=checkbox]').change(
    function () {
      if (this.checked) {
        renderWords(BAND[0])
      } else renderWords(BAND.join(' '))
    })
}

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
  $('.js-quote span').html(`<h2>${crop}</h2>`)
  console.log(crop)
  return crop
}

function renderWholeQuote (data) {
  ALBUM = data.quote
  renderQuote(ALBUM)
}

$(watchQuote)
$(watchQuoteLength)
$(watchWords)
$(watchFlip)
$(watchMono)
$(watchCover)
$(watchColors)
$(initZInput)

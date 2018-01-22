const QUOTEENDPOINT = 'https://api.forismatic.com/api/1.0/?method=getQuote&lang=en&format=jsonp&jsonp=?'
const WORDSENDPOINT = 'https://api.wordnik.com/v4/words.json/randomWords'
const WORDAPI = 'a9ebebf8301d0e2e3a0070d083d0143dc1fd6a7989e31b1c6'
const COVERENDPOINT = 'https://api.unsplash.com/photos/random'
const COVERAPI = 'bad147bdc617e39778666eecef33b4dbee3cfb28693e0b73ba08441bb647c5da'
var COVERURL = ''
var BAND = []
var ALBUM = []
var ALBUM_WORD_COUNT = 4

function getCover(callback) {
  const query = {
    client_id: COVERAPI,
    orientation: 'squarish'
  }
  $.getJSON(COVERENDPOINT, query, callback)
  console.log('getCover ran')
}

function watchCover() {
  $('form').on('click', '#cover', function(e) {
    getCover(renderCover)
    console.log('cover clicked')
  })
}

function renderCover(image) {
  COVERURL = image.urls.regular
  console.log(COVERURL)
  $('.js-cover').html(`<img id='coverImg' src='${COVERURL}'>`)
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
    api_key: WORDAPI
  }
  $.getJSON(WORDSENDPOINT, query, callback)
}

function renderAllWords(object) {
  BAND = object.map(item => item.word)
  console.log(BAND)
  renderWords(BAND.join(' '))
}

function renderWords(result) {
  $('.js-words').html(`<h2>${result}</h2>`)
}

function watchFlip () {
  $('form').on('click', '#flip', function (e) {
    let flip = BAND.reverse()
    console.log(flip)
    renderWords(flip.join(' '))
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
  $.getJSON(QUOTEENDPOINT, callback)
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
  $('.js-quote').html(`<h2>${crop}</h2>`)
  console.log(crop)
  return crop
}

function renderWholeQuote (data) {
  ALBUM = data.quoteText
  renderQuote(ALBUM)
}

$(watchQuote)
$(watchQuoteLength)
$(watchWords)
$(watchFlip)
$(watchMono)
$(watchCover)

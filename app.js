const QUOTEENDPOINT = 'https://api.forismatic.com/api/1.0/?method=getQuote&lang=en&format=jsonp&jsonp=?'
const WORDSENDPOINT = 'https://api.wordnik.com/v4/words.json/randomWords'
const WORDAPI = 'a9ebebf8301d0e2e3a0070d083d0143dc1fd6a7989e31b1c6'
var quote = ''
var words = ''
var word1
var word2
var x = 4
var crop

function getWordsData (callback) {
  const query = {
    limit: 5,
    minLength: 3,
    api_key: WORDAPI
  }
  $.getJSON(WORDSENDPOINT, query, callback)
}

function watchWords () {
  $('form').on('click', '#words', function (e) {
    words = 'fwd'
    getWordsData(renderAllWords)
  })
}

function watchFlip () {
  $('form').on('click', '#flip', function (e) {
    if (words === 'fwd') {
      renderWords(word2 + ' ' + word1)
      words = 'rev'
    } else if (words === 'rev') {
      renderWords(word1 + ' ' + word2)
      words = 'fwd'
    }
  })
}

/* function watchMono () {
  $('form').on('click', '#mono', function (e) {
} */

function renderWords (result) {
  $('.js-words').html(`<h2>${result}</h2>`)
}

function renderAllWords (object) {
  words = object
  word1 = object[0].word
  word2 = object[1].word
  renderWords(word1 + ' ' + word2)
  console.log(object)
}

function getQuoteData (callback) {
  $.getJSON(QUOTEENDPOINT, callback)
}

function watchQuote () {
  $('form').on('click', '#quote', function (e) {
    x = 4
    getQuoteData(renderWholeQuote)
  })
}

function watchQuoteLength () {
  $('form').on('click', '#less', function (e) {
    let noWords = x--
    renderQuote(quote, noWords)
  })
  $('form').on('click', '#more', function (e) {
    let noWords = x++
    renderQuote(quote, noWords)
  })
}

function renderQuote (result, noWords) {
  noWords = x
  crop = quote.split(' ').splice(0, noWords).join(' ')
  $('.js-quote').html(`<h2>${crop}</h2>`)
  console.log(crop)
  return crop
}

function renderWholeQuote (data) {
  quote = data.quoteText
  renderQuote(quote)
}

$(watchQuote)
$(watchQuoteLength)
$(watchWords)
$(watchFlip)

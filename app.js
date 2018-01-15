const QUOTEENDPOINT = 'https://api.forismatic.com/api/1.0/?method=getQuote&lang=en&format=jsonp&jsonp=?'
var quote
var x = 4
var crop

function getQuoteData (callback) {
  $.getJSON(QUOTEENDPOINT, callback)
}

function watchQuote () {
  $('form').on('click', '#quote', function (e) {
    getQuoteData(renderQuote)
  })
}

function watchQuoteLength () {
  $('form').on('click', '#less', function (e) {
    let noWords = x--
    let short = crop.replace(/\W/ig, ' ').split(' ').splice(0, noWords).join(' ')
    console.log(x)
    $('.js-quote').prepend(`<h2>${short}</h2>`)
  })
}

function renderQuote (data, noWords) {
  noWords = x
  quote = data.quoteText
  crop = quote.replace(/\W/ig, ' ').split(' ').splice(0, noWords).join(' ')
  $('.js-quote').prepend(`<h2>${crop}</h2>`)
  console.log(crop)
  return crop
}

$(watchQuote)
$(watchQuoteLength)

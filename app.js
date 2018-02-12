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
var PANEL_STATE
var CURRENT_PANEL
var CURRENT_NAME
var mono = 0, flip = 0, blank = 0

function getCurrentName() {
  if (CURRENT_NAME === 'bandName') {
    return $('.js-band')
  } else if (CURRENT_NAME === 'albumName') {
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
  $('#bandName').on('click', function (e) {
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
  $('.js-band').on('change', 'input[type = "checkbox"]', function () {
    blank = $('#theNames:checked').length
    mono = $('#mono:checked').length
    flip = $('#flip:checked').length

    let flipped = applyFlip(BAND)
    let monoed = applyMono(flipped)
    let blanked = applyBlank(monoed)
    renderWords(blanked)
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
  $('#albumName').on('click', function (e) {
    getQuoteData(renderWholeQuote)
  })
}

function watchQuoteLength () {
  $('.js-album').on('click', '#less', function (e) {
    let noWords = ALBUM_WORD_COUNT--
    renderQuote(ALBUM, noWords)
  })
  $('.js-album').on('click', '#more', function (e) {
    let noWords = ALBUM_WORD_COUNT++
    renderQuote(ALBUM, noWords)
  })
}

function renderQuote (result, noWords) {
  noWords = ALBUM_WORD_COUNT
  let crop = ALBUM.split(' ').splice(0, noWords).join(' ')
  $('.js-album > h2').text(crop)
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
  $('#albumCover').on('click', function(e) {
    $('#coverPanel').slideDown('normal')
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
  const $palette = $('.colorPalette')
  $palette.empty()
  for (var i = 0; i < COLORS.length; i++) {
    $palette.append(`<input type='button' class='paletteItem' title='${COLORS[i]}' id='color${i + 1}' style='background-color:${COLORS[i]}'>`)
  }
  watchPalette()
}

function watchPalette () {
  $('.js-cover').on('click', '.paletteItem', function () {
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
          CURRENT_PANEL = undefined
          PANEL_STATE = true
        })
      } else {
        PANEL_STATE = false
      }
    },
    containment: '#containment-wrapper', 
    scroll: false
  })
}
//   $('.js-album').draggable({ containment: '#containment-wrapper', scroll: false })
// }

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
  $('.js-band').on('mousedown', function(event) {
    CURRENT_PANEL || (CURRENT_PANEL = bandPanel())
    CURRENT_NAME = 'bandName'
  })
  document.addEventListener('jspanelloaded', function (event) {
    if (event.detail === 'bandTool') {
      $('#bandfont').fontselect().on('change', function () {
        var font = $(this).val().replace(/\+/g, ' '); font = font.split(':')
        $('.js-band').children().css('font-family', font[0])
      })
    }
    document.addEventListener('jspanelclosed', function (event) {
      if (event.detail === 'bandTool') {
        CURRENT_PANEL = undefined
      }
    })
  })
}

function bandPanel () {
  return jsPanel.create({
    container: '.js-band',
    animateIn: 'jsPanelFadeIn',
    callback: renderPalette,
    content: `<div>
<input id='bandfont' type='text'>
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
    mode: 'sticky',
    ttipEvent: 'click',
    delay: 0,
    connector: '#FBD0D9',
    position: {
      my: 'left-top',
      at: 'left-bottom',
      offsetY: '40px'
    },
    id: 'bandTool',
    panelSize: '400 275',
    contentSize: '100% 65',
    theme: 'default',
    boxShadow: 3,
    border: '5px solid',
    headerTitle: 'Band Name Editor',
    headerControls: 'closeonly'
  })
}

function watchAlbumPanel() {
  $('.js-album').on('mousedown', function (event) {
    CURRENT_PANEL || (CURRENT_PANEL = albumPanel())
    CURRENT_NAME = 'albumName'
  })
  document.addEventListener('jspanelloaded', function (event) {
    if (event.detail === 'albumTool') {
      $('#albumfont').fontselect().on('change', function () {
        var font = $(this).val().replace(/\+/g, ' ')
        font = font.split(':')
        $('.js-album').children().css('font-family', font[0])
      })
    }
    document.addEventListener('jspanelclosed', function (event) {
      if (event.detail === 'albumTool') {
        CURRENT_PANEL = undefined
      }
    })
  })
}

function albumPanel() {
  return jsPanel.create({
    container: '.js-album',
    animateIn: 'jsPanelFadeIn',
    callback: renderPalette,
    content: `<div>
    <input id='albumfont' type='text'>
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
      offsetY: '-40px'
    },
    id: 'albumTool',
    panelSize: '400 275',
    contentSize: '100% 65',
    theme: 'default',
    boxShadow: 3,
    border: '5px solid',
    headerTitle: 'Album Name Editor',
    headerControls: 'closeonly'
  })
}

/***
 *    ########  ########  ######  #### ######## ########
 *    ##     ## ##       ##    ##  ##       ##  ##
 *    ##     ## ##       ##        ##      ##   ##
 *    ########  ######    ######   ##     ##    ######
 *    ##   ##   ##             ##  ##    ##     ##
 *    ##    ##  ##       ##    ##  ##   ##      ##
 *    ##     ## ########  ######  #### ######## ########
 */

$('.js-album, .js-band').resizable({
  start: function (event, ui) {
    if (CURRENT_PANEL) {
      CURRENT_PANEL.close(function(id) {
        CURRENT_PANEL = undefined
        PANEL_STATE = true
      })
    } else {
      PANEL_STATE = false
    }
  },
  resize: function (event, ui) {
    let size = ui.size
    $(this).css({
      'font-size': (size.width * size.height) / 10000 + 'vmin'
    })
  },

  handles: 'n, ne, e, se, s, sw, w',
  containment: $('.js-cover'),
  autoHide: true,
  maxWidth: 550
})

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
$(watchAlbumPanel)
// $(setPanels)
$(watchCover)
$(watchQuote)
$(watchQuoteLength)
$(watchWords)
$(nameControls)
// $(watchCustomName)
// $(watchCustomAlbum)
$(watchCustomCover)
// $(watchSliders)
// $(watchNameControls)

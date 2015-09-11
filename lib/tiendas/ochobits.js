var request = require('request');
var cheerio = require('cheerio');
var tienda = require('./tienda');

var Ochobits = Object.create(tienda);

var buscar = function(texto, plataforma, cbk) {
  var urlBusqueda = this.url;
  var page = 1;
  var juegos = [];
  var self = this;

  if (arguments.length == 5) {
    juegos = arguments[3];
    page = arguments[4];
  }

  urlBusqueda = urlBusqueda.replace(':page', page).replace(':juego', texto);

  if (plataforma != null) {
    if (this.tienePlataforma(plataforma)) {
      urlBusqueda += '&category_id=' + this.plataformas[plataforma];
    }
  }

  urlBusqueda = urlBusqueda.replace(' ', '+');

  return request(urlBusqueda, function(err, res, body) {
    var $;

    if (err) {
      return cbk(juegos);
    }

    $ = cheerio.load(body);

    if (!$('.product-thumb').length) {
      return cbk(juegos);
    }

    $('.product-thumb').each(function(i, el) {
      var juego = {};

      juego.nombre = $(this).find('.caption').find('.name').find('a').first().text().trim();
      juego.url = $(this).find('.caption').find('.name').find('a').first().attr('href');

      if ($(this).find('.caption').find('.price').find('.price-new').length) {
        juego.precio = parseInt($(this).find('.caption').find('.price').find('.price-new').text().replace('.', '').replace('$', ''));
      } else {
        juego.precio = parseInt($(this).find('.caption').find('.price').text().replace('.', '').replace('$', ''));
      }

      juego.tienda = tienda;

      juegos.push(juego);
    });

    return setTimeout(function() {
      self.buscar(texto, plataforma, cbk, juegos, page + 1);
    }, 5000);
  });
};

var plataformas = {
  'PC': 131,
  'PS3': 89,
  'PS4': 114,
  'PSVITA': 96,
  'XBOX360': 98,
  'XBOXONE': 97,
  'WIIU': 119,
  'WII': 127,
  '3DS': 124
};

var tienda = {
  nombre: '8-bits',
  url: 'http://www.8-bits.cl'
};

Ochobits.buscar = buscar;
Ochobits.nombre = 'Ochobits';
Ochobits.plataformas = plataformas;
Ochobits.tienda = tienda;
Ochobits.url = 'http://www.8-bits.cl/index.php?route=product/search&search=:juego&page=:page';

module.exports = Ochobits;

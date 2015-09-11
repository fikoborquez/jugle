var request = require('request');
var cheerio = require('cheerio');
var tienda = require('./tienda');

var Microplay = Object.create(tienda);

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
      urlBusqueda += ' ' + this.plataformas[plataforma];
    }
  }

  urlBusqueda = urlBusqueda.replace(' ', '+');

  return request(urlBusqueda, function(err, res, body) {
    var $;

    if (err) {
      return cbk(juegos);
    }

    $ = cheerio.load(body);

    // Buscador de la página redirecciona a la ficha de producto cuando sólo hay una coincidencia
    if ($('.ficha').find('h1').length) {
      var juego = {};

      juego.nombre = $('.ficha').find('h1').text().trim();
      juego.url = $('#url').val();
      juego.precio = parseInt($('.ficha').find('.precios').find('strong').first().text().replace('.', '').replace('$', ''));
      juego.tienda = tienda;

      juegos.push(juego);

      return cbk(juegos);
    }

    if (! $('.juegos-similares').find('li').first().hasClass('ps2')) {
      return cbk(juegos);
    }

    $('.ps2').each(function(i, el) {
      var juego = {};

      juego.nombre = $(this).find('span').find('a').first().text().trim();
      juego.url = 'http://www.microplay.cl' + $(this).find('span').find('a').first().attr('href');
      juego.precio = parseInt($(this).find('strong').first().text().replace('.', '').replace('$', ''));
      juego.tienda = tienda;

      juegos.push(juego);
    });

    return setTimeout(function() {
      self.buscar(texto, plataforma, cbk, juegos, page + 1);
    }, 5000);
  });
};

var plataformas = {
  'PC': 'pc',
  'PSP': 'psp',
  'PS2': 'ps2',
  'PS3': 'ps3',
  'PS4': 'ps4',
  'PSVITA': 'ps vita',
  'XBOX360': 'xbox 360',
  'XBOXONE': 'xbox one',
  'WIIU': 'wii u',
  'WII': 'wii',
  'NDS': 'nds',
  '3DS': '3ds'
};

var tienda = {
  nombre: 'Microplay',
  url: 'http://www.microplay.cl'
};

Microplay.buscar = buscar;
Microplay.nombre = 'Microplay';
Microplay.plataformas = plataformas;
Microplay.tienda = tienda;
Microplay.url = 'http://microplay.cl/resultados/page::page/?buscar=:juego';

module.exports = Microplay;

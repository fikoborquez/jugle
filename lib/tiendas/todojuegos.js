var request = require('request');
var cheerio = require('cheerio');
var tienda = require('./tienda');

var Todojuegos = Object.create(tienda);

var buscar = function(texto, plataforma, cbk) {
  var urlBusqueda = this.url;
  var juegos = [];

  if (plataforma != null) {
    if (this.tienePlataforma(plataforma)) {
      urlBusqueda = urlBusqueda + '&idFamiliaListadoProd=' + this.plataformas[plataforma];
    }
  }

  urlBusqueda = urlBusqueda.replace(':juego', texto).replace(' ', '+');

  return request(urlBusqueda, function(err, res, body) {
    var $;

    if (err || body.length == 0) {
      return cbk(juegos);
    }

    $ = cheerio.load(body);

    $('tr').filter(function(i, el) {
      var juego = {};

      if (i % 2 != 0) {
        $(this).find('td').each(function (subi, subel) {
          if (subi == 1) {
            if ($(this).text().split(' ')[0].indexOf('Juegos') == -1) {
              agregar = false;

              return false;
            }

            juego.nombre = $(this).find('a').text().trim();
            juego.url = $(this).find('a').attr('href');
          }

          if (subi == 2) {
            juego.precio = parseInt($(this).text().replace('$', '').replace('.', '').trim());
            juego.tienda = tienda;

            juegos.push(juego);
          }
        });
      }
    });

    return cbk(juegos);
  });
};

var plataformas = {
  'PS3': 5,
  'PS4': 28,
  'XBOX360': 10,
  'XBOXONE': 32,
  'WIIU': 27,
  '3DS': 16,
  'PSVITA': 15,
  'PC': 3,
  'WII': 9,
  'NDS': 2
};

var tienda = {
  nombre: 'TodoJuegos',
  url: 'http://www.todojuegos.cl'
};

Todojuegos.buscar = buscar;
Todojuegos.nombre = 'TodoJuegos';
Todojuegos.plataformas = plataformas;
Todojuegos.tienda = tienda;
Todojuegos.url = 'http://www.todojuegos.cl/Productos/buscador_ajax.asp?consulta=:juego';

module.exports = Todojuegos;

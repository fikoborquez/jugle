var request = require('request');
var cheerio = require('cheerio');
var tienda = require('./tienda');

var Psonline = Object.create(tienda);

var buscar = function(texto, plataforma, cbk) {
  var urlBusqueda = this.url;
  var juegos = [];

  if (plataforma != null) {
    if (this.tienePlataforma(plataforma)) {
      urlBusqueda += ' ' + this.plataformas[plataforma];
    }
  }

  urlBusqueda = urlBusqueda.replace(':juego', texto).replace(' ', '+');

  return request(urlBusqueda, function(err, res, body) {
    var $;

    if (err) {
      return cbk(juegos);
    }

    $ = cheerio.load(body);

    $('.disponible').filter(function(i, el) {
      var juego = {};

      juego.nombre = $(this).find('.info-producto').find('.datos').find('h2').text().trim();
      juego.url = 'http://www.psonline.cl/' + $(this).attr('href');
      juego.precio = parseInt($(this).find('.info-producto').find('.precio').find('h3').text().trim().replace(',', '').replace('$', ''));
      juego.tienda = tienda;

      juegos.push(juego);
    });

    return cbk(juegos);
  });
};

var plataformas = {
  'PS3': 'ps3',
  'PS4': 'ps4',
  'PSVITA': 'psvita',
  'PC': 'pc'
};

var tienda = {
  nombre: 'PSOnline',
  url: 'http://www.psonline.cl'
};

Psonline.buscar = buscar;
Psonline.nombre = 'PSOnline';
Psonline.plataformas = plataformas;
Psonline.tienda = tienda;
Psonline.url = 'http://www.psonline.cl/diseno/psonline/productos/vitrina.php?q=:juego';

module.exports = Psonline;

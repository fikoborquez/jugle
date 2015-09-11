var request = require('request');
var cheerio = require('cheerio');
var tienda = require('./tienda');

var PlanetaJuegos = Object.create(tienda);

var buscar = function(texto, plataforma, cbk) {
  var urlBusqueda = this.url;
  var juegos = [];
  var opciones = {
    url: '',
    form: {
      producto: 'PRUEBAJUEGOS',
      submit: 'Buscar',
      categoria: '0',
      consola: '0',
      publicador: '0',
      desarrollador: '0',
      genero: '0',
      censura: '0'
    }
  };

  if (plataforma != null) {
    if (this.tienePlataforma(plataforma)) {
      opciones.form.consola = this.plataformas[plataforma];
    }
  }

  if (texto != '') {
    opciones.form.producto = texto;
  }

  opciones.url = urlBusqueda;

  return request.post(opciones, function(err, res, body) {
    var $;

    $ = cheerio.load(body);

    if (err) {
      return cbk(juegos);
    }

    $('.marg_busq').each(function(i, el) {
      var juego = {};
      var precio = 0;

      precio = parseInt($(this).find('.precio_cat_2').first().text().replace('.', '').replace('$', ''));

      if (isNaN(precio)) {
        return true;
      }

      juego.nombre = $(this).find('.consola_pr').first().text();
      juego.url = 'http://www.planetajuegos.cl/' + $(this).find('.consola_pr').find('a').first().attr('href');
      juego.precio = precio;
      juego.tienda = tienda;

      juegos.push(juego);
    });

    return cbk(juegos);
  });
};

var plataformas = {
  'PS3': 'PS3',
  'PS4': 'PS4',
  'XBOX360': '360',
  'XBOXONE': 'XB1',
  'WII': 'WII',
  'WIIU': 'WIIU',
  '3DS': '3DS',
  'NDS': 'NDS',
  'PSVITA': 'VITA',
  'PSP': 'PSP'
};

var tienda = {
  nombre: 'Planeta Juegos',
  url: 'http://www.planetajuegos.cl'
};

PlanetaJuegos.buscar = buscar;
PlanetaJuegos.nombre = 'PlanetaJuegos';
PlanetaJuegos.plataformas = plataformas;
PlanetaJuegos.tienda = tienda;
PlanetaJuegos.url = 'http://planetajuegos.cl/busqueda_avanzada.php';;

module.exports = PlanetaJuegos;

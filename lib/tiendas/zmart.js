var request = require('request');
var cheerio = require('cheerio');
var tienda = require('./tienda');

var Zmart = Object.create(tienda);

var buscar = function(texto, plataforma, cbk) {
  var urlBusqueda = this.url;
  var juegos = [];
  var opciones = {
    url: '',
    form: {
      strSearch: '',
      curPage: 1,
      Ajax: 1,
      iTypeDiv: 3,
      sortPageTop: 0,
      sCategoria: 'dvSearchVJ',
      chkOptionSearchDisp: 'DISP',
      chkOptionSearchPrice: '',
      chkOptionSearch: ''
    }
  };
  var self = this;

  if (plataforma != null) {
    if (this.tienePlataforma(plataforma)) {
      opciones.form.chkOptionSearch = this.plataformas[plataforma];
    }
  }

  if (arguments.length == 5) {
    juegos = arguments[3];
    opciones.form.curPage = arguments[4];
  }

  texto = texto.replace(' ', '+');
  opciones.form.strSearch = texto;
  opciones.url = urlBusqueda.replace(':juego', texto);

  return request.post(opciones, function(err, res, body) {
    var $;

    if (err || body.length == 0) {
      return cbk(juegos);
    }

    $ = cheerio.load(body);

    if ($('div').hasClass('warn')) {
      return cbk(juegos);
    }

    $('.ProdBox146').each(function(i, el) {
      var juego = {};

      juego.nombre = $(this).find('a').first().text();
      juego.url = 'http://www.zmart.cl' + $(this).find('a').first().attr('href');
      juego.precio = parseInt($(this).find('.ProdBox146_Precio').first().text().replace('.', ''));
      juego.tienda = tienda;

      juegos.push(juego);
    });

    return setTimeout(function() {
      self.buscar(texto, plataforma, cbk, juegos, opciones.form.curPage + 1);
    }, 5000);
  });
};

var plataformas = {
  'PS3': 'PS3',
  'PS4': 'PS4',
  'XBOX360': 'XB360',
  'XBOXONE': 'XBONE',
  'WIIU': 'WIU',
  'NGC': 'NGC',
  'NDS': 'NDS',
  'PSP': 'PSP',
  'PS2': 'PS2',
  'PC': 'PC',
  '3DS': 'N3DS',
  'WII': 'WII',
  'PSVITA': 'PSV'
};

var tienda = {
  nombre: 'Zmart',
  url: 'http://www.zmart.cl'
};

Zmart.buscar = buscar;
Zmart.nombre = 'Zmart';
Zmart.plataformas = plataformas;
Zmart.tienda = tienda;
Zmart.url = 'http://www.zmart.cl/Scripts/prodSearch.asp?strSearch=:juego';

module.exports = Zmart;

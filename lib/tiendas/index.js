var modulos = {
  TodoJuegos: require('./todojuegos'),
  Zmart: require('./zmart'),
  PlanetaJuegos: require('./planetajuegos'),
  Microplay: require('./microplay'),
  Psonline: require('./psonline'),
  Ochobits: require('./ochobits')
};

var listaPlataformas = function() {
  var lista = [];
  var plataformas = [];

  for (var tienda in modulos) {
    plataformas = modulos[tienda].plataformas;

    for (var plataforma in plataformas) {
      if (lista.indexOf(plataforma) == - 1) {
        lista.push(plataforma);
      }
    }
  }

  return lista;
};

var listaTiendas = function() {
  var lista = [];
  var tiendas = [];

  for (var tienda in modulos) {
    tiendas.push(tienda);
  }

  return tiendas;
};

var buscar = function (texto, plataforma, cbk) {
  var mod = {};
  var juegos = [];
  var n = 0;
  var obj = {};

  if (plataforma != null) {
    for (var tienda in modulos) {
      if (modulos[tienda].tienePlataforma(plataforma)) {
        mod[tienda] = modulos[tienda];
      }
    }
  } else {
    mod = modulos;
  }

  n = Object.keys(mod).length++;

  function cb_ (encontrados) {
    juegos = juegos.concat(encontrados);

    if (-- n == 0) {
      return cbk(juegos);
    }
  }

  if (n == 0) {
    return setTimeout(function(){ return cbk([]); }, 1000);
  }

  for (var tienda in mod) {
    mod[tienda].buscar(texto, plataforma, cb_);
  }
};

var Tiendas = {};

Tiendas.modulos = modulos;
Tiendas.listaPlataformas = listaPlataformas;
Tiendas.listaTiendas = listaTiendas;
Tiendas.buscar = buscar;

module.exports = Tiendas;

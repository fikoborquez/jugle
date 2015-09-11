var express = require('express');
var async = require("async");
var tiendas = require('./lib/tiendas');
var cache = require('./lib/cache');

var port = process.env.OPENSHIFT_NODEJS_PORT || 8080;
var ipaddress = process.env.OPENSHIFT_NODEJS_IP || "127.0.0.1";
var tiempoEntrePeticiones = 15;

var app = express();
var colaPeticiones = async.queue(function (task, callback) {
  setTimeout(function(){
    var texto = task.texto;
    var textoCache = task.textoCache;
    var plataforma = task.plataforma;
    var res = task.res;

    tiendas.buscar(texto, plataforma, function(juegos) {
      cache.agregar(textoCache, plataforma, juegos, null);

      res.json(juegos);
    });

    callback();
  },tiempoEntrePeticiones * 1000);
}, 1);

app.use(express.static(__dirname + '/public'));

app.listen(port, ipaddress);
console.log("App listening on port " + port);

app.get('/', function(req, res) {
  res.sendfile('./public/index.html');
});

app.get('/buscar', function(req, res) {
  var texto = req.query.texto || '';
  var textoCache = texto.replace(' ', '').toLowerCase();
  var plataforma = req.query.plataforma || null;
  var task = {
    texto: texto,
    textoCache: textoCache,
    plataforma: plataforma,
    res: res
  };

  cache.existe(textoCache, plataforma, function(error, respuesta) {
    if (respuesta) {
      return cache.obtener(textoCache, plataforma, function(error, respuesta) {
        res.json(respuesta);
      });
    }

    colaPeticiones.push(task);
  });
});

app.get('/plataformas', function(req, res) {
  res.json(tiendas.listaPlataformas());
});

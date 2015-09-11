var Cache = {};

var redis = require("redis");
var ip = process.env.OPENSHIFT_REDIS_HOST || "127.0.0.1";
var puerto = process.env.OPENSHIFT_REDIS_PORT || 6379;
var password = process.env.REDIS_PASSWORD || null;
var clienteRedis = redis.createClient(puerto, ip);
var horas = 36;

if (password) {
  clienteRedis.auth(password);
}

var agregar = function(texto, plataforma, valor, cbk) {
  if (cbk == null) {
    clienteRedis.set(texto + '+' + plataforma, JSON.stringify(valor));
  } else {
    clienteRedis.set(texto + '+' + plataforma, JSON.stringify(valor), cbk);
  }

  clienteRedis.expire(texto + '+' + plataforma, horas * 60 * 60);
};

var existe = function(texto, plataforma, cbk) {
  clienteRedis.exists(texto + '+' + plataforma, cbk);
};

var obtener = function(texto, plataforma, cbk) {
  clienteRedis.get(texto + '+' + plataforma, function(error, resultado) {
    resultado = JSON.parse(resultado);

    cbk(error, resultado);
  });
};

var quitar = function(texto, plataforma, cbk) {
  clienteRedis.del(texto + '+' + plataforma, cbk);
};

Cache.agregar = agregar;
Cache.existe = existe;
Cache.obtener = obtener;
Cache.quitar = quitar;

module.exports = Cache;

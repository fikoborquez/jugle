var expect = require('expect2'),
    cache = require('../../lib/cache');

describe('Agregar resultado a cache', function(){
  it('nueva clave o existente con plataforma', function(done){
    var texto = 'God';
    var plataforma = 'PS4';
    var resultado = [
      {
        'nombre': 'God of war 3',
        'url': 'http://www.godofwar.com',
        'precio': 6700
      }
    ];

    cache.agregar(texto, plataforma, resultado, function (error, respuesta) {
      expect(respuesta).to.be.eql('OK');

      done();
    });
  });

  it('nueva clave o existente sin plataforma', function(done){
    var texto = 'God';
    var plataforma = null;
    var resultado = [
      {
        'nombre': 'God of war 3',
        'url': 'http://www.godofwar.com',
        'precio': 6700
      }
    ];

    cache.agregar(texto, plataforma, resultado, function (error, respuesta) {
      expect(respuesta).to.be.eql('OK');

      done();
    });
  });
});

describe('Comprobar si existe resultado en cache', function(){
  it('hay resultados', function(done){
    var texto = 'God';
    var plataforma = 'PS4';

    cache.existe(texto, plataforma, function(error, respuesta) {
      expect(respuesta).to.be.eql(1);

      done();
    });
  });

  it('no hay resultados', function(done){
    var texto = 'God';
    var plataforma = 'PS2';

    cache.existe(texto, plataforma, function(error, respuesta) {
      expect(respuesta).to.be.eql(0);

      done();
    });
  });
});

describe('Obtener resultado desde la cache', function(){
  it('clave existente', function(done){
    var texto = 'God';
    var plataforma = 'PS4';

    cache.obtener(texto, plataforma, function (error, respuesta) {
      expect(respuesta).to.not.be.empty();

      done();
    });
  });

  it('clave no existe', function(done){
    var texto = 'God';
    var plataforma = 'PS3';

    cache.obtener(texto, plataforma, function (error, respuesta) {
      expect(respuesta).to.not.be.ok();

      done();
    });
  });
});
//
describe('Quitar resultado de cache', function(){
  it('clave existente', function(done){
    var texto = 'God';
    var plataforma = 'PS4';

    cache.quitar(texto, plataforma, function (error, respuesta) {
      expect(respuesta).to.be.ok();

      done();
    });
  });

  it('clave no existe', function(done){
    var texto = 'God';
    var plataforma = 'PS3';

    cache.quitar(texto, plataforma, function (error, respuesta) {
      expect(respuesta).to.not.be.ok();

      done();
    });
  });
});

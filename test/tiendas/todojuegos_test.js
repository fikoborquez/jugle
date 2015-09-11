var expect = require('expect2'),
    tienda = require('../../lib/tiendas/todojuegos.js');

describe('Dada una plataforma', function(){
  it('retornar si PS3 existe como plataforma', function(){
    var plataforma = 'PS3';

    expect(tienda.tienePlataforma(plataforma)).to.be(true);
  });

  it('retornar si PLATAFORMA existe como plataforma', function(){
    var plataforma = 'PLATAFORMA';

    expect(tienda.tienePlataforma(plataforma)).to.be(false);
  });
});

describe('Dado un texto', function(){
  it('buscar si hay juegos', function(done){
    var texto = 'Fifa',
        plataforma = null;

    tienda.buscar(texto, plataforma, function(juegos) {
      expect(juegos).to.not.be.empty();

      return done();
    });
  });

  it('buscar si hay juegos, pero no se encontro alguno', function(done){
    var texto = 'PRUEBAJUEGOS',
        plataforma = null;

    tienda.buscar(texto, plataforma, function(juegos) {
      expect(juegos).to.be.empty();

      return done();
    });
  });

  it('y una plataforma, buscar si hay juegos', function(done){
    var texto = 'Fifa',
        plataforma = 'PS3';

    tienda.buscar(texto, plataforma, function(juegos) {
      expect(juegos).to.not.be.empty();

      return done();
    });
  });
});

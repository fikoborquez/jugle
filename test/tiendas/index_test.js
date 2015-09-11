var expect = require('expect2'),
    tiendas = require('../../lib/tiendas');

describe('Buscar lista de plataformas', function(){
  it('obtener arreglo con plataformas', function(){
    expect(tiendas.listaPlataformas()).to.not.be.empty();
  });
});

describe('Buscar lista de tiendas', function(){
  it('obtener arreglo con tiendas', function(){
    expect(tiendas.listaTiendas()).to.not.be.empty();
  });
});

describe('Buscar juegos', function(){
  this.timeout(60000);

  it('obtener arreglo con juegos', function(done){
    var juego = 'Fifa',
        plataforma = null;

    tiendas.buscar(juego, plataforma, function(juegos) {
      expect(juegos).to.not.be.empty();

      done();
    });
  });

  it('obtener arreglo con juegos, limitado a una plataforma', function(done){
    var juego = 'Fifa',
        plataforma = 'PS3';

    tiendas.buscar(juego, plataforma, function(juegos) {
      expect(juegos).to.not.be.empty();

      done();
    });
  });

  it('obtener arreglo con juegos, limitado a una plataforma, pero plataforma no es soportada', function(done){
    var juego = 'Fifa',
        plataforma = 'PLATAFORMA';

    tiendas.buscar(juego, plataforma, function(juegos) {
      expect(juegos).to.be.empty();

      done();
    });
  });
});

var tienda = {
  nombre: '',
  plataformas: {},
  url: '',
  tienda: {
    nombre: '',
    url: ''
  },
  tienePlataforma: function(plataforma) {
    return this.plataformas.hasOwnProperty(plataforma);
  }
};

module.exports = tienda;

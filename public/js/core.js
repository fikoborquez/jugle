(function() {

    angular
        .module('videojuegos', ['ui.grid'])
        .controller('mainController', mainController);

    function mainController($scope, $http, uiGridConstants) {
      $scope.plataformas = [];
      $scope.gridOptions = {};

      $scope.gridOptions.columnDefs = [
         {
           name: 'nombre',
           width: '60%',
           enableColumnMenu: false,
           cellTemplate:'<div><a href="{{row.entity.url}}">{{row.entity.nombre}}</a></div>',
         },
         {
           name: 'tienda',
           width: '20%',
           sort: false,
           enableColumnMenu: false,
           cellTemplate:'<div><a href="{{row.entity.tienda.url}}">{{row.entity.tienda.nombre}}</a></div>',
         },
         {
           name: 'precio',
           width: '20%',
           sort: {
             direction: uiGridConstants.ASC,
             priority: 0
           },
           type: 'number',
           enableColumnMenu: false,
           cellFilter: 'currency:$:0'
          }
       ];

      $http({
        method: 'GET',
        url: '/plataformas',
      }).success(function(result) {
        $scope.plataformas = result;
      });

      $scope.buscar = function() {
        $scope.loading = true;

        $http({
          method: 'GET',
          url: '/buscar',
          params: {
            texto: $scope.texto,
            plataforma: $scope.plataforma,
          }
        }).success(function(result) {
          $scope.gridOptions.data = result;
          $scope.loading = false;
        });
      }
    }

})();

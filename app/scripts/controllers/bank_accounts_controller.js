// var myApp = angular.module('BankApplication', ['ngRoute', 'ngResource']).constant("CSRF_TOKEN", '{!! csrf_token() !!}');

//custom directive
myApp.directive('accountDirective', function() {
  return {
    require: 'ngModel',
    link: function(scope, element, attr, mCtrl) {
      function accountDirective(value) {
        if (value.length > 10 && value.length < 17) {
          mCtrl.$setValidity('charE', true);
          scope.show = true;
        } else {
          mCtrl.$setValidity('charE', false);
           scope.show = false;
        }
        return value;
      }
      mCtrl.$parsers.push(accountDirective);
    }
  };
});

//Factory
myApp.factory('BankAccounts', ['$resource',function($resource){
  return $resource('/api/bank_accounts.json', {},{
    query: { method: 'GET', isArray: true },
    create: { method: 'POST' }
  })
}]);

myApp.factory('BankAccount', ['$resource', function($resource){
  return $resource('/api/bank_accounts/:id.json', {}, {
    show: { method: 'GET' },
    update: { method: 'PUT', params: {id: '@id'} },
    delete: { method: 'DELETE', params: {id: '@id'} }

  });
 
}]);
myApp.factory('BankAccount1', ['$resource', '$routeParams', function($resource,$routeParams){
  return $resource('/api/bank_accounts/'+$routeParams.id+'/debit.json', {}, {
    debit: { method: 'post', params: {id: '@id'}},
  });
}]);
myApp.factory('BankAccount2', ['$resource', '$routeParams', function($resource,$routeParams){
  return $resource('/api/bank_accounts/'+$routeParams.id+'/transaction_views.json', {}, {
    transaction: { method: 'get',params: {id: '@id'}}
  });
}]);


myApp.factory('BankAccount3', ['$resource', '$routeParams', function($resource,$routeParams){
  return $resource('/api/bank_accounts/'+$routeParams.id+'/deposite.json', {}, {
    deposite: { method: 'post', params: {id: '@id'}},
  });
}]);

myApp.factory('BankAccount4', ['$resource', '$routeParams', function($resource,$routeParams){
  return $resource('/api/bank_accounts/'+$routeParams.id+'/withdraw.json', {}, {
    withdraw: { method: 'post', params: {id: '@id'}},
  });
}]);

//Controller
myApp.controller("BankListCtr", ['$scope', '$http', '$resource', 'BankAccounts', 'BankAccount', '$location', function($scope, $http, $resource, BankAccounts, BankAccount, $location) {
   return $http.get('/api/bank_accounts.json').then(function(response){ 
      //returns a call back
      $scope.bank_accounts  = response.data;  
    //store data of 1st call in this.userDetails
    });

  // $scope.bank_accounts = BankAccounts.query();
 
  // $scope.deleteBankAccount = function (bankID) {
  //   if (confirm("Are you sure you want to delete this user?")){
  //     BankAccount.delete({ id: bankID }, function(){
  //       $scope.bank_accounts = BankAccounts.query();
  //       $location.path('/');
  //     });
  //   }
  // };
  
  $scope.creditUser = function (bankID) {
    if (confirm("Are you sure you want to delete this user?")){
      BankAccount.delete({ id: bankID }, function(){
        $scope.bank_accounts = BankAccounts.query();
        $location.path('/bank_accounts');
      });
    }
  };
}]);

//BankAccountUpdateCtr
myApp.controller("BankAccountUpdateCtr", ['$scope', '$resource', 'BankAccount', '$location', '$routeParams', function($scope, $resource, BankAccount, $location, $routeParams) {
  $scope.bank_account = BankAccount.get({id: $routeParams.id})
  $scope.update = function(){
    if ($scope.userForm.$valid){
      BankAccount.update({id: $scope.bank_account.id},{bank_account: $scope.bank_account},function(){
        $location.path('/');
      }, function(error) {
        console.log(error)
      });
    }
  };
}]);

//BankAddCtr

myApp.controller("BankAddCtr", ['$scope', '$resource', 'BankAccounts','$http', '$location','CSRF_TOKEN', function($scope, $resource, BankAccounts,$http, $location,CSRF_TOKEN) {
   $http.defaults.headers.common['X-Csrf-Token'] = CSRF_TOKEN;
  // $scope.bank_account = {account_params: [{user_name: '', account_name: ''}]}
  $scope.show=false
  $scope.save = function () {

    if ($scope.bank_account){
      BankAccounts.create({bank_account: $scope.bank_account}, function(response){
        // debugger
        // if(response.account_number[0]=="has aleady been taken"){alert(response.account_number[0])}
        $location.path('/');
      }, function(error){
        $scope.obj_err = "error: "+error.statusText
        // alert(error.statusText)
      });
    }
  }
}]);




//BankAccountDebitCtr
myApp.controller("BankAccountDebitCtr", ['$scope', '$resource', 'BankAccount1','$http', '$location','CSRF_TOKEN', function($scope, $resource, BankAccount1,$http, $location,CSRF_TOKEN) {
  $http.defaults.headers.common['X-Csrf-Token'] = CSRF_TOKEN;
  // $scope.bank_account = {account_params: [{user_name: '', account_name: ''}]}
  $scope.show=false
  $scope.debit = function () {
    if ($scope.bank_account){
      BankAccount1.debit({bank_account: $scope.bank_account}, function(response){
        if (response.errors){$scope.obj_err = "Error: "+response.errors}
        else{$scope.obj_success="!Success"}        
        // $location.path('/');
      }, function(error){
        $scope.obj_err = "error: "+error.statusText
        console.log(error)
      });
    }
  }
}]);

//BankAccountTransactionCtr
myApp.controller("BankAccountTransactionCtr", ['$scope', '$resource', 'BankAccount2','$http','$routeParams', '$location', function($scope, $resource, BankAccount2,$http,$routeParams, $location) {
  return $http.get('/api/bank_accounts/'+$routeParams.id+'/transaction_views.json').then(function(response){ 
      $scope.transactions  = response.data;
    });
  // $scope.transactions = BankAccount2.transaction();
}]);

//BankAccountDepositeCtr
myApp.controller("BankAccountDepositeCtr", ['$scope', '$resource', 'BankAccount3','$http', '$location','CSRF_TOKEN', function($scope, $resource, BankAccount3,$http, $location,CSRF_TOKEN) {
  $http.defaults.headers.common['X-Csrf-Token'] = CSRF_TOKEN;
  // $scope.bank_account = {account_params: [{user_name: '', account_name: ''}]}
  $scope.show=false
  $scope.deposite = function () {
    if ($scope.bank_account){
      BankAccount3.deposite({bank_account: $scope.bank_account}, function(){
        $location.path('/');
      }, function(error){
        console.log(error)
        $scope.obj_err = "error: "+error.statusText
        
      });
    }
  }

}]);

//BankAccountWithdrawCtr
myApp.controller("BankAccountWithdrawCtr", ['$scope', '$resource', 'BankAccount4','$http', '$location','CSRF_TOKEN', function($scope, $resource, BankAccount4,$http, $location,CSRF_TOKEN) {
  $http.defaults.headers.common['X-Csrf-Token'] = CSRF_TOKEN;
  $scope.show=false
  // $scope.bank_account = {account_params: [{user_name: '', account_name: ''}]}
  $scope.withdraw = function () {
    if ($scope.bank_account){
      BankAccount4.withdraw({bank_account: $scope.bank_account}, function(response){
        if (response.errors){$scope.obj_err = "Error: "+response.errors}
        else{$scope.obj_success="!Success"} 
        
        //$location.path('/');
      }, function(error){
        console.log(error)
        $scope.obj_err = "error: "+error.statusText
       
      });
    }
  }
 }]);


//Routes
// myApp.config([
//   '$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
//     $routeProvider.when('/bank_accounts',{
//       templateUrl: '/templates/bank_accounts/index.html',
//       controller: 'BankListCtr'
//     });
//     $routeProvider.when('/bank_accounts/new', {
//       templateUrl: '/templates/bank_accounts/new.html',
//       controller: 'BankAddCtr'
//     });
//     $routeProvider.when('/bank_accounts/:id/edit', {
//       templateUrl: '/templates/bank_accounts/edit.html',
//       controller: "BankAccountUpdateCtr"
//     });
//     $routeProvider.when('/bank_accounts/:id/debit', {
//       templateUrl: '/templates/bank_accounts/debit.html',
//       controller: "BankAccountDebitCtr"
//     });
//      $routeProvider.when('/bank_accounts/:id/transaction_views', {
//       templateUrl: '/templates/bank_accounts/transaction_views.html',
//       controller: "BankAccountTransactionCtr"
//     });

//     $routeProvider.when('/bank_accounts/:id/deposite', {
//       templateUrl: '/templates/bank_accounts/deposite.html',
//       controller: "BankAccountDepositeCtr"
//     });

//     $routeProvider.when('/bank_accounts/:id/withdraw', {
//       templateUrl: '/templates/bank_accounts/withdraw.html',
//       controller: "BankAccountWithdrawCtr"
//     });
//     $routeProvider.otherwise({
//       redirectTo: '/bank_accounts'
//     });
//     $locationProvider.hashPrefix('');

//   }
// ]);






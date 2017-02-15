'use strict';


var myApp = angular.module('BankApplication', ['ngRoute', 'ngResource']).constant("CSRF_TOKEN", '{!! csrf_token() !!}');


myApp.config([
  '$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
    $routeProvider.when('/bank_accounts',{
      templateUrl: '/views/bank_accounts/index.html',
      controller: 'BankListCtr'
    });
    $routeProvider.when('/bank_accounts/new', {
      templateUrl: '/views/bank_accounts/new.html',
      controller: 'BankAddCtr'
    });
    $routeProvider.when('/bank_accounts/:id/edit', {
      templateUrl: '/views/bank_accounts/edit.html',
      controller: "BankAccountUpdateCtr"
    });
    $routeProvider.when('/bank_accounts/:id/debit', {
      templateUrl: '/views/bank_accounts/debit.html',
      controller: "BankAccountDebitCtr"
    });
     $routeProvider.when('/bank_accounts/:id/transaction_views', {
      templateUrl: '/views/bank_accounts/transaction_views.html',
      controller: "BankAccountTransactionCtr"
    });

    $routeProvider.when('/bank_accounts/:id/deposite', {
      templateUrl: '/views/bank_accounts/deposite.html',
      controller: "BankAccountDepositeCtr"
    });

    $routeProvider.when('/bank_accounts/:id/withdraw', {
      templateUrl: '/views/bank_accounts/withdraw.html',
      controller: "BankAccountWithdrawCtr"
    });
    $routeProvider.otherwise({
      redirectTo: '/bank_accounts'
    });
    $locationProvider.hashPrefix('');

  }
]);
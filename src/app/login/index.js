const template = require('./login.html');

export const LoginCtrlName = 'LoginCtrl';

export const LoginCtrlState = {
  url: '/login',
  template,
  controller: LoginCtrlName,
  controllerAs: 'login'
};

export const UserServices = [

 '$q', '$http',
 class UserServices {
   constructor ($q, $http, users) {
     this.$http = $http;
     this.users = users;
   }

   getUsers (userData) {
     console.log('userData', userData);
     this.data = userData;
     const req ={
      method: 'POST',
      url: `/api/login`,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      data: `username=${userData.username}&password=${userData.password}&=`
     };

     return this.$http(req).success(response => {
        console.log('response: ', response);
       return
     });
   }
 }
];

export const LoginCtrl = [
  '$scope', 'UserServices',

  class LoginCtrl {
    constructor($scope, UserServices) {
      this.userData = {
        username: '',
        password: ''
      };
      $scope.userName = '';
      $scope.password = '';
      $scope.UserServices = UserServices;

    $scope.checkCreditinals = () =>{
      this.userData.username = $scope.userName;
      this.userData.password = $scope.password;
      console.log('userData: ', this.userData);
      UserServices.getUsers(this.userData);
    };
    }
  }
]

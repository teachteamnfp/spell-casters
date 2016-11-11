const template = require('./login.html');

export const LoginCtrlName = 'LoginCtrl';

export const LoginCtrlState = {
  url: '/login',
  template,
  controller: LoginCtrlName,
  controllerAs: 'login',
  params: {
    errorMessage: null
  }
};

export const UserServices = [

 '$http', '$state',

 class UserServices {
   constructor ($http, $state, users) {
     this.$http = $http;
     this.$state = $state;
     this.users = users;
   }

   getUsers (userData) {
     this.data = userData;
     const req ={
      method: 'POST',
      url: `/api/login`,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      data: `username=${userData.username}&password=${userData.password}&=`
     };
     return this.$http(req)
       .success(response => {
          if(response.success === true){
              this.$state.go('splash');
          }else{
            this.$state.go('login', {errorMessage: response.errorMessage});
          }
         return;
       });
   }
 }
];

export const LoginCtrl = [
  '$scope', 'UserServices', '$state', '$stateParams', '$rootScope',

  class LoginCtrl {
    constructor($scope, UserServices, $state, $stateParams, $rootScope) {
      this.userData = {
        username: '',
        password: ''
      };

      $scope.userName = '';
      $scope.password = '';
      $scope.UserServices = UserServices;


    $scope.checkCredentials = () =>{
      this.userData.username = $scope.userName;
      this.userData.password = $scope.password;
      UserServices.getUsers(this.userData)
        .success(response =>{
          $rootScope.user = response.username;
          $rootScope.visible = true;
        });
    };
    $scope.errorMessage = $stateParams.errorMessage;

    $scope.goToRegistration = () => {
      $state.go('registration');
    };
  }
}
];
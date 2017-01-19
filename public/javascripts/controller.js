/**
 * Created by Administrator on 2016/12/28.
 */

var user_Login = angular.module('user_Login',[]);
user_Login.controller('userLogin',function($scope,$http){
    $scope.processLoginForm = function(isVaild){
        if(isVaild){
            //成功
            $http({
                method:'POST',
                url:'/doLogin',
                data: $.param($scope.logFormData),
                headers:{'Content-type':'application/x-www-form-urlencoded'}
            }).success(function(data){
                if(data === 'success'){
                    alert('登录成功');
                    window.location.reload();
                }else{
                    $('#errorInfo').removeClass('hide').text(data);
                }
            })
        }else{
            alert('error');
        }
    }
})






angular.module('nodeTodo', [])
    .controller('mainController', function($scope, $http) {
        $scope.formData = {};
        $scope.todoData = {};


        $http.get('/api/v1/todos')
            .success(function(data) {
                $scope.todoData = data;
                console.log(data);
            })
            .error(function(error) {
                console.log('Error: ' + error);
            });

        $scope.createTodo = function() {
            $http.post('/api/v1/todos', $scope.formData)
                .success(function(data) {
                    $scope.formData = {};
                    $scope.todoData = data;
                    console.log(data);
                })
                .error(function(error) {
                    console.log('Error: ' + error);
                });
        };

        $scope.deleteTodo = function(todoID) {
            $http.delete('/api/v1/todos/' + todoID)
                .success(function(data) {
                    $scope.todoData = data;
                    console.log(data);
                })
                .error(function(data) {
                    console.log('Error: ' + data);
                });
        };
    });

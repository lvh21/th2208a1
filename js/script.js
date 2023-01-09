var app = angular.module("myApp", ["ngRoute"]);
app.config(function($routeProvider) {
    $routeProvider
    .when("/", {
        templateUrl : "home.html",
        controller: 'MainCtrl'
    })
    .when("/catalog", {
        templateUrl : "catalog.html"
    })
    .when("/all-walltiles", {
      templateUrl: "walltiles.html"
    })
    .when("/all-floortiles", {
      templateUrl: "floortiles.html"
    })
    .when("/all-special", {
      templateUrl: "special.html"
    })
});

function Boxes() {
  let box1Element = document.getElementById(
    "box-" + document.getElementById("select-1").value
  );
  let box2Element = document.getElementById(
    "box-" + document.getElementById("select-2").value
  );

  document.getElementById("new-container").innerHTML = "";
  var clone1 = box1Element.cloneNode(true);
  var clone2 = box2Element.cloneNode(true);
  document.getElementById("new-container").appendChild(clone1);
  document.getElementById("new-container").appendChild(clone2);
}

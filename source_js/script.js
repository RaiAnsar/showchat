function searchBarController($scope){
    $scope.searchBar = {field:"Search For A Movie"};
}

$(".button.alert").click(function(){
    var searchBarVal = $("#searchBar").val;
    var theUrl       = "http://fa16-cs411-36.cs.illinois.edu:8080/";
    $.post(theUrl,
    {
        queryVal: "searchBarVal"
    });
    // function(){
    //     console.log("alrighty");
    // });
});



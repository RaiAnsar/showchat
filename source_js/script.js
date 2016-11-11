function searchBarController($scope){
    $scope.searchBar = {field:"Search For A Movie"};
}

$(".button.alert").click(function(){
    var searchBarVal = $("#searchBar").val();
    var theUrl       = "movieFile";
    console.log("searchBarVal:", searchBarVal);
    $.post(theUrl,
    {
        queryVal: searchBarVal
    });
});



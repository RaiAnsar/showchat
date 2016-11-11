function searchBarController($scope){
    $scope.searchBar = {field:"Search For A Movie"};
}

$(".button.alert").click(function(){
    var searchBarVal = $("#searchBar").val;
    var theUrl       = "movieFile";
    console.log("checking if this function fired");
    $.post(theUrl,
    {
        queryVal: "searchBarVal"
    });
});



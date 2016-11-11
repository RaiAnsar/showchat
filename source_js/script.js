$(".button.alert").click(function(){
    var searchBarVal = $("#searchBar").val();
    var theUrl       = "movieFile";
    console.log("searchBarVal:", searchBarVal);
    $.post(theUrl,
    {
        queryVal: searchBarVal
    });
});



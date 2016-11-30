$(".button.alert").click(function(){
    var searchBarVal = $("#searchBar").val();
    var theUrl       = "movieFile";
    console.log("searchBarVal:", searchBarVal);
    $.post(theUrl,
    {
        queryVal: searchBarVal
    });

    // $.get(theUrl,
    // {
    //     urlVal: "search"
    // });
});

$("#searchBar").keyup(function(event){
    if(event.keyCode == 13){
        $(".button.alert").click();
    }
});

$("#Trending").click(function(){
    var theUrl = "TrendingData";
});


$("#Trending").click(function(){
    var theUrl = "TrendingData";
});


$("#Trending").click(function(){
    var theUrl = "TrendingData";
    $.post(theUrl,
    {
         queryVal: "Trending"
    });
});

$("#Theater").click(function(){
    var theUrl       = "TheaterData";
    console.log("searchBarVal:", searchBarVal);
    $.post(theUrl,
    {
        theaterVal: "Theater"
    });
});

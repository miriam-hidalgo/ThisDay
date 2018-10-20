var url = "https://api.nasa.gov/planetary/apod?api_key=54lBa2rMDnkIC43dEmrnkzykVy4aWrfLWxYDJfXO";
var date;
var picInfo;
var picTitle;

$('.datepicker').datepicker({format: 'yyyy-mm-dd'});

$("#submit").on("click",function(){

    //get rid of inputs
    $(".datepicker").toggle();
    $("#submit").toggle()

    date = $('.datepicker')[0].value;
    console.log("date picked = "+date);

    // changeBackground(date);
    $.ajax({
        url: url+"&date="+date,
        success: function(result){
    
            //change background color
            console.log(result)
            $("body").css("background-image","url("+result.url+")");
            $("body").css("background-size","cover")

            picInfo = result.explanation;
            picTitle = result.title;
            console.log("title = "+picTitle)
            console.log("title = "+picInfo)

            addCard()
            
        }
    });
        
})

function changeBackground(datePicked){
    $.ajax({
    url: url+"&date="+datePicked,
    success: function(result){

        //change background color
        console.log(result.url)
        $("body").css("background-image","url("+result.url+")");
        $("body").css("background-size","cover")
        }
    });
}

function addCard(){
    console.log("making card now")
    var newCard = $("<div class='card'></div>");
    var newCardContent= $("<div class='card-content'></div>");
    newCardContent.append("<span class='card-title'>"+picTitle+"</span>")
    newCardContent.append("<p>"+picInfo+"</p>")

    newCard.append(newCardContent);
    $(".contentSpot").append(newCard)
}


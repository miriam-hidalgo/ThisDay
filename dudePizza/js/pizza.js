var url = "https://api.nasa.gov/planetary/apod?api_key=54lBa2rMDnkIC43dEmrnkzykVy4aWrfLWxYDJfXO";
var date;
var picInfo;
var picTitle;
var numbersInfo;
var mm;
var dd;
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

            addApodCard()
            
        }
    });
 
   console.log("date picked = "+date);
   console.log("year = "+date.split("-")[0])
   console.log("month = "+date.split("-")[1])
    mm = (date.split("-")[1])
   console.log("day = "+date.split("-")[2])
    dd = (date.split("-")[2])

    
    $.ajax({
        url: "http://numbersapi.com/" + mm + "/" + dd + "/date",
        success: function(result){  
           console.log(result)
           numbersInfo = result;
           addNumbersCard();
        }
    });
    $.ajax({
        url: "https://api.darksky.net/forecast/9b70b905a7064b660f99a10adfa4f74c/40.7128,-74.0060,2018-"+ mm +"-" + dd + "T12:00:00",
        success: function(result){  
           console.log(result.currently)
           weatherInfo = result;
           addWeatherCard();
           $("#weatherBlock").html(result.currently);
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

function addApodCard(){
    console.log("making card now")
    var newCard = $("<div class='card'></div>");
    var newCardContent= $("<div class='card-content'></div>");
    newCardContent.append("<span class='card-title'>"+picTitle+"</span>")
    newCardContent.append("<p>"+picInfo+"</p>")

    newCard.append(newCardContent);
    $(".apodCard").append(newCard)
}

function addNumbersCard(){
    console.log("making card now")
    var newNumberCard = $("<div class='card'></div>");
    var newNumberCardContent= $("<div class='card-content'></div>");
    // newCardContent.append("<span class='card-title'>"+picTitle+"</span>")
    newNumberCardContent.append("<p id='trivia'>"+numbersInfo+"</p>")
    newNumberCardContent.append("<a class='waves-effect waves-light btn'>NEW TRIVIA</a>")

    newNumberCard.append(newNumberCardContent);
    $(".numberBlock").append(newNumberCard)
}
$(".numberBlock").on("click", "a", function(){
    console.log("y=h");
    newNumber();
})
function newNumber(){
    $.ajax({
        url: "http://numbersapi.com/" + mm + "/" + dd + "/date",
        success: function(result){  
            console.log(result)
            numbersInfo = result;
            $("#trivia").html(result);
        }
    });
}


// skycons to append to div. need to connect .currently.icon
function addWeatherCard(){
    console.log("making weather card now")
    var newWeatherCard = $("<div class='card'></div>");
    var newWeatherCardContent= $("<div class='card-content'></div>");
    // newCardContent.append("<span class='card-title'>"+picTitle+"</span>")
    newWeatherCardContent.append("<p id='weather'>"+ weatherInfo +"</p>")
    newWeatherCardContent.append("<a class='waves-effect waves-light btn'>NEW TRIVIA</a>")

    newWeatherCard.append(newWeatherCardContent);
    $(".numberBlock").append(newWeatherCard)
}
function newWeatherNY(){
    $.ajax({
        url: "https://api.darksky.net/forecast/9b70b905a7064b660f99a10adfa4f74c/40.7128,-74.0060,2018-"+ mm +"-" + dd + "T12:00:00",
        success: function(result){  
           console.log(result)
           weatherInfo = result;
           $("#weatherBlock").html(result);
            addWeatherCard();
        }
    });
}
var icons = new Skycons({"color": "black"});

icons.set("clear-day", Skycons.CLEAR_DAY);
icons.set("clear-night", Skycons.CLEAR_NIGHT);
icons.set("partly-cloudy-day", Skycons.PARTLY_CLOUDY_DAY);
icons.set("partly-cloudy-night", Skycons.PARTLY_CLOUDY_NIGHT);
icons.set("cloudy", Skycons.CLOUDY);
icons.set("rain", Skycons.RAIN);
icons.set("sleet", Skycons.SLEET);
icons.set("snow", Skycons.SNOW);
icons.set("wind", Skycons.WIND);
icons.set("fog", Skycons.FOG);

icons.play();

$(document).ready(function(){
    $('.sidenav').sidenav();
  });

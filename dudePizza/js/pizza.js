var url = "https://api.nasa.gov/planetary/apod?api_key=54lBa2rMDnkIC43dEmrnkzykVy4aWrfLWxYDJfXO";
var NYTurl = "https://api.nytimes.com/svc/search/v2/articlesearch.json";
var date;
var picInfo;
var picTitle;
var numbersInfo;
var mm;
var dd;
var yyyy;
var collapsibleElem = document.querySelector('.collapsible');
var collapsibleInstance = M.Collapsible.init(collapsibleElem);

$('.sidenav').sidenav();
$('.tooltipped').tooltip();

// Initialize collapsible (uncomment the lines below if you use the dropdown variation)

        
$('.fixed-action-btn').floatingActionButton();
var elems = document.querySelectorAll('.fixed-action-btn');
var instances = M.FloatingActionButton.init(elems, {
  direction: 'right',  
  hoverEnabled: false
});

$('#pickDay').on("click", function(){
    addApodCard();
    addNumbersCard();
    addnyt();
})

$("#newDateButton").on("click",function(){
    $('.datepicker').datepicker("open");
})

$('.datepicker').datepicker({
    format: 'yyyy-mm-dd', 
    maxDate: new Date(),
    onClose: function(datePicked){
   
        $('#pickDay').css("display","none");
        $(".btn-floating").css("display","inline-block");
        
        // $(".datepicker").toggle();
        // $("#submit").toggle()
        
        date = $('.datepicker')[0].value;
        console.log("date picked = "+date);
        mm = (date.split("-")[1])
        dd = (date.split("-")[2])
        yyyy= (date.split("-")[0])
    
        // changeBackground(date);
        $.ajax({
            url: url+"&date="+date,
            success: function(result){
        
                //change background color
                console.log(result)
                $("body").css("background-image","url("+result.url+")");
                // $("body").css("background-repeat","no-repeat");

                picInfo = result.explanation;
                picTitle = result.title;
                console.log("title = "+picTitle)
                console.log("title = "+picInfo)

                $(".apodInfo").html(picInfo);
                $(".apodTitle").html(picTitle);
                $(".apodCard").css("display","inherit");
            }
        });
        
        //change numbers block
       newNumber();

        //change darkSky block
        $.ajax({
            url: "https://api.darksky.net/forecast/9b70b905a7064b660f99a10adfa4f74c/40.7128,-74.0060,2018-"+ mm +"-" + dd + "T12:00:00",
            success: function(result){  
            console.log(result.currently)
            weatherInfo = result;
            addWeatherCard();
            $("#weatherBlock").html(result.currently);
            }
        });

        NYTurl = NYTurl + '?' + $.param({
        'api-key': "49af0056ae9e46d5a207000ad5232d9d",
        'begin_date': yyyy+mm+dd,
        // "end_date": yyyy+mm+dd
        });
        $.ajax({
            url: NYTurl,
            method: 'GET',
        }).done(function(result) {
            var articles = result.response.docs;

            // for (let index = 0; index < 5; index++) {

            //     // CHANGE STORIES


            //     // var story = articles[index];
    
            //     // var storySection = $("<div class='section'></div>")
            //     // storySection.append("<a href="+story.web_url+" target='_blank'><p>"+story.headline.main+"</p></a>");
            //     // storySection.append("<p>"+story.snippet+"</p>");
            //     // $(".nytContent").append(storySection);
            //     // nytContent.append("<div class='divider'></div>");
            
            // }
            $(".nytCard").css("display","block");
        }).fail(function(err) {
            throw err;
        });
    }
});

// $("#submit").on("click",function(){
//     // $(".apodCard").empty()
//     // $(".numberBlock").empty()

//     //get rid of inputs
//     $(".datepicker").toggle();
//     $("#submit").toggle()

//     date = $('.datepicker')[0].value;
//     console.log("date picked = "+date);
//     mm = (date.split("-")[1])
//     dd = (date.split("-")[2])
//     yyyy= (date.split("-")[0])
  
//     // changeBackground(date);
//     $.ajax({
//         url: url+"&date="+date,
//         success: function(result){
    
//             //change background color
//             console.log(result)
//             $("body").css("background-image","url("+result.url+")");
//             // $("body").css("background-repeat","no-repeat");

//             picInfo = result.explanation;
//             picTitle = result.title;
//             console.log("title = "+picTitle)
//             console.log("title = "+picInfo)

//             addApodCard();  
//         }
//     });
    
//     //change numbers block
//     $.ajax({
//         url: "http://numbersapi.com/" + mm + "/" + dd + "/date",
//         success: function(result){  
//            console.log(result)
//            numbersInfo = result;
//            addNumbersCard();
//         }
//     });

//     //change darkSky block
//     $.ajax({
//         url: "https://api.darksky.net/forecast/9b70b905a7064b660f99a10adfa4f74c/40.7128,-74.0060,2018-"+ mm +"-" + dd + "T12:00:00",
//         success: function(result){  
//            console.log(result.currently)
//            weatherInfo = result;
//            addWeatherCard();
//            $("#weatherBlock").html(result.currently);
//         }
//     });

//     NYTurl = NYTurl + '?' + $.param({
//     'api-key': "49af0056ae9e46d5a207000ad5232d9d",
//     'begin_date': yyyy+mm+dd,
//     // "end_date": yyyy+mm+dd
//     });
//     $.ajax({
//         url: NYTurl,
//         method: 'GET',
//     }).done(function(result) {
//         console.log("NYT result is "+result);
//         console.log(result);
//         var articles = result.response.docs;
//         console.log(articles)
//         addnyt(articles);

//     }).fail(function(err) {
//         throw err;
//     });

// })

function changeBackground(datePicked){
    $.ajax({
    url: url+"&date="+datePicked,
    success: function(result){

        //change background color
        console.log(result.url)
        $("body").css("background-image","url("+result.url+")");
        $("body").css("background-size","cover");
        }
    });
}

function addApodCard(){
    console.log("making apod card now")
    var newCard = $("<div class='card hoverable apodCard'></div>");
    var newCardContent= $("<div class='card-content'></div>");
    newCardContent.append("<span class='card-title apodTitle'></span>")
    newCardContent.append("<p class='apodInfo'></p>")

    newCard.append(newCardContent);
    $(".apodCard").append(newCard)
}

function addNumbersCard(){
    var newNumberCard = $("<div class='triviaCard card hoverable'></div>");
    var newNumberCardContent= $("<div class='card-content'></div>");
    newNumberCardContent.append("<span class='card-title'>Trivia</span>")
    newNumberCardContent.append("<p id='trivia'></p>")
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
    $(".triviaCard").css("display","block");
}


// skycons to append to div. need to connect .currently.icon
function addWeatherCard(){
    console.log("making weather card now")
    var newWeatherCard = $("<div class='card hoverable'></div>");
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

function addnyt(){

    var nytCard = $("<div class='nytCard card hoverable'></div>");
        var nytContent = $("<div class='card-content nytContent'></div>");
        for (let index = 0; index < 5; index++) {
            var storySection = $("<div class='section'></div>")
            storySection.append("<a href='' target='_blank'><p id=''></p></a>");
            storySection.append("<p class='snippet'></p>");
            nytContent.append(storySection);
        }

    nytCard.append(nytContent);
    $(".nytBlock").append(nytCard);

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


var NASAurl = "https://api.nasa.gov/planetary/apod?api_key=54lBa2rMDnkIC43dEmrnkzykVy4aWrfLWxYDJfXO";
var NYTurl = "https://api.nytimes.com/svc/search/v2/articlesearch.json";
var nytArticles;
var date;
var picInfo;
var picTitle;
var numbersInfo;
var mm;
var dd;
var yyyy;
var collapsibleElem = document.querySelector('.collapsible');
var collapsibleInstance = M.Collapsible.init(collapsibleElem);
var savedDays;

// as soon as page loads, create links out of local storage
if(localStorage.getItem("savedDays") === null){
    savedDays=[];
    console.log("NO SAVED DAYS");
}else{
  console.log("SAVED DAYS FOUND");
  savedDays=JSON.parse(localStorage.getItem("savedDays"));
  console.log("saved days = "+ savedDays);
  makeSavedLinks();
  $("#menu").css("display","inline-block");
}

$('.sidenav').sidenav();
$('.tooltipped').tooltip();

$("#saveDay").on("click",function(){

    if($("#saveIcon").html()==="favorite"){
        $("#saveIcon").html("favorite_border")
    }else{
        $("#saveIcon").html("favorite")
    }
    
    if(savedDays.includes(date)===true){
        savedDays.splice(savedDays.indexOf(date), 1);
        localStorage.setItem("savedDays", JSON.stringify(savedDays));
        $('#'+date).remove();   
    }else{
        savedDays.push(date);
        localStorage.setItem("savedDays", JSON.stringify(savedDays));
        $("#savedDays").append("<li id='"+date+"'><a class='waves-effect'>"+date+"</a></li>");   
    }
})

    $("#clearAllButton").click(function(){
    $("#savedDays").empty()
    savedDays=[]
    localStorage.setItem("savedDays", JSON.stringify(savedDays));
    })

$(".savedDayButton").on("click",function(){
    
    date=event.target.innerText;
    console.log("saved date to show "+date)
    mm = (date.split("-")[1]);
    dd = (date.split("-")[2]);
    yyyy= (date.split("-")[0]);
    
    if ($("#pickDay").css("display")!= "none"){
        $('#pickDay').css("display","none");
        $(".btn-floating").css("display","inline-block");
        addApodCard();
        addNumbersCard();
        addnyt();
    }
    changePage();
})

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
        
        date = $('.datepicker')[0].value;
        console.log("date picked = "+date);
        mm = (date.split("-")[1]);
        dd = (date.split("-")[2]);
        yyyy= (date.split("-")[0]);
        console.log("month = "+mm);
        console.log("day = "+dd);
        console.log("year = "+yyyy);
        
        changePage();
    }
});


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

function addnyt(){
    
    var nytCard = $("<div class='nytCard card hoverable'></div>");
    var nytContent = $("<div class='card-content nytContent'></div>");
    for (let index = 0; index < 5; index++) {
        var storySection = $("<div class='section'></div>")
        storySection.append("<a id='link"+index+"' href='' target='_blank'><p id='headline"+index+"'></p></a>");
        storySection.append("<p id='snippet"+index+"'></p>");
        nytContent.append(storySection);
    }
    
    nytCard.append(nytContent);
    $(".nytBlock").append(nytCard);
    
}
function makeSavedLinks(){
    for(var a=0; a<savedDays.length;a++){
        $("#savedDays").append("<li id='"+savedDays[a]+"' class='savedItem'><a class='waves-effect savedDayButton'>"+savedDays[a]+"<i class='material-icons clearSaved'>clear</i></a></li>");
    }
}

function checkIcon(){
    if(savedDays.includes(date)===true && $("#saveIcon").html() === "favorite_border"){
        console.log("this needs an icon change");
        $("#saveIcon").html("favorite");
    }else if(savedDays.includes(date)===false && $("#saveIcon").html() === "favorite"){
        console.log("icon's good")
        $("#saveIcon").html("favorite_border");
    }
}
function changePage(){

    checkIcon();
     // changeBackground(date);
     $.ajax({
        url: NASAurl+"&date="+date,
        success: function(result){
            if(result.media_type == "video") {
                console.log("issa video dawg");
            }
            //change background color
            $("body").css("background-image","url("+result.url+")");

            picInfo = result.explanation;
            picTitle = result.title;

            $(".apodInfo").html(picInfo);
            $(".apodTitle").html(picTitle);
            $(".apodCard").css("display","inherit");
        }
    });
    
    //change numbers block
   newNumber();

    console.log(NYTurl + '?' + $.param({
        'api-key': "49af0056ae9e46d5a207000ad5232d9d",
        'begin_date': yyyy+mm+dd,
        // "end_date": yyyy+mm+dd
    }))
    var newNyt = NYTurl + '?' + $.param({
    'api-key': "49af0056ae9e46d5a207000ad5232d9d",
    'begin_date': yyyy+mm+dd,
    // "end_date": yyyy+mm+dd
    });
    $.ajax({
        url: newNyt,
        method: 'GET',
    }).done(function(result) {
        nytArticles = result.response.docs;
        console.log(result);

        for (let index = 0; index < 5; index++) {
            //CHANGE STORIES
            var story = nytArticles[index];
            $("#link"+index).attr("href",story.web_url)
            $("#headline"+index).html(story.headline.main);
            $("#snippet"+index).html(story.snippet);
        }
        $(".nytCard").css("display","block");
    }).fail(function(err) {
        throw err;
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


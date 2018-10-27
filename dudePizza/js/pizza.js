var url = "https://api.nasa.gov/planetary/apod?api_key=54lBa2rMDnkIC43dEmrnkzykVy4aWrfLWxYDJfXO";
var date;
var picInfo;
var picTitle;
var numbersInfo;
var mm;
var dd;
$('.datepicker').datepicker({format: 'yyyy-mm-dd'});

$("#submit").on("click",function(){
    $(".apodCard").empty()
    $(".numberBlock").empty()

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

    var nytUrl = "https://api.nytimes.com/svc/search/v2/articlesearch.json",
        nytUrl = nytUrl+"?" + $.param({
        'api-key': "49af0056ae9e46d5a207000ad5232d9d",
        'begin_date': "20181002",
        // 'sort': "oldest"
        // 'fl': "print_page"
        });
    $.ajax({
    
        url: nytUrl,
        success: function(result){  
           console.log(result)
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
        $("body").css("background-size","cover");
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

  // Initialize collapsible (uncomment the lines below if you use the dropdown variation)
    //var collapsibleElem = document.querySelector('.collapsible');
    //var collapsibleInstance = M.Collapsible.init(collapsibleElem, options);

  // Or with jQuery
  $(document).ready(function(){
    $('.sidenav').sidenav();
  });

  $("#newDateButton").on("click", function(){
    console.log();
    $(".datepicker").toggle();
    $("#submit").toggle()  
})


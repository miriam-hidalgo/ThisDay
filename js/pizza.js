//declare variables
var NASAurl ="https://api.nasa.gov/planetary/apod?api_key=54lBa2rMDnkIC43dEmrnkzykVy4aWrfLWxYDJfXO";
var NASAimg;
var nytArticles;
var date;
var picInfo;
var picTitle;
var numbersInfo;
var mm;
var dd;
var yyyy;
var savedDays;

//trigger sidenav and tooltips using JQuery as per Materialize Documentation
$(".sidenav").sidenav();
$(".tooltipped").tooltip({
  enterDelay: 700,
  inDuration: 500,
});
$('.materialboxed').materialbox();

// as soon as page loads, run a check for savedDays inside of localStorage. 
// if it gets no result, set savedDays to an empty array
if (localStorage.getItem("savedDays") === null) {
  savedDays = [];
  console.log("NO SAVED DAYS");
} else {
    // if it returns anything other than "null": set savedDays array to the array in storage, make sure it isn't empty, and then make the links in the sidenav and show menu button
  console.log("SAVED DAYS FOUND");
  console.log("saved days = " + savedDays);
  savedDays = JSON.parse(localStorage.getItem("savedDays"));
  makeSavedLinks();
  if (savedDays.length > 0) {
    $("#menu").css("display", "inline-block");
  }
}

//the function for the datepicker. sets input to the format desired, sets maxDate to current date so user can't select tomorrow or beyond, closes as soon as a date is pressed, and sets onClose function
$(".datepicker").datepicker({
  format: "yyyy-mm-dd",
  maxDate: new Date(),
  autoClose: true,
  onClose: function(datePicked) {

    //when the datepicker closes, hide pickDay button, show menu buttons, set date and break it up, run changePage function
    $("#pickDay").css("display", "none");
    $(".btn-floating").css("display", "inline-block");

    date = $(".datepicker")[0].value;
    console.log("date picked = " + date);
    mm = date.split("-")[1];
    dd = date.split("-")[2];
    yyyy = date.split("-")[0];
    console.log("month = " + mm);
    console.log("day = " + dd);
    console.log("year = " + yyyy);

    changePage();
  }
});

//when user clicks on the saveDay button, the icon switches to its alternate version and checks if date is already saved before appending sidenav link and adding to localStorage    
$("#saveDay").on("click", function() {
  if ($("#saveIcon").html() === "favorite") {
    $("#saveIcon").html("favorite_border");
  } else {
    $("#saveIcon").html("favorite");
  }

  //if current Date is already saved, remove it from the savedDays array using splice, set the new value of savedDays in localStorage, and remove the sidenav button
  if (savedDays.includes(date) === true) {
    savedDays.splice(savedDays.indexOf(date), 1);
    localStorage.setItem("savedDays", JSON.stringify(savedDays));
    $("#" + date).remove();
  } else {
      //if current date is NOT saved, add it to savedDays, set new value of savedDays in localStorage, and append link on side
    savedDays.push(date);
    localStorage.setItem("savedDays", JSON.stringify(savedDays));
    $("#savedDays").append(
      "<li id='" + date + "' class='savedItem'><a class='waves-effect savedDayButton'>" + date + "</a></li>"
    );
  }
});

$("#newDateButton").on("click", function() {
  $(".datepicker").datepicker("open");
});

$("#clearAllButton").click(function(){
  $("#savedDays").empty()
  savedDays=[]
  localStorage.setItem("savedDays", JSON.stringify(savedDays));
  checkIcon();
})

//when a sidenav link is pressed, set date to the value of the html, break up the date into mm/dd/yyyy, and run changePage
$("#savedDays").on("click", ".savedDayButton",function() {
  date = event.target.innerText;
  console.log("saved date to show " + date);
  mm = date.split("-")[1];
  dd = date.split("-")[2];
  yyyy = date.split("-")[0];

  //this is in case the user pressses a sidenav link BEFORE pressing the #pickDay button. 
  if ($("#pickDay").css("display") != "none") {
    $("#pickDay").css("display", "none");
    $(".btn-floating").css("display", "inline-block");
    addApodCard();
    // addNumbersCard();
    addViewToggle();
    addnyt();
  }
  changePage();
});

//the cards are created as soon as button is pressed and datepicker is opened. display is initially set to "none"
$("#pickDay").on("click", function() {
  addApodCard();
  // addNumbersCard();
  addViewToggle();
  addnyt();
});


//when "new trivia" button is pressed, run newNumber to call ajax and change html of #trivia
$(".numberBlock").on("click", "a", function() {
  // newNumber();
});

//makes Astronomy Picture of the Day card and appends to page. display set to "none" by default.
function addApodCard() {
  console.log("making apod card now");
  var newCard = $("<div class='card hoverable apodCard'></div>");
  var newCardContent = $("<div class='card-content'></div>");
  newCardContent.append("<span class='card-title apodTitle flow-text'></span>");
  newCardContent.append("<p class='apodInfo flow-text'></p>");
  newCardContent.append("<div class='preloader-wrapper big active center-align'><div class='spinner-layer spinner-blue-only'><div class='circle-clipper left'><div class='circle'></div></div><div class='gap-patch'><div class='circle'></div></div><div class='circle-clipper right'><div class='circle'></div></div></div></div>")
  // newCardContent.append("<a class='waves-effect waves-light btn'>view Nasa's Image of the day</a>");

  newCard.append(newCardContent);
  $(".apodCard").append(newCard);
}

//makes Trivia card and appends to page. display set to "none" by default.
function addNumbersCard() {
  var newNumberCard = $("<div class='triviaCard card hoverable'></div>");
  var newNumberCardContent = $("<div class='card-content'></div>");
  newNumberCardContent.append("<span class='card-title'>Trivia</span>");
  newNumberCardContent.append("<p id='trivia'></p>");
  newNumberCardContent.append("<a class='waves-effect waves-light btn'>NEW TRIVIA</a>");
  
  newNumberCard.append(newNumberCardContent);
  $(".numberBlock").append(newNumberCard);
}

//function to add view button instead of Trivia Card. Had to pivot since numbers API does not work from an "HTTPS" page.
function addViewToggle(){
  var newViewCard = $("<div class='viewCard card hoverable'></div>");
  var newViewCardContent = $("<div class='card-content nasaContent'></div>");
  // newViewCardContent.append("<a class='waves-effect waves-light btn'>view Nasa's Image of the day</a>");
  newViewCardContent.append("<div class='preloader-wrapper active center-align'><div class='spinner-layer spinner-blue-only'><div class='circle-clipper left'><div class='circle'></div></div><div class='gap-patch'><div class='circle'></div></div><div class='circle-clipper right'><div class='circle'></div></div></div></div>");
  
  newViewCard.append(newViewCardContent);
  $(".numberBlock").append(newViewCard);
}

//call ajax and change html for trivia card
function newNumber() {
  // $.ajax({
  //   url: "https://numbersapi.com/" + mm + "/" + dd + "/date",
  //   success: function(result) {
  //     console.log(result);
  //     numbersInfo = result;
  //     $("#trivia").html(result);
  //   }
  // });

  // $.get("https://numbersapi.p.mashape.com/" + mm + "/" + dd + "/date", function(data) {
  //   console.log("http://numbersapi.com/" + mm + "/" + dd + "/date?notfound=floor&fragment")
  //   $('#trivia').text(data);
  // });

  $.ajax({
    url: "https://numbersapi.p.mashape.com/" + mm + "/" + dd + "/date",
    method: 'GET', 
    header: {
       'X-Mashape-Key': 'RR4vbj1JoFmsh2LbrfgQDRtLCUCCp1UAX7ajsnVrcTSRttqII3',
       'Content-type': 'application/x-www-form-rule coded',
       'Accept': 'application/json'
    },
    crossDomain: true,
    success: function(data) { console.log(data)}
    });
  $(".triviaCard").css("display", "block");
}

//makes NYT card and appends to page. display set to "none" by default.
function addnyt() {
  var nytCard = $("<div class='nytCard card hoverable'></div>");
  var nytContent = $("<div class='card-content nytContent'></div>");
  for (let index = 0; index < 5; index++) {
    var storySection = $("<div class='section'></div>");
    storySection.append(
      "<a id='link" +
        index +
        "' href='' target='_blank'><p id='headline" +
        index +
        "' class='flow-text'></p></a>"
    );
    storySection.append("<p id='snippet" + index + "'></p>");
    nytContent.append(storySection);
  }

  nytContent.prepend("<span class='card-title flow-text'>New York Times Articles</span>");
  nytCard.append(nytContent);
  $(".nytBlock").append(nytCard);
}

//makes links to display in sideNav. display set to "none" by default.
function makeSavedLinks() {
  for (var a = 0; a < savedDays.length; a++) {
    $("#savedDays").append(
      "<li id='" +
        savedDays[a] +
        "' class='savedItem'><a class='waves-effect savedDayButton'>" +
        savedDays[a] +
        "<i class='material-icons clearSaved'>clear</i></a></li>"
    );
  }
}

//checks icon every time page is changed. makes sure 
function checkIcon() {
  if (
    savedDays.includes(date) === true &&
    $("#saveIcon").html() === "favorite_border"
  ) {
    console.log("this needs an icon change");
    $("#saveIcon").html("favorite");
  } else if (
    savedDays.includes(date) === false &&
    $("#saveIcon").html() === "favorite"
  ) {
    console.log("icon's good");
    $("#saveIcon").html("favorite_border");
  }
}

//make date more readable
function readDate(){
  var suffix="th";
  var newMonth;

  switch(dd){
    case "01":
    suffix="st"
    break;

    case "02":
    suffix="nd"
    break;

    
    case "03":
    suffix="rd"
    break;
  }

  switch(mm){
    case "01":
    newMonth="January"
    break;

    case "02":
    newMonth="February"
    break;

    case "03":
    newMonth="March"
    break;
    case "04":
    newMonth="April"
    break;
    case "05":
    newMonth="May"
    break;
    case "06":
    newMonth="June"
    break;
    case "07":
    newMonth="July"
    break;
    case "08":
    newMonth="August"
    break;
    case "09":
    newMonth="September"
    break;
    case "10":
    newMonth="October"
    break;
    case "11":
    newMonth="November"
    break;
    case "12":
    newMonth="December"
    break;
  }
  
  return(newMonth+" "+dd+suffix+", "+yyyy)
}

//the meat and potatos of the page. runs ajax calls to each API to change HTML 
function changePage() {
  $(".sidenav").sidenav("close");
  checkIcon();
  $("#dateDisplay").text(readDate());
  $(".preloader-wrapper").css("display","block");
  $(".added").css("display","none");
  $(".apodInfo").css("display","none");
  $(".apodTitle").css("display","none");
  
  //display viewImage card and .apodCard to show loading sign. give feedback to user
  $(".viewCard").css("display","block");
  $(".apodCard").css("display", "block");
 
  //run NASA ajax to change background
  $.ajax({
    url: NASAurl + "&date=" + date,
    success: function(result) {
      if (result.media_type == "video") {
        console.log("issa video dawg");
        console.log(result.url);
        $("#dateDisplay").css("color","black");
        $(".added").remove();
        $(".nasaContent").append("<div class='added video-container'><iframe id='videoPlace' src='"+result.url+"'frameborder='0' allowfullscreen></iframe></div>");
        $(".video-container").css("display","block");
      }else{
        //change background color
        $("#dateDisplay").css("color","white");
        $(".added").remove();
        $(".nasaContent").append("<img class='added responsive-img materialboxed' src='"+result.url+"'>");
        $('.materialboxed').materialbox();
      }
      
      $("body").css("background-image", "url(" + result.url + ")");
      picInfo = result.explanation;
      picTitle = result.title;

      $(".apodInfo").html(picInfo);
      $(".apodTitle").html(picTitle);
      $(".apodInfo").css("display","block");
      $(".apodTitle").css("display","block");
      $(".added").css("display","block");
      $(".preloader-wrapper").css("display","none");
    } 
  });

  //run newNumber to change trivia
  // newNumber();


  //adds 1 to day. ajax call to NYT needs to send date and date+1. this means headaches for last day of the month.
  var dayPlus = parseInt(dd) + 1;
  console.log(dayPlus);

  $.ajax({
    url:"https://api.nytimes.com/svc/search/v2/articlesearch.json?api-key=49af0056ae9e46d5a207000ad5232d9d&begin_date=" +yyyy + mm + dd + "&end_date=" + yyyy + mm + dayPlus,
    method: "GET"
  })
    .done(function(result) {
      nytArticles = result.response.docs;

      //runs for loop to change HTML of NYT card. changes headline, adds "href" attribute to <a> tag, changes <p> tag
      for (let index = 0; index < nytArticles.length; index++) {
        //CHANGE STORIES
        var story = nytArticles[index];

        if (story.document_type != "article") {
          $("#headline" + index).html(story.headline.name);
        }

        $("#link" + index).attr("href", story.web_url);
        $("#headline" + index).html(story.headline.main);
        $("#snippet" + index).html(story.snippet);
      }
      $(".nytCard").css("display", "block");
    })
    .fail(function(err) {
      throw err;
    });
}


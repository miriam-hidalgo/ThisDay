var NASAurl =
  "https://api.nasa.gov/planetary/apod?api_key=54lBa2rMDnkIC43dEmrnkzykVy4aWrfLWxYDJfXO";
// var NYTurl = "https://api.nytimes.com/svc/search/v2/articlesearch.json";
// var NYTurl =
//   "https://api.nytimes.com/svc/search/v2/articlesearch.json?api-key=49af0056ae9e46d5a207000ad5232d9d&begin_date=";

//declare variables
var nytArticles;
var date;
var picInfo;
var picTitle;
var numbersInfo;
var mm;
var dd;
var yyyy;
var collapsibleElem = document.querySelector(".collapsible");
var collapsibleInstance = M.Collapsible.init(collapsibleElem);
var savedDays;

//trigger sidenav and tooltips using JQuery as per Materialize Documentation
$(".sidenav").sidenav();
$(".tooltipped").tooltip();

// as soon as page loads, run a check for savedDays inside of localStorage. if it gets no result, set savedDays to an empty array
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

//when you click on the saveDay button, the icon switches to its alternative and checks if date is already saved
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
      "<li id='" + date + "'><a class='waves-effect'>" + date + "</a></li>"
    );
  }
});

//when a sidenav link is pressed, set date to the value of the html, break up the date into mm/dd/yyyy, and run changePage
$(".savedDayButton").on("click", function() {
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
    addNumbersCard();
    addnyt();
  }
  changePage();
});

//the cards are created as soon as button is pressed and datepicker is opened. display is initially set to "none"
$("#pickDay").on("click", function() {
  addApodCard();
  addNumbersCard();
  addnyt();
});

$("#newDateButton").on("click", function() {
  $(".datepicker").datepicker("open");
});

//the function for the datepicker. sets format to return date in, sets maxDate to current date so user can't select tomorrow or beyond, and sets onClose
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

//makes Astronomy Picture of the Day card and appends to page. display set to "none" by default.
function addApodCard() {
  console.log("making apod card now");
  var newCard = $("<div class='card hoverable apodCard'></div>");
  var newCardContent = $("<div class='card-content'></div>");
  newCardContent.append("<span class='card-title apodTitle'></span>");
  newCardContent.append("<p class='apodInfo'></p>");

  newCard.append(newCardContent);
  $(".apodCard").append(newCard);
}

//makes Trivia card and appends to page. display set to "none" by default.
function addNumbersCard() {
  var newNumberCard = $("<div class='triviaCard card hoverable'></div>");
  var newNumberCardContent = $("<div class='card-content'></div>");
  newNumberCardContent.append("<span class='card-title'>Trivia</span>");
  newNumberCardContent.append("<p id='trivia'></p>");
  newNumberCardContent.append(
    "<a class='waves-effect waves-light btn'>NEW TRIVIA</a>"
  );

  newNumberCard.append(newNumberCardContent);
  $(".numberBlock").append(newNumberCard);
}

//when "new trivia" button is pressed, run newNumber to call ajax and change html
$(".numberBlock").on("click", "a", function() {
  console.log("getting new trivia");
  newNumber();
});


//call ajax and change html for trivia card
function newNumber() {
  $.ajax({
    url: "http://numbersapi.com/" + mm + "/" + dd + "/date",
    success: function(result) {
      console.log(result);
      numbersInfo = result;
      $("#trivia").html(result);
    }
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
        "'></p></a>"
    );
    storySection.append("<p id='snippet" + index + "'></p>");
    nytContent.append(storySection);
  }

  nytContent.prepend("<span class='card-title'>New York Times Articles</span>");
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

//the meat and potatos of the page. runs ajax calls to each API to change HTML 
function changePage() {
  checkIcon();
  
  //run NASA ajax to change background
  $.ajax({
    url: NASAurl + "&date=" + date,
    success: function(result) {
      if (result.media_type == "video") {
        console.log("issa video dawg");
      }
      //change background color
      $("body").css("background-image", "url(" + result.url + ")");

      picInfo = result.explanation;
      picTitle = result.title;

      $(".apodInfo").html(picInfo);
      $(".apodTitle").html(picTitle);
      $(".apodCard").css("display", "inherit");
    }
  });

  //run newNumber to change trivia
  newNumber();

  //adds 1 to day. ajax call to NYT needs to send date and date+1. this means headaches for last day of the month.
  var dayPlus = parseInt(dd) + 1;
  console.log(dayPlus);

  $.ajax({
    url:
      "https://api.nytimes.com/svc/search/v2/articlesearch.json?api-key=49af0056ae9e46d5a207000ad5232d9d&begin_date=" +
      yyyy +
      mm +
      dd +
      "&end_date=" +
      yyyy +
      mm +
      dayPlus,
    method: "GET"
  })
    .done(function(result) {
      console.log(
        "https://api.nytimes.com/svc/search/v2/articlesearch.json?api-key=49af0056ae9e46d5a207000ad5232d9d&begin_date=" +
          yyyy +
          mm +
          dd +
          "&end_date=" +
          yyyy +
          mm +
          dayPlus
      );
      nytArticles = result.response.docs;
      console.log(nytArticles[0].document_type);
      console.log(nytArticles);

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


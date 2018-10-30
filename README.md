# This Day:
## Purpose:
The purpose of this website is to inform the user of a date that they would like to know about. It gives them information on the astronomy Picture of the day, histroical trivia of the date and month selected as well as New York Times articles published on that day.

## Explanation of flow:
The website has the user select a date from the pop up Datepicker that pops up from the "Pick a Day" Button. This creates a value that is put into the NASA API to append to the website a card that populates with the information form the object called. It also changes the bacground to be the actual Astronomy Picture of the Day. The date selected by the user is stored as a value and then spliced to be used for the trivia API that we use to generate trivia. Using those same values they are used to call the NYT API. A for loop is used to generate 5 anchors for the articles to link to.


## API's Used:
![NASA API](https://api.nasa.gov/images/logo.png)
![Numbers API](https://www.programmableweb.com/wp-content/numbersapiscreen.png)
![NYT API](https://developer.nytimes.com/img/NYTDevLogo.svg)

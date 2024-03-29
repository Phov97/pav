//wiki search bar using JavaScript Object Notation (JSON)

//indicate that this function is used in strcit mode, hence only use declared variables
"use strict";

//decalre function
(function(){
  // creates a new object which is called xhr, as this handles the API call so it can be displayed in the webiste later on
  var xhr = new XMLHttpRequest();

  // console.log(`Current readyState: ${xhr.readyState}`);
  //write this message to the console
  console.log(`Current readyState: ${xhr.readyState}`);

  //create new object and return an element for each attribute
  var queryBox = document.getElementById("wikiQuery");
  var searchForm = document.getElementById("searchForm");
  var demoJSON = document.getElementById("demo");

  // construction of the base for the request url of the wiki
  var baseURL = "https://en.wikipedia.org/w/api.php? \
                format=json& \
                action=query& \
                generator=search& \
                gsrnamespace=0& \
                gsrlimit=10& \
                prop=info|extracts|langlinks|pageimages& \
                inprop=url& \
                exintro& \
                explaintext& \
                exsentences=1& \
                exlimit=max& \
                llprop=url& \
                lllimit=max& \
                piprop=thumbnail|name& \
                origin=*& \
                gsrsearch=";

/*
API Sandbox url
https://en.wikipedia.org/wiki/Special:ApiSandbox#action=query&format=json&generator=search&prop=extracts%7Clanglinks%7Cpageimages&gsrlimit=10&gsrnamespace=0&exintro&explaintext&exsentences=1&exlimit=max&llprop=url&lllimit=max&piprop=thumbnail|name&origin=*&gsrsearch=kittens
Request url
https://en.wikipedia.org/w/api.php?action=query&format=json&generator=search&prop=extracts%7Clanglinks%7Cpageimages&gsrlimit=10&gsrnamespace=0&exintro&explaintext&exsentences=1&exlimit=max&llprop=url&lllimit=max&piprop=thumbnail|name&origin=*&gsrsearch=kittens
*/

  //declare function getherData
  function gatherData(data) {
    // console.log(data);
    // initialise some variables
    let theData = "";
    let langLinks = "";
    let img = "<img>";
    //declare varibale of languages (english)
    var languages = ["en"]; //removing the languges as just need in english ["en", "de", "zh", "fr", "es", "ja", "ar", "ko", "el"], this removes the language options from the results grid when searching using wiki
    let k;
    let key;
    // loop through the result pages by pageid
    for(key in data.query.pages) {
      //initialise the variables
      let tmp = data.query.pages[key];

      //if there is a thumble for each result, display it
      //removed this if statement as i dont want the thumbnales for each record from the wiki search to be displayed
      //if (tmp.thumbnail) {
        //img = `<img src="${tmp.thumbnail.source}" alt="${tmp.title}"> `;
      //}

      let title = `<strong><a href="${tmp.fullurl}">${tmp.title}</a></strong>`;
      let extract = `<span class="txt">${tmp.extract}</span>`;
      langLinks = "";
      for (k in tmp.langlinks) {
        //if the languages are included
        if (languages.includes(tmp.langlinks[k].lang)) {
          langLinks += `<a href=${tmp.langlinks[k].url}>${tmp.langlinks[k].lang}</a> `;
        }
      }
      theData += `<li>${img} ${title} ${extract} <span class="langs">${langLinks}</span></li>`;
    }
    demoJSON.innerHTML = theData;
  }

  // the API call is triggered once the user submits a query
  searchForm.addEventListener("submit", function(ev){
    // complete the request url
    let wiki = baseURL + queryBox.value;
    // open a connection to the requested API url
    xhr.open("GET", wiki, true);
    // be polite to Wikipedia
    xhr.setRequestHeader('Api-User-Agent', 'Example/1.0');
    // send off that request
    xhr.send();
    // if the response was ok, handle the response data using the gatherData function
    xhr.onreadystatechange = function() {
      // console.log(`Current readyState: ${xhr.readyState}`);
      if (xhr.readyState === 4 && xhr.status === 200) {
        // parse the response JSON
        let response = JSON.parse(xhr.responseText);
        // deal with the parsed JSON data
        gatherData(response);
      }
    };
    // clear the search box
    queryBox.value = "";
    ev.preventDefault();
  }, false);

}());

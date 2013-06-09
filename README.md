<h2>Instructions</h2>
<ol>
<li>Clone the repository</li>
<li>Edit the example.html file or use it as a guide</li>
</ol>

<h2>Adding Additional Languages</h2>
<p>Pass in a JS Object to languageMatchAndWrap with the new language name and a regex that can detect that language</p>

$("p").languageMatchAndWrap(
{
    language : 'langCode',                       // enter language code (en, he, etc...) see: http://www.w3schools.com/tags/ref_language_codes.asp
    regExMap : {languageName : /[A-Z]/}               //create a regEx to grab word containing language
});

<h2>Notes</h2>
1) Only pass in elements that do NOT have html in them (aka text elements). Make your selectors specific enough to only contain lowest level element with text. Why didn't I just handle that in the code? The issue lies with html elements that contain text, such as title in which this code would add spans to. Sure I could've changed the code to try and detect that, but I wanted it to be as simple and efficient as possible
2) This was tested with jQuery 1.9.1

More information: http://www.teeohhem.com


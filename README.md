<h2>Instructions</h2>
<ol>
<li>Clone the repository</li>
<li>Edit the example.html file or use it as a guide</li>
</ol>

<h2>Adding Additional Languages</h2>
<p>Pass in a JS Object to languageMatchAndWrap with the new language name and a regex that can detect that language</p>

<pre>
$("p").languageMatchAndWrap(
{
    language : 'langCode',                       // enter language code (en, he, etc...) see: http://www.w3schools.com/tags/ref_language_codes.asp
    regExMap : {languageName : /[A-Z]/}               //create a regEx to grab word containing language
});
</pre>

<h2>Notes</h2>
<ol>
<li>Elements can contain only text or it can contain both HTML and text. The plugin will traverse the child nodes and their children (and so on) if they exist.</li>
<li>There may be a performance hit depending on how deep the child node list is. This has not been fully performance tested.</li>
<li>This was tested with jQuery 1.7.2 and jQuery 1.9.1</li>
</ol>
<p>More information: http://www.teeohhem.com</p>


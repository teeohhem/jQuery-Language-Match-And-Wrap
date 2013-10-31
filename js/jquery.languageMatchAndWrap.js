(function($){
    "use strict";
    
    var dir = "auto",
        bdoStart = "",
        bdoEnd = "</bdo>",
        regExTagCleanSpace = "",
        regExTagClean = "",
        tempElem = "",
        
        process = {
           /*
            * Method 'setDirection' corrects IE7-IE10 incorrect handling of direction 'auto', forcing right-to-left
            * direction
            */
            setDirection: function(){
                if($.browser.msie){
                     dir = "rtl";
                }
            },
           /*
            * Method 'setTagRegExp' sets the correct regular expression values to be used if they haven't been set
            * 
            * @param {Object} containing user defined options
            */
            setTagRegExp: function(options){
                if(typeof regExTagClean !== "object"){
                   bdoStart = '<bdo dir="'+ dir +'" lang="'+ options.language +'">';
                    regExTagClean = new RegExp("<\/bdo>" + bdoStart, "g");
                    regExTagCleanSpace = new RegExp("<\/bdo> " + bdoStart, "g");
                }
            },
           /*
            * Method 'getContents' converts a String to a jQuery Object so the individual child nodes can be properly
            * evaluated
            * 
            * @param {String} containing HTML/plain text 
            * 
            * @return jQuery Object of element contents 
            */
            getContents: function(elem){
                return $("<div />").append(elem).contents();
            },
           /*
            * Method 'getHTML' converts a String to a HTML Object
            * 
            * @param {String} containing HTML/plain text
            * 
            * @return HTML Object
            */
            getHTML: function(elem){
                return $("<div />").append(elem).html();
            },
           /*
            * Method 'cleanTags' combines adjacent <bdo> tags into a single wrapper
            * 
            * @param {String} String of matched <bdo> wrapped text
            * 
            * @return String of combined tags
            */
            cleanTags: function(contents){
                return contents.replace(regExTagCleanSpace, " ")
                               .replace(regExTagClean, "");
            },
           /*
            * Method 'nonAlphaText' checks to see if the String passed in contains only integers and/or special characters
            * 
            * @param {String} plain text
            * @param {Object} user defined options
            * 
            * @return Boolean
            */
            nonAlphaText: function(elem, options){
                return (options.nonAlphaRegExMap.special.test(elem) || options.nonAlphaRegExMap.number.test(elem))  && !options.languageRegExMap.en.test(elem);
            },
           /*
            * Method 'matchText' wraps user defined language with the <bdo> tag then evaluates text between tags for 
            * numbers and special characters to be included with the surrounding language properly
            * 
            * @param {String} plain text containing mixed languages
            * @param {Object} user defined options
            * 
            * @return String of user-defined language text wrapped in <bdo> tags
            */
            matchText: function(elem, options){
                var tmp = elem.replace(options.languageRegExMap[options.language], bdoStart + "$1" + bdoEnd),
                    contentsArr = [],
                    elemBlock = process.getContents(process.cleanTags(tmp));
                      
                elemBlock.each(function(index){
                    if(this.nodeType === 3){
                        if(process.nonAlphaText(this.nodeValue, options)){
                            if(contentsArr.length > 0){
                                contentsArr[index - 1] = process.getHTML($(contentsArr[index - 1]).append(this.nodeValue));
                            }
                            else {
                                $(elemBlock[index + 1]).prepend(this.nodeValue);
                            }
                        } 
                        else {
                            contentsArr.push(process.getHTML(this));
                        }
                    }
                    else {
                        contentsArr.push(process.getHTML(this));
                    }
                });
                
                tmp = contentsArr.join('');
                
                return process.cleanTags(tmp, options.language);
            },
           /*
            * Method 'runMatch' separates out the plain text from HTML elements, evaluates the plain text, recursive
            * call if HTML element
            * 
            * @param {Object} jQuery Object to be evaluated
            * @param {Object} user defined options
            * 
            * @return String of completed text to be sent back to the DOM
            */
            runMatch: function(elem, options){
                elem = elem instanceof jQuery ? elem : $(elem);
                var curElem = elem.contents(),
                    elemArr = [];
                
                curElem.each(function(){
                    //if the element is text, evaluate language
                    if(this.nodeType === 3){ 
                        //only send to wrapper function if text contains rtl language
                        if(options.languageRegExMap[options.language].test(this.nodeValue)){ 
                            tempElem = process.matchText(this.nodeValue, options);
                        }
                        else {
                            tempElem = this.nodeValue;
                        }
                    }
                    //if its HTML then recursive call on the HTML element
                    else { 
                        tempElem = process.getHTML($(this).languageMatchAndWrap(options));
                    }
                    
                    elemArr.push(tempElem);
                });
                
                return elemArr.join(''); 
            }
        };
        
        //Set direction onLoad
        process.setDirection();
        
    $.fn.languageMatchAndWrap = function(options) {
        options = $.extend(true,defaultOptions,options);
        
        process.setTagRegExp(options);
        
        //If selector Array passed in, recursive call for each
        if(this.length > 1){
            this.each(function() {
                $(this).languageMatchAndWrap(options);
            });
            return this;
        }
        else {
            this.html(process.runMatch(this, options));
            return this;
        }
    };
     
    var defaultOptions = {
            language : 'en',
            languageRegExMap : {
                en: /(\S*[\u0041-\u005A\u0061-\u007A]+\S*)/g,
                he: /(\S*[\u0590-\u05FF]+\S*)/g
            },
            nonAlphaRegExMap : {
                number: /(\S*[0-9]+\S*)/g,
                special: /(\S*[;.,?!\-\u2014]+\S*)/g
            }
    };
    
})(jQuery);

(function($){
    "use strict";
    
    var dir = "auto",
        process = {
            setDirection: function(){
                if($.browser.msie){
                     dir = "rtl";
                }
            },
            getContents: function(elem){
                return $("<div />").append(elem).contents();
            },
            getHTML: function(elem){
                return $("<div />").append(elem).html();
            },
            cleanTags: function(contents, lang){
                var regExLangReplaceStr = '<\/bdo> <bdo dir="'+ dir +'" lang="'+ lang +'">',
                    regExLangReplaceStr2 = '<\/bdo><bdo dir="'+ dir +'" lang="'+ lang +'">',
                    tmp = contents.replace(new RegExp(regExLangReplaceStr, "g"), " ")
                                  .replace(new RegExp(regExLangReplaceStr2, "g"), "");
                
                return tmp;
            },
            evalText: function(elem, options){
                var tmp = elem.replace(options.regExMap[options.language], '<bdo dir="'+ dir +'" lang="' + options.language + '">$1</bdo>'),
                    tmpArr = [],
                    testing = process.getContents(process.cleanTags(tmp, options.language));
                      
                testing.each(function(z){
                    if(this.nodeType === 3){
                        if((options.regExMap.special.test(this.nodeValue) || options.regExMap.number.test(this.nodeValue))  && !options.regExMap.en.test(this.nodeValue)){
                            if(tmpArr.length > 0){
                                tmpArr[z - 1] = process.getHTML($(tmpArr[z - 1]).append(this.nodeValue));
                            }
                            else {
                                $(testing[z + 1]).prepend(this.nodeValue);
                            }
                        } 
                        else {
                                tmpArr.push(process.getHTML(this));
                        }
                    }
                    else {
                        tmpArr.push(process.getHTML(this));
                    }
                });
                
                tmp = tmpArr.join('');
                
                return process.cleanTags(tmp, options.language);
            },
            runMatch: function(elem, options){
                var curElem = elem.contents(),
                    elemArr = [],
                    tempElem,
                    langWrappedHTML;
               
               curElem.each(function(){
                   if(this.nodeType === 3){ //if the element is text, evaluate language
                       
                       if(options.regExMap[options.language].test(this.nodeValue)){ //only send to wrapper function if text contains rtl language
                           tempElem = process.evalText(this.nodeValue, options);
                       }
                       else {
                           tempElem = this.nodeValue;
                       }
                   }
                   else { //if its HTML then re run the langMatch on its contents
                       tempElem = process.getHTML($(this).languageMatchAndWrap(options));
                   }
                   
                   elemArr.push(tempElem);
               });
               
               return elemArr.join(''); 
            }
        };
       
       process.setDirection();
        
    $.fn.languageMatchAndWrap = function(options) {
        options = $.extend(true,defaultOptions,options);
        
        if(this.length > 1) {   // applying function to all the selected elements
            this.each(function() {
                $(this).languageMatchAndWrap(options);
            });
            return this;
        }
        
       this.html(process.runMatch(this, options));
       
       return this;
    };
     
    var defaultOptions = {
            language : 'en',
            regExMap : {
                en: /(\S*[\u0041-\u005A\u0061-\u007A]+\S*)/g,
                he: /(\S*[\u0590-\u05FF]+\S*)/g,
                number: /(\S*[0-9]+\S*)/g,
                special: /(\S*[;.,?!\-\u2014]+\S*)/g
            }
    };
    
})(jQuery);

(function($){
    $.fn.languageMatchAndWrap = function(options) { 
        options = $.extend(true,defaultOptions,options);
        if(this.length > 1) {   // applying function to all the selected elements 
            this.each(function(index) {
                $(this).languageMatchAndWrap(options);
            });
            return this;
        }   
        var selectorHTML = this.text(),
        regExSpanReplaceStr = "<\/span> <span lang='"+options.language+"'>",
        langWrappedHTML = selectorHTML.replace(options.regExMap[options.language], "<span lang='"+options.language+"'>$1</span>")
                            .replace(new RegExp(regExSpanReplaceStr, "g"), " ");
        this.html(langWrappedHTML);
        return this;
    };
 
    var defaultOptions = {
        language : 'en',
        regExMap : {
            en: /(\S*[\u0041-\u005A][\u0061-\u007A]+\S*)/g,
            he: /(\S*[\u0590-\u05FF]+\S*)/g
        }
    };
})(jQuery);

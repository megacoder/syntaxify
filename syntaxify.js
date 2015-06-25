// ==UserScript==
// @name Syntaxify
// @description Universal syntax highlighting
// @namespace http://rob-bolton.co.uk
// @version 1.0
// @include http*
// @grant GM_addStyle
// @require http://cdnjs.cloudflare.com/ajax/libs/highlight.js/8.6/highlight.min.js
// ==/UserScript==
//

// HightlightJS CSS
var cssStyle=".hljs{display:block;overflow-x:auto;padding:0.5em;background:#f0f0f0;-webkit-text-size-adjust:none}.hljs,.hljs-subst,.hljs-tag .hljs-title,.nginx .hljs-title{color:black}.hljs-string,.hljs-title,.hljs-constant,.hljs-parent,.hljs-tag .hljs-value,.hljs-rule .hljs-value,.hljs-preprocessor,.hljs-pragma,.hljs-name,.haml .hljs-symbol,.ruby .hljs-symbol,.ruby .hljs-symbol .hljs-string,.hljs-template_tag,.django .hljs-variable,.smalltalk .hljs-class,.hljs-addition,.hljs-flow,.hljs-stream,.bash .hljs-variable,.pf .hljs-variable,.apache .hljs-tag,.apache .hljs-cbracket,.tex .hljs-command,.tex .hljs-special,.erlang_repl .hljs-function_or_atom,.asciidoc .hljs-header,.markdown .hljs-header,.coffeescript .hljs-attribute,.tp .hljs-variable{color:#800}.smartquote,.hljs-comment,.hljs-annotation,.diff .hljs-header,.hljs-chunk,.asciidoc .hljs-blockquote,.markdown .hljs-blockquote{color:#888}.hljs-number,.hljs-date,.hljs-regexp,.hljs-literal,.hljs-hexcolor,.smalltalk .hljs-symbol,.smalltalk .hljs-char,.go .hljs-constant,.hljs-change,.lasso .hljs-variable,.makefile .hljs-variable,.asciidoc .hljs-bullet,.markdown .hljs-bullet,.asciidoc .hljs-link_url,.markdown .hljs-link_url{color:#080}.hljs-label,.ruby .hljs-string,.hljs-decorator,.hljs-filter .hljs-argument,.hljs-localvars,.hljs-array,.hljs-attr_selector,.hljs-important,.hljs-pseudo,.hljs-pi,.haml .hljs-bullet,.hljs-doctype,.hljs-deletion,.hljs-envvar,.hljs-shebang,.apache .hljs-sqbracket,.nginx .hljs-built_in,.tex .hljs-formula,.erlang_repl .hljs-reserved,.hljs-prompt,.asciidoc .hljs-link_label,.markdown .hljs-link_label,.vhdl .hljs-attribute,.clojure .hljs-attribute,.asciidoc .hljs-attribute,.lasso .hljs-attribute,.coffeescript .hljs-property,.hljs-phony{color:#88f}.hljs-keyword,.hljs-id,.hljs-title,.hljs-built_in,.css .hljs-tag,.hljs-doctag,.smalltalk .hljs-class,.hljs-winutils,.bash .hljs-variable,.pf .hljs-variable,.apache .hljs-tag,.hljs-type,.hljs-typename,.tex .hljs-command,.asciidoc .hljs-strong,.markdown .hljs-strong,.hljs-request,.hljs-status,.tp .hljs-data,.tp .hljs-io{font-weight:bold}.asciidoc .hljs-emphasis,.markdown .hljs-emphasis,.tp .hljs-units{font-style:italic}.nginx .hljs-built_in{font-weight:normal}.coffeescript .javascript,.javascript .xml,.lasso .markup,.tex .hljs-formula,.xml .javascript,.xml .vbscript,.xml .css,.xml .hljs-cdata{opacity:0.5}";

GM_addStyle(cssStyle);

var menuCounter = 0;

function SyntaxifyMenu(node) {
    var modified = false;
    var originalNode;
    var currentNode = node;
    
    var menu = document.createElement("menu");
    menu.setAttribute("type", "context");
    menu.setAttribute("id", "SyntaxifyMenu" + menuCounter++);
    
    var menuItem = document.createElement("menuitem");
    menuItem.setAttribute("label", "Syntaxify - Highlight");
    
    
    var toggleHighlight = function() {
        if(modified) {
            var parent = currentNode.parentNode;
            parent.insertBefore(originalNode, currentNode);
            parent.removeChild(currentNode);
            currentNode = originalNode;
            menuItem.setAttribute("label", "Syntaxify - Highlight");
            modified = false;
        } else {
            originalNode = currentNode.cloneNode(true);
            hljs.highlightBlock(currentNode);
            menuItem.setAttribute("label", "Syntaxify - UnHighlight");
            modified = true;
        }
    }
    
    
    menuItem.addEventListener("click", toggleHighlight, false);
    
    menu.appendChild(menuItem);
    return menu;
}

var syntaxableElements = [];
var tagsToSearch = ["pre", "code"];
for(var i=0; i<tagsToSearch.length; i++) {
    var tagsFound = document.getElementsByTagName(tagsToSearch[i]);
    for(var j=0; j<tagsFound.length; j++) {
        syntaxableElements.push(tagsFound.item(j));
    }
}

if(syntaxableElements) {
    for(var i=0; i<(syntaxableElements.length || 0); i++) {
        var element = syntaxableElements[i];
        var parent = element.parentNode;
        var menu = new SyntaxifyMenu(element);
        parent.insertBefore(menu, element);
        element.setAttribute("contextmenu", menu.getAttribute("id"));
    }
}

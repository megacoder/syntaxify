// ==UserScript==
// @name Syntaxify
// @description Universal syntax highlighting
// @namespace http://rob-bolton.co.uk
// @version 1.2
// @include http*
// @grant GM_addStyle
// @grant GM_getResourceText
// @require http://cdnjs.cloudflare.com/ajax/libs/highlight.js/8.6/highlight.min.js
// @resource highlightJsCss https://cdnjs.cloudflare.com/ajax/libs/highlight.js/8.6/styles/monokai.min.css
// ==/UserScript==
//

var tagsToSearch = ["pre", "code"];

GM_addStyle(GM_getResourceText("highlightJsCss"));

var menuCounter = 0;

function wrapSelection() {
    var selection = window.getSelection();
    if(selection.rangeCount && tagsToSearch.indexOf(selection.anchorNode.nodeName) == -1) {
        range = selection.getRangeAt(0);
        if(range) {
            range.surroundContents(new CodeContainer());
        }
    }
}

function CodeContainer() {
    var container = document.createElement("code");
    var menu = addSyntaxMenuForNode(container);
    
    var menuItem = document.createElement("menuitem");
    menuItem.setAttribute("label", "Unwrap code");
    menuItem.addEventListener("click", function(){
        var parent = container.parentNode;
        var newTextNode = document.createTextNode(container.textContent);
        parent.insertBefore(newTextNode, container);
        parent.removeChild(container);
    });
    
    menu.appendChild(menuItem);
    
    return container;
}

function SyntaxifyMenu(node) {
    var modified = false;
    var originalNode;
    var currentNode = node;
    var menu;
    
    var nodeMenuId = node.getAttribute("contextmenu");
    if(!nodeMenuId) {
        menu = document.createElement("menu");
        menu.setAttribute("type", "context");
        menu.setAttribute("id", "SyntaxifyMenu" + menuCounter++);
    } else {
        menu = document.getElementById(nodeMenuId);
    }
    
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

function addSyntaxMenuForNode(node) {
    var menu = new SyntaxifyMenu(node);
    document.body.appendChild(menu);
    node.setAttribute("contextmenu", menu.getAttribute("id"));
    return menu;
}

var syntaxableElements = [];
for(var i=0; i<tagsToSearch.length; i++) {
    var tagsFound = document.getElementsByTagName(tagsToSearch[i]);
    for(var j=0; j<tagsFound.length; j++) {
        syntaxableElements.push(tagsFound.item(j));
    }
}

if(syntaxableElements) {
    for(var i=0; i<(syntaxableElements.length || 0); i++) {
        addSyntaxMenuForNode(syntaxableElements[i]);
    }
}

var body = document.body;
var bodyMenu;
var bodyMenuId = body.getAttribute("contextmenu");
if(!bodyMenuId) {
    bodyMenu = document.createElement("menu");
    bodyMenu.setAttribute("type", "context");
    bodyMenu.setAttribute("id", "SyntaxifyMenuMain");
} else {
    bodyMenu = document.getElementById(bodyMenuId);
}

var wrapItem = document.createElement("menuitem");
wrapItem.setAttribute("label", "Syntaxify - Wrap with <code>");
wrapItem.addEventListener("click", wrapSelection, false);

bodyMenu.appendChild(wrapItem);
body.appendChild(bodyMenu);
body.setAttribute("contextmenu", bodyMenu.getAttribute("id"));

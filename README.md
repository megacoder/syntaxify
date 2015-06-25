# syntaxify
Adds syntax highlighting as a right-click/context menu entry for any `<pre>` and `<code>` and  tags in a page, and allows you to wrap selected text in a page with a `<code>` tag.

Although the current screenshots don't show it, there is now a "Highlight as..." menu entry too, which allows you to set the language to highlight for that block (cancel the "Highlight as..." dialog to revert to auto-detection).

To change the CSS theme, modify the `@require highlightJsCss` line in the script. There are some good themes at [cjdns](http://cdnjs.com/libraries/highlight.js)
Uses the HighlightJS minimal JS and CSS.

## Screenshots
![Context menu when selecting highlightable code](http://i.imgur.com/YTtqRdy.png "Before highlighting")
![Context menu when selecting highlighted code](http://i.imgur.com/rif6dao.png "After highlighting")

/**
 * moves cursor to the end of a [contentEditable] div.
 * may not work on <textArea /> or <input />
 * @param { HTMLDivElement } el a div with contentEditable true
 * @returns { void }
 */
function moveCursorToEnd(el) {
  var range, selection;
  if (document.createRange) {
    //Firefox, Chrome, Opera, Safari, IE 9+
    range = document.createRange(); //Create a range (a range is a like the selection but invisible)
    range.selectNodeContents(el); //Select the entire contents of the element with the range
    range.collapse(false); //collapse the range to the end point. false means collapse to end rather than the start
    selection = window.getSelection(); //get the selection object (allows you to change selection)
    selection.removeAllRanges(); //remove any selections already made
    selection.addRange(range); //make the range you have just created the visible selection
    // @ts-ignore
  } else if (document.selection) {
    //IE 8 and lower
    // @ts-ignore
    range = document.body.createTextRange(); //Create a range (a range is a like the selection but invisible)
    range.moveToElementText(el); //Select the entire contents of the element with the range
    range.collapse(false); //collapse the range to the end point. false means collapse to end rather than the start
    range.select(); //Select the range (make it the visible selection
  }
}

export default moveCursorToEnd;

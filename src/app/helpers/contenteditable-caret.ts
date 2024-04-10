// node_walk: walk the element tree, stop when func(node) returns false
function node_walk(node, func) {
  var result = func(node);
  for (
    node = node.firstChild;
    result !== false && node;
    node = node.nextSibling
  )
    result = node_walk(node, func);
  return result;
}

/**
 * return [start, end] as offsets to elem.textContent that
 * correspond to the selected portion of text
 * (if start == end, caret is at given position and no text is selected)
 */
export function getContentEditableCaretCoordinates(elem): {
  start: number;
  end: number;
} {
  var sel: any = window.getSelection();
  var cum_length = [0, 0];

  if (sel.anchorNode == elem) {
    cum_length = [sel.anchorOffset, sel.focusOffset];
  } else {
    var nodes_to_find = [sel.anchorNode, sel.focusNode];

    if (!elem.contains(sel.anchorNode) || !elem.contains(sel.focusNode)) {
      return {
        start: undefined,
        end: undefined,
      };
    } else {
      var found: any = [0, 0];
      var i;
      node_walk(elem, function (node) {
        for (i = 0; i < 2; i++) {
          if (node == nodes_to_find[i]) {
            found[i] = true;
            if (found[i == 0 ? 1 : 0]) return false; // all done
          }
        }

        if (node.textContent && !node.firstChild) {
          for (i = 0; i < 2; i++) {
            if (!found[i]) cum_length[i] += node.textContent.length;
          }
        }
      });
      cum_length[0] += sel.anchorOffset;
      cum_length[1] += sel.focusOffset;
    }
  }
  let coordinates = {
    start: cum_length[0],
    end: cum_length[1],
  };

  if (cum_length[0] <= cum_length[1]) return coordinates;

  // it's reversed
  coordinates.start = cum_length[1];
  coordinates.end = cum_length[0];

  return coordinates;
}

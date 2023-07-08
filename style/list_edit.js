var rowNumber = null;  // absolute (real) row number
//var idIndex = 1; // always ++'d.

function getLastRowNumberColumn(container)
{
  var items = container.getElementsByTagName("TD");
  var i = items.length-1;

  for (;i>=0;i--)
  {
    if (items[i].id == "lastRowNumber") {
      if (items[i].parentNode.style.display == "none" && // a bug fix when user first removes the last row
          rowNumber == null)
        return items[i];
      if (items[i].parentNode.style.display != "none")
        return items[i];
    }
  }
  return null;
}

/*
 * Use this function to add a new row of template elements.
 */
function domAddRow(containerElement) {
  var container = document.getElementById(containerElement);
  var lastTd = getLastRowNumberColumn(container)
  if (lastTd != null && rowNumber == null)
    rowNumber = parseInt(lastTd.innerHTML, 10) + 1;
  else if (rowNumber == null)
    rowNumber = 1;
  else
    rowNumber++;

  var newRow = getNewRow(container);
  if (container.lastChild.nodeName == "#text")  // DOM compelete support
    container.insertBefore(newRow, container.lastChild.previousSibling);
  else // Explorer 5, 6
    container.insertBefore(newRow, container.lastChild);
  var newLastTd = getLastRowNumberColumn(container);
  if ( lastTd != null )
    newLastTd.innerHTML = parseInt(lastTd.innerHTML, 10) + 1;
  else
    newLastTd.innerHTML = 1;
}

function addIndex(name, index)
{
  if ( name.substring(name.length-3, name.length) == "_0)" ) {
    return name.replace("_0", "_" + index);
  }
  else if ( name.substring(name.length-2, name.length) == "_0" ) {
    return name.replace("_0", "_" + index);
  }
  else
    return name + "_" + index ;

}

/**
 * Used internally by domAddRow. This function reads items (inputs) from an element
 * in the page with the id="template".
 */
function getNewRow(parent) {
  var rowContent = document.getElementById('template').cloneNode(true);
  rowContent.id = 'row' + rowNumber;
  rowContent.style.display = "";
  var inputItems = rowContent.getElementsByTagName("INPUT");
  for (var j = 0; j < inputItems.length; j++)
  {
    inputItems[j].id = addIndex(inputItems[j].id, rowNumber);
    if (inputItems[j].name == "status")
      inputItems[j].value = 'TV';
    else if (inputItems[j].name != "selectedItems" && inputItems[j].name != "altered")
    {
      inputItems[j].name = addIndex(inputItems[j].name, rowNumber);
      inputItems[j].value = "";
    }
  }

  var linkItems = rowContent.getElementsByTagName("A");
  var str;
  for (var j = 0; j < linkItems.length; j++)
  {
    if (linkItems[j].name == "datePicker") {
      linkItems[j].id = addIndex(linkItems[j].id, rowNumber);
      linkItems[j].href = getArgument(0, linkItems[j].href) + "(" + getArgument(1, linkItems[j].href) + ",'" + linkItems[j].id.substring(4) + "')";
      linkItems[j].id = "link_" + linkItems[j].id;
    }
  }

  selectItems = rowContent.getElementsByTagName("SELECT");
  for (var j = 0; j < selectItems.length; j++)
  {
    if (selectItems[j].id.indexOf ("combo_") != -1) { // if <select> element contains "combo_"
      selectItems[j].name = addIndex(selectItems[j].name, rowNumber);
      selectItems[j].id = addIndex(selectItems[j].id, rowNumber);
    }
    else {
      selectItems[j].name = addIndex(selectItems[j].name, rowNumber);
      selectItems[j].id = addIndex(selectItems[j].id, rowNumber);
    }
  }

  return rowContent;
}

/**
 * @return the function input parameters. The should be no , within the parameter itself.
 * Notes:
 * if argCount is 0 then the function name will be returned
 * argCount is counted from 1.
 * funcCallStr should not contain any "," or "(" or ")" except those used for separating arguments and start and finish parentheses
 */
function getArgument(argCount, funcCallStr) {
  if (argCount == 0)
    return funcCallStr.substring(0, funcCallStr.indexOf("("));
  var sIndex = funcCallStr.indexOf("(") + 1;
  var fIndex = funcCallStr.indexOf(",", sIndex);
  var ret = funcCallStr.substring(sIndex, fIndex);

  for(i = 1; i < argCount; i++) {
    sIndex = fIndex + 1;
    fIndex = funcCallStr.indexOf(",", sIndex);
    if (fIndex == -1) {
      fIndex = funcCallStr.lastIndexOf(")");
      ret = funcCallStr.substring(sIndex, fIndex);
      break;
    }
    ret = funcCallStr.substring(sIndex, fIndex);
  }
  return ret
}

function hideElement(element) {
  element.style.display = 'none';

  var childs = element.getElementsByTagName("INPUT");
  for (var i = 0; i < childs.length; i++)
    if (childs[i].name == 'status') {
      if (childs[i].value == 'TV')
        childs[i].value = 'TH';
      else
        childs[i].value = 'PH';
      break;
    }
}

function deleteSelectedRows (containerElement) {
  var container = document.getElementById(containerElement);
  var selection = container.getElementsByTagName('INPUT');

  for (var i = 0; i < selection.length; i++)
    if (selection[i].type == 'checkbox' && selection[i].name == 'selectedItems' && selection[i].checked && selection[i].parentNode.parentNode.style.display!='none')
      break;

  if (i == selection.length) {
    alert('حداقل يك سطر را انتخاب كنيد');
    return;
  }

  if (!confirm('آيا مطمئن هستيد؟')) return;

  var checkBox;
  for (var i = 0; i < selection.length; i++) {
    checkBox = selection[i];
    if (checkBox.name == 'selectedItems' && checkBox.type == 'checkbox')
      if (checkBox.checked) {
//        rowIndex--;
        checkBox.checked = false;
        hideElement(checkBox.parentNode.parentNode); // hide <tr> which is parent of parent of checkbox
      }
  }
  var items = container.getElementsByTagName("TD");
  var myRowIndex = 0;
  for (var i=0;i<items.length;i++)
  {
    if ( items[i].id == "lastRowNumber" && items[i].parentNode.style.display != "none")
      items[i].innerHTML = ++myRowIndex;
  }

  deselectCheckAll();
}

function deselectCheckAll() {
  document.getElementById("selectManager").checked = false;
}

/**
 * This function sets default status hidden inputs' values to Temporary Visible.
 */
function setHiddenInputValue(element) {
  element.value = 'TV';
}

/* selectAll() has been moved to procedure.js */

function replaceId(badId) {
  var startIndex = badId.substring(badId.lastIndexOf("_") + 1);
  var retId = badId.substring(0, badId.lastIndexOf("_") + 1) + (rowNumber + parseInt(startIndex, 10));
  return retId;
}

/**
 * given "salam_0" returns "salam_"
 */
function getWithoutIndex(str) {
  var index = str.lastIndexOf("_");
  if (index != -1)
    return str.substring(0, str.lastIndexOf("_") + 1)
  else
    return "";
}

/**
 * given "salam_0" returns "0"
 */
function getIndex(str) {
  var index = str.lastIndexOf("_");
  if (index != -1)
    return str.substring(str.lastIndexOf("_") + 1)
  else
    return "";
}

/*
function onSelectChange(objectId, comboId) {
  var element = null;
  var itemId;
  var enORdes = true; // true means that textboxes should be disabled (to set <element>.disabled = true)
  var comboPrefix = getWithoutIndex(comboId)
  if (document.getElementById(comboId).selectedIndex == 0)
    enORdes = false;
  for (i = 0; i <= rowNumber; i++) {
    itemId = comboPrefix + i;
    element = document.getElementById(itemId);
    if (!enORdes)
      element.selectedIndex = 0;
  }
  for (i = 0; i <= rowNumber; i++) {
    itemId = "" + objectId + i;
    element = document.getElementById(itemId);
//    alert("item: " + itemId + "  availability: " + element);
    if (element.disabled == enORdes) // if one textbox is disabled/enabled (true/false) then all of them must be disabled before.
      return
    element.disabled = enORdes;
    if (element.disabled)
      element.value="";
  }
}
*/

function onSelectChange(objectId, comboId) {
  var element = null;
  var enORdes = true; // true means that textboxes should be disabled (to set <element>.disabled = true)
  var comboPrefix = getWithoutIndex(comboId);
  var itemIndex = getIndex(comboId);
  element = document.getElementById(objectId + itemIndex)
  if (element == null) return;
  if (document.getElementById(comboId).selectedIndex == 0) {
    element.disabled = false;
  }
  else {
    element.disabled = true;
    element.value = "";
  }
}

function secure_show_calendar(now, name) {
  if (document.getElementById(name).disabled)
    return;
  show_calendar(now, name);
}

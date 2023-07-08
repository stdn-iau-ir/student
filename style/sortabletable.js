// ------------------------------ String Functions
/*
String.prototype.startsWith = function(str) {
	return (this.substr(0, str.length) == str);
};

String.prototype.trim = function(chars) {
	var len = this.length;
	var sIndex = 0, fIndex = len;
    if(!chars) chars = ' ';
	for (var i = 0; i < len; i++) {
		if (chars.indexOf(this.charAt(i)) == -1) break;
		sIndex++;
	}
	for (var i = len - 1; i >= 0; i--) {
		if (chars.indexOf(this.charAt(i)) == -1) break;
		fIndex--;
	}
	return this.substring(sIndex, fIndex);
};

String.prototype.trimString = function() {
	var b = 0;
	var e = this.length - 1;
	while (this.substr(b,1) == " ") b++;
	while (this.substr(e,1) == " ") e--;
	return this.substring(b,e+1);
};
*/

///////////////////////
if(typeof String.prototype.startsWith !== 'function') {
	String.prototype.startsWith = function(str) {
		return (this.substr(0, str.length) == str);
	};
}


if(typeof String.prototype.trim !== 'function') {
  String.prototype.trim = function() {
    return this.replace(/^\s+|\s+$/g, ''); 
  }
}

if(typeof String.prototype.trimString !== 'function') {
	String.prototype.trimString = function() {
		var b = 0;
		var e = this.length - 1;
		while (this.substr(b,1) == " ") b++;
		while (this.substr(e,1) == " ") e--;
		return this.substring(b,e+1);
	};
}

function SortableTable(oTable, oSortTypes) {
	this.sortTypes = oSortTypes || [];
	this.sortColumn = null;
	this.descending = null;

	var oThis = this;
	this._headerOnclick = function (e) {
		oThis.headerOnclick(e);
	};

	if (oTable) {
		this.setTable( oTable );
		this.document = oTable.ownerDocument || oTable.document;
	}
	else {
		this.document = document;
	}


	// only IE needs this
	var win = this.document.defaultView || this.document.parentWindow;
	this._onunload = function () {
		oThis.destroy();
	};
	if (win && typeof win.attachEvent != "undefined") {
		win.attachEvent("onunload", this._onunload);
	}
}
SortableTable.IGNORE_CHARACTERS = "\n\r\t ";
SortableTable.gecko = navigator.product == "Gecko";
SortableTable.msie = /msie/i.test(navigator.userAgent);
// Mozilla is faster when doing the DOM manipulations on
// an orphaned element. MSIE is not
SortableTable.removeBeforeSort = SortableTable.gecko;

SortableTable.prototype.onsort = function () {
	if (SortableTable.msie) {
		var table = this.element;
		var inputs = table.getElementsByTagName("INPUT");
		var l = inputs.length;
		for (var i = 0; i < l; i++) {
			inputs[i].checked = inputs[i].parentNode.parentNode._checked;
		}
	}
};

SortableTable.prototype.onbeforesort = function () {
	if (SortableTable.msie) {
		var table = this.element;
		var inputs = table.getElementsByTagName("INPUT");
		var l = inputs.length;
		for (var i = 0; i < l; i++) {
			inputs[i].parentNode.parentNode._checked = inputs[i].checked;
		}
	}
};

// default sort order. true -> descending, false -> ascending
SortableTable.prototype.defaultDescending = false;

// shared between all instances. This is intentional to allow external files
// to modify the prototype
SortableTable.prototype._sortTypeInfo = {};

SortableTable.prototype.setTable = function (oTable) {
	if ( this.tHead )
		this.uninitHeader();
	this.element = oTable;
	this.setTHead( oTable.tHead );
	this.setTBody( oTable.tBodies[0] );
};

SortableTable.prototype.setTHead = function (oTHead) {
	if (this.tHead && this.tHead != oTHead )
		this.uninitHeader();
	this.tHead = oTHead;
	this.initHeader( this.sortTypes );
};

SortableTable.prototype.setTBody = function (oTBody) {
	this.tBody = oTBody;
};

SortableTable.prototype.setSortTypes = function ( oSortTypes ) {
	if ( this.tHead )
		this.uninitHeader();
	this.sortTypes = oSortTypes || [];
	if ( this.tHead )
		this.initHeader( this.sortTypes );
};

// adds arrow containers and events
// also binds sort type to the header cells so that reordering columns does
// not break the sort types
SortableTable.prototype.initHeader = function (oSortTypes) {
	if (!this.tHead) return;
	var cells = this.tHead.rows[0].cells;
	var doc = this.tHead.ownerDocument || this.tHead.document;
	this.sortTypes = oSortTypes || [];
	var l = cells.length;
	var img, c;
	for (var i = 0; i < l; i++) {
		c = cells[i];
		if (this.sortTypes[i] != "None") {
			if (this.sortTypes[i] != null)
				c._sortType = this.sortTypes[i];
			if (typeof c.addEventListener != "undefined")
				c.addEventListener("click", this._headerOnclick, false);
			else if (typeof c.attachEvent != "undefined")
				c.attachEvent("onclick", this._headerOnclick);
			else
				c.onclick = this._headerOnclick;
		}
		else
		{
			c.setAttribute( "_sortType", oSortTypes[i] );
			c._sortType = "None";

		}
	}
	this.updateHeaderArrows();
};

// remove arrows and events
SortableTable.prototype.uninitHeader = function () {
	if (!this.tHead) return;
	if (!this.tHead.rows.length) return;
	var cells = this.tHead.rows[0].cells;
	var l = cells.length;
	var c;
	for (var i = 0; i < l; i++) {
		c = cells[i];
		if (c._sortType != null && c._sortType != "None") {
			c.removeChild(c.lastChild);
			if (typeof c.removeEventListener != "undefined")
				c.removeEventListener("click", this._headerOnclick, false);
			else if (typeof c.detachEvent != "undefined")
				c.detachEvent("onclick", this._headerOnclick);
			c._sortType = null;
			c.removeAttribute( "_sortType" );
		}
	}
};

SortableTable.prototype.updateHeaderArrows = function () {
  if (!this.tHead) return;

  var THs = this.tHead.rows[0].cells;
  var l = THs.length;
  for (var i = 0; i < l; i++) {
    var header = THs.item(i);
    if (i == this.sortColumn)
      if (header.className=="clickedColumnAsc")
        header.className = "clickedColumnDes";
      else if (header.className=="clickedColumnDes")
        header.className = "clickedColumnAsc";
      else
        header.className = "clickedColumnAsc";
      else if (header.className=="_clickedColumnAsc" || header.className=="_clickedColumnDes")
        header.className = header.className.substr(1);
      else if (header.className=="clickedColumnAsc" || header.className=="clickedColumnDes")
        header.className = "sortableColumn";
  }
/*	var cells = this.tHead.rows[0].cells;
	var l = cells.length;
	var img;
	for (var i = 0; i < l; i++) {
		if (cells[i]._sortType != null && cells[i]._sortType != "None") {
			img = cells[i].lastChild;
			if (i == this.sortColumn)
				img.className = "sort-arrow " + (this.descending ? "descending" : "ascending");
			else
				img.className = "sort-arrow";
		}
	}*/
};

SortableTable.prototype.headerOnclick = function (e) {
  // find TH element
  var el = e.target || e.srcElement;
  while (el.tagName != "TH")
    el = el.parentNode;
  if (el.className == "sortableColumn" || el.className == "clickedColumnAsc" ||
      el.className == "clickedColumnDes")
    this.sort(SortableTable.msie ? SortableTable.getCellIndex(el) : el.cellIndex);
};

// IE returns wrong cellIndex when columns are hidden
SortableTable.getCellIndex = function (oTd) {
	var cells = oTd.parentNode.childNodes
	var l = cells.length;
	var i;
	for (i = 0; cells[i] != oTd && i < l; i++)
		;
	return i;
};

SortableTable.prototype.getSortType = function (nColumn) {
	return this.sortTypes[nColumn] || "String";
};


// only nColumn is required
// if bDescending is left out the old value is taken into account
// if sSortType is left out the sort type is found from the sortTypes array
SortableTable.prototype.sort = function (nColumn, bDescending, sSortType) {
	if (!this.tBody) return;
	if (sSortType == null)
		sSortType = this.getSortType(nColumn);

	// exit if None
	if (sSortType == "None")
		return;

	if (bDescending == null) {
		if (this.sortColumn != nColumn)
			this.descending = this.defaultDescending;
		else
			this.descending = !this.descending;
	}
	else
		this.descending = bDescending;

	this.sortColumn = nColumn;

	if (typeof this.onbeforesort == "function")
		this.onbeforesort();

	var f = this.getSortFunction(sSortType, nColumn);
	var a = this.getCache(sSortType, nColumn);
	var tBody = this.tBody;

	a.sort(f);

	if (this.descending)
		a.reverse();

	if (SortableTable.removeBeforeSort) {
		// remove from doc
		var nextSibling = tBody.nextSibling;
		var p = tBody.parentNode;
		p.removeChild(tBody);
	}

        // insert in the new order
	var l = a.length;
	for (var i = 0; i < l; i++)
		tBody.appendChild(a[i].element);

	if (SortableTable.removeBeforeSort) {
		// insert into doc
		p.insertBefore(tBody, nextSibling);
	}

	this.updateHeaderArrows();

	this.destroyCache(a);

	reHighlight(tBody);

	if (typeof this.onsort == "function")
		this.onsort();
};

SortableTable.prototype.asyncSort = function (nColumn, bDescending, sSortType) {
	var oThis = this;
	this._asyncsort = function () {
		oThis.sort(nColumn, bDescending, sSortType);
	};
	window.setTimeout(this._asyncsort, 1);
};

SortableTable.prototype.getCache = function (sType, nColumn) {
	if (!this.tBody) return [];
	var rows = this.tBody.rows;
	var l = rows.length;
	var a = new Array(l);
	var r;
	for (var i = 0; i < l; i++) {
		r = rows[i];
		a[i] = {
			value:		this.getRowValue(r, sType, nColumn),
			element:	r
		};
	};
	return a;
};

SortableTable.prototype.destroyCache = function (oArray) {
	var l = oArray.length;
	for (var i = 0; i < l; i++) {
		oArray[i].value = null;
		oArray[i].element = null;
		oArray[i] = null;
	}
};

SortableTable.prototype.getRowValue = function (oRow, sType, nColumn) {
	// if we have defined a custom getRowValue use that
	if (this._sortTypeInfo[sType] && this._sortTypeInfo[sType].getRowValue)
		return this._sortTypeInfo[sType].getRowValue(oRow, nColumn);

	var s;
	var c = oRow.cells[nColumn];
	if (sType == "Boolean") 
		s = c.innerHTML.trim(SortableTable.IGNORE_CHARACTERS);
	else if (typeof c.innerText != "undefined")
		s = c.innerText.trim(SortableTable.IGNORE_CHARACTERS);
	else
		s = SortableTable.getInnerText(c).trim(SortableTable.IGNORE_CHARACTERS);
		
	x = this.getValueFromString(s, sType);
	return x;
};

SortableTable.getInnerText = function (oNode) {
	var s = "";
	var cs = oNode.childNodes;
	var l = cs.length;
	for (var i = 0; i < l; i++) {
		switch (cs[i].nodeType) {
		case 1: //ELEMENT_NODE
			s += SortableTable.getInnerText(cs[i]);
			break;
		case 3:	//TEXT_NODE
			s += cs[i].nodeValue;
			break;
		}
	}
	return s;
};

SortableTable.prototype.getValueFromString = function (sText, sType) {
	if (this._sortTypeInfo[sType])
		return this._sortTypeInfo[sType].getValueFromString( sText );
	return sText;
};

SortableTable.prototype.getSortFunction = function (sType, nColumn) {
	if (this._sortTypeInfo[sType])
		return this._sortTypeInfo[sType].compare;
	return SortableTable.basicCompare;
};

SortableTable.prototype.destroy = function () {
	this.uninitHeader();
	var win = this.document.parentWindow;
	if (win && typeof win.detachEvent != "undefined") {	// only IE needs this
		win.detachEvent("onunload", this._onunload);
	}
	this._onunload = null;
	this.element = null;
	this.tHead = null;
	this.tBody = null;
	this.document = null;
	this._headerOnclick = null;
	this.sortTypes = null;
	this._asyncsort = null;
	this.onsort = null;
};

// Adds a sort type to all instance of SortableTable
// sType : String - the identifier of the sort type
// fGetValueFromString : function ( s : string ) : T - A function that takes a
//    string and casts it to a desired format. If left out the string is just
//    returned
// fCompareFunction : function ( n1 : T, n2 : T ) : Number - A normal JS sort
//    compare function. Takes two values and compares them. If left out less than,
//    <, compare is used
// fGetRowValue : function( oRow : HTMLTRElement, nColumn : int ) : T - A function
//    that takes the row and the column index and returns the value used to compare.
//    If left out then the innerText is first taken for the cell and then the
//    fGetValueFromString is used to convert that string the desired value and type

SortableTable.prototype.addSortType = function (sType, fGetValueFromString, fCompareFunction, fGetRowValue) {
	this._sortTypeInfo[sType] = {
		type:				sType,
		getValueFromString:	fGetValueFromString || SortableTable.idFunction,
		compare:			fCompareFunction || SortableTable.basicCompare,
		getRowValue:		fGetRowValue
	};
};

// this removes the sort type from all instances of SortableTable
SortableTable.prototype.removeSortType = function (sType) {
	delete this._sortTypeInfo[sType];
};

SortableTable.prototype.cmp = function (ch1, ch2) {
	var ARABIC_BEH = 0x628;
	var ARABIC_JEEM = 0x62c;
	var ARABIC_ZAIN = 0x632;
	var ARABIC_KAF = 0x643;
	var ARABIC_VAV = 0x648;
	var ARABIC_HEH = 0x647;
	var ARABIC_YEH = 0x64a;

	var FARSI_PEH = 0x67e;
	var FARSI_TCHEH = 0x686;
	var FARSI_JEH = 0x698;
	var FARSI_KEHEH = 0x6a9;
	var FARSI_GAF = 0x6af;

	var i1 = ch1.charCodeAt(0)
	var i2 = ch2.charCodeAt(0)

	if (i1 == FARSI_PEH) i1 = ARABIC_BEH + 0.5;

	if (i1 == FARSI_TCHEH) i1 = ARABIC_JEEM + 0.5;
	else if (i1 == FARSI_JEH) i1 = ARABIC_ZAIN + 0.5;
	else if (i1 == FARSI_KEHEH) i1 = ARABIC_KAF + 0.5;
	else if (i1 == FARSI_GAF) i1 = ARABIC_KAF + 0.6;
	else if (i1 == ARABIC_HEH) i1 = ARABIC_YEH - 0.5;
	else if (i1 == ARABIC_VAV) i1 = ARABIC_HEH - 0.5;

	if (i2 == FARSI_PEH) i2 = ARABIC_BEH + 0.5;
	else if (i2 == FARSI_TCHEH) i2 = ARABIC_JEEM + 0.5;
	else if (i2 == FARSI_JEH) i2 = ARABIC_ZAIN + 0.5;
	else if (i2 == FARSI_KEHEH) i2 = ARABIC_KAF + 0.5;
	else if (i2 == FARSI_GAF) i2 = ARABIC_KAF + 0.6;
	else if (i2 == ARABIC_HEH) i2 = ARABIC_YEH - 0.5;
	else if (i2 == ARABIC_VAV) i2 = ARABIC_HEH - 0.5;

	return 10 * (i1 - i2);
};

SortableTable.basicCompare = function compare(n1, n2) {
	var str1 = n1.value;
	var str2 = n2.value;
	var l1 = str1.length;
	var l2 = str2.length;
	var res = 0;
	for (i = 0; i < l1 && i < l2 && res == 0; i++) {
		res = SortableTable.prototype.cmp(str1.charAt(i), str2.charAt(i));
		if (res != 0)
			return res;
	}
	if (l1 == l2)
		return 0;
	else if (l1 < l2)
		return -1;
	return 1;
};

SortableTable.idFunction = function (x) {
	return x;
};

SortableTable.toUpperCase = function (s) {
	return s.toUpperCase();
};

SortableTable.toDate = function (s) {
	var parts = s.split("-");
	var d = new Date(0);
	d.setFullYear(parts[0]);
	d.setDate(parts[2]);
	d.setMonth(parts[1] - 1);
	return d.valueOf();
};

SortableTable.toBoolean = function (s) {
	if (s.indexOf("true.gif") != -1) 
		return true;
	else 
		return false;
};

SortableTable.numberCompare = function compare(n1, n2) {
	if (n1.value < n2.value)
		return -1;
	if (n2.value < n1.value)
		return 1;
	return 0;
};

SortableTable.booleanCompare = function compare(n1, n2) {
	if (n1.value == true &&  n2.value == false)
		return -1;
	if (n1.value  == false && n2.value == true)
		return 1;
	return 0;
};

// add sort types
SortableTable.prototype.addSortType("Number", Number, SortableTable.numberCompare);
SortableTable.prototype.addSortType("CaseInsensitiveString", SortableTable.toUpperCase);
SortableTable.prototype.addSortType("Date", SortableTable.toDate);
SortableTable.prototype.addSortType("String");
SortableTable.prototype.addSortType("Boolean", SortableTable.toBoolean, SortableTable.booleanCompare);


/**
 * This function will get a tbody, and sets class="evenRow" and class="oddRow"
 * to TRs respectively
 */
function reHighlight(tab) {
	var tr = tab.getElementsByTagName("TR");
	var i;
	for (i = 0; i < tr.length; i += 2) {
		if (tr[i].className == "even" || tr[i].className == "odd")
			tr[i].className = "even";
		else
			tr[i].className = "even-selected";
	}
	for (i = 1; i < tr.length; i += 2) {
		if (tr[i].className == "even" || tr[i].className == "odd")
			tr[i].className = "odd";
		else
			tr[i].className = "odd-selected";
  }
}

/**
 * Determines if all of a table's column elements are number
 *
 * @param {HTMLTableElement} tb
 * @param {Number} colNo
 */
function isNumberCol(tb, colNo) {
	if (!tb.tBodies[0]) false;
	var rows = tb.tBodies[0].rows;
	var l = rows.length;
	if (rows.length <= 0 || rows[0].cells.length <= colNo) return;
	for (var i = 0; i < l; i++) {
		col = rows[i].cells[colNo];
		c = col.innerText != undefined ? col.innerText : col.textContent;
		if (c.trim(SortableTable.IGNORE_CHARACTERS) == "") continue;
		if (!isNaN(Number(c))) continue;
		return false;
	}
	return true;
}

function isBooleanCol(tb, colNo) {
	if (!tb.tBodies[0]) false;
	var rows = tb.tBodies[0].rows;
	var l = rows.length;
	if (rows.length <= 0 || rows[0].cells.length <= colNo) return;
	for (var i = 0; i < l; i++) {
		col = rows[i].cells[colNo];
		c = col.innerHTML != undefined ? col.innerHTML : col.textContent;
		if (c.trim(SortableTable.IGNORE_CHARACTERS) == "") continue;
		if (c.indexOf("true.gif") != -1 || c.indexOf("false.gif") != -1) continue;
		return false;
	}
	return true;
}

/**
 * A call to this function will install a sortable table for the table with id=tbId
 * @param {String} tbId
 */
function installSortableTable(tbElem) {
	if (!tbElem) return null;
	if (!tbElem.tBodies) return null;
	if (tbElem.tBodies[0].rows.length <= 1) return;
	var ths = tbElem.getElementsByTagName('TH');
	var typeArray = [];
	for (var i = 0; i < ths.length; i++) {
		if (ths[i].className != "sortableColumn")
			typeArray.push("None");
		else if (isBooleanCol(tbElem, i))
			typeArray.push("Boolean");	
		else if (isNumberCol(tbElem, i))
			typeArray.push("Number");
		else
			typeArray.push("String");
	}
	return new SortableTable(tbElem, typeArray);
}

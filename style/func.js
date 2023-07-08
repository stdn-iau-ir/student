function Toggle(e)
    {
	
	if (e.checked) {
	    Highlight(e);
	}
	else {
	    Unhighlight(e);
	}
}

function ToggleAll(e)
    {
	if (e.checked) {
	    CheckAll();
	}
	else {
	    ClearAll();
	}
}

function   goBackAndRefreshIfPossible(frm) {
  		if(typeof document.referrer ==  "undefined" ) //damn IE
  			window.history.back();
  		else 
  			window.location.href = document.referrer;
 }


/*
* mohammad
* is used for manage checkbox list in listbody page and ...
* when user clicked  'select all checkbox', this function called
*
* <Mohsen>
* DEPRICATED: Use selectAll() instead (defined in procedure.js).
* </Mohsen>
*/
function masterEvent(masterObj, detailsName) {
  	var ml = document.getElementsByName(detailsName);
  	var len = ml.length;

  	if (!masterObj.checked) {
    	for (i = 0; i < len; i++) {
      		var e = ml[i];
      		Clear(e);
    	}
  	} else {
  		for (i = 0; i < len; i++) {
      		var e = ml[i];
      		Check(e);
		}
    }
}

/*
* mohammd
* when a checkbox in listbody clicked this function called for control the number of checkboxes that check
*/

function detailEvent(masterName, detailsName, detailObj) {
  	var mList = document.getElementsByName(masterName);
   	var dsList = document.getElementsByName(detailsName);
   	var allChecked = true;

  	if (detailObj.checked == false) {
    	Clear(detailObj);

    	if (mList) {
      		mList[0].checked = false;
    	}
  	} else {
    	Check(detailObj);

    	if (dsList != null) {
      		for (i = 0; i < dsList.length; i++) {
        		var e = dsList[i];
        		if (!e.checked) {
          			allChecked = false;
          			break;
        		}
      		}
      		mList[0].checked = allChecked;
    	}
	}
}

function CheckAll()
    {
/*	var ml = document.getElementsByName("SelectAll");
	var len = ml.length;
	for (var i = 0; i < len; i++) {
	    var e = ml[i];
		Check(e);
	}*/
	var ml = document.getElementsByName("selectedItems");
	var len = ml.length;
	for (var i = 0; i < len; i++) {
	    var e = ml[i];
		Check(e);
	}
}

function ClearAll()
    {
/*	var ml = document.getElementsByName("SelectAll");
	var len = ml.length;
	for (var i = 0; i < len; i++) {
	    var e = ml[i];
		Clear(e);
	}*/
	var ml = document.getElementsByName("selectedItems");
	var len = ml.length;
	for (var i = 0; i < len; i++) {
	    var e = ml[i];
		Clear(e);
	}
}

function Check(e)
    {
	e.checked = true;
	Highlight(e);
}

function Clear(e)
    {
	e.checked = false;
	Unhighlight(e);
}

function Highlight(e)
    {
	var r = null;
	r = e.parentNode.parentNode;
    if(r) dojo.addClass(r, 'selected');
}

function Unhighlight(e)
    {
	var r = null;
	r = e.parentNode.parentNode;
    if(r) dojo.removeClass(r, 'selected');
}

/*
* mohammad
* This function toggles the visibility state of the panel componnent
* used to show or hide the details of a topic
*/
function toggleShowHide(panel_id) {
  if (document.getElementById("panel_" + panel_id).style.display == 'none') {
    document.getElementById("panel_" + panel_id).style.display = '';
    document.getElementById("show_" + panel_id).style.display = 'none';
    document.getElementById("hide_" + panel_id).style.display = '';
  } else {
    document.getElementById("panel_" + panel_id).style.display = 'none';
    document.getElementById("hide_" + panel_id).style.display = 'none';
    document.getElementById("show_" + panel_id).style.display = '';
  }
}

/*
* mohammad
* used in masterDetail pages and MDCommandBarTag for submit form to MasterDetailActionHandler
*/

function setDispatch(action, formName, dispatch, need2Confirm, message) {
  if (need2Confirm == 'true') {
    if (!confirm(message)) {
      return;
    }
  }
  theForm = document.getElementById(formName);
  if (theForm.dispatch != null)
    theForm.dispatch.value = dispatch;
  theForm.action = action;
//  theForm.submit();
  //gotoUrl(theForm,action);
  submitForm(theForm);
}


/* will fix opacity problem with all png files in the document */
function fixPng() {
  if (window.ie55up) {
    var images = document.images;
    for (i = 0; i < images.length; i++) {
      myImage = images.item(i);
      if (myImage.mimeType=="PNG Image") {
        var img = new Image(); img.src = myImage.src;
        var w = img.width;
        var h = img.height;
        myImage.style.cssText += (";filter:progid:DXImageTransform.Microsoft.AlphaImageLoader" +
        "(src=\'" + myImage.src + "\', sizingMethod='scale');");
        myImage.src="Pages/images/icons/blank.gif";
        myImage.width = w;
        myImage.height = h;
      }
    }
  }
}

function menuMouseOver(o, msg, c) {
  if (o.className == "selectedMenuGroup") return false;
  o.className=c;
  window.status = msg;
}

function menuMouseOut(o, c) {
  if (o.className == "selectedMenuGroup") return false;
  o.className=c;
  window.status = "";
}

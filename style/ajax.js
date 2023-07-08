function getHTTPObject() {
  var xmlhttp;
  /*@cc_on
  @if (@_jscript_version >= 5)
    try {
      xmlhttp = new ActiveXObject("Msxml2.XMLHTTP");
    } catch (e) {
      try {
        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
      } catch (E) {
        xmlhttp = false;
      }
    }
  @else
  xmlhttp = false;
  @end @*/
  if (!xmlhttp && typeof XMLHttpRequest != 'undefined') {
    try {
      xmlhttp = new XMLHttpRequest();
    } catch (e) {
      xmlhttp = false;
    }
  }
  return xmlhttp;
}
var http = getHTTPObject(); // We create the HTTP Object

var __servlet = "ajaxCallServlet"
var __msgUrl = __servlet + "?a=msg";
var __searchUrl = __servlet + "?a=search";
var __operationalUrl = "operationalProps"
var args = new Array(); // a global variable to hold callback method's arguments

function doAjax(callBack, url, paramStr) {
  args = new Array();
  if (arguments.length >= 3) {
    for(i = 3; i < arguments.length; i++)
      args.push(arguments[i]);
    var obj = document.getElementById(arguments[3]);
    obj.style.cursor = 'wait';
  }
  if (paramStr != null)
    url += paramStr;
  http.open("GET", url, true);
  http.onreadystatechange = callBack;
  http.send(null);
}
	
	

function fillCombo() {
  try {
    if (http.readyState == 4 && http.status == 200) { // fully received (4) and is OK (200)
      var resultDoc = http.responseXML.documentElement;
      var items = resultDoc.childNodes;
      var combo = document.getElementById(args[0]);

      for (i = combo.childNodes.length-1; i > 0; i--) {
        combo.remove(i);
      }
      for (i = 0; i < items.length; i++) {
        var item = items[i];
        if ( item.nodeName != "#text" ) {
          var opt = document.createElement('OPTION');
          //opt.setAttribute("innerHTML", item.getAttribute("label"));
          opt.text = item.getAttribute("label");
          //opt.setAttribute("value", item.getAttribute("value"));
          opt.value = item.getAttribute("value");
          if (navigator.appName=="Netscape")
            combo.appendChild(opt);
          else
            combo.options.add(opt);
        }
      }
      combo.style.cursor = '';
    }
  } catch (err) {
//      alert(err);
  }
}

function handleResponse4Msg() {
  try {
    if (http.readyState == 4 && http.status == 200) {
      result = http.responseText;
      element = document.getElementById('messageBoardWrapper');
      // FIXIT: 10 < result.length < 2000
      if (element != null && result.length > 10 && result.length < 2000) {
        element.innerHTML = result;
      }
    }
  } catch (err) {
//      alert(err);
  }
}

function processReqChange(callBack) {
  // only if req shows "loaded"
  if (req.readyState == 4) {
    // only if "OK"
    if (req.status == 200) {
      // ...processing statements go here...
      if (callback != null)
        callback ();
    } else {
//      alert("There was a problem retrieving the XML data:\n" + req.statusText);
    }
  }
}

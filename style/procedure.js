

var x="اخطار امنیتی: تلاش برای دسترسی غیر مجاز به این سیستم می تواند عواقب قانونی برای متخلف در بر داشته باشد";
if (!String.prototype.startsWith) {
  String.prototype.startsWith = function(searchString, position) {
    position = position || 0;
    return this.indexOf(searchString, position) === position;
  };
}

var timeValidationMessage = "لطفا ساعت و دقیقه را به نحو صحیح و با معنی وارد نمایید.";
var VALIDATION = {number: ["لطفا يک عدد وارد نماييد.", /^\d*$/],
				  newnumber: ["لطفا يک عدد وارد نماييد.", /^(\-)*\d*(\.)*\d*$/],
  				  newnumber2: ["لطفا يک عدد وارد نماييد.", /^((\-)\d*(\.)\d*)|(\d*(\.)\d*)|((\-)\d*)|(\d*)$/],				  
  				  newnumber3: ["لطفا يک عدد وارد نماييد.", /^(\-)?([1-9][0-9]{0,2}(,[0-9]{3})*)(\.)?\d*$/],	
                  alphanum: ["لطفا عدد يا حرف وارد نماييد.", /^([a-zA-Z0-9 ؀-܀])*$/],
                  alpha: ["لطفا يک رشته حرفي وارد نماييد.", /^(([a-zA-Z ؀-܀]))*$/],
                  alphae: ["لطفا يک رشته حرفي انگليسي وارد نماييد.", /^(([a-zA-Z ]))*$/],
                  alphap: ["لطفا يک رشته حرفي فارسي وارد نماييد.", /^(([ ؀-܀]))*$/],
                  text: ["لطفا يک متن وارد نماييد.", /^(([a-zA-Z ؀-܀.;-؛،.]))*$/],
                  texte: ["لطفا يک متن انگليسي وارد نماييد.", /^(([a-zA-Z .;-]))*$/],
                  textp: ["لطفا يک متن فارسي وارد نماييد.", /^(([ ؀-܀.،؛-]))*$/],
                  email: ["آدرس پست الکترونيکي صحيح نمي باشد.", /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/],
                  number1: ["لطفا يک عدد يک رقمي وارد نماييد.", /^\d{1}$/],
                  number2: ["لطفا يک عدد دو رقمي وارد نماييد.", /^\d{2}$/],
                  number3: ["لطفا يک عدد دو رقمي وارد نماييد.", /^\d{3}$/],
                  number4: ["لطفا يک عدد 4 رقمي وارد نماييد.", /^\d{4}$/],
                  number5: ["لطفا يک عدد 5 رقمي وارد نماييد.", /^\d{5}$/],
                  number6: ["لطفا يک عدد 6 رقمي وارد نماييد.", /^\d{6}$/],
                  number7: ["لطفا يک عدد 6 رقمي وارد نماييد.", /^\d{7}$/],
                  number8: ["لطفا يک عدد 6 رقمي وارد نماييد.", /^\d{7}$/],
                  number9: ["لطفا يک عدد 9 رقمي وارد نماييد.", /^\d{9}$/],
                  number10: ["لطفا يک عدد 10 رقمي وارد نماييد.", /^\d{10}$/],
                  number46: ["لطفا يک عدد 4 تا 6 رقمي وارد نماييد.", /^\d{4,6}$/],
                  alphanump: ["لطفا عدد يا حرف وارد نماييد.", /^([0-9 ؀-܀])*$/],
                  tel: ["لطفا يک عدد 11 رقمي وارد کنيد که با 0 آغاز شود.", /^[0]\d{10}$/],
                  date: ["لطفا يك تاريخ با فرمت yyyy/mm/dd وارد نماييد.", /^\d{4}\/\d{2}\/\d{2}$/],
                  floatnumber:["لطفا يک عدد اعشاري وارد نماييد. استفاده از / غیر مجاز است. برای نمایش اعشار از نقطه استفاده کنید.", /^((\d+(\.\d*)?)|((\d*\.)?\d+))$/],
                  HoursAndMinutes:[ timeValidationMessage , /([01]\d|2[0-3]):([0-5]\d)/]
  
};



function getParentForm(element) {
	//alert(element);
	//  var e = $(element);//element not element.id
	//  alert (element.type);
	//  alert (element.value);
	  var form = element.form;
	//  alert(form);
	  return form;
	}

var mandatoryAlert = "لطفا مقدار فيلد را وارد/انتخاب نماييد.";

var imgRelativePath = "Pages/images/";
var returnAddressForSelect = "";

var __sindex__ = 0;
var __combo_to_select__ = null;

function ShowDetail(URL) {
day = new Date();
id = day.getTime();
eval(id + " = window.open(URL, '" + id + "', 'toolbar=0,scrollbars=0,location=0,statusbar=0,menubar=0,resizable=0,width=400,height=300,left = 312,top = 150');");
}

var head="display:''";
function toggleMenu(thisObj,menu_id,menu_size)
{
  var i;
  var submenuObject = document.getElementById("submenu_"+menu_id);

  if (submenuObject.style.display == "none") {
    // fold all menu groups
    for (i = 0; i < menu_size; i++) {
      var mitem = document.getElementById("submenu_"+i) ;
      mitem.style.display = "none";
      var mgrp = document.getElementById("mg_"+i);
      mgrp.className="menuGroup";
    }
    submenuObject.style.display = "";
    thisObj.className = "selectedMenuGroup";
  } else {
    submenuObject.style.display = "none";
    thisObj.className = "menuGroup";
  }
}

function nodeClick(form, evt, eSrc, id, open, closed ) {
  var eSpan = document.getElementById('span'+id);
  eSpan.className = (eSpan.className=='clsShow') ? 'clsHide' : 'clsShow';
  var eImg = document.getElementById('img'+id);
  if( eSpan.className=='clsHide' ) {
    eImg.src = imgRelativePath + open;
    form.treeOperation.value = "closed";
//    return false;
  }
  else {
    eImg.src = imgRelativePath + closed;
    form.treeOperation.value = "opened";
  }
  form.getAttributeNode('id').value = id;
//  return true;
}


function MakeHref(href){
	var firstPart=href;
	var qry =firstPart.indexOf('?',0);
	if(qry>0)
		firstPart=href.substring(0,qry);

	var s=firstPart.split("/");
	var len=s.length;
	if ( len <=0 ){
		alert("Error. Check with Admin: Action empty!");
		return "";
	}
	var URI=s[len-1];
	if(qry>0)
		URI=URI.concat(href.substring(qry,href.length));
	if (!KG(null)) return "" ;
	var y=zzh2;
	if (!(zzs && y) ) {
		alert("!!!!!!!!!!!!!Errrrooooorrrrrr!!!!!!");
		return "";
		}
	var token;
	var idx=URI.indexOf("?", 0);
	if (idx > 0) {
		href = href.concat ("&_H2__=".concat(y) );
		token = URI.substring(0, idx).concat("&".concat(URI.substring(idx+1, URI.length))).concat("&".concat(zzs));//URI.concat(zzs) ;//????????????zzs.concat(y)
	}
	else{
		href = href.concat ("?_H2__=".concat(y) );
		token = URI.concat("&".concat(zzs));
	}
		
	var hsh=genHash(token,y);
	href = href.concat("&_H1__=".concat(hsh));
	return href;
}

function popHref( href , width, height) {
	href = MakeHref(href); 
	if (href != "")
		openWindow( href, width, height);
	return false;
}

function GotoHref(href){
	//alert(href);
	if (href.indexOf('ajax=true')> 0) {
		//alert ("here1");
		getAjaxUrl( href);
		return;
	}

	href=MakeHref(href) ;
	window.location.href = href;
	return false;
}


function testForAjaxThenSubmit (frm){
	if (!frm.action){
		alert("Error: Form with empty action  detected!" ) ;
		return;
	}
	if ( frm.action.indexOf('ajax=true') < 0  || ( typeof frm.ajax == "undefined" ) ){
		if ( frm.action.indexOf('?' ) < 0 ) 
				frm.action += "?ajax=true" ;
		else
				frm.action += "&ajax=true" ;
	} 
	submitForm(frm);
	
}

function submitFormPrompted(frm,arg1,arg2) {
	var prompt = arg1; // 3th argument
	if (prompt == "MESSAGE") {
	  alert(arg1);
	} else if (prompt == "CONFIRM") {
	if (!confirm(arg2))
	   return false;
	}
	submitForm(frm)	
}

function submitForm(frm) {
	if (frm['doValidation']) 
		if (!frm['doValidation'].call(this)) 
			return false;
  var ee = "";
  
  try{
	//  alert("submitForm: \n Being called!")
	 if (!disableOnS(frm)){
			//alert("Failed!");
		  return false;
	  }
	 disableOnClick(frm);
  }
  catch(ee){
	  alert(ee);
	  return false
	  }
 // alert(frm.target);
 //alert("submitForm: \n Going to submit!");
  frm.submit();
  return true;
}

function resetForm(form) { form.reset(); } ;

function disableOnClick(form) {
	if (form.target != "_blank") {
		for (i=0; i < form.elements.length; i++) {
			if (form.elements[i].type == "submit" ||
				form.elements[i].type == "reset" ||
				form.elements[i].type == "button") {
				form.elements[i].disabled = true;
			}
		}
		var anchors = document.getElementsByName("rowLink");
		for (i=0; i < anchors.length; i++) {
			anchors[i].style = "pointer-events: none";
		}
	}
}

function fce(theForm, key, value) {
    // Create a hidden input element, and append it to the form:
    var inp = document.createElement('input');
    inp.type = 'hidden';
    inp.name = key;
    inp.id = key;
    inp.value = value;
    if (theForm !== null )
    	theForm.appendChild(inp);
    else
    	 document.body.appendChild(inp);
}
var _ReqTest = false;
var _srv = 'GSrv';
var Phttp="";

function getSync(M,s) {
	
	if (!Phttp){
		Phttp =new  XMLHttpRequest(); // We create the HTTP Object		
		if (!Phttp) {alert("http not initialized!") ;
		return false;}
		}
	try {
		if (arguments.length < 2) s = _srv ;
		Phttp.open(M, s, false);
        Phttp.withCredentials = true;
	  	Phttp.send();
	while (Phttp.readyState !== 4 ){};
		if(Phttp.status !== 200) {
			alert("Service Not available!!");
			return false;
			}
	  	}
	catch (err) {
		alert (err) ; 
		return false  ;
	  	}

	return true ; 
	}






var zzs = "";
var zzh1="";
var zzh2="";
		
function KG(form){ 
	if (!document.getElementById("_H2__") && form != null ) {
			fce(form, "_H1__","");
			fce(form, "_H2__","");
			}
	if (!getSync("GET", "SecServ.jsp")) return false;
	var stra = Phttp.responseText;
	if(!stra){
		alert("No response from server");
		return false;
	}
	
	var rObj;
	try{
		rObj=JSON.parse(stra);
	}
	catch(e){
		alert ("خطا در دسترسی به سرور: احتمال دارد زمان اتصال شما منقضی شده باشد." + "\n");
		window.location.replace(document.referrer);
		return;
	}
	if(!rObj){
		return false;
		}
	zzs = rObj.s ;
	zzh2= rObj.h ;
	if ( document.getElementById("_H2__") )
		document.getElementById("_H2__").value = rObj.h ;
	return true; 
}

function jHash(str) {
	  var hash = 0, i, chr, len;
	  if (str.length == 0) return hash;
	  for (i = 0, len = str.length; i < len; i++) {
	    chr   = str.charCodeAt(i);
	    hash  = ((hash << 5) - hash) + chr;
	    hash |= 0; 
	  }
	  return hash;
	}
function revertEncodedSigns(str){
	//%7E%21%40%23%24%25%5E%26*%28%29
	//~!%40%23%24%25%5E%26*()
	  var res = str;
	  res = res.replace("%7E", "~") ; 
	  res = res.replace("%21", "!") ; 
	  res = res.replace("%28", "(") ; 
	  res = res.replace("%29", ")") ; 

	  return res;
}

function genHash( s, key){
	var tst11 = "" ;
	var h=0;
	srl = s.split("&");
	var l=srl.length;
	for(var i=0;i<l;i++){
		if(!(srl[i].startsWith("returnAddress=") || srl[i].startsWith("selectForward=") ||
				srl[i].startsWith("_H2__=") || srl[i].startsWith("_H1__=")  ||
				srl[i].startsWith("operation=") || srl[i].startsWith("parameter(title)=") ||
				srl[i].startsWith("selectedItems=")|| srl[i].startsWith("value(body)=")) ){
					h=h+jHash(srl[i])%127*key;
					tst11=tst11+"&"+srl[i];						
		}
	}
	//alert(tst11);
	return h%100000;
}


function disableOnS( frm ) {
	
	var firstPart=frm.action;
	if (firstPart.indexOf("ajax=true") > 0 || (frm.ajax && frm.ajax.value == "true" )){
		var frmId = frm.getAttribute("id");
		if (!frmId)
			frmId = frm.name;
		postAjaxForm(frmId);
		return;
	}
	var qry =firstPart.indexOf('?',0);
	if(qry>=0)
	{
		firstPart=frm.action.substring(0,qry);
	}
	var s=firstPart.split("/");
	var len=s.length;
	if ( len <=0 ){
		alert("Action empty!");
		return false;
	}
	//var URI='/'+ s[len-2]+'/'+s[len-1];
	var URI=s[len-1];
	if(qry>=0)
		URI=URI.concat(frm.action.substring(qry,frm.action.length));
	if (!KG(frm)) return false ;
	var y=document.getElementById("_H2__").value;
	if (!(zzs && y) ) {
		alert("!!!!!!!!!!!!!Errrrooooorrrrrr!!!!!!");
		return false;
		}
	var token;
	
	if (qry<0){
		var serialized =  $(frm).serialize();
		serialized = revertEncodedSigns(serialized);
		token = URI.concat("&".concat(serialized.concat("&".concat(zzs))));
	}
	else{
		frm.action = frm.action.concat ("&_H2__=".concat(y) );
		var idx=URI.indexOf("?", 0);
		token = URI.substring(0, idx).concat("&".concat(URI.substring(idx+1, URI.length))).concat("&".concat(zzs));
	}
	var hsh=genHash(token,y);
	document.getElementById("_H1__").value = hsh;
	if (qry>=0) 
		frm.action = frm.action.concat("&_H1__=".concat(hsh));
	return true
}



function goHref( url ) {
	var firstPart=url;
	var qry =firstPart.indexOf('?',0);
	if(qry>=0)
	{
		firstPart=firstPart.substring(0,qry);
	}
	var s=firstPart.split("/");
	var len=s.length;
	if ( len <=0 ){
		alert("Action empty!");
		return false;
	}
	var URI=s[len-1];
	if(qry>=0)
		URI=URI.concat(url.substring(qry,url.length));

	if (!KG(null)) return false ;
	if (!(zzs && zzh2) ) {
		alert("!!!!!!!!!!!!!Errrrooooorrrrrr!!!!!!");
		return false;
		}
	var token;
	
	url = url.concat (zzh2.concat(zzh) );
	var idx=URI.indexOf("?", 0);
	token = URI.substring(0, idx).concat("&".concat(URI.substring(idx+1, URI.length))).concat("&".concat(zzs));
	var hsh=genHash(token,zzh2);
	url = url.concat("&_H1__=".concat(hsh));
	window.location.href=url;
	return true
}




function disabSubs(frm){
	if (frm.target != "_blank") {
		var j = frm.elements.length
		for (i=0; i < j ; i++) 
			if (frm.elements[i].type == "submit" ||
				frm.elements[i].type == "reset" ||
				frm.elements[i].type == "button"){ 
				frm.elements[i].disabled = true;
				frm.elements[i].nadDisabled = true;
				}
		}

}

function wrapText(document, text, lim)
{
  str = refineText(text) ;
  if ( lim > 1 && str.length > lim ) {
    var pos = str.lastIndexOf(" ", lim);
    if ( pos > 0 )
      lim = pos ;
    var smallStr = str.substring(0, lim);

    var str = "<di" + "v nowrap style='overflow:hidden' " +
    "title='" + str + "'" +
    ">" +
    smallStr + "..." +
    "<\/d" + "iv>";
  }

  document.write(str);
  document.close();
}

function refineText(str) {
  if ( str == null )
    return "";
  return str.replace("\n\r", "<" + "b>").replace("\n", "<" + "b>").replace("\r", "<" + "b>");
}

function refineHint(str) {
  if ( str == null )
    return "";
  return str.replace("\n\r", "&#13;").replace("\r", "&#13;").replace("\n", "&#13;");
}

function printWindow(winText, width, height) {
  win = window.open("", "printPage", "width="+width+",height="+height+",menubar=yes,scrollbars=yes,status=yes,resizable=yes");
  win.document.write(winText);
  win.document.close();
}

function getSelectedCount(aForm) {
  var ml = aForm.selectedItems;

  if (!ml) return 0; // There is no row

  var len = ml.length;
  var j = 0;

  /* when we have only one row, ml is of type InputElement, but if there is more than one row, the type changes to ListNode */
  if (!len) { // There is only one row
    return ml.checked ? 1 : 0;
  }

  for (var i = 0; i < len; i++) {
    var e = ml[i];
    if (e.checked)
      j = j + 1;
    }
    return j;
}

function checkSelectedCount(aForm, selectCount) {
    var cnt = getSelectedCount(aForm);
    var msg = "";
    if ( selectCount == "n" )
    {
      if ( cnt >= 1 )
        return true ;
      else
        msg = "حداقل يك سطر انتخاب شود.";
    }
    else if ( parseInt(selectCount) == cnt )
      return true ;
    else
        msg = "دقيقاً بايد " + selectCount + " سطر انتخاب شود.";
    alert(msg);
    return false;
}


function submitRet(element){
    var frm = element.form;
    if (frm == null){
    	alert ("No input form to process!");
    	return;
    }
      
 //   if(typeof frm.returnAddress != undefined)
//  		frm.returnAddress.value = returnAddress;
    try{
  	  if (!disableOnS(frm))
  		  return ;
  	  }
    catch(ee){
    alert(ee);
    return ;
    }
    frm.submit();
}


function gotoUrl(formId, url, arg3, arg4,arg5) {
	if (typeof url !== typeof "string" ){
		alert ("Destination URL not specified!");
		return;
	}
	if (arguments.length > 4 ){
		gotoUrlPrompted(formId, url, arg3, arg4,arg5) ;
		return;
	}
	if (url.indexOf("ajax=true")> 0 ){
		submitFormCommandForAjax(formId, url);
		return;
	};
	if (!(typeof formId === typeof "STRING" ) )	{
		form = formId;
		formId = form.getAttribute("id");
		if (!formId){
			var formName= form.getAttribute("name");
			formId=formName+"_"+ Math.floor(Math.random()*1000);
			form.setAttribute("id", formId);
		}
	}
	form = document.getElementById(formId);
	if (!form){
		var forms = document.getElementsByName(formId);
		if (forms){
			form = forms[0];
			formId=formId+"_"+ Math.floor(Math.random()*1000);
			form.setAttribute("id", formId);
		}
		
	}
	form = document.getElementById(formId);
    if (!form ){
    	alert("trying to locate a form");
    	var forms = document.getElementsByName("itoForm");
    	if (forms && forms.length > 1){  
    		forms = document.getElementsByName("loginForm");
    		if (!forms  ){    		
    			alert("Not a form!");
    			return;
    			}
    	}
    	form = foms[0] ; 
		var formName= form.getAttribute("name");
		formId=formName+"_"+ Math.floor(Math.random()*1000);
		form.setAttribute("id", formId);
    }
	form = document.getElementById(formId);
	if (!form){
		alert("couldn't locate a form!");
		return;
	}
	form.action = url;	
	if( url.indexOf("newWindow=true",0) > 0 ){
		form.setAttribute("target","_blank");
  	}
	if (arguments[2] && arguments[2] == "true") { 
  	// has third argument set true ==>  <target = "_blank"> ==> submit to  New Window 
  		form.setAttribute("target","_blank");
 
    	if (url.indexOf("newWindow",0) < 0 )
    		form.action += "&newWindow=true";
  	}
	var inpRetAddr = form.elements["returnAddress"] ;
	if( inpRetAddr != null && (typeof returnAddress != "undefined") && returnAddress != ""  ){
		inpRetAddr.value = returnAddress;
	}
	submitForm(form);
}


function gotoUrlPrompted(formId, url, arg3,arg4,arg5) {
	var prompt = arg4; // 3th argument
	if (prompt == "MESSAGE") {
	  alert(arg4);
	} else if (prompt == "CONFIRM") {
	if (!confirm(arg5))
	   return false;
	}
	gotoUrl(formId,url, arg3)
}





function submitAndExit(formId) {
	form = document.getElementById(formId);
	if (!form){
		var forms = document.getElementsByName(formId);
		if (forms){
			form = forms[0];
			formId=formId+"_"+ Math.floor(Math.random()*1000);
			form.setAttribute("id", formId);
		}
		
	}
	form = document.getElementById(formId);
    if (!form ){
    	alert("trying to locate a form");
    	var forms = document.getElementsByName("itoForm");
    	if (forms && forms.length > 1){  
    		forms = document.getElementsByName("loginForm");
    		if (!forms  ){    		
    			alert("Not a form!")
    			return;
    			}
    	}
    	form = foms[0] ; 
		var formName= form.getAttribute("name");
		formId=formName+"_"+ Math.floor(Math.random()*1000);
		form.setAttribute("id", formId);
    }
	form = document.getElementById(formId);
	if (!form){
		alert("couldn't locate a form!")
		return;
	}
	gotoUrlAjax(formId, form.action);
	 return;
 }


function gotoSearch(formId, url) {
  var form = document.getElementById(formId);
  var selectCount = "0";
  if ( arguments[2] != null)
    selectCount = arguments[2];
  if ( selectCount != "0" && !checkSelectedCount(form, selectCount) )
    return false;
  if(typeof form.returnAddress !== "undefined")
  	if (!form.returnAddress.value)
  		form.returnAddress.value = returnAddress;

  if ( arguments[3] != null)
    form.selectForward.value = arguments[3];
  else
    form.selectForward.value = returnAddress;
  form.action = url;
  submitForm(form);
}

function editCommand(params, hash){
	if ( jHash(params) != hash ){
		alert (x);
		return false;
	}
	getUrl("pListHandlerAction.do?"+params) ;
	return false;
}

function getUrl( url){
	getAjaxUrl(url+"&ajax=true");
}
function submitFormCommandForAjax(formId, url, sc, prompt, msg ) {
	  if (url.indexOf("ajax=true") < 0 ) {
		  submitFormCommand(formId, url, sc, prompt, msg );
		  return ; 
	  }
	  if (prompt && prompt == "MESSAGE") {
	    alert(msg);
	  } 
	  else if (prompt && prompt == "CONFIRM") {
	    if (!confirm(msg))
	      return false;
	  	}
	  
	  var closeCmd = document.getElementById("closeSearchDialog");
	  var frm ;
	  if (typeof formId === typeof "STRING" ){
		  	frm = document.getElementById(formId);
		  }  else{
			frm = formId;
		  }

	  if (!frm){
		  alert ("Command Error: not a valid form ");
		  return;
	  }
	  var selectCount = "0";
	  if ( sc  )
	    selectCount = sc;
	  if ( selectCount != "0" && !checkSelectedCount(frm, selectCount) ){
		    return false;
		  }

	  if ( closeCmd){
		  var onclickFunc = closeCmd.onclick;
		  if (typeof onclickFunc == "function") 
			  onclickFunc.apply(closeCmd);
		  getAjaxUrl(url);
		  return;
	  }
	  var lastAction = frm.action ;
	  frm.action = url;
	  postAjaxForm (frm);	 
	  frm.action = lastAction ;
	  return;
	}

function setSelecteds_(	selectedIdField_, selectedId_,selectedTextField_, selectedText_ ) {
	selectedIdField_ = document.getElementById(selectedIdField_) ;
	if (!selectedIdField_ ) return;
	selectedIdField_.value = selectedId_ ;
	selectedTextField_ = document.getElementById(selectedTextField_) ;
	if (!selectedTextField_ ) return;
	selectedTextField_.value = selectedText_ ;
}


function submitFormCommand(formId, url, sc, prompt, msg, newWin ) {
	if (url.indexOf("ajax=true")>0 ){
		  submitFormCommandForAjax(formId, url, sc, prompt, msg );
		  return;
	}
	if (prompt == "MESSAGE") {
		alert(msg);
    } 
    else if (prompt == "CONFIRM") {
	    if (!confirm(msg))
	      return false;
  	}

  var form; 
  if (typeof formId === typeof "STRING" ){
  	form = document.getElementById(formId);
  }  else{
	form = formId;
  }
  

  var selectCount = "0";
  if ( sc != null )
    selectCount = sc;
  if ( selectCount != "0" && !checkSelectedCount(form, selectCount) ){
    return false;
  }
 
	  
  if (arguments[5]){ 
	  // 6th argument is whether it should submit in a new window or not
    gotoUrl(formId, url, arguments[5]);
}
  else{
	  gotoUrl(formId, url);
  }
}

function submitFormDelete(formId) {
  var form = document.getElementById(formId);
  j = getSelectedCount(form);
  if (j == 0) {
      alert("براي حذف حداقل يك عضو را انتخاب نماييد");
      return false;
  }
  else if(confirm("آيا مطمئن از حذف موارد انتخابي هستيد؟"))
  {
    var action = "pCommitAction.do?operation=DELETE";
    if ( arguments[1] != null)
      action = arguments[1];
    if(typeof form.returnAddress !== "undefined")
    	if (!form.returnAddress.value)
    		form.returnAddress.value = returnAddress;

    form.action = action;
    submitForm(form);
  }
}

function submitFormSelect(formId) {
  var form = document.getElementById(formId);
  var j = getSelectedCount(form);
  if (j == 0) {
          alert("حداقل يك سطر را انتخاب نماييد");
          return false;
  }
  else {
//  form.returnAddress.value = returnAddress;
	  if (typeof form.returnAddress == "string" )
		  form.returnAddress.value = returnAddressForSelect;
    form.operation.value = 'SELECT';
    submitForm(form);
  }
}

function ChangeCode(app, e, code, oldCode, newCode){
  if (code == oldCode) {
    if ( app == 1 )   // IE
      e.keyCode = newCode;
    else		// Netscape
      e.which = newCode;
    return true ;
  }
  return false;
}

function KbdHandleEvent(e) {
  var app = 0;	// Netscape
  if(!e) {
    var e = window.event; // For IE
    app = 1 ;
  }

  if (e.keyCode)  // IE
  {
      code = e.keyCode;
  }
  else if (e.which)  // NS
  {
      code = e.which;
  }
  if ( !ChangeCode(app, e, code, 0x06a9, 0x0643 ) ) // KAF Farsi -> KAF Arabic
  if ( !ChangeCode(app, e, code, 0x649, 0x064a ) )  // YA no dot -> YA two dot
  if ( !ChangeCode(app, e, code, 0x6cc, 0x064a ) )  // YA Farsi(#1740) -> YA 2 dot
    return true; // false causes problems: no character is written out.
  return true;
}

function addEvent(obj, type, fn) {
  if (obj.attachEvent) {
    obj['e' + type + fn] = fn;
    obj[type + fn] = function(){obj['e' + type + fn]( window.event );}
    obj.attachEvent('on' + type, obj[type + fn]);
  } else
    obj.addEventListener(type, fn, false);
}

function removeEvent(obj, type, fn) {
  if (obj.detachEvent) {
    obj.detachEvent('on' + type, obj[type + fn]);
    obj[type + fn] = null;
  } else
    obj.removeEventListener(type, fn, false);
}

/*function rightClick() {
    var rightclick;
    var e = window.event;
    alert(typeof e);
    if (typeof e.which != undefined ) rightclick = (e.which == 3);
    else if (typeof e.button != undefined ) rightclick = (e.button == 2);
    else {alert("Browser not supported!"); return false;}
    alert(rightclick);
    return rightclick ; 
}*/
// Global event registeration
function initAll() {
 if (typeof returnAddress == undefined  ) 
		returnAddress = "/startAction.do";
  initFrame('menuFrame');
  // keyboard events
  if (document.captureEvents)  // NS
    document.captureEvents(Event.KEYPRESS);
  document.onkeypress = KbdHandleEvent;  // Both IE & NS

  allForms = document.getElementsByTagName("form");
  for (var i = 0; i < allForms.length; i++) {
    f = allForms[i];
    var s = new String();
    s.toUpperCase
    elems = f.elements;
    if (elems) {
      for (var j = i; j < elems.length; j++) {
          if (elems[j].nodeName.toUpperCase() == "TEXTAREA" ||
                (elems[j].nodeName.toUpperCase() == "INPUT" && elems[j].type.toUpperCase() == "TEXT"))
            addEvent(elems[j], "change", fixKbdProbs);
      }
    }
    addFormValidator(f);
  }
  initComboBoxes();
  menuOnLoad();
}

function doFormValidation(form) {
  var elems = form.elements;
  if (!elems) return;
  var firstElm;
  for (var i = 0; i < elems.length; i++) {
    var mandatory = elems[i].getAttribute("mandatory");
    if(mandatory=="true"){
    	if(elems[i].type=='radio'){
          var list = document.getElementsByName(elems[i].name);
          var j=0;
          
          for(j=0;j<list.length&&!list[j].checked;j++);
          if(j==list.length){
        	  elems[i].style.backgroundColor='#FFCCCC';
        	  if(firstElm==null){firstElm = i;}
          }else{
        	  elems[i].style.backgroundColor='';
          }
        }
	    if (elems[i].value == '' ){
		  elems[i].style.backgroundColor='#FFCCCC';
		  if(firstElm==null){firstElm = i;}
	    }
	    else{
	    	elems[i].style.backgroundColor='';
	    }
    }
    var filter = elems[i].getAttribute("filter");
    if (filter == null || filter=="") continue;
    if (elems[i].value == '') continue
    var fobj = VALIDATION[filter];
    if (!fobj[1].test(elems[i].value)) {
      alert(fobj[0]);
      elems[i].style.backgroundColor='#FFCCCC';
      elems[i].focus();
      return false;
    }else{
    	elems[i].style.backgroundColor='';
    }
  }
  if(firstElm!=null){
	  elems[firstElm].focus();
	  alert(mandatoryAlert);
      return false;
  }
  return true;
}

function addFormValidator(form) {
  var elems = form.elements;
  if (!elems) return;
  var fn = function() {return doFormValidation(form)};
  form['doValidation'] = fn;
}

function fixKbdProbs(e)
{
  var targ;
  if (!e) var e = window.event;
  if (e.target) targ = e.target;
  else if (e.srcElement) targ = e.srcElement;
  if (targ.nodeType == 3) // defeat Safari bug
    targ = targ.parentNode;
//  targ.value = getStandardizedString(targ.value);
  if (targ.value)
    targ.value = getStandardizedString(targ.value);
}

function getStandardizedString(str) {
  // will do something later (replace 0x6cc with 0x64a, and more...)
  return str.replace(/ی/gi, "ي") // Farsi Yeh => Arabic Yeh
  .replace(/ى/gi, "ي") // Alef Maksura => Arabic Yeh
  .replace(/ک/gi, "ك"); // Farsi Keheh => Arabic Kaf
}

/**
 * This function is used to select all checkbox elements in a
 * table (select some rows). You should pass id of the containertElement
 * within which checkbox inputs are located plus the selectManager
 * element as checkAll argument.
 * exceptionId is the id for row(s) to be ignored.
 * An example:
 * <in put type="checkbox" id="selectManager" onclick="selectAll('containerElement', this);" / >
 *
 */
function selectAll(containerElement, checkAll, exceptionId) {
  var container = document.getElementById(containerElement);
  var selectItem = container.getElementsByTagName('INPUT');
  var checkBox;
  if (exceptionId) {
    for (var i = 0; i < selectItem.length; i++) {
      checkBox = selectItem[i];
      if (checkBox.name == 'selectedItems' && checkBox.type == 'checkbox' &&
          checkBox.parentNode.parentNode.getAttribute('id') != exceptionId)
        if (checkAll.checked && !checkBox.checked)
          Check(checkBox);
        else if (!checkAll.checked && checkBox.checked)
          Clear(checkBox);
    }
  }
  else {
    for (var i = 0; i < selectItem.length; i++) {
      checkBox = selectItem[i];
      if (checkBox.name == 'selectedItems' && checkBox.type == 'checkbox')
        if (checkAll.checked && !checkBox.checked)
          Check(checkBox);
        else if (!checkAll.checked && checkBox.checked)
          Clear(checkBox);
    }
  }
}

/**
 * @param o select tag object (which contains some <option>s)
 * @return an array of selected options (can be more than one
 *         if the select element is multiple select)
 */
function getSelectedObjects(o) {
  var ret = new Array();
  ret.length = 0;
  for (i = 0; i < o.length; i++)
    if(o.options[i].selected)
      ret.push(o.options[i]);
  return ret;
}

function openWindow(url, width, height, parameters) {
  if (parameters && parameters.length > 0)
    win = window.open(url, "MessagePage", "width="+width+",height="+height+",menubar=yes,scrollbars=yes,status=yes,resizable=yes," + parameters);
  else
    win = window.open(url, "MessagePage", "width="+width+",height="+height+",menubar=yes,scrollbars=yes,status=yes,resizable=yes");
}

function openBillWindow(width, height) {
  var win = window.open("", "Bill", "width="+width+",height="+height+",menubar=no,scrollbars=yes,status=no,resizable=yes");
  return win;
}

function trimString (str, chars) {
  var len = str.length;
  var sIndex = 0, fIndex = len;
  for (var i = 0; i < len; i++) {
    if (chars.indexOf(str.charAt(i)) == -1) break;
    sIndex++;
  }
  for (var i = len - 1; i >= 0; i--) {
    if (chars.indexOf(str.charAt(i)) == -1) break;
    fIndex--;
  }
  return str.substring(sIndex, fIndex);
}

function updateImage(thisObj, imgId) {
  var image = document.getElementById(imgId);
  if (thisObj.value != null) {
    image.src = 'file:///' + thisObj.value.replace(/\\\\/g, '/');
    image.title = thisObj.value;
    if (image.fileSize == '-1') { // Image is not available
      image.src = 'Pages/images/no-photo.gif'; // no photo
      image.title='No photo available';
      return;
    }
    thisObj.title = thisObj.value;
    
  	var hidden = document.getElementById(imgId);
    
  }
}

function preventSelectDisabled(oSelect) {
  var option1 = oSelect.options[oSelect.selectedIndex];
  if ( option1.parentNode && option1.parentNode.tagName.toUpperCase() == "OPTGROUP") {
    option1 = option1.parentNode;
  }
  var isOptionDisabled = option1.disabled;
    if(isOptionDisabled) {
        oSelect.selectedIndex = oSelect.defaultSelectedIndex;
        return false;
    }
    else oSelect.defaultSelectedIndex = oSelect.selectedIndex;
    return true;
}


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

farsiCharCompare = function (ch1, ch2) {
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

  return (i1 - i2);
};

farsiCompare = function(str1, str2) {
  var l1 = str1.length;
  var l2 = str2.length;
  var res = 0;
  for (i = 0; i < l1 && i < l2 && res == 0; i++) {
    res = farsiCharCompare(str1.charAt(i), str2.charAt(i));
    if (res != 0)
      return res;
  }
  if (l1 == l2)
    return 0;
  else if (l1 < l2)
    return -1;
  return 1;
};

myFarsiCompare = function(str1, str2) {
  var l1 = str1.text.length;
  var l2 = str2.text.length;
  var res = 0;
  for (i = 0; i < l1 && i < l2 && res == 0; i++) {
    res = farsiCharCompare(str1.text.charAt(i), str2.text.charAt(i));
    if (res != 0)
      return res;
  }
  if (l1 == l2)
    return 0;
  else if (l1 < l2)
    return -1;
  return 1;
};

valueCompare = function(str1, str2) {
  var l1 = (str1.value==''?-1:parseInt(str1.value));
  var l2 = (str2.value==''?-1:parseInt(str2.value));
  return l1-l2;
};

/**
 * ascendingOrder is non-functional for now.
 */

function sortCombo(combo, ascendingOrder, comparator) {
  // return false;
  if (arguments.length == 1) ascendingOrder = true;    // default to ascending sort

  sort = combo.getAttribute("alphaSort");
  if (sort != null && sort.equals("false")) {
	  // copy options into an array
	  var myOptions = [];
	  for (var loop=0; loop < combo.options.length; loop++) {
	    myOptions[loop] = combo.options[loop];
	  }
	  if(comparator)myOptions.sort(comparator);
	  else  myOptions.sort(myFarsiCompare);
	
	  for (i = combo.childNodes.length - 1; i >= 0; i--) {
	    combo.remove(i);
	  }
	
	  for (var loop=0; loop < myOptions.length; loop++) {
	    combo.options.add(myOptions[loop]);
	  }

  }    
}

function initComboBoxes() {
  var s = document.getElementsByTagName("SELECT");

  for(var i=0; i < s.length; i++) {
    if (!gecko)
//      addEvent(s[i], "keydown", showSelection);
      addEvent(s[i], "keydown", smartComboListener); // incremental search

    if (s[i].getAttribute('id') != null && s[i].getAttribute('id').length > 13)
      if (s[i].id.substr(0, 13) == "_tosortcombo_" || // detailEdit.jsp
          s[i].id.substr(0, 13) == "_tosortcombo_") // creteReport2.jsp
        sortCombo(s[i]);
  }
}


function showSelection() {
//  var targ;
//  if (!e) var e = window.event;
//  if (e.target) targ = e.target;
//  else if (e.srcElement) targ = e.srcElement;
//  if (targ.nodeType == 3) // defeat Safari bug
//    targ = targ.parentNode;
//  alert(targ.options[__sindex__].text);
//  targ.selectedIndex = __sindex__;
  __combo_to_select__.selectedIndex = __sindex__;
}


var _timer = 0;
var __s = new Array(0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,
                    32,33,34,35,36,37,1548,1711,41,40,215,43,1608,45,46,47,48,49,50,51,52,53,54,55,56,57,58,1603,
                    44,61,46,1567,64,1616,1584,125,1609,1615,1609,1604,1570,247,1600,1548,47,8217,1583,215,1563,
                    1614,1569,1613,1601,8216,123,1611,1618,1573,126,1580,1688,1670,94,95,1662,1588,1584,1586,1610,
                    1579,1576,1604,1575,1607,1578,1606,1605,1574,1583,1582,1581,1590,1602,1587,1601,1593,1585,1589,
                    1591,1594,1592,60,124,62,1617);
var _b = navigator.userAgent.toLowerCase() ;
var msie  = (_b.indexOf('msie')  > -1) ? true : false ;
var gecko = (_b.indexOf('gecko') > -1) ? true : false ;
var opera = (_b.indexOf('opera') > -1) ? true : false ;

function smartComboListener(e) {
  var targ;
  if (!e) var e = window.event;
  if (e.target) targ = e.target;
  else if (e.srcElement) targ = e.srcElement;
  if (targ.nodeType == 3) // defeat Safari bug
    targ = targ.parentNode;
  if ((e.keyCode >= 33 && e.keyCode <= 40) || e.keyCode <= 20)
    return true;
  if (isEnglishCombo(targ))
    setSelectedIndex(targ, e, 0);
  else
    setSelectedIndex(targ, e, 1);

  __combo_to_select__ = targ;
  window.setTimeout(showSelection, 0);
}

function isEnglishCombo(combo) {
  if (combo.options.length <= 0) return false;
  if (combo.options.length > 1) { // most of EMS combos have "- - - - - -" as the first item, so we use 2nd item
    if (combo.options.length > 4) {
      ch = combo.options[4].text.charAt(0)
      return (ch <= 'z' && ch >= 'a') || (ch <= 'Z' && ch >= ' ') || (ch <= '9' && ch >= '0');
    } else {
      ch = combo.options[1].text.charAt(0)
      return (ch <= 'z' && ch >= 'a') || (ch <= 'Z' && ch >= ' ') || (ch <= '9' && ch >= '0');
    }
  }
}

function setSelectedIndex(obj, event, mode)
{
  var curdate = new Date();
  var seconds = curdate.getTime() / 1000;
  if (_timer != 0 && (seconds - _timer) >= 2) {
    obj.selectedString = '';
//    obj.selectedIndex = -1;
    _timer = seconds;
  }
  else {
    _timer = seconds;
  }
  if (mode == 1) {
    if(event.keyCode != 27 && event.keyCode != 8 &&  event.keyCode != 32 &&
       event.keyCode != 13 && event.keyCode != 9 && event.keyCode != 38 &&
       event.keyCode != 40 && event.keyCode != 16 && event.keyCode != 17) {
      if(event.keyCode == 222 ) newKey = 39;
      else if(event.keyCode == 186) newKey = 59;
      else if(event.keyCode == 221) newKey = 93;
      else if(event.keyCode == 220) newKey = 92;
      else if(event.keyCode == 192) newKey = 96;
      else var newKey = event.keyCode + 32;
      if (msie) event.keyCode = __s[newKey];
      else if (gecko || opera) {
        obj.value  = obj.value + String.fromCharCode(newKey) ;
        return false ;
      }
    }
  }

  if(event.keyCode == 27) {
    obj.selectedString = '';
    obj.selectedIndex = 0;
    return true;
  } else if(event.keyCode == 13 || event.keyCode == 9 || event.keyCode == 38 ||
            event.keyCode == 40  || event.ctrlKey || event.altKey ) {
            //|| event.type.toLowerCase() == 'blur' tab, arrow-up, arrow-down, ctrl, or alt keys
    return true;
  } else {
    if(typeof obj.selectedString == 'undefined') obj.selectedString = '';
    if(event.keyCode == 189) {
      event.keyCode = 175;
      obj.selectedString =  obj.selectedString + '-';
    } else if(event.keyCode == 8) { // backspace
      obj.selectedString = (obj.selectedString.length != 0) ? obj.selectedString.substring(0, obj.selectedString.length - 1) : '';
    } else {
      if(event.keyCode>95 && event.keyCode < 106)
        vari = String.fromCharCode(event.keyCode-48);
      else {
        vari = String.fromCharCode(event.keyCode)
      }
      obj.selectedString = obj.selectedString + vari;
    }
    var newSelectedIndex = -1;
    for(var i = 0; i < obj.options.length; i++) {
      if(obj.options[i].text.toLowerCase().indexOf(obj.selectedString.toLowerCase()) == 0) {
        newSelectedIndex = i;
        break;
      }
    }

    if(newSelectedIndex != -1) {
      obj.selectedIndex = newSelectedIndex;
      __sindex__ = newSelectedIndex;
    } else {
      if(event.keyCode > 95 && event.keyCode < 106)
        obj.selectedString = String.fromCharCode(event.keyCode - 48);
      else
        obj.selectedString = String.fromCharCode(event.keyCode);
      return true;
    }
//    alert(obj.options[obj.selectedIndex].text);
  }
  return false;
}


function getFirstParent (obj, elemName) {
  while(obj.nodeName.toUpperCase() != elemName.toUpperCase() && obj.nodeType != 9) {
    obj = obj.parentNode;
  }
  return obj;
}

function findPos(obj) {
  var curleft = curtop = 0;
  if (obj.offsetParent) {
    curleft = obj.offsetLeft
    curtop = obj.offsetTop
    while (obj = obj.offsetParent) {
      curleft += obj.offsetLeft
      curtop += obj.offsetTop
    }
  }
  return {x: curleft, y: curtop};
}

function scroll2Element(obj) {
  var p = findPos(obj);
  menuFrame.window.scrollTo(p.x, p.y - 50);
}

function initFrame(fid) {
  var f = document.getElementById(fid);
  if (!f) return;
  f.height = document.body.clientHeight - 215;
  addEvent(window, "resize", function() {
    f.height = document.body.clientHeight - 215;
  });
}

function menuOnLoad() {
  if (window.menuFrame != undefined) {
    var mgi = document.getElementById('menuGroupIndex').value;
    var mii = document.getElementById('menuItemIndex').value;
    var mg = menuFrame.document.getElementById('mg_' + mgi)
    var mi = menuFrame.document.getElementById('mi_' + mii)
    if (mi)
      mi.className = "selectedMenuItem";
    if (mg)
    mg.className = "selectedMenuGroup";
    if (mgi && mgi != '_')
      menuFrame.document.getElementById('submenu_' + mgi).style.display = "";

    if (mi)
      scroll2Element(mi);
  }
}

function toggleCmdImg(obj) {
  var img = obj.getElementsByTagName('IMG').item(0);
  img.style.visibility = img.style.visibility != 'hidden' ? 'hidden' : 'visible';
}

function gotoFormCmd(frmCmdId) {
  window.scrollTo(1000, parseInt(getElementY(document.getElementById(frmCmdId))) - 200)
}


/*
function submitCommand(th, formId) {
  var frm = document.getElementById(formId);
  var combo = document.getElementById('commandSelectorCombo');
  var idx = th.className.split(' ')[0];
  var num = idx.substring(idx.indexOf('_') + 1);
  alert(num);
  combo.selectedIndex = num;
  frm.action = 'commandDispatcherAction.do';
  submitForm(frm);
}
*/
var gAutoPrint = true;
function myOpenWindow(width, height) {
  var win = window.open("", "Bill", "width="+width+",height="+height+",menubar=no,scrollbars=yes,status=no,resizable=yes");
  return win;
}

function printSpecial()
{
	if (document.getElementById != null)
	{
		var html = '<HTML>\n<HEAD>\n';
		var meta = '<meta http-equiv="Content-Type" content="text\/html; charset=UTF-8">\n';
		html += meta;
//		if (document.getElementsByTagName != null)
//		{
//			var headTags = document.getElementsByTagName("head");
//			if (headTags.length > 0)
//				html += headTags[0].innerHTML;
//		}
		html += '<title>' + 'print' + '<\/t' + 'itle>'
		html += '\n<\/he' + 'ad>\n<body dir="rtl">\n';

		var printReadyElem = document.getElementById("printReady");
		
		if (printReadyElem == null) {
			printReadyElem = document.getElementById("printBody");
		}		
		if (printReadyElem != null)
		{
//			var bodyTags = document.getElementsByTagName("body");
//			if (bodyTags.length > 0)
//				html += bodyTags[0].innerHTML;
				html += printReadyElem.innerHTML;
		}
		else
		{
			alert("Could not find the printReady section in the HTML");
			return;
		}

		html += '\n<\/BO' + 'DY>\n<\/HT' + 'ML>';
		var printWin = myOpenWindow(1000, 700);
//		var printWin = window.open("","printSpecial");
		printWin.document.open();
		printWin.document.write(html);
		printWin.document.close();
		if (gAutoPrint)
			printWin.print();
	}
	else
	{
		alert("Sorry, the print ready feature is only available in modern browsers.");
	}
}

function helpSpecial(helpUrl)
{
    var mii = document.getElementById('menuItemIndex').value;
    var mi = menuFrame.document.getElementById('mi_' + mii);
	
    if (mi) {
    	str = mi.href;
        var pos = str.lastIndexOf("helpContext");
        if ( pos > 0 ) {
        	var helpContext = '';
            var pos2 = str.indexOf("&", pos+1);
        	if (pos2 > 0)
        		helpContext = str.substring(pos+12, pos2);
        	else {
        		helpContext = str.substring(pos+12, str.length);
        	}
        }
    	openWindow(helpUrl+'#'+helpContext, 800, 500, 'toolbar=yes');
    	
    }
    else {
    	openWindow(helpUrl, 800, 500, 'toolbar=yes');
    }
}



function mapToMate_(id){
	if ( !(typeof id == 'string' ) ) 
		return null;
	if ( id.endsWith(')') )
		id = id.replace(')', "_TEXT_)");
	else
		id = id.concat("_TEXT_");
	return(id);
}


function resetField_ (id ) {
	var elem = getElement_(id)
	if ( elem  ){
		elem.value = "" ;
		if (typeof elem.onchange == 'function') {
			elem.onchange.apply(elem);
		}
		resetField_(mapToMate_(id));
			
	}

}

function resetFields_(csFields){
	if ( !csFields ) 
		return;
	var arFields = csFields.split(',');
	var s = arFields.length ;
	if (s <= 0 )
			return ;
	for ( i= 0 ; i < s ; i++ ){
		resetField_(arFields[i]);
	}
}

function getElement_( id ){
      var elem = document.getElementById(id);
 		if (!elem) 
     		elem = document.getElementById("_tosortcombo_"+id);
 		return (elem);

  }
function runOnclick(elem){
	elem.onclick.apply(elem);

}
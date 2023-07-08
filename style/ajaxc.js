dojo.require("dojo.NodeList-manipulate");
dojo.require("dijit.form.Button");
dojo.require("dijit.Dialog");
dojo.require("dijit.layout.TabContainer");
dojo.require("dijit.layout.ContentPane");
dojo.require("dijit.Tooltip");
dojo.require("dojox.widget.DialogSimple");


var toolTipDom; 
var needsRefresh = false;
var destroyables="";
var lastCandidate= null;
var lastAction="";

var noticeId_ =  'dlg_prepare_notice' ;

function ajaxLoading(){
	var dlg=dijit.byId(noticeId_);
	if (dlg ){
		ajaxSendMessage( 'همزمانی در دسترسی به سرور. عملیات انجام نخواهد شد. مجددا تلاش کنید!' ) ;
		return false;
	}
		dlg = new dojox.widget.DialogSimple({  
			executeScripts	:true,
     		id				:noticeId_
		});
	  dlg.setContent("<div style='width:400px'>در حال بارگیری ...</div><br/><br/><div>"+closeButton(noticeId_)+"</div>");
	  dojo.query("#"+noticeId_+" .dijitDialogTitleBar").prepend("<img id='ajaxStat' style='float:left' src='Pages/images/kittscanner.gif'/>");
	  dlg.startup();
	dlg.show();	
	return true;
}


function ajaxFinished(){
	var dlg=dijit.byId(noticeId_);
	if (!dlg ) return;
	dlg.hide();
	dlg.destroyRecursive();
}

function ajaxSendMessage(message){
	var dlg=dijit.byId(noticeId_);
	if (!dlg )
		if (!ajaxLoading() ){ 
			alert (message);
			return;
		}
	dlg=dijit.byId(noticeId_);
	if (!dlg){
		alert (message);
		return;
	}
	  dlg.hide();
	  dlg.setContent("<div style='width:400px'>"+message+"</div><br/><br/><div>"+closeButton(noticeId_)+"</div>");
	  dojo.query("#"+noticeId_+" .dijitDialogTitleBar").prepend("<img id='ajaxStat' style='float:left' src='Pages/images/kittscanner.gif'/>");
	  dlg.startup();
	  dlg.show();	
}


function dojoGetAttr( elemId , attrName ){
/**	var result = new Object();
	
	require(["dojo/dom-attr"], function(domAttr, result){
		  result.attrValue = domAttr.get( elemId, attrName);
		});
	return (result.attrValue) **/
	
	var elem = document.getElementById(elemId);
	if (elem)
		return elem.value;
	else
		return "";
	
}


function pushMeToDestroy(dialogId, currentAction){
	if (destroyables.length > 0 )
		destroyables.concat(",".concat(dialogId));
	else
		destroyables= dialogId ;
	lastCandidate = dialogId;
	lastAction = currentAction;
}



function popMeFromDestroy(dialogId){
	if (destroyables.length = 0 )
		return;
	if (destroyables.indexOf(dialogId)>0 ){
		destroyables.replace(dialogId, "" );
		destroyables.replace(",,", "," );
	}
	if (destroyables.indexOf(",")== 0)
		destroyables = destroyables.substring(1, destroyables.length-1);
	if (destroyables.lastIndexOf(",") == destroyables.length -1)
		destroyables = destroyables.substring(0, destroyables.length-1)
}



function saveTiming(dialogId,formName){
	
	if(document.getElementById("ajaxStat")!=null){
		// another ajax proccess running so return
		return;
	}
	if(!checkAjaxInput()){
		fce(document.getElementById(formName),"ajax","true");			
	}

	dojo.query("#"+dialogId+" #"+formName).prepend("<input type='hidden' name='ajax' value='true'>");

	var dlg=dijit.byId(dialogId);
	dojo.query("#"+dialogId+" .dijitDialogTitleBar").prepend("<img id='ajaxStat' style='float:left' src='Pages/images/kittscanner.gif'/>");
	dojo.xhrPost({
	    form: formName,
	    load: function(data){
	    	dojo.query("#"+dialogId+" #ajaxStat").forEach(dojo.destroy);
	    	if(data.indexOf("<li class=\"error\">") == -1){
//	    		alert(data);
	    		hideDestroyDialoge(dlg);
	    	}else{
	    		var from=data.indexOf("<li class=\"error\">");
	    		var to=data.indexOf("</li>");
	    		var ndlgId="n_dlg_"+Math.floor(Math.random()*1000);
	    	    var newdlg = new dojox.widget.DialogSimple({  
					executeScripts	:true,
	    	    	id:ndlgId,
   				   content:data.substring(from,to)+closeButton(ndlgId),
				   style:"width:"+viewport()['width']*0.7+"px  ;height:"+viewport()['height']*0.7+"px  ;overflow:scroll;draggable:true;background-color:white"
	    		});
	    	    newdlg.startup();
	    		newdlg.show();
	    		removeXButton(ndlgId);
	    	}
	    },
	    error:function(e){
	    	dojo.query("#"+dialogId+" #ajaxStat").forEach(dojo.destroy);
			alert(e);
		}
	});
	
	
	
}

function showTimingDialog(dialogId,url,formData){
	var dlg=dijit.byId(dialogId);
	if(dlg!=null){
		try{dlg.destroyRecursive();}catch(e){}
	}
    dlg = new dojox.widget.DialogSimple({  
		executeScripts	:true,
			   id:dialogId
	});

    dlg.setContent("<div style='width:400px'>در حال بارگیری ...</div><br/><br/><div>"+closeButton(dialogId)+"</div>");
    
	dojo.query("#"+dialogId+" .dijitDialogTitleBar").prepend("<img id='ajaxStat' style='float:left' src='Pages/images/kittscanner.gif'/>");
	dlg.startup();
	dlg.show();	
	removeXButton(dialogId);
	
	dojo.xhrGet({
		   url:url+"&ajax=true",
		   content:formData,
		   load: function(data){
			   dojo.query("#"+dialogId+" #ajaxStat").forEach(dojo.destroy);
			   data=data.replace(/editForm/g,"editForm_"+dialogId);
			   dlg.setContent(data+closeButton(dialogId));
		        var h = dojo.query('#'+dialogId).coords()[0].h ;
		        if(h >= document.body.scrollHeight){
				   try{dlg.destroyRecursive();}catch(e){}
				   dlg = new dojox.widget.DialogSimple({  
						executeScripts	:true,
						   id:dialogId,
						   content:data+closeButton(dialogId),
						   style:"width:"+viewport()['width']*0.7+"px  ;height:"+viewport()['height']*0.7+"px  ;overflow:scroll;draggable:true;background-color:white"
						});
				   dlg.startup();
				   dlg.show();
		        }
		        
			   
			   removeXButton(dialogId);
//			   dojo.query("#"+dialogId+" #editForm").attr('id', "editForm_"+dialogId);
			   document.getElementById(dialogId).innerHTML=document.getElementById(dialogId).innerHTML.replace(/return submitForm\(form\)/g, "saveTiming('"+dialogId+"','editForm_"+dialogId+"')");
  
			   
		   },
		   error:function(data){
			   
			   dojo.query("#"+dialogId+" #ajaxStat").forEach(dojo.destroy);
			   alert(e);
		   }
		});

	
}
function viewport()
{
var e = window
, a = 'inner';
if ( !( 'innerWidth' in window ) )
{
a = 'client';
e = document.documentElement || document.body;
}
return { width : e[ a+'Width' ] , height : e[ a+'Height' ] }
}

function prepareSearchDialogeForNext(dialogId,url, formData ){
		var dlg=dijit.byId(dialogId);
		if(dlg!=null){
			try{dlg.destroyRecursive();}catch(e){}
		}
	    dlg = new dojox.widget.DialogSimple({  
			executeScripts	:true,
				   id:dialogId
		});

	    dlg.setContent("<div style='width:400px'>در حال بارگیری ...</div><br/><br/><div>"+closeButton(dialogId)+"</div>");
	    
	    
		dojo.query("#"+dialogId+" .dijitDialogTitleBar").prepend("<img id='ajaxStat' style='float:left' src='Pages/images/kittscanner.gif'/>");
		dlg.startup();
		dlg.show();
		removeXButton(dialogId);
		
		
		dojo.xhrGet({
			   url:url+"&ajax=true",
			   load: function(data){
				   dojo.query("#"+dialogId+" #ajaxStat").forEach(dojo.destroy);
				   dlg.setContent(data+closeButton(dialogId));
				   removeXButton(dialogId);
				   dojo.query("#"+dialogId+" #findForm").attr('id', "findForm_"+dialogId);
				   objectToForm("findForm_"+dialogId,formData);
				   dojo.forEach(dojo.query("#"+dialogId+" #findForm_"+dialogId+" input[type='text']"), function(element) {
						dojo.attr(element,"onkeypress","onKeySearch(event,'"+dialogId+"','"+selectText+"','"+selectHidden+"','"+"findForm_"+dialogId+"');");
			    	});
				   
				   document.getElementById(dialogId).innerHTML=document.getElementById(dialogId).innerHTML.replace(/'findForm'/g, "'findForm_"+dialogId+"'");
				   try{
					   dojo.query('#'+dialogId+" button[onclick^='goSearch']").attr("onclick","goSearchAjax('"+dialogId+"','"+selectText+"','"+selectHidden+"','"+"findForm_"+dialogId+"');");
				   }catch(e){
					   document.getElementById(dialogId).innerHTML=document.getElementById(dialogId).innerHTML.replace(/goSearchNew\(.*\)/g,"goSearchAjax('"+dialogId+"','"+selectText+"','"+selectHidden+"','"+"findForm_"+dialogId+"')");
				   }

			
				   
				   document.getElementById(dialogId).innerHTML=document.getElementById(dialogId).innerHTML.replace(/gotoPageNew\(\+1.*\)/g,"goNextPageAjax('"+dialogId+"','"+selectText+"','"+selectHidden+"');");
			        document.getElementById(dialogId).innerHTML=document.getElementById(dialogId).innerHTML.replace(/gotoPageNew\(-1.*\)/g,"goPrevPageAjax('"+dialogId+"','"+selectText+"','"+selectHidden+"');");

			        
			        try{
			        
//			        dojo.query("#"+dialogId+" a[onclick*='goExport']").forEach(dojo.destroy);
			        dojo.query("#"+dialogId+" #exportCSV").forEach(dojo.destroy);
			        
			        dojo.query("#"+dialogId+" input[type=radio]").attr('checked', false);

			       
				    dojo.forEach(dojo.query("#"+dialogId+"  #scrollable  .odd"), function(element) {
				    	    dojo.connect(element, "onmouseover", function() {
				    	    	dojo.addClass(this,"over");
				    	    });

				    	    dojo.connect(element, "onmouseout", function() {
				    	    	dojo.removeClass(this,"over");
				    	    });
				    	    
				    	    dojo.connect(element, "onclick", function() {
				    	    	var elem = document.getElementById(selectHidden) ;
				    	    	dojo.addClass(this,"selected");
				    	    	dojo.query ("#"+dialogId + " .selected > td > input[type='radio']").attr('checked', true);
				    	    	var values=dojo.query("#"+dialogId+ " input[type='radio']:checked").val();
								if(values!=null){
									var vals=values.split("__");
									elem.value=vals[0];
									var selectedText = "";
									if (vals.length > 1){
										var idx = vals[1].indexOf("$${");
										if (idx >= 0)
											selectedText = vals[1].substring(0,idx);
										else
											selectedText = vals[1];
										
									}
									if (selectText)
										document.getElementById(selectText).value=selectedText;
									hideDestroyDialoge(dlg);
									if (typeof elem.onchange == 'function') elem.onchange.apply(elem);
								}
				    	    });
				    	    
				    	});

				       dojo.forEach(dojo.query("#"+dialogId+"  #scrollable  .even"), function(element) {
				    	    dojo.connect(element, "onmouseover", function() {
				    	    	dojo.addClass(this,"over");
				    	    });

				    	    dojo.connect(element, "onmouseout", function() {
				    	    	dojo.removeClass(this,"over");
				    	    });
				    	    
				    	    dojo.connect(element, "onclick", function() {
				    	    	var elem = document.getElementById(selectHidden) ;
				    	    	dojo.addClass(this,"selected");
				    	    	dojo.query ("#"+dialogId+" .selected > td > input[type='radio']").attr('checked', true);
				    	    	var values=dojo.query("#"+dialogId+" input[type='radio']:checked").val();
								if(values!=null){
									var vals=values.split("__");
									elem.value=vals[0];
									var selectedText = "";
									if (vals.length > 1){
										var idx = vals[1].indexOf("$${");
										if (idx >= 0)
											selectedText = vals[1].substring(0,idx);
										else
											selectedText = vals[1];
										
									}
									if ( selectText)
										document.getElementById(selectText).value=selectedText;
									hideDestroyDialoge(dlg);
									if (typeof elem.onchange == 'function') elem.onchange.apply(elem);
								}
				    	    });
				    	    
				    	});

				       installSortableTable(document.getElementById('scrollable'));
			        }catch(e){
			        	
			        }
				   
				   
			   },
			   error:function(error){
				   dojo.query("#"+dialogId+" #ajaxStat").forEach(dojo.destroy);
//				   dlg.setContent("error:"+error);
				   alert("error:"+error);
			   }
			});
	}



function prepareSearchDialoge(dialogId,url,formData,selectText,selectHidden){
//alert (dialogId) ;
	var dlg=dijit.byId(dialogId);
	if(dlg!=null){
		try{dlg.destroyRecursive();}catch(e){}
	}
    dlg = new dojox.widget.DialogSimple({  
		executeScripts	:true,
			   id:dialogId
	});

    dlg.setContent("<div style='width:400px'>در حال بارگیری ...</div><br/><br/><div>"+closeButton(dialogId)+"</div>");
    
    
	dojo.query("#"+dialogId+" .dijitDialogTitleBar").prepend("<img id='ajaxStat' style='float:left' src='Pages/images/kittscanner.gif'/>");
	dlg.startup();
	dlg.show();
	removeXButton(dialogId);
	dojo.xhrGet({
		   url:url+"&ajax=true",
//		   content:formData,   
		   load: function(data){
			   dojo.query("#"+dialogId+" #ajaxStat").forEach(dojo.destroy);
			   dlg.setContent(data+closeButton(dialogId));
			   removeXButton(dialogId);
			   dojo.query("#"+dialogId+" #findForm").attr('id', "findForm_"+dialogId);
			  
			   objectToForm("findForm_"+dialogId,formData);
			   
//			   dojo.query("#"+dialogId+" #findForm_"+dialogId+" input[name='returnAddress']").val(returnAdd);
			   
			   
			   dojo.forEach(dojo.query("#"+dialogId+" #findForm_"+dialogId+" input[type='text']"), function(element) {
					dojo.attr(element,"onkeypress","onKeySearch(event,'"+dialogId+"','"+selectText+"','"+selectHidden+"','"+"findForm_"+dialogId+"');");
		    	});
			   
			   document.getElementById(dialogId).innerHTML=document.getElementById(dialogId).innerHTML.replace(/'findForm'/g, "'findForm_"+dialogId+"'");
			   try{
				   dojo.query('#'+dialogId+" button[onclick^='goSearch']").attr("onclick","goSearchAjax('"+dialogId+"','"+selectText+"','"+selectHidden+"','"+"findForm_"+dialogId+"');");
			   }catch(e){
				   document.getElementById(dialogId).innerHTML=document.getElementById(dialogId).innerHTML.replace(/goSearchNew\(.*\)/g,"goSearchAjax('"+dialogId+"','"+selectText+"','"+selectHidden+"','"+"findForm_"+dialogId+"')");
			   }

		
			   
			   document.getElementById(dialogId).innerHTML=document.getElementById(dialogId).innerHTML.replace(/gotoPageNew\(\+1.*\)/g,"goNextPageAjax('"+dialogId+"','"+selectText+"','"+selectHidden+"');");
		        document.getElementById(dialogId).innerHTML=document.getElementById(dialogId).innerHTML.replace(/gotoPageNew\(-1.*\)/g,"goPrevPageAjax('"+dialogId+"','"+selectText+"','"+selectHidden+"');");

		        
		        try{
		        
//		        dojo.query("#"+dialogId+" a[onclick*='goExport']").forEach(dojo.destroy);
		        dojo.query("#"+dialogId+" #exportCSV").forEach(dojo.destroy);
		        
		        dojo.query("#"+dialogId+" input[type=radio]").attr('checked', false);

		       
			    dojo.forEach(dojo.query("#"+dialogId+"  #scrollable  .odd"), function(element) {
			    	    dojo.connect(element, "onmouseover", function() {
			    	    	dojo.addClass(this,"over");
			    	    });

			    	    dojo.connect(element, "onmouseout", function() {
			    	    	dojo.removeClass(this,"over");
			    	    });
			    	    
			    	    dojo.connect(element, "onclick", function() {
			    	    	var elem = document.getElementById(selectHidden) ;
			    	    	dojo.addClass(this,"selected");
			    	    	dojo.query ("#"+dialogId + " .selected > td > input[type='radio']").attr('checked', true);
			    	    	var values=dojo.query("#"+dialogId+ " input[type='radio']:checked").val();
							if(values!=null){
								var vals=values.split("__");
								elem.value=vals[0];
								var selectedText = "";
								if (vals.length > 1){
									var idx = vals[1].indexOf("$${");
									if (idx >= 0)
										selectedText = vals[1].substring(0,idx);
									else
										selectedText = vals[1];
									
								}
								if ( selectText)
									document.getElementById(selectText).value=selectedText;
								hideDestroyDialoge(dlg);
								if (typeof elem.onchange == 'function') elem.onchange.apply(elem);
							}
			    	    });
			    	    
			    	});

			       dojo.forEach(dojo.query("#"+dialogId+"  #scrollable  .even"), function(element) {
			    	    dojo.connect(element, "onmouseover", function() {
			    	    	dojo.addClass(this,"over");
			    	    });

			    	    dojo.connect(element, "onmouseout", function() {
			    	    	dojo.removeClass(this,"over");
			    	    });
			    	    
			    	    dojo.connect(element, "onclick", function() {
			    	    	var elem = document.getElementById(selectHidden) ;
			    	    	dojo.addClass(this,"selected");
			    	    	dojo.query ("#"+dialogId+" .selected > td > input[type='radio']").attr('checked', true);
			    	    	var values=dojo.query("#"+dialogId+" input[type='radio']:checked").val();
							if(values!=null){
								var vals=values.split("__");
								elem.value=vals[0];
								var selectedText = "";
								if (vals.length > 1){
									var idx = vals[1].indexOf("$${");
									if (idx >= 0)
										selectedText = vals[1].substring(0,idx);
									else
										selectedText = vals[1];
									
								}
								
								if (selectText)
									document.getElementById(selectText).value=selectedText;
								hideDestroyDialoge(dlg);
								if (typeof elem.onchange == 'function') elem.onchange.apply(elem);
							}
			    	    });
			    	    
			    	});

			       installSortableTable(document.getElementById('scrollable'));
		        }catch(e){
		        	
		        }
			   
			   
		   },
		   error:function(error){
			   dojo.query("#"+dialogId+" #ajaxStat").forEach(dojo.destroy);
//			   dlg.setContent("error:"+error);
			   alert("error:"+error);
		   }
		});
}

function closeDialog(dialogId){
	try{dijit.hideTooltip(toolTipDom);}catch(e){}
	var myDlg=dijit.byId(dialogId);
	var dlgs;
	if (!myDlg)
		return;
/*	popMeFromDestroy(dialogId);
	if (destroyables.length > 0 ){
		if (dojo.query("#"+dialogId+" input[name=TerminateAllAjax]")){
			dlgs= destroyables.split(',');
		}
	}*/
	hideDestroyDialoge(myDlg);
/*	if (dlgs){
		var n= dlgs.length;
		for ( i=n-1;i>-1; i--){
			var dlg=dijit.byId(dlgs[i]);
			if(dlg!=null){
				popMeFromDestroy(dlgs[i]);
				hideDestroyDialoge(dlg);
			}
		}
	}
	if ( needsRefresh) {
		window.location.reload(true);
	} */
}


function removeXButton(dialogId){
//	dojo.forEach(dojo.query(".dijitDialogCloseIcon"),function(element){
//		dojo.attr(element,"onclick", "closeDialog('"+dialogId+"')")
//	});
}

function closeButton(dialogId){
	return "<input type='button' id='closeSearchDialog' style='background-image: url(Pages/images/icons/false.gif)' onclick=\"closeDialog('"+dialogId+"')\" value='  بستن' class='button'/>";
}

function goNextPageAjax(dialogId,selectText,selectHidden){
	var frm=dojo.query("#"+dialogId+" #resultsForm");
	frm.query("input[name='movement']").attr('value','1');
	frm.query("input[name='operation']").attr('value','REFIND');
	return goSearchAjax(dialogId,selectText,selectHidden,"resultsForm");
}

function goPrevPageAjax(dialogId,selectText,selectHidden){
	var frm=dojo.query("#"+dialogId+" #resultsForm");
	frm.query("input[name='movement']").attr('value','-1');
	frm.query("input[name='operation']").attr('value','REFIND');
	return goSearchAjax(dialogId,selectText,selectHidden,"resultsForm");
}
function hideDestroyDialoge(dialog){
	try{
		dialog.hide();
		dialog.destroyRecursive();
	}catch(e){
		
	}
}
function goSearchAjax(dialogId,selectText,selectHidden,formName){
	
	if(document.getElementById("ajaxStat")!=null){
		// another ajax proccess running so return
		return;
	}

	if(!formName){
		formName="findForm";
	}
	
	

	if(!checkAjaxInput()){
		fce(document.getElementById(formName),"ajax","true");			
	}
	

	var dlg=dijit.byId(dialogId);
	dojo.query("#"+dialogId+" .dijitDialogTitleBar").prepend("<img id='ajaxStat' style='float:left' src='Pages/images/kittscanner.gif'/>");
	dojo.query("#"+dialogId+" #"+formName).prepend("<input type='hidden' name='ajax' value='true'>");

			
	dojo.xhrPost({
	    form: formName,
	    load: function(data){
			   dojo.query("#"+dialogId+" #ajaxStat").forEach(dojo.destroy);
			   
			   try{dlg.destroyRecursive();}catch(e){}
			   dlg = new dojox.widget.DialogSimple({  
					executeScripts	:true,
					   id:dialogId,
					   content:data+closeButton(dialogId),
					   style:"width:"+viewport()['width']*0.75+"px  ;height:"+viewport()['height']*0.75+"px  ;overflow:scroll;draggable:true;background-color:white"
					});
			   var rowCount=10;
			   try{
				   rowCount=dojo.query("select[name='parameter(rowCount)'] option[selected]").val();
				   
			   }catch(eeee){
				   
			   }
			   
			   if(rowCount>10){
				   try{dlg.destroyRecursive();}catch(e){}
				   dlg = new dojox.widget.DialogSimple({  
						executeScripts	:true,
						   id:dialogId,
						   content:data+closeButton(dialogId),
						   style:"width:"+viewport()['width']*0.9+"px  ;height:"+viewport()['height']*0.9+"px  ;overflow:scroll;draggable:true;background-color:white"
						});
			   }
			   
			   
			   
			   dojo.query("#"+dialogId+" #findForm").attr('id', "findForm_"+dialogId);
			   
			   dojo.forEach(dojo.query("#"+dialogId+" #findForm_"+dialogId+" input"), function(element) {
					dojo.attr(element,"onkeypress","onKeySearch(event,'"+dialogId+"','"+selectText+"','"+selectHidden+"','"+"findForm_"+dialogId+"');");
		    	});
			   
			   try{
				   dojo.query('#'+dialogId+" button[onclick^='goSearch']").attr("onclick","goSearchAjax('"+dialogId+"','"+selectText+"','"+selectHidden+"','"+"findForm_"+dialogId+"');");
			   }catch(e){
			       document.getElementById(dialogId).innerHTML=document.getElementById(dialogId).innerHTML.replace(/goSearchNew\(.*\)/g,"goSearchAjax('"+dialogId+"','"+selectText+"','"+selectHidden+"','"+"findForm_"+dialogId+"')");
			   }

			   
//		        dojo.query("#"+dialogId+" button[onclick^='submitFormSelect']").attr("onclick","goSelectAjax('"+dialogId+"','"+selectText+"','"+selectHidden+"');");
//		        dojo.query("#"+dialogId+" #nextPage").attr("onclick","goNextPageAjax('"+dialogId+"','"+selectText+"','"+selectHidden+"');");
//		        dojo.query("#"+dialogId+" #prePage").attr("onclick","goPrevPageAjax('"+dialogId+"','"+selectText+"','"+selectHidden+"');");

		        document.getElementById(dialogId).innerHTML=document.getElementById(dialogId).innerHTML.replace(/gotoPageNew\(\+1.*\)/g,"goNextPageAjax('"+dialogId+"','"+selectText+"','"+selectHidden+"');");
		        document.getElementById(dialogId).innerHTML=document.getElementById(dialogId).innerHTML.replace(/gotoPageNew\(-1.*\)/g,"goPrevPageAjax('"+dialogId+"','"+selectText+"','"+selectHidden+"');");

		        
		        
		        
//		        dojo.query("#"+dialogId+" a[onclick*='goExport']").forEach(dojo.destroy);
		        dojo.query("#"+dialogId+" #exportCSV").forEach(dojo.destroy);
		        
		        dojo.query("#"+dialogId+" input[type=radio]").attr('checked', false);

		       
			          
			       
			       dojo.forEach(dojo.query("#"+dialogId+"  #scrollable  .odd"), function(element) {
			    	    dojo.connect(element, "onmouseover", function() {
			    	    	dojo.addClass(this,"over");
			    	    });

			    	    dojo.connect(element, "onmouseout", function() {
			    	    	dojo.removeClass(this,"over");
			    	    });
			    	    
			    	    dojo.connect(element, "onclick", function() {
			    	    	var elem = document.getElementById(selectHidden) ;
			    	    	dojo.addClass(this,"selected");
			    	    	dojo.query (".selected > td > input[type='radio']").attr('checked', true);
			    	    	var values=dojo.query("input[type='radio']:checked").val();
							if(values!=null){
								var vals=values.split("__");
								elem.value=vals[0];
								var selectedText = "";
							if (vals.length > 1){
									var idx = vals[1].indexOf("$${");
									if (idx >= 0)
										selectedText = vals[1].substring(0,idx);
									else
										selectedText = vals[1];
									
								} 
								if (selectText)
									document.getElementById(selectText).value=selectedText;
								hideDestroyDialoge(dlg);
								if (typeof elem.onchange == 'function') elem.onchange.apply(elem);
							}
			    	    });
			    	    
			    	});

			       dojo.forEach(dojo.query("#"+dialogId+"  #scrollable  .even"), function(element) {
			    	    dojo.connect(element, "onmouseover", function() {
			    	    	dojo.addClass(this,"over");
			    	    });

			    	    dojo.connect(element, "onmouseout", function() {
			    	    	dojo.removeClass(this,"over");
			    	    });
			    	    
			    	    dojo.connect(element, "onclick", function() {
			    	    	var elem = document.getElementById(selectHidden) ;
			    	    	dojo.addClass(this,"selected");
			    	    	dojo.query (".selected > td > input[type='radio']").attr('checked', true);
			    	    	var values=dojo.query("input[type='radio']:checked").val();
							if(values!=null){
								var vals=values.split("__");
								elem.value=vals[0];
								var selectedText = "";
								if ( vals.length > 1){
									var idx = vals[1].indexOf("$${");
									if (idx >= 0)
										selectedText = vals[1].substring(0,idx);
									else
										selectedText = vals[1];
									
								} 
								if (selectText)
									document.getElementById(selectText).value=selectedText;
								hideDestroyDialoge(dlg);
								if (typeof elem.onchange == 'function') elem.onchange.apply(elem);
							}
			    	    });
			    	    
			    	});

			       installSortableTable(document.getElementById('scrollable'));
			   dlg.startup();
		       dlg.show();
		       removeXButton(dialogId);
	    },
	    error:function(e){
			alert(e);
		}
	});


	return false; 
}
//----------------------------------------------------------------
function goNextPageAjax2(dialogId,formName){
	var frm=dojo.query("#"+dialogId+" #"+formName);
	frm.query("input[name='movement']").attr('value','1');
	frm.query("input[name='operation']").attr('value','REFIND');
	return goSearchAjax2(dialogId,formName);
}

function goPrevPageAjax2(dialogId,formName){
	var frm=dojo.query("#"+dialogId+" #"+formName);
	frm.query("input[name='movement']").attr('value','-1');
	frm.query("input[name='operation']").attr('value','REFIND');
	return goSearchAjax2(dialogId,formName);
}


function submitFormSelect2(formId) {
	  var form = document.getElementById(formId);  
	  var j = getSelectedCount(form);
	  if (j == 0) {
	          alert("حداقل يك سطر را انتخاب نماييد");
	          return false;
	  }
	  else {
//	      form.returnAddress.value = returnAddress;
	//	disableOnSubmit(form);
	    if ( form.returnAddress) 
	    	form.returnAddress.value = returnAddressForSelect;
	    form.operation.value = 'SELECT';
	    submitForm(form);
	  }
	}

function invertToggle(e){
	e.checked = (e.checked)?(false):(true);
}

function goSearchAjax2(dialogId,formName){
//	alert(viewport()['width']+" "+viewport()['height']);
	if(document.getElementById("ajaxStat")!=null){
		// another ajax proccess running so return
		return;
	}

	if(!formName){
		formName="findForm";
	}
	
	
	if(!checkAjaxInput()){
		fce(document.getElementById(formName),"ajax","true");			
	}


	var dlg=dijit.byId(dialogId);
	dojo.query("#"+dialogId+" .dijitDialogTitleBar").prepend("<img id='ajaxStat' style='float:left' src='Pages/images/kittscanner.gif'/>");
	dojo.query("#"+dialogId+" #"+formName).prepend("<input type='hidden' name='ajax' value='true'>");

		
	dojo.xhrPost({
	    form: formName,
	    load: function(data){
			   dojo.query("#"+dialogId+" #ajaxStat").forEach(dojo.destroy);
			   
			   try{dlg.destroyRecursive();}catch(e){}
			   dlg = new dojox.widget.DialogSimple({  
					executeScripts	:true,
					   id:dialogId,
					   content:data+closeButton(dialogId),
					   style:"width:"+viewport()['width']*0.7+"px;height:"+viewport()['height']*0.7+"px;overflow:scroll;draggable:true;background-color:white"
				});

			   
			   var rowCount=10;
			   try{
				   rowCount=dojo.query("select[name='parameter(rowCount)'] option[selected]").val();
				   
			   }catch(eeee){
				   
			   }
			   
			   
			   dojo.query("#"+dialogId+" #findForm").attr('id', "findForm_"+dialogId);
			   
			   
			   dojo.forEach(dojo.query("#"+dialogId+" #findForm_"+dialogId+" input"), function(element) {
					dojo.attr(element,"onkeypress","onKeySearch2(event,'"+dialogId+"','"+"findForm_"+dialogId+"');");
		    	});
			   
			   try{
				   dojo.query('#'+dialogId+" button[onclick^='goSearch']").attr("onclick","goSearchAjax2('"+dialogId+"','"+"findForm_"+dialogId+"');");
			   }catch(e){
			       document.getElementById(dialogId).innerHTML=document.getElementById(dialogId).innerHTML.replace(/goSearchNew\(.*\)/g,"goSearchAjax2('"+dialogId+"','"+"findForm_"+dialogId+"'");
			   }

//			   dojo.query("#"+dialogId+" #resultsForm").attr('id', "resultsForm_"+dialogId);
//			   dojo.query("#"+dialogId+" #findForm_"+dialogId+" #resultsForm").attr('id', "resultsForm_"+dialogId);
			   
			   document.getElementById(dialogId).innerHTML=document.getElementById(dialogId).innerHTML.replace(/Toggle\(this\)/g,"invertToggle(this)");
			   document.getElementById(dialogId).innerHTML=document.getElementById(dialogId).innerHTML.replace(/selectAll\(/g,"selectAjaxAll('"+dialogId+"',");
			   document.getElementById(dialogId).innerHTML=document.getElementById(dialogId).innerHTML.replace(/resultsForm/g,"resultsForm_"+dialogId);
			   document.getElementById(dialogId).innerHTML=document.getElementById(dialogId).innerHTML.replace(/submitFormSelect/g,"submitFormSelect2");		   
//		       document.getElementById(dialogId).innerHTML=document.getElementById(dialogId).innerHTML.replace(/submitFormSelect\('resultsForm'\)/g,"submitFormSelect2('"+"resultsForm_"+dialogId+"')");


		        document.getElementById(dialogId).innerHTML=document.getElementById(dialogId).innerHTML.replace(/gotoPageNew\(\+1.*\)/g,"goNextPageAjax2('"+dialogId+"','"+"resultsForm_"+dialogId+"');");
		        document.getElementById(dialogId).innerHTML=document.getElementById(dialogId).innerHTML.replace(/gotoPageNew\(-1.*\)/g,"goPrevPageAjax2('"+dialogId+"','"+"resultsForm_"+dialogId+"');");

		        
		        
		        
		        dojo.query("#"+dialogId+" #exportCSV").forEach(dojo.destroy);
		        dojo.query("#"+dialogId+" input[type=checkbox]").attr('checked', false);

		       prepareHover(dialogId,"even");
		       prepareHover(dialogId,"odd");
		       installSortableTable(document.getElementById('scrollable'));
		       dlg.startup();
		       dlg.show();
		       removeXButton(dialogId);
		       
	    },
	    error:function(e){
			alert(e);
		}
	});
	
	
	return false; 
}


function nodeClickAjax( evt, eSrc, id, open, closed ) {
	var form = document.getElementById('treeForm');
	var eSpan = document.getElementById('span'+id);
  eSpan.className = (eSpan.className=='clsShow') ? 'clsHide' : 'clsShow';
  var eImg = document.getElementById('img'+id);
  eImg.src = 'Pages/images/tree_progress.gif';
  if( eSpan.className=='clsHide' ) {
//    eImg.src = imgRelativePath + open;
    form.treeOperation.value = "closed";
//    return false;
  }
  else {
//    eImg.src = imgRelativePath + closed;
    form.treeOperation.value = "opened";
  }
  
  var inputElements = form.elements ;
  if (!inputElements || !inputElements["id"]){
	  alert ("خطا! با راهبر سیستم تماس بگیرید.");
	  return;
  }
  inputElements["id"].value = id ;
  
  if(!checkAjaxInput()){
		fce(form,"ajax","true");			
	}
//	dojo.query("#"+dialogId+" #"+treeForm).prepend("<input type='hidden' name='ajax' value='true'>");
	
//	  alert('here');

	dojo.xhrPost({
	    form: "treeForm",
	    load: function(data){
	    	document.getElementById("content").innerHTML=data;
	        try{
	        	var hh = Math.max(dojo.coords('content').h + 140, dojo.coords('sidebar').h) + "px";
		        dojo.style('maincontent', 'height', hh);
		        dojo.style('sidebar', 'height', hh);
	    	}catch(e){
	    		
	    	}
//	    	try{
//		        var h = Math.max(dojo.query('.contentwrap').coords()[0].h, dojo.coords('sidebar').h) + "px";
//		        jo.style('maincontent', 'height', "100%");
//		        jo.style('maincontent', 'sidebar', "100%");
//	    	}catch(e){}
	    },
	    error:function(e){
			alert(e);
		}
	});
  
  return false;
}

function checkAjaxInput(){
	var inp=document.getElementsByTagName("input");
	return (typeof inp["ajax"]!= 'undefined' )

}

function haveSameURI(url, URI ){
	return url.substring(0,url.indexOf('?')) == URI ;
}

function submitFormAjax(formName,lastUrl, killMe){
	
	if(document.getElementById("ajaxStat")!=null){
		// another ajax proccess running so return
		return;
	}


	var dialogId="gdlg_"+Math.floor(Math.random()*100000);

	var dlg=dijit.byId(dialogId);
	if(dlg!=null){
		try{dlg.destroyRecursive();}catch(e){}
	}
	
	dlg = new dojox.widget.DialogSimple({  
		executeScripts	:true,
	   				   id:dialogId,
			 		   content:"<div style='width:400px'>لطفا چند لحظه صبر نمایید ...</div><br/><br/>"+"<div>"+closeButton(dialogId)+"</div>"
		    	});
	
	dlg.startup();
	dlg.show();
	
	dojo.query("#"+dialogId+" .dijitDialogTitleBar").prepend("<img id='ajaxStat' style='float:left' src='Pages/images/kittscanner.gif'/>");

	var destroy = false;
	if(!checkAjaxInput()){
		fce(document.getElementById(formName),"ajax","true");		
		dojo.query("#"+dialogId+"#"+formName).prepend("<input type='hidden' name='ajax' value='true'>");
		destroy = true;
	}
	//alert("submitFormAjax: Then Here!");
	var currentAction = form.action;
	dojo.xhrPost({
	    form: formName,
	    load: function(data){
			if (destroy)
	    	  dojo.query("#ajaxInputHidden").forEach(dojo.destroy);
	    	if ( lastUrl )
	    	  document.getElementById(formName).action=lastUrl;
	    	dojo.query("#"+dialogId+" #ajaxStat").forEach(dojo.destroy);
			try{dlg.destroyRecursive();}catch(e){}
			if ((killMe && lastCandidate != null)|| haveSameURI(currentAction,lastAction) ){
				dlg = dijit.byId (lastCandidate ); 
				dlg.set("content", data+closeButton(lastCandidate));
			}
			else {
				dlg = new dojox.widget.DialogSimple({  
					executeScripts	:true,
					   id:dialogId,
					   content:data+closeButton(dialogId),
					   style:"width:"+viewport()['width']*0.7+"px  ;height:"+viewport()['height']*0.7+"px  ;overflow:scroll;draggable:true;background-color:white"
	
					});
/*				if (!killMe)
					pushMeToDestroy(dialogId,currentAction);
				else 
					lastCandidate = dialogId; */
			}
			dlg.startup();
			dlg.show();
			//attachEvents(dlg);
	     },
	     error:function(e){
	    	  dojo.query("#ajaxInputHidden").forEach(dojo.destroy);
	    	  document.getElementById(formName).action=lastUrl;
	    	  alert(e);
		 }
	});
	
}



function selectAjaxAll(dialogId,containerElement, checkAll, exceptionId) {
	toolTipDom=checkAll;
	if(checkAll.checked){
		dijit.showTooltip("<a href='javascript:void(0);' onclick='javascript:selectAllOnServer(\""+dialogId+"\");'>انتخاب همه "+dojo.query("#"+dialogId+" #totalSearchCount").html()+" مورد"+"</a>",toolTipDom);
	}else{
		dijit.hideTooltip(toolTipDom);
	}
	selectAll(containerElement, checkAll, exceptionId);
//	checkAll.checked=!checkAll.checked;
}


function gotoUrlAjax(formId, url, killMe) {
	//alert("gotoUrlAjax: Called!");
	    if (arguments[3]) { 
	    	/* has fourth argument */ 
		    var prompt = arguments[3]; // 3th argument
		    if (prompt == "MESSAGE") 
		      alert(arguments[4]);
		    else if ( prompt == "CONFIRM" && !confirm(arguments[4]) )
		        return;
	    }
   		if(document.getElementById("ajaxStat")!=null){
    		// another ajax proccess running 
    		return;
    	}


    	var dialogId="gdlg_"+Math.floor(Math.random()*100000);

    	var dlg=dijit.byId(dialogId);
    	if(dlg!=null){
    		try{dlg.destroyRecursive();}catch(e){}
    	}
    	
    	dlg = new dojox.widget.DialogSimple({  
			executeScripts	:true,
    	   				   id:dialogId,
    			 		   content:"<div style='width:400px'>لطفا چند لحظه صبر نمایید ...</div><br/><br/>"+"<div>"+closeButton(dialogId)+"</div>"
    		    	});
    	
    	dlg.startup();
    	dlg.show();
    	
    	dojo.query("#"+dialogId+" .dijitDialogTitleBar").prepend("<img id='ajaxStat' style='float:left' src='Pages/images/kittscanner.gif'/>");

    	if (url.indexOf("ajax=true")< 0 )
    		url+="&ajax=true"
    	dojo.xhrGet({
    	    url: url,
    	    load: function(data){
    	    	dojo.query("#"+dialogId+" #ajaxStat").forEach(dojo.destroy);
    			dlg.destroyRecursive();
/*    			if (killMe && lastCandidate != null ){
    				dlg = dijit.byId (lastCandidate ); 
    				dlg.set("content", data+closeButton(lastCandidate));
    			}
    			else { */
    				dlg = new dojox.widget.DialogSimple({  
    					executeScripts	:true,
    					   id:dialogId,
    					   content:data+closeButton(dialogId),
    					   style:"width:"+viewport()['width']*0.7+"px  ;height:"+viewport()['height']*0.7+"px  ;overflow:scroll;draggable:true;background-color:white"
    	
    					});
/*    				if (!killMe)
    					pushMeToDestroy(dialogId);
    				else 
    					lastCandidate = dialogId; 
    			} */
    			dlg.startup();
    			dlg.show();
    			//attachEvents(dlg);
    	     },
    	     error:function(e){
    	    	  dojo.query("#ajaxInputHidden").forEach(dojo.destroy);
    	    	  alert(e);
    		 }
    	});
    	
}  


function prepareHover(dialogId,row){
	dojo.forEach(dojo.query("#"+dialogId+"  #scrollable ."+row), function(element) {
	    dojo.connect(element, "onmouseover", function() {
	    	dojo.addClass(this,"over");
	    });

	    dojo.connect(element, "onmouseout", function() {
	    	dojo.removeClass(this,"over");
	    });
	    
	    dojo.connect(element, "onclick", function() {
	    	var checkbox=dojo.query("input[type='checkbox']",this)
	    	var checked=checkbox.attr('checked');
	    	if(checked=='false'){
	    		checkbox.attr('checked',true);
	    		dojo.addClass(this,"selected");
	    	}else{
	    		checkbox.attr('checked',false);
	    		dojo.removeClass(this,"selected");
	    	}
	    	
	    });
	    
	});
	
}

function onKeySearch2(e,dialogId,formName){
	var keynum;
	if(window.event){ // IE8 and earlier
		keynum = e.keyCode;
	}else if(e.which){ // IE9/Firefox/Chrome/Opera/Safari
		keynum = e.which;
	}
	
	if(keynum==13)
		goSearchAjax2(dialogId,formName);
}

function onKeySearch(e,dialogId,selectText,selectHidden,formName){
	var keynum;
	if(window.event){ // IE8 and earlier
		keynum = e.keyCode;
	}else if(e.which){ // IE9/Firefox/Chrome/Opera/Safari
		keynum = e.which;
	}
	
	if(keynum==13)
		goSearchAjax(dialogId,selectText,selectHidden,formName);
}

function objectToForm(formName,objects){
	
	for(var name in objects){
		try{
		var myInput=dojo.query("#"+formName+" input[name='"+name+"']");
		
		if(myInput==null || myInput.attr('name') ==""){
//			continue;
			var input = document.createElement("input");
			input.setAttribute("type", "hidden");
			input.setAttribute("name", name);
			input.setAttribute("value", objects[name]);
//			alert('value='+objects[name]);
			document.getElementById(formName).appendChild(input);
			
		}else{
			if(name=='returnAddress')
				myInput.val(objects[name]);
		}
		}catch(ee){
		}
	}	
	
	
}


function gotoPageNew(page,dialog){
	if (!dialog)
		dialog = "";
	var frm=dojo.query("#resultsForm"+dialog);
	if (!frm) {
		alert("Error: resultsForm" + dialog + " not recognized.");
		return;
	}
	frm.query("input[name='movement']").attr('value',page);
	frm.query("input[name='operation']").attr('value','REFIND');
	var searchForm = document.getElementById('resultsForm'+dialog);
	if (dialog){
		if( searchForm.action.indexOf("ajax=true")<0 ) 
			if ( searchForm.action.indexOf("?") > 0 )
				searchForm.action = searchForm.action +"&ajax=true" ;
			else
				searchForm.action = searchForm.action +"?ajax=true" ;
		postAjaxForm('resultsForm'+dialog);
		return;
	}
	return submitForm(searchForm);
}

function shouldIgnoreSearch(formName){
	return true;
	/*
	if (!history.pushState) {
		  return true;
	}
	try{
		var finder=dojo.query("#"+formName+" input[value='findForStdTrackManagment']");
		if(finder){
			if(finder.attr('name')=="parameter(finder)"){
				return true;
			}
		}
	}catch(ee){}
		
	try{
		var finder=dojo.query("#"+formName+" input[value='findStudentWorkbookState']");
		if(finder){
			if(finder.attr('name')=="parameter(finder)"){
				return true;
			}
		}
	}catch(ee){}
		
	
	try{
		finder=dojo.query("#"+formName+" input[value='findForGeneralExamination']");
		if(finder){
			if(finder.attr('name')=="parameter(finder)"){
				return true;
			}
		}
	}catch(ee){	}
	
	try{
		finder=dojo.query("#"+formName+" input[value='findForFinalConfirm']");
		if(finder){
			if(finder.attr('name')=="parameter(finder)"){
				return true;
			}
		}
	}catch(ee){	}
	
	return false;
	*/
}



function goSearchNew(formName, ajaxMode){
	
	if(!formName)
		formName='findForm';

	var searchForm = document.getElementById(formName);
	document.getElementById("export").value="false";
	if(ajaxMode == "true" && searchForm.action.indexOf("ajax=true")<0 ){ 
		if ( searchForm.action.indexOf("?") > 0 )
			searchForm.action = searchForm.action +"&ajax=true" ;
		else
			searchForm.action = searchForm.action +"?ajax=true" ;
		return postAjaxForm(formName);
	}
	
	return submitForm(searchForm);
	
}


function goExecAjax(formName){
	if(formName==null){
		formName='execForm';
	}
	if (!document.getElementById(formName)){
		alert("خطا در نحوه فراخوانی");
		return;
	}
	
	if(document.getElementById("ajaxStat")!=null){
		// another ajax proccess running so return
		alert("اندکی تامل و دوباره تلاش کنید");
		return;
	}
	var dialogId="gdlg_"+Math.floor(Math.random()*100000);

	var dlg=dijit.byId(dialogId);
	if(dlg!=null){
		try{dlg.destroyRecursive();}catch(e){}
	}
	
	dlg = new dojox.widget.DialogSimple({  
		executeScripts	:true,
	   				   id:dialogId,
			 		   content:"<div style='width:400px'>لطفا چند لحظه صبر نمایید ...</div><br/><br/>"+"<div>"+closeButton(dialogId)+"</div>"
		    	});
	
	dlg.startup();
	dlg.show();
	
	dojo.query("#"+dialogId+" .dijitDialogTitleBar").prepend("<img id='ajaxStat' style='float:left' src='Pages/images/kittscanner.gif'/>");
	if(!checkAjaxInput()){
		fce(document.getElementById(formName),"ajax","true");		
		dojo.query("#"+dialogId+"#"+formName).prepend("<input type='hidden' name='ajax' value='true'>");
	}
	dojo.xhrPost({
	    form: formName,
	    load: function(data){
	    	  dojo.query("#ajaxInputHidden").forEach(dojo.destroy);
	    		dojo.query("#"+dialogId+" #ajaxStat").forEach(dojo.destroy);
			   
			   try{dlg.destroyRecursive();}catch(e){}
			   dlg = new dojox.widget.DialogSimple({  
					executeScripts	:true,
				   id:dialogId,
				   content:data+closeButton(dialogId)
				});
			   dlg.startup();
			   dlg.show();
	    },
	    error:function(e){
	    	  dojo.query("#ajaxInputHidden").forEach(dojo.destroy);
			alert(e);
		}
	});
}



function updateTab(){
//	var tab=dijit.byId("mainTabDijit");
//	tab.setContent(document.getElementById("content").innerHTML);
//      var w = document.body.scrollWidth- parseInt ( dojo.coords('sidebar').w)-100+"px" ;
//      var h = Math.max(dojo.query('.contentwrap').coords()[0].h, dojo.coords('sidebar').h)-70 + "px";
//	dojo.style("contentwrap","width",w);
//	dojo.style("contentwrap","height",h);
	

}

function selectAllOnServer(dialogId){
	var form=document.getElementById("resultsForm_"+dialogId);
	
	dojo.query("#"+dialogId+" input[type='checkbox']").forEach(function(elem){
		if(elem.name!="selectManager")
			Clear(elem);
	});
	
	disableOnSubmit(form);
    form.returnAddress.value = returnAddressForSelect;
    form.operation.value = 'SELECTALL';
    submitForm(form);
    
}
if (history.pushState) {
	window.addEventListener('popstate', function(event) {
	    if (event.state) {
	    	location.reload();
	    }
	}, false);
}

function replaceAll(txt, replace, with_this) {
	return txt.replace(new RegExp(replace, 'g'),with_this);
}


function goSearchSimple(selectForward,selectedId,subject,finder){
	var formName='findForm';
//	var input = document.createElement("input");
//	input.setAttribute("id","ajaxInput");
//	input.setAttribute("type", "hidden");
//	input.setAttribute("name", "ajax");
//	input.setAttribute("value", "true");
	
//above lines were commented out by Davarpanah: we just check .do query styles no need to ajax input 
//and Note: it is a "get" operation this input element won't be posted anyway!

	
//	document.getElementById(formName).appendChild(input);

	document.getElementById("ajaxMessage").innerHTML="";	
	var url="Pages/idfinderAndCompleteSelectForward.jsp?subject="+subject+"&finder="+finder+"&selectForward="+selectForward+"&selectedId="+selectedId;
    dojo.style('SimpleAjaxStat', 'display', 'block');
   
	dojo.xhrGet({
		   url:url,
		   //This url being a .jsp call won't be checked by CSS security module
		   load: function(data1){
			   data1=replaceAll(data1,"\n","");
			   data1=replaceAll(data1,"\r","");
			   if(data1=="notfound"){
					document.getElementById("ajaxMessage").innerHTML="<li class='error'>جستجو نتیجه ای در بر نداشت.</li>";
			   }else{
				   window.location= data1;
			   }
			   dojo.style('SimpleAjaxStat', 'display', 'none');
			   
		   },
		   error:function(data1){
			   alert(e);
			   dojo.style('SimpleAjaxStat', 'display', 'none');
		   }
		});
	
	return false;
}

function selectAndForward( selectForward,selectedId,subject,finder){
	var dlgId = "dlg_"+Math.floor(Math.random()*1000);
	prepareSearchDialoge(dlgId,url, formId,selectedText,selectedId);
	tagText.append(");");

//	input.setAttribute("value", "true");
	
//above lines were commented out by Davarpanah: we just check .do query styles no need to ajax input 
//and Note: it is a "get" operation this input element won't be posted anyway!

	
//	document.getElementById(formName).appendChild(input);

	document.getElementById("ajaxMessage").innerHTML="";	
	var url="Pages/idfinderAndCompleteSelectForward.jsp?subject="+subject+"&finder="+finder+"&selectForward="+selectForward+"&selectedId="+selectedId;
    dojo.style('SimpleAjaxStat', 'display', 'block');
   
	dojo.xhrGet({
		   url:url,
		   //This url being a .jsp call won't be checked by CSS security module
		   load: function(data1){
			   data1=replaceAll(data1,"\n","");
			   data1=replaceAll(data1,"\r","");
			   if(data1=="notfound"){
					document.getElementById("ajaxMessage").innerHTML="<li class='error'>جستجو نتیجه ای در بر نداشت.</li>";
			   }else{
				   window.location= data1;
			   }
			   dojo.style('SimpleAjaxStat', 'display', 'none');
			   
		   },
		   error:function(data1){
			   alert(e);
			   dojo.style('SimpleAjaxStat', 'display', 'none');
		   }
		});
	
	return false;
}



function goSearchAdvanced(finder, formId){
	var form=document.getElementById(formId);
	try{
		document.getElementById("operationId").value="RESET";
	}catch(e){}
	if(document.getElementById("ajaxInput"))
		document.getElementById("ajaxInput").value="false";
	var input = document.createElement("input");
	input.setAttribute("type", "hidden");
	input.setAttribute("name", "changeToAdvancedFinder");
	input.setAttribute("value", finder);
	form.appendChild(input);
	submitForm(form);	
	
}

function submitFormSelectSimple() {
	  var form = document.getElementById("simpleForm");  
		disableOnSubmit(form);
	    form.returnAddress.value = returnAddressForSelect;
	    form.operation.value = 'SELECT';
	    submitForm(form);
}


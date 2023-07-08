dojo.require("dojox.widget.DialogSimple");
dojo.require("dijit.form.Button");
dojo.require("dijit.Dialog");
dojo.require("dijit.layout.TabContainer");
dojo.require("dijit.layout.ContentPane");


function closeMe(dialogId){
	return "<input type='button' style='background-image: url(Pages/images/icons/false.gif)' onclick=\"closeSession('"+dialogId+"')\" value='  بستن' class='button'/>";
}

function closeSessionDialog(reference){
	ajaxStack.destroy(reference);
}




function dialogByGet(url, session){
/*	if (!isValidURL (url ) ) 
		throw("Bad url!"); */
	var dialogId = session.dialogId;
	if (!url.indexOf("ajax=true") < 0 )
		url.concat("&ajax=true");
	var dlg = new dojox.widget.DialogSimple({  
				executeScripts	:true,
	     		id				:dialogId,
	     		onHide: function() {
							ajaxStack.destroy(dialogId);
	     		   }
	     		});
	if (!ajaxLoading()){
		throw 'همزمانی در دسترسی به سرور. عملیات انجام نخواهد شد. مجددا تلاش کنید!' ;
	}
	var xhrArgs = {
		    url: url,
		    handleAs: "text",
		    preventCache: true,
            withCredentials: true
	};
	var deferred = dojo.xhrGet(xhrArgs);
	 deferred.then(
	      function(data){
	    	  ajaxFinished();
	    	  session.dlg = dlg;
	    	  session.data = data;
	    	  session.handleAjax(true);
	      },

	      function(error, ioargs){
	    	  if (! ioargs) 
	    		  ajaxSendMessage("خطا در دسترسی به سرور: "+"\n"+ error.responseText );
	    	  else
	    		  ajaxSendMessage(error.responseText);
	    	  session.status = error.status;
	    	  session.error = error;
	    	  session.data = null;
	          dlg.destroyRecursive();
	          session.handleAjax(false);
	      }
		);;
}



function dialogByPost(frm, session){
	var dialogId = session.dialogId;
	var dlg = new dojox.widget.DialogSimple({  
					executeScripts	:true,
		     		id				:dialogId,
		     		onHide: function() {
		ajaxStack.destroy(dialogId);
}
		     		});
		if (!ajaxLoading())
			return;
		var xhrArgs = {
			    form		: frm,
			    handleAs	: "text",
			    preventCache: true,
                withCredentials: true
		};
		 var deferred = dojo.xhrPost(xhrArgs);
		 deferred.then(  function(data){
		    	  ajaxFinished();
		    	  session.dlg = dlg;
		    	  session.data = data;
		    	  session.handleAjax(true);
		      },
		      function(error, ioargs){
		    	  if (! ioargs) 
		    		  ajaxSendMessage("خطا در دسترسی به سرور: "+"\n"+ error.responseText );
		    	  else
		    		  ajaxSendMessage(error.responseText);
		    	  session.status = error.status;
		    	  session.error = error;
		    	  session.data = null;
		          dlg.destroyRecursive();
		          session.handleAjax(false);
		      }
				
			);
}


function closeSession(dialogId){
	closeSessionDialog(dialogId);
}


var ajaxStack = { 		stack  			: new Array()
										, 
						stkptr 			: 0 
										, 
						init  		   : function(session){
											if (!session){
												alert ('Can not initialize stack with null object');
												return;
											}
											this.stack[0]= session;
						
										},
						top    			: function(){ 
											return this.stack[this.stkptr];
										},
						push			: function(session){
											if (!session.mode ){
												alert ("Uninitialized session!");
												return;
											}
											var currentMode = this.top().mode ;
											if (currentMode == "SEARCH" ){
												/** we have to preempt current search dialog in any scenario */
												if (session.mode == "ACTION")
													/** something happened and we have been forwarded somewhere -> refresh */
													this.top().refreshParent = true;
												this.pop();
												currentMode= this.top().mode;
											}
											if ( currentMode == "ACTION"  && session.Mode == "ACTION" ){
												/** we have been forwarded here **/
												//this.preemptURI(session.URI); /** TODO: support this logic: never push same more than once **/
												//currentMode = this.top().mode; /** requires more assessment **/
												session.refreshParent = true; /** should take care of action's side effects */
												if (currentMode != "ACTION" )	/** logic: never push an action on top of other modes(search/edit/exec) **/
													this.preemptOtherModes("ACTION");
											}
											this.stack[++this.stkptr] = session;
										},
							refresh		: function(){
											session=this.top();
											if (session.mode == "" )
												window.location.reload(false); /** reset & exit **/
												//window.location.replace(document.referrer);
											this.stkptr--;
											session.refresh();
										},
							pop_		: function(refresh){ /**should never be called for the end of stack*/
											var session = this.top();
											this.stack[this.stkptr--]= null;
											session.destroy();
											if (!refresh)
												return;
											session = this.top();
											session.refreshParent = true;
										},
							pop			: function (){
											var session = this.top();
											var currMode = session.mode;
											var parentRefresh = session.refreshParent ;
											if (currMode == "" ) /**The end of stack */
												return false;
											if (currMode == "CHANGED" || parentRefresh ){
												this.pop_(true);
												session = this.top();
												if (  	(  
														session.mode == "EXEC"  
															||
														session.mode == "EDIT" 	
															|| 
														session.mode == "NEW" 
														)
														&& 
														currMode != "NEW" 
														&& 
														currMode != "EDIT" 
													) 
													this.pop();
												else 
													if ( 	session.mode != "EDIT" 
															&& 
															session.mode != "NEW" 
															&&
															session.mode != "EXEC" )
														this.refresh();
											}
											else
												this.pop_(false);
											return true;
										},
							preemptURI	: function(uri) {
											var i;
											for (i=1; i<=this.stkptr; i++ )
												if (this.stack[i].URI == uri )
													break;
											if (i <= this.stkptr ){
												try{
													this.destroyTo(i);
												}
												catch(err){
													alert(err);
													throw ("Session URI preemption error.");
												}
												return true;
											}
											return false;
										},
						destroyTo		: function(index){
											while( this.stkptr>=index && this.pop() ){
											};
										},
						preemptOtherModes: function(mode){
												var i;
												for (i=this.stkptr; i>0 ; i-- )
													if (this.stack[i].mode != mode )
														break;
												if (i > 0 ){
													try{
														this.destroyTo(i);
													}
													catch(err){
														alert(err);
														throw ("Other modes preemption error.");
													}
													return true;
												}
												return false;
										},
						 rootRefresh	: function(){
											if (this.stack[0])
											         return(this.stack[0].refreshParent);
											else return false;
										},
						destroy			: function(refId){
											var idx = this.getIndex(refId);
											if ( idx >0 )
												this.destroyTo(idx);
										},
						getIndex		: function(refId){
											var i ;
											for (i = this.stkptr; i>0 ;i-- )
												if (this.stack[i].getRef() == refId )
													break;
											return(i);
										}
};

ajaxStack.init( AjaxSession(null,null,null));

function postAjaxForm(formId){
	var frm ;
	if ( typeof formId == "string" ){
		frm = document.getElementById(formId) ;
		if (!frm ){
			alert ("Invalid form Id!");
			return;
		}
	}
	else {
		frm = formId;
		formId = frm.getAttribute('id') ;
		if ( !formId )
			formId = frm.getAttribute('name');
	}
	
	var dialogId = "dlg_"+Math.floor(Math.random()*1000);
	if ( dijit.byId(dialogId) != null )
		dialogId = "dlg_"+Math.floor(Math.random()*1000);
	var act = frm.action;
	var idx = act.indexOf("&_dialog_=");
	if ( idx > 0 ){
		act = act.substr(0, idx);
	}
	frm.action = act + "&_dialog_="+dialogId;
	var freshSession;
	try{
		freshSession = AjaxSession(dialogId, formId, null);
	}
	catch (e){
		alert(e);
		return
	}
}

function getAjaxUrl(url){
	var dialogId = "dlg_"+Math.floor(Math.random()*1000);
	if ( dijit.byId(dialogId) != null )
		dialogId = "dlg_"+Math.floor(Math.random()*1000);
	url+="&_dialog_=" + dialogId;
	var freshSession;
	try{
		freshSession = AjaxSession(dialogId, null, url);
	}
	catch (e){
		alert(e);
		return
	}
}


function AjaxSession(dialog, formId, url ){
	var sessionObj= {
			dialogId		: dialog,
			URL				: url,
			form			: formId,
			mode			: "",
			method			: "",
			action			: "", 
			frm				: null,
			URI				: null,
			dlg				: null,
			data			: null,
			status			: null,
			error			: null,
			refreshParent	: false,
			
			handleAjax		: function(succeeded){
								if (succeeded && this.data && this.dialogId){			
									this.dlg.set("content", this.data+closeMe(this.dialogId));
									this.dlg.startup();
									this.mode = dojoGetAttr(this.dialogId+"_MODE" , "value");
									if (!this.mode) 
										this.mode = "ACTION";
									this.data = null;
									this.dlg.show();
									ajaxStack.push(this);
								}
								else {
									this.dialogId = null;
									this.mode = "";
									this.method = "";
									this.dlg=null;
									 };
							},
			refresh			: function(){
								if (this.dlg){
									this.destroy();
								};
								if ( this.method == "GET" ){
									dialogByGet(this.URL, this);
									}
								else if (this.method == "POST"){
									this.frm.action=this.action;
									dialogByPost(this.form, this);
								};
								
							},
			show		: function(){
								if (this.dlg)
									this.dlg.show();
						  },
			hide		: function(){
								if (this.dlg)
									this.dlg.hide();
						  },
			destroy		: function(){
							  var dlg = this.dlg;
							  if (dlg){
								  dlg.hide();
								  dlg.destroyRecursive();
								  this.dlg = null  ;
								  this.data = null ;
								  this.mode = null ;
								  this.URI = null  ;
							  };
						  },
			getRef		: function(){
							  return (this.dialogId);
						  }
	};
	if ( sessionObj.URL )
		sessionObj.method = "GET"; 
	else if (sessionObj.form ){
		sessionObj.frm =document.getElementById(sessionObj.form) ;
		sessionObj.method = "POST";
		sessionObj.action = sessionObj.frm.action;
		}
		else
			return (sessionObj) ;
	
	sessionObj.refresh();
	return (sessionObj);
}

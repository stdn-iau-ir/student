dojo.require("dojo.dnd.Mover");
dojo.require("dojo.dnd.Moveable");
dojo.require("dojo.dnd.move");

var farsiNormalize = function(s){
    var r = s;
    r = r.replace(0x06a9, 0x0643); // KAF Farsi -> KAF Arabic
    r = r.replace(0x649, 0x064a);  // YA no dot -> YA two dot
    r = r.replace(0x6cc, 0x064a);  // YA Farsi(#1740) -> YA 2 dot
    return r;
};

setTimeout("dojo.removeClass(dojo.body(), 'loading')", 10000);

function setupOnLoad(){
	if(dojo.isFF){
        dojo.query('form input[type=submit], form input[type=button], form button')
            .forEach(function(el){
                if(!dojo.hasClass(el, 'candisabled')) el.disabled = false;
            });
    }
    dojo.query('.datagrid > table > tbody > tr')
        .filter(function(el){return !dojo.hasClass(el, 'inactive'); })
        .onmouseenter(function(){
            dojo.addClass(this, 'over');
        })
        .onmouseleave(function(){
            dojo.removeClass(this, 'over');
        })
        .onclick(function(ev){
            if(ev.target.tagName=='TD'){
                dojo.query('input[type=radio]', ev.target.parentNode.parentNode).forEach(function(elem){ elem.checked = false; dojo.removeClass(elem.parentNode.parentNode, 'selected'); });
                dojo.query('input[type=radio]', ev.target.parentNode).forEach(function(elem){ elem.checked = true; dojo.addClass(elem.parentNode.parentNode, 'selected'); });
                dojo.query('input[type=checkbox]', ev.target.parentNode).forEach(function(elem){ elem.checked = !elem.checked; dojo.toggleClass(elem.parentNode.parentNode, 'selected'); });
            }
        })
        .forEach(function(elem){
            var highlightfn = function(){
                dojo.query('tr', elem.parentNode).removeClass('selected');
                dojo.addClass(elem, 'selected');
            }
            dojo.query('input[type=radio]', elem).onclick(highlightfn).onchange(highlightfn);
        });
    if(!itorbitConfig.isClassic) 
        dojo.query('.datagrid')
            .filter(function(el){
                if(dojo.hasClass(el, 'simple')) return false;
                
                var noscroll = dojo.query('.datagridNoScroll .datagrid');
                if(noscroll.indexOf(el)>=0) return false;
                
                return true;
            })
            .forEach(function(el){
                var w = dojo.contentBox(el).w;
                
                // Setting width
                dojo.style(el, 'display', 'none');
                var hasScroll = false;
                if( w>dojo.contentBox(el.parentNode).w ){
                    //var width = dojo.contentBox(el.parentNode).w - 25;
                	
                	var www=dojo.coords('maincontent').w-30;
                	try{
	        			if("0"==dojo.cookie("showhidecookie")){
	                		www=window.innerWidth-40;
	                	}
                	}catch(e2){}
                	var width=Math.max( www, dojo.contentBox(el.parentNode).w)- 25;
                    dojo.style(el, 'width', width + "px");
                    hasScroll = true;
                }
                dojo.style(el, 'display', '');
                
                // Setting up the inline scroll bar
                if(el.scrollWidth>el.clientWidth) hasScroll = true;
                if(hasScroll && (dojo.query('table tr', el).length>10)){
                    el.scrollbar = dojo.create('div', {'class':'grid-scrollbar'}, el);
                    el.scrollbar.slider = dojo.create('div', {'class':'slider'}, el.scrollbar);
                    el.scrollbar.movable = new dojo.dnd.Moveable(el.scrollbar.slider);
                    el.scrollbar.slider.initScrollbar = function(mv){
                        var container = mv.node.parentNode.parentNode;
                        dojo.style(mv.node.parentNode, 'width', container.clientWidth + "px");
                        dojo.style(mv.node.parentNode, 'left', dojo.coords(container).x + "px");
                        mv.node.initialTop = dojo.coords(mv.node).t;
                        var slider_width = container.clientWidth / container.scrollWidth * container.clientWidth;
                        dojo.style(mv.node, 'width', slider_width + 'px');
                        var left = dojo.isMozilla ? container.scrollLeft : (container.scrollLeft - container.scrollWidth + container.clientWidth);
                        left = (left/(container.scrollWidth/container.clientWidth)) - dojo.coords(mv.node).w + dojo.coords(mv.node.parentNode).x + dojo.coords(mv.node.parentNode).w + dojo.coords(mv.node).l - dojo.coords(mv.node).x;
                        dojo.style(mv.node, 'left', left + 'px');
                        mv.node.minLeft = dojo.coords(mv.node.parentNode).x - dojo.coords(container).x;
                        mv.node.maxLeft = dojo.coords(mv.node.parentNode).x + dojo.coords(mv.node.parentNode).w - dojo.coords(mv.node).w - dojo.coords(container).x;
                    };
                    el.scrollbar.slider.initScrollbar({node:el.scrollbar.slider});
                    dojo.connect(el, 'scroll', function(e){
                        if(!el.scrollbar.isMouseIn && !el.scrollbar.isMoving) {
                            dojo.style(el.scrollbar, 'display', 'block');
                            //dojo.style(el.scrollbar, 'opacity', 0);
                            var container = e.target;
                            var node = e.target.scrollbar.slider;
                            var left = dojo.isMozilla ? container.scrollLeft : (container.scrollLeft - container.scrollWidth + container.clientWidth);
                            left = (left/(container.scrollWidth/container.clientWidth)) - dojo.coords(node).w + dojo.coords(node.parentNode).x + dojo.coords(node.parentNode).w + dojo.coords(node).l - dojo.coords(node).x;
                            dojo.style(node, 'left', left + 'px');
                            dojo.style(el.scrollbar, 'display', 'none');
                        }
                    });
                    dojo.connect(el.scrollbar.movable, 'onFirstMove', function(mv, lt){
                        mv.node.initScrollbar(mv);
                    });
                    dojo.connect(el.scrollbar.movable, 'onMoved', function(mv, lt){
                        dojo.style(mv.node, 'top', mv.node.initialTop+'px');
                        if(dojo.coords(mv.node).l < mv.node.minLeft) dojo.style(mv.node, 'left', mv.node.minLeft+'px');
                        if(dojo.coords(mv.node).l > mv.node.maxLeft) dojo.style(mv.node, 'left', mv.node.maxLeft+'px');
                        var container = mv.node.parentNode.parentNode;
                        var left = (dojo.coords(mv.node).x + dojo.coords(mv.node).w - dojo.coords(mv.node.parentNode).x - dojo.coords(mv.node.parentNode).w)*(container.scrollWidth/container.clientWidth);
                        left = dojo.isMozilla ? left : (left + container.scrollWidth - container.clientWidth);
                        container.scrollLeft = left;
                    });
                    dojo.connect(el.scrollbar.movable, 'onMoveStart', function(mv, lt){
                        el.scrollbar.hideAfter = false;
                        el.scrollbar.isMoving = true;
                    });
                    dojo.connect(el.scrollbar.movable, 'onMoveStop', function(mv, lt){
                        el.scrollbar.isMoving = false;
                        if(el.scrollbar.hideAfter) {
                            dojo.style(el.scrollbar, 'display', 'none');
                        }
                    });
                    dojo.query('table tr', el)
                        .onmouseenter(function(ev){
                            if(!el.scrollbar.isMouseIn && !el.scrollbar.isMoving){
                                dojo.style(el.scrollbar, 'display', 'none');
                            }
                            if(dojo.style(el.scrollbar, 'display')=='none'){
                                if(el.scrollbar_timeout) clearTimeout(el.scrollbar_timeout);
                                var y = dojo.coords(this, true).y - dojo.coords(el.scrollbar).h - 10;
                                dojo.style(el.scrollbar, 'top', y + 'px');
                                el.scrollbar_timeout = setTimeout(function(){
                                    if(dojo.isMozilla){
                                        dojo.style(el.scrollbar, 'display', 'block');
                                        dojo.style(el.scrollbar, 'opacity', 0);
                                        dojo.fadeIn({node:el.scrollbar, duration:500}).play();
                                    } else {
                                        //dojo.style(el.scrollbar, 'opacity', 1);
                                        dojo.style(el.scrollbar, 'display', 'block');
                                    }
                                    clearTimeout(el.scrollbar_timeout);
                                }, 500);
                            }
                        })
                        .onmouseleave(function(){
                            clearTimeout(el.scrollbar_timeout);
                            el.scrollbar_timeout = setTimeout(function(){
                                if(!el.scrollbar.isMouseIn && !el.scrollbar.isMoving){
                                    dojo.style(el.scrollbar, 'display', 'none');
                                }
                                clearTimeout(el.scrollbar_timeout);
                            }, 10);
                        });
                    dojo.connect(el.scrollbar, 'onmouseenter', function(){
                        el.scrollbar.isMouseIn = true;
                        el.scrollbar.hideAfter = false;
                    });
                    dojo.connect(el.scrollbar, 'onmouseleave', function(){
                        el.scrollbar.isMouseIn = false;
                        clearTimeout(el.scrollbar_timeout);
                        if(!el.scrollbar.isMoving){
                            dojo.style(el.scrollbar, 'display', 'none');
                        } else
                            el.scrollbar.hideAfter = true;
                    });
                    dojo.style(el.scrollbar, 'display', 'none');
                }
                dojo.style(el, 'display', '');
        });
    
    if(itorbitConfig.isClassic) {
        dojo.query('#maincontent .heading .user-menu form input').forEach(function(el){ el.value=''; });
        window.scrollTo(1000, -100);
        dojo.connect(window, 'onresize', function(ev){ dojo.style('menuFrame', 'height', (document.documentElement.clientHeight - 135)+'px'); });
        dojo.style('menuFrame', 'height', (document.documentElement.clientHeight - 135)+'px');
    }

    var layoutPage = function(){
        var h = Math.max(dojo.coords('maincontent').h + 100, dojo.coords('sidebar').h) + "px";
//        var w = document.body.scrollWidth- parseInt ( dojo.coords('sidebar').w)+"px" ;
        dojo.style('maincontent', 'height', h);
        //dojo.style('innertable', 'width', w);
        dojo.style('sidebar', 'height', h);
        dojo.style('menuFrame', 'height', (dojo.style('sidebar', 'height')-170)+'px');
        var contentblock = dojo.byId("content");
        //if(dojo.isIE && (contentblock.scrollHeight-contentblock.clientHeight<30))
        //    dojo.style(contentblock , 'height', (contentblock.scrollHeight+30) + 'px');
        if(contentblock.scrollWidth>contentblock.clientWidth){
            dojo.query('.findform select').forEach(function(el){
                if(dojo.coords(el).w>(dojo.coords(contentblock).w/4))
                    dojo.style(el, 'width', (dojo.coords(contentblock).w/4-40) + 'px');
            });
        }
        if(dojo.query('.pagebuttons *').length==0) dojo.query('.pagebuttons').style('display', 'none');
    }
    if((!itorbitConfig.isClassic) && (dojo.byId('sidebar'))) layoutPage();

    // Quick Goto Dialog
    var overlay = false;
    var showQuickFind = function() {
        if(!overlay){
            console.log('Quick Go Created');
            overlay = dojo.create('div', {id:'gotopopupwrapper'}, dojo.body());
            var quickbox = dojo.create('div', {id:'gotopopup'}, overlay);
            var input = dojo.create('input', {type:"text", id:'gotoinput'}, dojo.create('div', {'class':'top'}, quickbox));
            var list = dojo.create('div', {'class':'list', id:'quicklist'}, quickbox);
            var oDoc = dojo.byId('menuFrame').contentWindow || dojo.byId('menuFrame').contentDocument;
            if (oDoc.document) oDoc = oDoc.document;
            dojo.query('#mainmenu a', oDoc).forEach(function(link){
                dojo.create('a', {href:link.href, innerHTML:link.innerHTML, target:link.target}, list);
            });
            list.items = dojo.query('a', list);
            if(list.items.length>0){
                list.items.at(0).addClass('active');
                list.currentItem = 0;
            };
            list.updateCurrentItem = function(){
                var lst = dojo.byId('quicklist');
                lst.items.at(lst.currentItem).addClass('active');
                var itemheight = 21;
                var offsetTop = lst.currentItem*itemheight;
                if(offsetTop>dojo.coords(lst).h-itemheight+lst.scrollTop)
                    lst.scrollTop = lst.scrollTop + itemheight;
                else if (offsetTop<lst.scrollTop)
                    lst.scrollTop = lst.scrollTop - itemheight;
            };
            var filterfunc = function(ev){
                var key = ev.keyCode;
                var type = ev.type;
                var list = dojo.byId('quicklist');
                // Down
                if(type=="keydown" && key==40){
                    if(list.currentItem<list.items.length-1){
                        list.items.at(list.currentItem).removeClass('active');
                        list.currentItem++;
                        list.updateCurrentItem();
                    }
                    dojo.stopEvent(ev);
                }
                // Up
                else if(type=="keydown" && key==38){
                    if(list.currentItem>0){
                        list.items.at(list.currentItem).removeClass('active');
                        list.currentItem--;
                        list.updateCurrentItem();
                    }
                    dojo.stopEvent(ev);
                }
                // Enter
                else if(type=="keyup" && key==13){
                    if(list.items.at(list.currentItem).attr('target')=="_blank")
                        window.open(list.items.at(list.currentItem).attr('href'));
                    else
                        window.location = list.items.at(list.currentItem).attr('href');
                    dojo.style(overlay, 'display', 'none');
                    dojo.stopEvent(ev);
                } else if(key!=40 && key!=38 && key!=13){
                    var terms = this.value;
                    var lastlength = list.items ? list.items.length : 0;
                    list.items = dojo.query('a', list).filter(function(el){ return el.innerHTML.indexOf(terms)!=-1;}).style('display', 'block');
                    dojo.query('a', list).filter(function(el){ return farsiNormalize(el.innerHTML).indexOf(farsiNormalize(terms))==-1;}).style('display', 'none');
                    if(list.items.length!=lastlength && list.items.length>0){
                        list.items.removeClass('active');
                        list.items.at(0).addClass('active');
                        list.currentItem = 0;
                        list.scrollTop = 0;
                    }
                }
            };
            dojo.connect(input, 'onkeydown', filterfunc);
            dojo.connect(input, 'onkeyup', filterfunc);
            dojo.connect(input, 'change', filterfunc);
        }
        dojo.style(overlay, 'display', 'block');
        dojo.byId('gotoinput').focus();
    };
    shortcut.add("Ctrl+Shift+O", showQuickFind, {'propagate':false});
    shortcut.add("Esc", function(){
        if(overlay) dojo.style(overlay, 'display', 'none');
    });
    dojo.connect(dojo.body(), 'onclick', function(ev){
        if(overlay && ev.target.id!="gotoinput" &&
           ev.target.id!="gotopopup" &&
           !(ev.target.parentNode && ev.target.parentNode.id=="gotopopup"))
            dojo.style(overlay, 'display', 'none');
    });
    
    // Favorite action
    dojo.query('#pagetitle a').connect('onclick', function(ev){
        dojo.stopEvent(ev);
        dojo.xhrGet({
            url: ev.target.href,
            error: function(){},
            content: {'url':window.location.pathname + window.location.search},
            load: function(){ dojo.toggleClass(ev.target, 'on'); }
        });
        ev.target.blur();
    });
    
    // Show bottom return if the page is vertically scrolled
    if(dojo.byId('bottomreturn') && (dojo.coords('content').h+dojo.coords('content').t>document.documentElement.clientHeight))
        dojo.style('bottomreturn', 'display', 'block');
        
    // If there is custom return button this will hide main return button
    if(dojo.query('.returnoverride').length>0) {
        dojo.style('bottomreturn', 'display', 'none');
        dojo.query('.returnbutton', 'pagetitle').style('display', 'none');
        /*dojo.query('.returnbutton', 'pagetitle').onclick(function(ev,el){
            dojo.stopEvent(ev);
        });*/
    }

    dojo.removeClass(dojo.body(), 'loading');
    window.onload = iframeOnLoad;
	try {
		iframeOnLoad();
	} catch (e) {
	}
	try {
		updateTab();
	} catch (e) {
	}
}

	dojo.addOnLoad(function(){
    //new itorbit.ui.TestMenu({}, 'mainmenu');
	setupOnLoad();
    });

// Set current menu item after iframe loads
var iframeOnLoad = function(){
    if(dojo.byId('menuFrame')) {
        var oDoc = dojo.byId('menuFrame').contentWindow || dojo.byId('menuFrame').contentDocument;
        if (oDoc.document) oDoc = oDoc.document;
        if(dojo.byId('menuItemIndex') && dojo.byId('menuItemIndex').value && dojo.byId('menuItemIndex').value!='null'){
            var e = oDoc.getElementById('mi_' + dojo.byId('menuItemIndex').value);
            if(e!=null){
	            var menugroup = e.parentNode.parentNode.parentNode;
	            dojo.addClass(e, 'current');
	            dojo.addClass(menugroup, 'current');
	            dojo.query("ul", menugroup).style('height', 'auto');
            }
        }
    }
};

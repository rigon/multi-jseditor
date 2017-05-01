/// <reference path="CopyPaste.js" />
/// <reference path="Curser.js" />
/// <reference path="Editor.js" />
/// <reference path="Initializer.js" />
/// <reference path="Keyhandler.js" />
/// <reference path="Selection.js" />
/// <reference path="UndoRedo.js" />
//--

/******************************************************************************
	UTILITIES
******************************************************************************/
function byid(id){return document.getElementById(id);}

String.prototype.insert = function(index, arr)
{
    var a1 = this.slice(0,index);
    var a2 = this.slice(index, this.length);
    return a1.concat(arr).concat(a2);
}
//Worlds fastest JS trim - thanks to http://blog.stevenlevithan.com/archives/faster-trim-javascript
String.prototype.trim = function()
{
	var str = this.replace(/^\s+/, '');
	for (var i = str.length - 1; i >= 0; i--)
	{
		if (/\S/.test(str.charAt(i)))
		{
			str = str.substring(0, i + 1);
			break;
		}
	}
	return str;
}
String.prototype.HTMLify2 = function()
{
	return this.replace(/( |&|<|>|\t|[^& \?<>\t]*)/g, function($0,$1){
		switch($1)
		{
			case " " : return("&nbsp;"); break;
			case "\t": return("&nbsp;&nbsp;&nbsp;&nbsp;"); break;
			case "<" : return("&lt;");  break;
			case ">" : return("&gt;");  break;
			case "&" : return("&amp;"); break;
			default:   return( $1 );    break;
		}
	});
}
String.prototype.HTMLify = function()
{
	return this.
		replace(/&/g,"&amp;").
		replace(/ /g,"&nbsp;").
		replace(/</g,"&lt;").
		replace(/>/g,"&gt;").
		replace(/\t/g, "&nbsp;&nbsp;&nbsp;&nbsp;");
}

function OpenLink(link)
{
	if(ctrlPressed)
	{
		window.open(link)
	}
}

function OverLink(obj)
{
	if(ctrlPressed)
	{
		obj.style.cursor = "pointer";
	}
}

var regxLink = /((https?:\/\/www\.|https?:\/\/|www\.)(.+?))(&nbsp;|\n|$|'|")/gi;
String.prototype.URLify = function()
{
	var test1 = this.indexOf("http") > -1;
	
	if(!test1) //speedup
		test2 = this.indexOf("www") > -1;
	
	if(test1 | test2)
		return this.replace(regxLink, "<b class=\"url\" onmouseover=\"OverLink(this)\" onmouseup=\"OpenLink('$1')\">$1</b>$4")
	else
		return this;
}
String.prototype.push = function(str)
{
	return this + str;
};

String.prototype.reverse = function() {
    return this.split("").reverse().join("");
};

Object.prototype.InsertDefs = function()
{
	for(var j=0,arr; arr=arguments[j]; j++)
	{
		for(var i=0,def; (def=arr[i]); i++)	{
			this[def] = [];
		}
	}
	return this;
};

Array.prototype.insert = function(index, arr)
{
    var a1 = this.slice(0,index);
    var a2 = this.slice(index, this.length);
    return a1.concat(arr).concat(a2); 
};

Array.prototype.contains = function(T){
	
	if(arguments[1]!=undefined) //2nd level index
	{	for(var i=0, B; B=this[i]; i++)
			if(B[arguments[1]]==T)
				return new Array(i,B[1]);
	}
	else
	{
		for(var i=0, B; B=this[i]; i++)
			if(B==T)
				return new Array(i, B);
	}			
	return false;
};

Array.prototype.last = function(){
	if( this[0] )
		return this[this.length-1];
	else
		return null;
}
Array.prototype.equals = function(T)
{
    for(i=0; this[i] || T[i] ;i++)
		if(this[i]!=T[i])
			return false;
	return true;
}

function changeLanguage(elm)
{
	cssInDef = false;
	cssInKey = false;
	cssLastKey = "";
	
	htmlInScript = false;
	htmlInStyle = false;
	htmlInHtml = false;
	htmlInTag = false;
	htmlTagName = "";
	htmlIsAttributeName = false;
	htmlAttributeName = "";
	htmlIsTagName = false;

	if(elm.value != 'none')
	{
		switch(elm.value)
		{
			case "Javascript":
				Editor.setLanguage(jsParser);
				break;
			case "HTML"	:
				Editor.setLanguage(htmlParser);
				break;
			case "XML":
				Editor.setLanguage(xmlParser);
				break;
			case "CSS":
				Editor.setLanguage(cssParser);
				break;
			case "Text":
				Editor.setLanguage(textParser);
				break;
		}
	}
	elm.selectedIndex=0;
	Editor.print(true);
	elm.blur()
}

function changeStyle(elm)
{
	if(elm.value != 'none')
	{
		document.getElementById('Theme').href = elm.value + "?t=" + Math.random();
		switch(elm.value)//not possible to detect fontsize otherwise ??
		{
			case "style1.css":
			case "style2.css":
			case "style3.css":
				fontsize = [10,18];
				cols = 80;
				rows = 30;
				break;
			case "style5.css":
			case "style4.css":
				fontsize = [8,17];
				cols = 100;
				rows = 35;
				break;
		}
		resizeEditor();
	}
	elm.selectedIndex = 0;
	elm.blur();
}

function scrollOffset()
{
	var left = (window.pageXOffset)?(window.pageXOffset):
		(document.documentElement)?document.documentElement.scrollLeft:
		document.body.scrollLeft;
		
	var top = (window.pageYOffset)?(window.pageYOffset):
		(document.documentElement)?document.documentElement.scrollTop:
		document.body.scrollTop;
	
	return [left + Math.abs(__content.offsetLeft) , top];
}

function getTarget(event)
{
	var e = event ? event : window.event;
	
	var targ;
	
	if (e.target)			targ = e.target;
	else if (e.srcElement) 	targ = e.srcElement;
	
	// defeat Safari bug
	if (targ.nodeType == 3)
	{ 
		targ = targ.parentNode;	
	}
	
	return targ;
}

function GetInnerSize () 
{
	var x,y;
	if (self.innerHeight) 
	{
		// all except Explorer
		x = self.innerWidth;
		y = self.innerHeight;
	}
	else if (document.documentElement && document.documentElement.clientHeight)
	{
		// Explorer 6 Strict Mode
		x = document.documentElement.clientWidth;
		y = document.documentElement.clientHeight;
	}
	else if (document.body) 
	{
		// other Explorers
		x = document.body.clientWidth;
		y = document.body.clientHeight;
	}
	return [x,y];
}

var maximized = false;
var lock_vert = false;
function resizeEditor()
{
	var size = GetInnerSize();
	var lang = jsParser;
	
	if(Editor)
		lang = Editor.getLanguage();
	
	if(maximized)
	{
		Editor = null;
		Curser = null;
		
		if(fontsize[0]==10){
		    if(lock_vert)
		    {
			    Editor = new Class_Editor( Math.floor(size[1]/18)-6 , cols, arguments[0], lang);
			    Curser = new Class_Curser( Math.floor(size[1]/18)-6 , cols, arguments[0]);
			}else{ 
			    Editor = new Class_Editor( Math.floor(size[1]/18)-6 , Math.floor(size[0]/10)-12, arguments[0], lang);
			    Curser = new Class_Curser( Math.floor(size[1]/18)-6 , Math.floor(size[0]/10)-12, arguments[0]);
			}
		}else{
		    if(lock_vert)
		    {
		        Editor = new Class_Editor( Math.floor(size[1]/17)-6 , cols, arguments[0], lang);
			    Curser = new Class_Curser( Math.floor(size[1]/17)-6 , cols, arguments[0]);
		    }else{
		        Editor = new Class_Editor( Math.floor(size[1]/17)-6 , Math.floor(size[0]/8)-14, arguments[0], lang);
			    Curser = new Class_Curser( Math.floor(size[1]/17)-6 , Math.floor(size[0]/8)-14, arguments[0]);
		    }
		}
		Editor.OffzY( Math.floor(_scrollbarY.scrollTop/18) )
		Editor.print()
	}
	else
	{
		Editor = null;
		Curser = null;
		
		Editor = new Class_Editor(rows, cols, arguments[0], lang);
		Curser = new Class_Curser(rows, cols, arguments[0]);
		
		Editor.OffzY( Math.floor(_scrollbarY.scrollTop/18) )
		Editor.print()
	}
	Editor.findLongest();
	Curser.scrollX(0);
}

function URLEncode(str){
	return encodeURIComponent(str);
}

function ExecuteRequest(func, url, postbody)
{
	var xmlhttp = false
	
	try { 	xmlhttp = new ActiveXObject("Msxml2.XMLHTTP");
	} catch (e) {
		try {	xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
	} catch (E) {	xmlhttp = false; } }
	
	if (!xmlhttp && typeof(XMLHttpRequest) != 'undefined') {
		try { 			xmlhttp = new XMLHttpRequest();
		} catch (e) {	xmlhttp = false;	}
	}
	if (!xmlhttp && window.createRequest) {
		try {			xmlhttp = window.createRequest();
		} catch (e) {	xmlhttp = false;	}
	}
	
	if ( xmlhttp )
	{
		xmlhttp.onreadystatechange = function()
		{
			if (xmlhttp.readyState==4){
				if (xmlhttp.status==200){
					func( xmlhttp.responseText );
				}else{
					alert("Error: " + xmlhttp.status + "\n\nURL: "+URL)
				}
			}
		}
		try{
			xmlhttp.open("POST", url, false);
			xmlhttp.setRequestHeader("Content-Type","application/x-www-form-urlencoded;");
			xmlhttp.send( postbody );
		}catch(e){
			alert("xmlhttp error: \n"+e.message);
		}
	}else{
		alert("Your browser does not support XMLHTTP.")
	}
}

var timer = 0;
var isRunning = false;
function TimeDown(count)
{
	Editor.errors = [];
		
	timer = count * 10;
	if(!isRunning){
		isRunning = true
		tick();
	}
}
function tick()
{
	if(timer-- >0)
		setTimeout(tick, 10)
	else{
		isRunning = false;
		Editor.compile(true);
		Editor.fillBuffer();
	}
}

// note, it destroys events ! :-(
function replaceHtml(el, html) {
    //var oldEl = typeof el === "string" ? document.getElementById(el) : el;
    var oldEl = el;
    /*@cc_on // Pure innerHTML is slightly faster in IE
	    oldEl.innerHTML = html;
	    return oldEl;
    @*/
    var newEl = oldEl.cloneNode(false);
    newEl.innerHTML = html;
    oldEl.parentNode.replaceChild(newEl, oldEl);
    /* Since we just removed the old element from the DOM, return a reference
    to the new element, which can be used to restore variable references. */
    return newEl;
};

/*
function Struct_Event(type,detail,screenX,screenY,clientX,clientY,ctrlKey,altKey,shiftKey,metaKey,button,relatedTarget)
{
	this.type = type;					/*'onmousemove'	* /
	this.detail = detail;				/* = 0;			* /
	this.screenX = screenX,				/* = 12;		* /
	this.screenY = screenY,				/* = 345;		* /
	this.clientX = clientX,				/* = 7;			* /
	this.clientY = clientY,				/* = 220;		* /
	this.ctrlKey = ctrlKey,				/* = false;		* /
	this.altKey = altKey,				/* = false;		* /
	this.shiftKey = shiftKey,			/* = true;		* /
	this.metaKey = metaKey,				/* = false;		* /
	this.button = button,				/* = 0;			* /
	this.relatedTarget = relatedTarget	/* = null;		* /
}
*/
function FakeEvent(Subject, EventType, EventObj)
{
	if( document.createEvent ) 
	{
		Subject.dispatchEvent(EventObj);
	}
	else if( document.createEventObject ) 
	{
		Subject.fireEvent('on' + EventType, EventObj);
	}
	
	/*if( document.createEvent ) 
	{
		var evObj = document.createEvent(EventType);
		evObj.initMouseEvent( 'mousemove', true, false, window, 0, 12, 345, 7, 220, false, false, true, false, 0, null );
		fireOnThis.dispatchEvent(evObj);
		
	}
	else if( document.createEventObject ) 
	{
		var evObj = document.createEventObject();
		evObj.detail = 0;
		evObj.screenX = 12;
		evObj.screenY = 345;
		evObj.clientX = 7;
		evObj.clientY = 220;
		evObj.ctrlKey = false;
		evObj.altKey = false;
		evObj.shiftKey = true;
		evObj.metaKey = false;
		evObj.button = 0;
		evObj.relatedTarget = null;
		fireOnThis.fireEvent('onmousemove',evObj);
	}*/
}
/**/

function FStringCat()
{
    var accum = '';
    var list = [];
    
    this.push = function(what)
    {
        accum += what;
        if(accum.length>2800)
        {
			list.push(accum);
			accum = '';
        }
    };
    
    this.value = function()
    {
		list.push(accum);
		accum = '';
		list = [ list.join("") ];
		return list[0];
    };
}
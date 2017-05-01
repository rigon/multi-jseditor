/// <reference path="CopyPaste.js" />
/// <reference path="Curser.js" />
/// <reference path="Editor.js" />
//--
/// <reference path="Keyhandler.js" />
/// <reference path="Selection.js" />
/// <reference path="UndoRedo.js" />
/// <reference path="Utilities.js" />
/// <reference path="Intellisense.js" />
/// <reference path="ContextMenu.js" />


/******************************************************************************
	INITIALIZATION: EVENT REGISTERING AND OBJECT INSTANTIATION
******************************************************************************/

var EditorContent = new Array();
var writeroot;
var hasFocus = false;
var wheelx, wheely; //BugFix for Firefox 2.0 wheel event :-(
var isScrolling = false;
var ctrlPressed = false;
var clickspeed = 400;

var Curser;
var Editor;
var Selection;
var CopyPaste;
var UndoRedo;
var Intellisense;
var ContextMenu;

//placement of editor
var editor_x = 80;
var editor_y = 50;
var cols = 80;
var rows = 30;
var fontsize = [10,18];

//markers
var _post1;
var _post2;
var _pre1;
var _pre2;
var _xmlStart;
var _xmlFinish;

//editor
var __content;
var _curser;
var _errors;
var _editorinfo;
var _editor;
var _contentContatiner;
var _secondary;
var _linenumbers;
var _scrollbarY;
var _scrollbarX;
var _contextmenu;
var _intellisense;
var _errors;
var _ErrorExplain;

window.onresize = function()
{
	if(maximized)
		resizeEditor();
}

window.onblur = function()
{
	if(Curser)
		Curser.SwitchOnOff(false);
}

window.onfocus = function()
{
	if(Curser)
		Curser.SwitchOnOff(true);
}

window.onload = function()
{
	/*var OS = navigator.userAgent.match(/windows nt [\d.]+/gi);
	if(OS){		var vers = OS[0].match(/[\d.]+/) * 1;
		if(vers >= 6.0 && vers < 7.0){ alert("Windows Vista"); } } 
	*/
	
	_post1 = byid("post1");
	_post2 = byid("post2");
	_pre1 = byid("pre1");
	_pre2 = byid("pre2");
	_xmlStart  = byid("xmlStart");
	_xmlFinish = byid("xmlFinish");
	
	__content = byid("content");
	_curser = byid("curser");
	_editor = byid("editor");
	_errors = byid("errors");
	_editorinfo = byid("editorinfo");
	_contentContatiner = byid("contentContatiner");
	_secondary = byid("secondary");
	_ErrorExplain = byid("errorexplain");
	_linenumbers = byid("linenumbers");
	_scrollbarY = byid("scrollbarY");
	_scrollbarX = byid("scrollbarX");
	_contextmenu = byid("ContextMenu");
	_intellisense = byid("Intellisense");
	//---------------------------------------
	Intellisense = new Class_Intellisense();
	Curser = new Class_Curser(rows,cols);
	Editor = new Class_Editor(rows,cols);
	Selection = new Class_Selection();
	CopyPaste = new Class_CopyPaste();
	UndoRedo = new Class_UndoRedo();
	ContextMenu = new Class_ContextMenu();
	//---------------------------------------
	byid("styleselector").selectedIndex = 0;
	writeroot = byid('writeroot');	
	Curser.onoff();
	Editor.print();
	//---------------------------------------
	
	_editor.style.left = editor_x + "px"
	_editor.style.top = editor_y + "px"
	
	//Since Explorer is fucked up, disable these events all along !
	_contentContatiner.onclick = new Function("return false");
	_contentContatiner.ondblclick = new Function("return false");
	
	//------
	
	_contentContatiner.onmousedown = mousedownEvtHandler;
	_contentContatiner.onmouseup = mouseupEvtHandler;
	_contentContatiner.onmousemove = mousemoveEvtHandler;
	_contentContatiner.oncontextmenu = new Function("return false");
	_contextmenu.oncontextmenu = new Function("return false");
	_scrollbarY.onscroll = scrollHandlerY;
	_scrollbarX.onscroll = scrollHandlerX;
	document.onselectstart = new Function("return false");
	document.onmouseup = function(){ isPressed = false; }
	document.defaultAction = false;
	document.onkeydown = function(e){ handleKeys(e); detectShiftPress(e); }
	document.onkeypress = function(e){ handleKeys(e); }
	document.onkeyup = detectShiftRelease;
	
	//MouseWheel (for scrolling)
	if (_contentContatiner.addEventListener)// DOMMouseScroll is for mozilla.
		_contentContatiner.addEventListener('DOMMouseScroll', wheel, false);
	_contentContatiner.onmousewheel = wheel;// IE/Opera.
}

/******************************************************************************
	KEYBOARD EVENT HANDLERS: DOWN->PRESS->UP
******************************************************************************/
function detectShiftPress(e)
{
	var evt = e ? e : window.event;
	
	if(evt.keyCode==16 && Selection.distance())
	{
		Selection.active = true;
		Editor.print();
	}
	if(evt.keyCode==17) //CTRL
	{
		ctrlPressed = true;
		_errors.style.display = "none";
	}
}

function detectShiftRelease(e)
{
	var evt = e ? e : window.event;
	
	if(evt.keyCode==16)//SHIFT
	{
		Selection.active = false;
		Editor.print();
	}
	if(evt.keyCode==17) //CTRL
	{
		ctrlPressed = false;
		_errors.style.display = "block";
	}
	//byid("writeroot").innerHTML = evt.type + ", " + Combo + ", " + evt.keyCode + "<br>" + byid("writeroot").innerHTML
	
	Combo = false //detectShiftRelease is the last function call in a key event
}

var nonChar = false;
var Combo = false;
function handleKeys(e) 
{
	isScrolling = false;
	var char;
    var evt = (e) ? e : window.event;       //IE reports window.event not arg
    
    if (!evt.stopPropagation){
		evt.stopPropagation = function() {this.cancelBubble = true;};
		evt.preventDefault = function() {this.returnValue = false;};
	}
	
	if (!evt.stop){
		evt.stop = function(){
			this.stopPropagation();
			this.preventDefault();
		};
	}
    
    if (evt.type == "keydown") {
        char = evt.keyCode;
        if (char < 16 ||                    // non printables
            (char > 16 && char < 32) ||     // avoid shift
            (char > 32 && char < 41) ||     // navigation keys
            char == 46 ||                   // Delete Key (Add to these if you need)
            char == 45 ||                   // Insert Key
            (char >= 112 && char <= 123)    // F1 to F12
        )
        {
            nonChar = true;
            Keyhandler_Meta(char, evt, e);     // function to handle non Characters
        } else
            nonChar = false;
    } else {                                // This is keypress
        if (nonChar) return;                // Already Handled on keydown
        char = (evt.charCode) ? evt.charCode : evt.keyCode;
        if (char > 31 && char < 256)        // safari and opera
			if( (evt.ctrlKey && evt.altKey) || (!evt.ctrlKey && !evt.altKey)) //allow AltGr
				Keyhandler_Char(char, evt);
    }
    
//  EditorContent.push(char + "," + evt.type + ", " + evt.charCode + ", " + evt.keyCode + ", " + nonChar + ", " + evt.ctrlKey);
//	Editor.print(true);
    
    
    if(evt.ctrlKey && !nonChar && evt.type == "keydown")
    {
		var tmp = Keyhandler_Combo(char, evt) //love tristate boolean :D
		Combo = (tmp == undefined) ? Combo : tmp;
		
		if(!Combo){
			evt.stop();
			evt.returnValue = false;
		}
	}
	
	//byid("writeroot").innerHTML = evt.type + ", " + Combo + ", " + char + "<br>" + byid("writeroot").innerHTML
	
	if (e && !Combo && nonChar)				// Non IE
		evt.stop();							// Using prototype
    else if (evt.keyCode == 8 || evt.keyCode == 9)
        evt.returnValue = false;            // and stop it!
}

/******************************************************************************
	MOUSE WHEEL EVENT HANDLERS
******************************************************************************/
function wheel(event)
{
	var delta = 0;
	if (!event) // For IE.
		event = window.event;
	if (event.wheelDelta) { // IE/Opera. 
		delta = event.wheelDelta/120;
	
	// In Opera 9, delta differs in sign as compared to IE.
	if (window.opera)
		delta = -delta;
	}else if (event.detail) { 
		// Mozilla
		delta = -event.detail/3;
	}
	
	//Target for scroll event
	var targ;
	if (event.target) 
		targ = event.target;
	else if (event.srcElement) 
		targ = event.srcElement;
	if (targ.nodeType == 3)
	{ 
		// defeat Safari bug
		targ = targ.parentNode;	
	}
	
	var mx=my=0;
	if(Selection.active){
		mx = wheelx - editor_x + scrollOffset()[0] + fontsize[0]; 
		my = wheely - editor_y + scrollOffset()[1] + fontsize[1];
	}
	//Handle non-zero delta, only on content-div
	if (delta && (targ.id == "content" 
				|| targ.id == "errors"
				|| targ.className == "bug"
				|| targ.id == "contentContainer"
				|| targ.parentNode.id == "content" 
				|| targ.parentNode.className ))
		handle(delta, mx, my);
	
	
	//Defeat event
	if (event.preventDefault)
		event.preventDefault();
	event.returnValue = false;
}

//Mouse Scroll handler
function handle(delta, mx, my)
{
	if (delta < 0)
		for(var x=0;x<3;x++)
			Editor.move_down(true)
	else
		for(var x=0;x<3;x++)
			Editor.move_up(true)
	
	if(Selection.active){
		var coord = Curser.getMousePos([mx, my]);
		Selection.end_row = coord[0]
		Selection.end_col = coord[1]			
	}
	
	_ErrorExplain.style.display = "none";
	isScrolling = true;
	Editor.print(true);
	scrollTimeDown(50)
}
/******************************************************************************
	SCROLL OPTIMIZER
******************************************************************************/
var scollTimer = 0;
var isScrolling = false;
function scrollTimeDown(count)
{
	scollTimer = count;
	
	if(!isScrolling){
		isScrolling = true
		scrollTick();
	}
}
function scrollTick()
{
	if(scollTimer-- >0)
		setTimeout(scrollTick, 10)
	else{
		isScrolling = false;
		//alert("Not Scrolling");
	}
}

/******************************************************************************
	SCROLLBAR HANDLER
******************************************************************************/
var DisableGoto = false;
function scrollHandlerY(evt)
{
	var e = evt ? evt : window.event;
	var target = getTarget(e);
	
	if(!DisableGoto) //prevent event refire, from Editor
	{
		//Editor.Goto( Math.floor(target.scrollTop/fontsize[1]) )
		Editor.OffzY( Math.floor(target.scrollTop/fontsize[1]) )
		Editor.print();
		scrollTimeDown(50)
	}
	else
	{
		DisableGoto = false;
	}
	
	if(_scrollbarY.scrollTop != fontsize[1] * Editor.OffzY())
		_scrollbarY.scrollTop = fontsize[1] * Editor.OffzY();
}
function scrollHandlerX(evt)
{
	var e = evt ? evt : window.event;
	var target = getTarget(e);
	
	Curser.scrollX( target.scrollLeft/fontsize[0] );
}
/******************************************************************************
	MOUSE DOWN -> MOVE -> UP -> CLICK
******************************************************************************/
var isPressed = false
function mousedownEvtHandler(evt)
{ 
	var e = evt ? evt : window.event;
	var targ = getTarget(e);
	isPressed = true;
		
	//detect mouseClick event
	mouseclick = true;
	setTimeout(detectClick, clickspeed);
		
	if(targ.id=="content" 
	|| targ.id=="errors"
	|| targ.parentNode.id=="content" 
	|| targ.parentNode.id=="errors" 
	|| targ.parentNode.className
	|| targ.className == "bug")
	{
		if(e.button == 2)
		{
			var left = (e.clientX - editor_x)-10;
			var top = (e.clientY- editor_y)-6;
			ContextMenu.show(top,left) ;
			return false;
		}
		
		ContextMenu.hide();
		
		var pageX = scrollOffset()[0];
		var pageY = scrollOffset()[1];
		
		var coord = Curser.getMousePos([
			e.clientX - editor_x + pageX + fontsize[0], 
			e.clientY - editor_y + pageY + fontsize[1]
		]);
		
		if( !Selection.active ){
			Selection.from_row = coord[0]
			Selection.from_col = coord[1]
			Selection.active = true;
		}else{
			Selection.end_row = coord[0]
			Selection.end_col = coord[1]
		}
	}else
		Selection.active = false;
	
	return document.defaultAction
}

function mousemoveEvtHandler(evt)
{ 
	var e = evt ? evt : window.event;
	if(e.button == 2)
		return false;
		
	wheelx = e.clientX;
	wheely = e.clientY;
	
	_ErrorExplain.style.top = (wheely - editor_y + 5) + "px";
	_ErrorExplain.style.left = (wheelx - editor_x + 5) + "px";
	
	if(Selection.active && isPressed)
	{
		var pageX = scrollOffset()[0];
		var pageY = scrollOffset()[1];
	
		var coord = Curser.getMousePos([
			e.clientX - editor_x + pageX + fontsize[0], 
			e.clientY - editor_y + pageY + fontsize[1]
		]);
		
		Selection.end_row = coord[0]
		Selection.end_col = coord[1]
		Editor.print();
	}
	return document.defaultAction
}

function mouseupEvtHandler(evt)
{ 
	var e = evt ? evt : window.event;
	if(e.button == 2)
		return false;
		
	var targ = getTarget(e);
	isPressed = false;
	
	if(targ.id=="content" 
	|| targ.id=="errors"
	|| targ.parentNode.id=="content" 
	|| targ.parentNode.id=="errors" 
	|| targ.parentNode.className
	|| targ.className == "bug")
	{
		var pageX = scrollOffset()[0];
		var pageY = scrollOffset()[1];
		
		var coord = Curser.getMousePos([
			e.clientX - editor_x + pageX + fontsize[0], 
			e.clientY - editor_y + pageY + fontsize[1]
		]);
		
		Curser.setCurser([
			e.clientX - editor_x + pageX + fontsize[0], 
			e.clientY - editor_y + pageY + fontsize[1]
		]);
		
		Selection.end_row = coord[0]
		Selection.end_col = coord[1]
	}
	Selection.active = false;
	
	if(mouseclick){ //user has clicked
		clickEvtHandler(e)
		//console.log("mouse clicked");
	}
	
	if(e.ctrlKey){
		Selection.dubbleClick(coord);
	}
	
	return document.defaultAction
}

var mouseclick = false;
function detectClick(){
	mouseclick = false;
	//console.log("mouseclick timeout");
}

var mousedoubleclick = false;
function detectDoubleClick(){
	mousedoubleclick = false; 
	//console.log("mousedoubleclick timeout");
}

function clickEvtHandler(e)
{ 
	var e = e ? e : window.event;
	window.focus();
	
	if(mousedoubleclick || e.ctrlKey)
	{
		//console.log("mouse doubleclicked");
		mousedoubleclick = false;
		
		var pageX = scrollOffset()[0];
		var pageY = scrollOffset()[1];
	
		var coord = Curser.getMousePos([
			e.clientX - editor_x + pageX + fontsize[0], 
			e.clientY - editor_y + pageY + fontsize[1]
		]);
		
		Selection.dubbleClick(coord);
	}else{
		mousedoubleclick = true;
		setTimeout(detectDoubleClick, clickspeed)
	}	
	
	Editor.print();
	return document.defaultAction;
}

/******************************************************************************
	EDITORCONTENT
******************************************************************************/
/*
EditorContent.push("FEATURES:");
EditorContent.push("		Bracket matching (using caret)");
EditorContent.push("		2 fontsizes (Neutral VS theme = 14px)");
EditorContent.push("		locked width of editor");
EditorContent.push("	KEYBOARD:");
EditorContent.push("		CTRL + A -> SELECT ALL");
EditorContent.push("		CTRL + D -> DUPLICATE LINE");
EditorContent.push("		CTRL + L -> SELECT LINE");
EditorContent.push("		CTRL + C -> COPY (TO WINDOWS CLIPBOARD)");
EditorContent.push("		CTRL + V -> PASTE (FROM WINDOWS CLIPBOARD)");
EditorContent.push("		CTRL + X -> CLIP (TO WINDOWS CLIPBOARD)");
EditorContent.push("		CTRL + G -> GOTO LINE");
EditorContent.push("		CTRL + ARROW LEFT/RIGHT -> STEP-MOVE");
EditorContent.push("		CTRL + HOME -> MOVE TO TOP");
EditorContent.push("		CTRL + END -> MOVE TO BOTTOM");
EditorContent.push("		CTRL + DEL -> DELETE NEXT WORD");
EditorContent.push("		CTRL + BACKSPACE -> DELETE LAST WORD");
EditorContent.push("		SELECT + CTRL + 1 -> SORT LINES ALPHABETICALLY");
EditorContent.push("		ARROW KEYS -> MOVE CARET");
EditorContent.push("		SHIFT + ARROW -> SELECT TEXT");
EditorContent.push("		SHIFT + DELETE -> DELETE LINE");
EditorContent.push("		SHIFT + HOME/END -> SELECT RANGE");
EditorContent.push("		---");
EditorContent.push("		HOME/END -> MOVE CARET TO EXTREMES");
EditorContent.push("		PAGE UP/DOWN -> MOVE PAGE UP/DOWN");
EditorContent.push("		ENTER -> NEW LINE (KEEPING TAB INDEX)");
EditorContent.push("		INSERT KEY -> INSERT MODE (OVERWRITE)");
EditorContent.push("		TAB KEY -> INDENT LINE (OR SELECTION)");
EditorContent.push("		SHIFT + TAB -> UN-INDENT LINE (OR SELECTION)");
EditorContent.push("	MOUSE:");
EditorContent.push("		CLICK -> PLACE CARET");
EditorContent.push("		DUBBLE CLICK ON WORD -> SELECT WORD");
EditorContent.push("		CLICK + DRAG -> SELECT TEXT");
EditorContent.push("		SCROLL -> SCROLL WINDOW");
EditorContent.push("	STYLES:");
EditorContent.push("		4 THEMES TO CHOOSE FROM...");
EditorContent.push("		---");
EditorContent.push("(HANDLER)	CTRL + S ->	SAVE ");
EditorContent.push("(HANDLER)	CTRL + SHIFT + S -> SAVE AS ");
EditorContent.push("(HANDLER)	CTRL + W ->	CLOSE WINDOW ");
EditorContent.push("(HANDLER)	CTRL + [1,2,3,4,5] -> HOTKEYS ");
EditorContent.push("(HANDLER)	F2,F3,F4,F5,F6,F7,F8,F9,F10,F12 ");
EditorContent.push("-------------------------------------------------");
EditorContent.push("TODO:");
EditorContent.push("	- visible changed lines");
EditorContent.push("	- Context Menu (needed ?) ");
EditorContent.push("	- Search (ctrl + f)");
EditorContent.push("	- Search'n'replace (ctrl + h)");
EditorContent.push("-------------------------------------------------");
EditorContent.push("KNOWN BUGS:");
EditorContent.push("	- Multiline comment error");
EditorContent.push("	- Some textual bugs");
EditorContent.push("	- Some selection bugs");
EditorContent.push("-------------------------------------------------");
EditorContent.push("EXTENDED TODO: ");
EditorContent.push("	+ Edited Lines (like Visual Studio)");
EditorContent.push("	+ Intellisense for JS and other languages  ");
EditorContent.push("	+ Bracket matching  ");
EditorContent.push("	+ Source formatting (JS, XML...)  ");
EditorContent.push("	+ Code Help (auto ending, auto complete) ");
EditorContent.push("	+ Fullscreen Editing...");
EditorContent.push("-------------------------------------------------");
EditorContent.push("FOR JAVASCRIPT ");
EditorContent.push("	+ Custom Variable tagging (like VS 08)  ");
EditorContent.push("	+ Custom Object tagging (like VS 08)  ");
EditorContent.push("	+ Code Scope Intellisense  ");
EditorContent.push("	+ Custom Imports (like C# Include) ");
EditorContent.push("-------------------------------------------------");
*/

EditorContent.push("//-------------------------------------------------*");
EditorContent.push("//               Copyright & License               |");
EditorContent.push("//                                                 |");
EditorContent.push("//  *  The editor is free to use for all free      |");
EditorContent.push("//     projects.                                   |");
EditorContent.push("//                                                 |");
EditorContent.push("//  *  The editor is NOT free for projects that,   |");
EditorContent.push("//     earn profit on its product/service in       |");
EditorContent.push("//     which the editor is/will be part of.        |");
EditorContent.push("//     License cost depends on the project and     |");
EditorContent.push("//     the level of support needed.                |");
EditorContent.push("//                                                 |");
EditorContent.push("//  *  Note that JSLINT has its own license        |");
EditorContent.push("//     http://www.jslint.com                       |");
EditorContent.push("//                                                 |");
EditorContent.push("//  *  Sourcecode and idea belongs to:             |");
EditorContent.push("//       Martin Kirk (founder/developer)           |");
EditorContent.push("//       Alvaro (XML-language, Tagmatcher)         |");
EditorContent.push("//       Mark (partial: Bracketmatch, Contextmenu) |");
EditorContent.push("//-------------------------------------------------*");
EditorContent.push("//     Goal of the editor:                         |");
EditorContent.push("//     Become an online version of Visual Studio's |");
EditorContent.push("//     editor with similar functionalities         |");
EditorContent.push("//-------------------------------------------------*");
EditorContent.push("//     Keep up2date : http://blog.mdk-photo.com    |");
EditorContent.push("//                                                 |");
EditorContent.push("//            JavaScript Document:                 |");
EditorContent.push("//-------------------------------------------------*");
EditorContent.push("function byid(id){return document.getElementById(id);}");
EditorContent.push("");
EditorContent.push("Array.prototype.insert = function(index, arr)");
EditorContent.push("{");
EditorContent.push("	var a1 = this.slice(0,index);");
EditorContent.push("	var a2 = this.slice(index, this.length);");
EditorContent.push("	return a1.concat(arr).concat(a2); ");
EditorContent.push("};");
EditorContent.push("String.prototype.insert = function(index, arr)");
EditorContent.push("{");
EditorContent.push("	var a1 = this.slice(0,index);");
EditorContent.push("	var a2 = this.slice(index, this.length);");
EditorContent.push("	return a1.concat(arr).concat(a2);");
EditorContent.push("};");
EditorContent.push("Array.prototype.contains = function(T){");
EditorContent.push("	for(var i=0, B; B=this[i]; i++)");
EditorContent.push("		if(B[1]==T)");
EditorContent.push("			return new Array(i,B[1]);");
EditorContent.push("	return false;");
EditorContent.push("};");
EditorContent.push("");
EditorContent.push("var writeroot;");
EditorContent.push("var keylog = new Array();");
EditorContent.push("var hasFocus = false;");
EditorContent.push("var Curser");
EditorContent.push("var Editor");
EditorContent.push("var Selection");
EditorContent.push("//placement of editor");
EditorContent.push("var editor_x = 50");
EditorContent.push("var editor_y = 50");
EditorContent.push("var cols = 60;");
EditorContent.push("var rows = 30;");
EditorContent.push("");
EditorContent.push("function init(){");
EditorContent.push("	Curser = new Class_Curser(rows,cols);");
EditorContent.push("	Editor = new Class_Editor(rows,cols);");
EditorContent.push("	Selection = new Class_Selection();");
EditorContent.push("	");
EditorContent.push("	writeroot = byid('writeroot');	");
EditorContent.push("	Curser.onoff();");
EditorContent.push("	Editor.print();");
EditorContent.push("	byid(\"editor\").style.left = editor_x + \"px\"");
EditorContent.push("	byid(\"editor\").style.top = editor_y + \"px\"");
EditorContent.push("	byid(\"editor\").onclick = clickEvtHandler;");
EditorContent.push("	byid(\"editor\").onmousedown = mousedownEvtHandler;");
EditorContent.push("	byid(\"editor\").onmouseup = mouseupEvtHandler;");
EditorContent.push("	byid(\"editor\").onmousemove = mousemoveEvtHandler;");
EditorContent.push("	//byid(\"editor\").onmousemove");
EditorContent.push("}");
EditorContent.push("");
EditorContent.push("document.defaultAction = false;");
EditorContent.push("document.onkeypress = detectEvent;");
EditorContent.push("document.onkeyup = detectShiftRelease;");
EditorContent.push("document.onkeydown = detectShiftPress;");
EditorContent.push("window.onload = init;");
EditorContent.push("");
EditorContent.push("//MouseWheel (for scrolling)");
EditorContent.push("if (window.addEventListener)/** DOMMouseScroll is for mozilla. */");
EditorContent.push("	window.addEventListener('DOMMouseScroll', wheel, false);");
EditorContent.push("/** IE/Opera. */");
EditorContent.push("window.onmousewheel = document.onmousewheel = wheel;");
EditorContent.push("");
EditorContent.push("function wheel(event){");
EditorContent.push("	var delta = 0;");
EditorContent.push("	if (!event) /* For IE. */");
EditorContent.push("		event = window.event;");
EditorContent.push("	if (event.wheelDelta) { /* IE/Opera. */");
EditorContent.push("		delta = event.wheelDelta/120;");
EditorContent.push("	");
EditorContent.push("	/** In Opera 9, delta differs in sign as compared to IE.");
EditorContent.push("	*/");
EditorContent.push("	if (window.opera)");
EditorContent.push("		delta = -delta;");
EditorContent.push("	}else if (event.detail) { /** Mozilla case. */");
EditorContent.push("		/** In Mozilla, sign of delta is different than in IE.");
EditorContent.push("		* Also, delta is multiple of 3.");
EditorContent.push("		*/");
EditorContent.push("		delta = -event.detail/3;");
EditorContent.push("	}");
EditorContent.push("	");
EditorContent.push("	/*What Target was scrolled upon*/");
EditorContent.push("	var targ;");
EditorContent.push("	//if (!e) var e = window.event;");
EditorContent.push("	if (event.target) ");
EditorContent.push("		targ = event.target;");
EditorContent.push("	else if (event.srcElement) ");
EditorContent.push("		targ = event.srcElement;");
EditorContent.push("	if (targ.nodeType == 3){ // defeat Safari bug");
EditorContent.push("		targ = targ.parentNode;	");
EditorContent.push("	}");
EditorContent.push("	");
EditorContent.push("	/** If delta is nonzero, handle it.");
EditorContent.push("	* Basically, delta is now positive if wheel was scrolled up,");
EditorContent.push("	* and negative, if wheel was scrolled down.");
EditorContent.push("	*/");
EditorContent.push("	if (delta && (targ.id==\"content\" || targ.parentNode.id==\"content\") )");
EditorContent.push("		handle(delta);");
EditorContent.push("	/** Prevent default actions caused by mouse wheel.");
EditorContent.push("	* That might be ugly, but we handle scrolls somehow");
EditorContent.push("	* anyway, so don't bother here..");
EditorContent.push("	*/");
EditorContent.push("	if (event.preventDefault)");
EditorContent.push("		event.preventDefault();");
EditorContent.push("	event.returnValue = false;");
EditorContent.push("}");
EditorContent.push("/** This is high-level function.");
EditorContent.push(" * It must react to delta being more/less than zero.");
EditorContent.push(" */");
EditorContent.push("function handle(delta) {");
EditorContent.push("	if (delta < 0)");
EditorContent.push("		for(var x=0;x<6;x++)");
EditorContent.push("			Editor.move_down()");
EditorContent.push("	else");
EditorContent.push("		for(var x=0;x<6;x++)");
EditorContent.push("			Editor.move_up()");
EditorContent.push("}");
EditorContent.push("function detectShiftPress(e){");
EditorContent.push("	var evt = e || window.event;");
EditorContent.push("	");
EditorContent.push("	//Continue selection... how ?");
EditorContent.push("	if(evt.keyCode==16)");
EditorContent.push("	{");
EditorContent.push("		//Selection.from_row = 0;");
EditorContent.push("		//Selection.from_col = 0;");
EditorContent.push("		");
EditorContent.push("		Selection.active = true;");
EditorContent.push("		Editor.print();");
EditorContent.push("	}");
EditorContent.push("}");
EditorContent.push("function detectShiftRelease(e){");
EditorContent.push("	var evt = e || window.event;");
EditorContent.push("	");
EditorContent.push("	if(evt.keyCode==16)");
EditorContent.push("	{");
EditorContent.push("		//Selection.from_row = 0;");
EditorContent.push("		//Selection.from_col = 0;");
EditorContent.push("		Selection.active = false;");
EditorContent.push("		Editor.print();");
EditorContent.push("	}");
EditorContent.push("}");
EditorContent.push("function detectEvent(e) {");
EditorContent.push("	var evt = e || window.event;");
EditorContent.push("	");
EditorContent.push("	if(evt.charCode && !evt.ctrlKey && !evt.altKey)");
EditorContent.push("		Keyhandler_Char(evt.charCode, evt);");
EditorContent.push("	if(evt.keyCode)");
EditorContent.push("		Keyhandler_Meta(evt.keyCode, evt);");
EditorContent.push("");
EditorContent.push("	/*keylog.push( evt.type + '<br />' + ");
EditorContent.push("				'keyCode is ' + evt.keyCode + '<br />' + ");
EditorContent.push("				'charCode is ' + evt.charCode + '<br /><br />' );");
EditorContent.push("");
EditorContent.push("	writeData();*/");
EditorContent.push("	if (!evt.stopPropagation) {");
EditorContent.push("		evt.stopPropagation = function() {this.cancelBubble = true;};");
EditorContent.push("		evt.preventDefault = function() {this.returnValue = false;};");
EditorContent.push("	}");
EditorContent.push("	if (!evt.stop) {");
EditorContent.push("		evt.stop = function() {");
EditorContent.push("			this.stopPropagation();");
EditorContent.push("			this.preventDefault();");
EditorContent.push("		};");
EditorContent.push("	}");
EditorContent.push("	");
EditorContent.push("	evt.stop();");
EditorContent.push("	return false;");
EditorContent.push("	//return document.defaultAction;");
EditorContent.push("}");
EditorContent.push("");
EditorContent.push("function clickEvtHandler(evt){ ");
EditorContent.push("	var e = evt || window.event;");
EditorContent.push("	window.focus();");
EditorContent.push("	");
EditorContent.push("	Curser.setCurser([");
EditorContent.push("		e.clientX - editor_x + window.pageXOffset +5, ");
EditorContent.push("		e.clientY - editor_y + window.pageYOffset +9");
EditorContent.push("	]);");
EditorContent.push("}");
EditorContent.push("");
EditorContent.push("var isPressed = false");
EditorContent.push("function mousedownEvtHandler(evt){ ");
EditorContent.push("	var e = evt || window.event;");
EditorContent.push("	isPressed = true;");
EditorContent.push("	");
EditorContent.push("	var coord = Curser.getMousePos([");
EditorContent.push("		e.clientX - editor_x + window.pageXOffset +5, ");
EditorContent.push("		e.clientY - editor_y + window.pageYOffset +9");
EditorContent.push("	]);");
EditorContent.push("	");
EditorContent.push("	Curser.setCurser([");
EditorContent.push("		e.clientX - editor_x + window.pageXOffset +5, ");
EditorContent.push("		e.clientY - editor_y + window.pageYOffset +9");
EditorContent.push("	]);");
EditorContent.push("	");
EditorContent.push("	if( !Selection.active ){	");
EditorContent.push("		Selection.from_row = Editor.Row();");
EditorContent.push("		Selection.from_col = Curser.Charcount();");
EditorContent.push("	}");
EditorContent.push("	Selection.active = true;");
EditorContent.push("	");
EditorContent.push("	return document.defaultAction;");
EditorContent.push("}");
EditorContent.push("function mouseupEvtHandler(evt){ ");
EditorContent.push("	var e = evt || window.event;");
EditorContent.push("	isPressed = false;");
EditorContent.push("	");
EditorContent.push("	var coord = Curser.getMousePos([");
EditorContent.push("		e.clientX - editor_x + window.pageXOffset +5, ");
EditorContent.push("		e.clientY - editor_y + window.pageYOffset +9");
EditorContent.push("	]);");
EditorContent.push("");
EditorContent.push("	Selection.active = false;");
EditorContent.push("	");
EditorContent.push("	Curser.setCurser([");
EditorContent.push("		e.clientX - editor_x + window.pageXOffset +5, ");
EditorContent.push("		e.clientY - editor_y + window.pageYOffset +9");
EditorContent.push("	]);");
EditorContent.push("	");
EditorContent.push("	Selection.end_row = Editor.Row();");
EditorContent.push("	Selection.end_col = Curser.Charcount();");
EditorContent.push("	");
EditorContent.push("	Editor.print()");
EditorContent.push("	return document.defaultAction;");
EditorContent.push("}");
EditorContent.push("function mousemoveEvtHandler(evt){ ");
EditorContent.push("	var e = evt || window.event;");
EditorContent.push("	");
EditorContent.push("	if(Selection.active && isPressed){");
EditorContent.push("		var coord = Curser.getMousePos([");
EditorContent.push("			e.clientX - editor_x + window.pageXOffset +5, ");
EditorContent.push("			e.clientY - editor_y + window.pageYOffset +9");
EditorContent.push("		]);");
EditorContent.push("		");
EditorContent.push("		Curser.setCurser([");
EditorContent.push("			e.clientX - editor_x + window.pageXOffset +5, ");
EditorContent.push("			e.clientY - editor_y + window.pageYOffset +9");
EditorContent.push("		]);");
EditorContent.push("		");
EditorContent.push("		Selection.end_row = Editor.Row();");
EditorContent.push("		Selection.end_col = Curser.Charcount();");
EditorContent.push("		");
EditorContent.push("		Editor.print()");
EditorContent.push("		return document.defaultAction;");
EditorContent.push("	}");
EditorContent.push("}");
EditorContent.push("");
EditorContent.push("function writeData() {");
EditorContent.push("	var out = \"\";");
EditorContent.push("	for(i=keylog.length-1 ; i>keylog.length-5 ; i--)");
EditorContent.push("		out += keylog[i];");
EditorContent.push("	");
EditorContent.push("	writeroot.innerHTML = out;");
EditorContent.push("}");
//----------
EditorContent = [];
//----------
EditorContent.push("html, address,")
EditorContent.push("blockquote,")
EditorContent.push("body, dd, div,")
EditorContent.push("dl, dt, fieldset, form,")
EditorContent.push("frame, frameset,")
EditorContent.push("h1, h2, h3, h4,")
EditorContent.push("h5, h6, noframes,")
EditorContent.push("ol, p, ul, center,")
EditorContent.push("dir, hr, menu, pre   { display: block }")
EditorContent.push("li              { display: list-item }")
EditorContent.push("head            { display: none }")
EditorContent.push("table           { display: table }")
EditorContent.push("tr              { display: table-row }")
EditorContent.push("thead           { display: table-header-group }")
EditorContent.push("tbody           { display: table-row-group }")
EditorContent.push("tfoot           { display: table-footer-group }")
EditorContent.push("col             { display: table-column }")
EditorContent.push("colgroup        { display: table-column-group }")
EditorContent.push("td, th          { display: table-cell }")
EditorContent.push("caption         { display: table-caption }")
EditorContent.push("th              { font-weight: bolder; text-align: center }")
EditorContent.push("caption         { text-align: center }")
EditorContent.push("body            { margin: 8px }")
EditorContent.push("h1              { font-size: 2em; margin: .67em 0 }")
EditorContent.push("h2              { font-size: 1.5em; margin: .75em 0 }")
EditorContent.push("h3              { font-size: 1.17em; margin: .83em 0 }")
EditorContent.push("h4, p,")
EditorContent.push("blockquote, ul,")
EditorContent.push("fieldset, form,")
EditorContent.push("ol, dl, dir,")
EditorContent.push("menu            { margin: 1.12em 0 }")
EditorContent.push("h5              { font-size: .83em; margin: 1.5em 0 }")
EditorContent.push("h6              { font-size: .75em; margin: 1.67em 0 }")
EditorContent.push("h1, h2, h3, h4,")
EditorContent.push("h5, h6, b,")
EditorContent.push("strong          { font-weight: bolder }")
EditorContent.push("blockquote      { margin-left: 40px; margin-right: 40px }")
EditorContent.push("i, cite, em,")
EditorContent.push("var, address    { font-style: italic }")
EditorContent.push("pre, tt, code,")
EditorContent.push("kbd, samp       { font-family: monospace }")
EditorContent.push("pre             { white-space: pre }")
EditorContent.push("button, textarea,")
EditorContent.push("input, select   { display: inline-block }")
EditorContent.push("big             { font-size: 1.17em }")
EditorContent.push("small, sub, sup { font-size: .83em }")
EditorContent.push("sub             { vertical-align: sub }")
EditorContent.push("sup             { vertical-align: super }")
EditorContent.push("table           { border-spacing: 2px; }")
EditorContent.push("thead, tbody,")
EditorContent.push("tfoot           { vertical-align: middle }")
EditorContent.push("td, th          { vertical-align: inherit }")
EditorContent.push("s, strike, del  { text-decoration: line-through }")
EditorContent.push("hr              { border: 1px inset }")
EditorContent.push("ol, ul, dir,")
EditorContent.push("menu, dd        { margin-left: 40px }")
EditorContent.push("ol              { list-style-type: decimal }")
EditorContent.push("ol ul, ul ol,")
EditorContent.push("ul ul, ol ol    { margin-top: 0; margin-bottom: 0 }")
EditorContent.push("u, ins          { text-decoration: underline }")
EditorContent.push("br:before       { content: \"\A\" }")
EditorContent.push(":before, :after { white-space: pre-line }")
EditorContent.push("center          { text-align: center }")
EditorContent.push(":link, :visited { text-decoration: underline }")
EditorContent.push(":focus          { outline: thin dotted invert }")
EditorContent.push("")
EditorContent.push("/* Begin bidirectionality settings (do not change) */")
EditorContent.push("BDO[DIR=\"ltr\"]  { direction: ltr; unicode-bidi: bidi-override }")
EditorContent.push("BDO[DIR=\"rtl\"]  { direction: rtl; unicode-bidi: bidi-override }")
EditorContent.push("")
EditorContent.push("*[DIR=\"ltr\"]    { direction: ltr; unicode-bidi: embed }")
EditorContent.push("*[DIR=\"rtl\"]    { direction: rtl; unicode-bidi: embed }")
EditorContent.push("")
EditorContent.push("@media print {")
EditorContent.push("  h1            { page-break-before: always }")
EditorContent.push("  h1, h2, h3,")
EditorContent.push("  h4, h5, h6    { page-break-after: avoid }")
EditorContent.push("  ul, ol, dl    { page-break-before: avoid }")
EditorContent.push("}")
//----------
EditorContent = [];
//----------
EditorContent.push("<html>")
EditorContent.push("	<head>")
EditorContent.push("		<script>")
EditorContent.push("		function func(){}")
EditorContent.push("		</script>")
EditorContent.push("		<style>")
EditorContent.push("		#div1{ color:blue; }")
EditorContent.push("		</style>")
EditorContent.push("	</head>")
EditorContent.push("	<body onload='func();'>")
EditorContent.push("		<div id='div1' onclick='alert(1)' style='display:none;'></div>")
EditorContent.push("	</body>")
EditorContent.push("</html>")
//----------
/*
EditorContent = [];
//----------
EditorContent.push("function Nice()");
EditorContent.push("{");
EditorContent.push("	var bbb = 123;");
EditorContent.push("	var ping,pong;");
EditorContent.push("	var a=2,b=3;");
EditorContent.push("	");
EditorContent.push("	for(var i=0; i<10; i++)");
EditorContent.push("	{");
EditorContent.push("		");
EditorContent.push("	}");
EditorContent.push("}");
EditorContent.push("");
EditorContent.push("function Nasty()");
EditorContent.push("{");
EditorContent.push("	abc = 123");
EditorContent.push("	");
EditorContent.push("	for(j=0; j<10; j++)");
EditorContent.push("		abc++;");
EditorContent.push("}");
EditorContent.push("");
*/
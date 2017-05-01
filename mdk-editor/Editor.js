/// <reference path="CopyPaste.js" />
/// <reference path="Curser.js" />
/// <reference path="Initializer.js" />
/// <reference path="Keyhandler.js" />
/// <reference path="Selection.js" />
/// <reference path="UndoRedo.js" />
/// <reference path="Utilities.js" />
/// <reference path="Parsers.js" />


function Class_Editor()
{
	var lines_per_page = (arguments[0]) ? arguments[0] : 10;
	var cols_per_page = (arguments[1]) ? arguments[1] : 40;
	var wrap = (arguments[2]) ? arguments[2] : false;
	var Language = (arguments[3]) ? arguments[3] : htmlParser;
	
	var offz_x = 0;
	var offz_y = 0;
	this.Buffer = null;
	this.wrappedLines = new Array();
	this.overWriteMode = false;
	
	_editor.style.width = 
		__content.style.width = 
		_secondary.style.width = (cols_per_page * fontsize[0]) + "px";
		
	_editor.style.height = 
		_linenumbers.style.height =
		__content.style.height = 
		_secondary.style.height = ((lines_per_page) * fontsize[1]) + "px";
	
	_scrollbarX.style.width = (cols_per_page*fontsize[0]) + 'px';
	
	_editorinfo.style.width = (cols_per_page * fontsize[0]) + "px";
	
	this.height = function()
	{
		return lines_per_page;
	}
	
	this.width = function()
	{
		return cols_per_page;
	}
	
	this.OffzY = function()
	{
		offz_y = (arguments[0]!=undefined)? arguments[0] : offz_y;
		return offz_y;
	}
	
	this.OffzX = function()
	{
		offz_x = (arguments[0]!=undefined)? arguments[0] : offz_x;
		return offz_x;
	}
	
	this.Row = function()
	{
		return Curser.Row()// + offz_y;
	}
	
	this.Wrap = function()
	{
	    if(arguments[0])
	        wrap = arguments[0];
	    return wrap;
	}
	this.setCode = function(str){
	    EditorContent = str.split("\n");
	    this.print(true);
	}

	this.getCode = function() {
	    return EditorContent.join("\n");
	}
	
	this.setLanguage = function(lang)
	{
		Language = lang;
		this.fillBuffer();
	}
	
	this.getLanguage = function()
	{
		return Language; 
	}
	
	/********************************************************************************************
		SUBSCRIBABLE EVENTS
	********************************************************************************************/	
	
	this.onSave = null;
	this.onSaveAs = null;
	this.onTabClose = null;
	this.onSearch = null;
	this.onSearchReplace = null;
//	this.on = null;
	
	this.fireOnSave = function(){
		if(this.onSave != null){this.onSave(this.getCode());}
		else{ alert("onSave Event (Subscribable)"); }
	}
	
	this.fireOnSaveAs = function(){
		if(this.onSaveAs != null){this.onSaveAs(this.getCode());}
		else{ alert("onSaveAs Event (Subscribable)"); }
	}
	
	this.fireOnTabClose = function(){
		if(this.onTabClose != null){this.onTabClose();}
		else{ alert("onTabClose Event (Subscribable)"); }
	}
	
	this.fireOnSearch = function(){
		if(this.onSearch != null){this.onSearch(Selection.getText());}
		else{ alert("onSearch Event (Subscribable)"); }
	}
	
	this.fireOnSearchReplace = function(){
		if(this.onSearchReplace != null){this.onSearchReplace(Selection.getText());}
		else{ alert("onSearchReplace Event (Subscribable)"); }
	}
	
//	this.fireOn = function(){
//		if(this.on != null){this.on();}
//		else{ alert(" Event (Subscribable)"); }
//	}
	
	/********************************************************************************************
		GET TAB INDEX
	********************************************************************************************/
	this.getTabIndex = function(row)
	{
		var tab = EditorContent[row].match(/^(\s)+/)
		if(tab==undefined)
			return "";
		return tab[0];
	}
	/********************************************************************************************
		SELECT LINE
	********************************************************************************************/
	this.selectLineStart = function(evt)
	{
	    isPressed = true;
	    var e = evt ? evt : window.event;
	    var targ = getTarget(e);
	    var row = targ.id.split("_")[1] * 1
	    
		Selection.release();
		Selection.from_row = row;
		Selection.from_col=0;
		Selection.end_row = row;
		Selection.end_col=EditorContent[row].length;
		Curser.move_to(EditorContent[row].length, row)
		Curser.update();
		__content.focus();
		Editor.print(true);
	}
	this.selectLineEnd = function(evt)
	{
	    isPressed = false;
        var e = evt ? evt : window.event;
	    var targ = getTarget(e);
        var row = targ.id.split("_")[1] * 1
        
        Selection.end_row = row;
	    Selection.end_col=EditorContent[row].length;
	    Curser.move_to(EditorContent[row].length, row)
	    Curser.update();
	    __content.focus();
	    Editor.print(true);
	}
	this.selectLineMove = function(evt)
	{
	    var e = evt ? evt : window.event;
	    var targ = getTarget(e);
	    var row = targ.id.split("_")[1] * 1
	    
	    if(isPressed)
	    {
            Selection.end_row = row;
	        Selection.end_col=EditorContent[row].length;
	        Curser.move_to(EditorContent[row].length, row)
	        Curser.update();
	        __content.focus();
	        Editor.print(true);
	    }
	}
	/********************************************************************************************
		MOVE UP / DOWN
	********************************************************************************************/
	this.move_down = function()
	{
		if( offz_y < EditorContent.length-lines_per_page+10 ){
			offz_y++;
			scrollTimeDown(20);
		}
		if(arguments[0]!=true)
			this.print();
		
		DisableGoto = true;
		_scrollbarY.scrollTop = fontsize[1] * offz_y;
	}
	
	this.move_up = function()
	{
		if(offz_y>0){
			offz_y--;
			scrollTimeDown(20);
		}
		if(arguments[0]!=true)
			this.print();
		
		DisableGoto = true;
		_scrollbarY.scrollTop = fontsize[1] * offz_y;
	}
	/********************************************************************************************
		PAGE UP / DOWN
	********************************************************************************************/
	this.page_down = function()
	{
	    if(Curser.Row()+lines_per_page < EditorContent.length)
	    {
			Curser.move_to( Curser.Charcount(), this.Row()+lines_per_page);
			offz_y += lines_per_page;
			_scrollbarY.scrollTop = fontsize[1] * offz_y;
		}else{
			Curser.move_to( Curser.Charcount(), EditorContent.length-1);
			offz_y = (EditorContent.length - 10>0)?EditorContent.length - 10 : 0;
			_scrollbarY.scrollTop = fontsize[1] * offz_y;
		}
		if(Selection.active)
		{
			Selection.end_row = this.Row();
		}
		this.print(true);
	}
	
	this.page_up = function()
	{
		if(Curser.Row() > lines_per_page)
	    {
			Curser.move_to( Curser.Charcount(), this.Row()-lines_per_page);
			offz_y -= lines_per_page;
			_scrollbarY.scrollTop = fontsize[1] * offz_y;
		}else{
			Curser.move_to( Curser.Charcount(), 0);
			offz_y = 0;
			_scrollbarY.scrollTop = fontsize[1] * offz_y;
		}
		if(Selection.active)
		{
			Selection.end_row = this.Row();
		}
		this.print(true);
	}
	/********************************************************************************************
		EDITOR: GET NEXT WORD
	********************************************************************************************/
	this.getNextWord = function()
	{
		var word = "";
		var col = Curser.Charcount();
		var row = this.Row();
		
		do{
			col++
			if( !EditorContent[row].charAt(col)
			||  !EditorContent[row].charAt(col-1) 
			|| (row==EditorContent.length-1 && col==EditorContent[EditorContent.length-1]-1) 
			|| !EditorContent[row].charAt(col-1).match )
				break;
		}while( EditorContent[row].charAt(col).match(/[\d\w_]/i)
		&& !EditorContent[row].charAt(col-1).match(/[\W ]/i) )
		
		return EditorContent[row].substr(col, Curser.Charcount()-col);
	}
	/********************************************************************************************
		EDITOR: GET LAST CHAR
	********************************************************************************************/
	this.getLastChar = function()
	{
		var Char = "";
		var row = this.Row();
		
	}
	/********************************************************************************************
		EDITOR: GET LAST WORD (LEFT TO CURSOR)
	********************************************************************************************/
	this.getLastWord = function()
	{
		var word = "";
		var col = Curser.Charcount();
		var row = this.Row();
		
		while( EditorContent[row].charAt(col-1).match(/[\d\w_\-]/) )
		//&& !EditorContent[row].charAt(col-1).match(/[\W ]/i) )
		{
			col--;
			if( !EditorContent[row].charAt(col)
			||  !EditorContent[row].charAt(col-1)
			|| (row==0 && col==0) 
			|| !EditorContent[row].charAt(col-1).match )
				break;
		}
		
		return EditorContent[row].substr(col, Curser.Charcount()-col);
	}
	
	/********************************************************************************************
		EDITOR: GET PREVIOUS WORD
	********************************************************************************************/
	this.getPreviousWord = function()
	{
		var line = EditorContent[this.Row()].substr(0, Curser.Charcount());
		var arr = line.split(' ');
		return arr[arr.length-2];
	}
	
	/********************************************************************************************
		EDITOR.FORMATSELECTION - DRAW SELECTED TEXT
	********************************************************************************************/
	this.formatSelection = function(row)
	{
		if( Selection.getStartRow() <= row && Selection.getEndRow() >= row && Selection.distance()){
			var str = EditorContent[row];
			
			if(Selection.getStartRow() != Selection.getEndRow()){
				if(Selection.getStartRow() == row)
					str = str.substr(0,Selection.getStartCol()) + "┬" + str.substr(Selection.getStartCol())
				if(Selection.getEndRow() == row)
					str = str.substr(0,Selection.getEndCol()) + "┴" + str.substr(Selection.getEndCol())
				if(row == offz_y && Selection.getStartRow() < offz_y && row < Selection.getEndRow())
					str = "┬" + str
			}else{
				
				var fc = Math.min(Selection.end_col , Selection.from_col)
				var ec = Math.max(Selection.end_col , Selection.from_col)
				
				var clip1 = str.substr(0,fc)
				var clip2 = str.substr(fc, ec-fc)
				var clip3 = str.substr(ec)
				
				str = clip1 + "┬" + clip2 + "┴" + clip3;
			}
		    str = str.replace(/(&)/g,"&amp;")
			if(wrap){
				str = str.replace(/(\t)/g, "┐┐┐┐");
				str = str.replace(/(.{40})/g, "$1└");
				str = str.replace(/( )/g,"&nbsp;")
				str = str.replace(/(<)/g,"&lt;").replace(/(>)/g,"&gt;")
				str = str.replace(/(└)/g,"<br>")
				str = str.replace(/(┐┐┐┐)/g, "&nbsp;&nbsp;&nbsp;&nbsp;");
			}else{
				str = str.replace(/( )/g,"&nbsp;")
				str = str.replace(/(<)/g,"&lt;").replace(/(>)/g,"&gt;")
				str = str.replace(/(\t)/g, "&nbsp;&nbsp;&nbsp;&nbsp;");
			}
			//tabs
			//str = str.replace(/^((&nbsp;&nbsp;&nbsp;&nbsp;)+)/,"<b class='tab'>$1</b>");
			str = str.replace("┬", "<span class='select'>")
			str = str.replace("┴", "</span>")
			return str + "<br>";
		}else
			return "<br>";
	}
	
	/********************************************************************************************
		FILL BUFFER
	********************************************************************************************/
	this.fillBuffer = function()
	{
		/*this.Buffer = new Array();
		for(var i=0; i<EditorContent.length; i++){
			this.Buffer.push( this.format(EditorContent[i]) )
		}*/
		this.Buffer = Language();
	}
	this.fillBuffer(); //Run on Init();
	
	/********************************************************************************************
		SCROLLBAR
	********************************************************************************************/
	
	this.findLongest = function()
	{
		LongestLine = 0
		var len =  EditorContent.length-1;
		do{
			LongestLine = Math.max(  EditorContent[len].replace(/(\t)/g,"....").length , LongestLine )
		}while( len-- );
	}
	this.findLongest();
	
	var LongestLine = 0
	this.checkLongestLine  = function()
	{
		if(arguments[0]!=undefined)
		{
			LongestLine = Math.max(  EditorContent[arguments[0]].replace(/(\t)/g,"....").length , LongestLine )
		}
		
		if(LongestLine > cols_per_page)
		{
			_scrollbarX.innerHTML = "<div style='width:"+((LongestLine*fontsize[0])+(fontsize[0]*20))+"px;border:1px #000000 solid'>&nbsp;</div>";
			_scrollbarX.style.display= 'block';
		}
		else
		{
			_scrollbarX.style.display= 'none';
		}
	}
	
	this.initScrollBar = function()
	{
		_scrollbarY.innerHTML = "<div style='height:" + ((EditorContent.length+20) * fontsize[1]) + "px;'>&nbsp;</div>";
		
		this.findLongest();
		this.checkLongestLine(arguments[0]);
	}
	
	this.initScrollBar(); //onload
	
	/********************************************************************************************
		REBUFFER ROW
	********************************************************************************************/
	this.reBufferRow = function(row)
	{
		/*/
		LongestLine = Math.max(  EditorContent[row].replace(/(\t)/g,"....").length , LongestLine )
		this.Buffer[row] = this.format(EditorContent[row]);
		/*/
		if(arguments[0] && arguments[1])
		{
			this.Buffer.splice(arguments[0], arguments[1]-arguments[0]);
			this.Buffer = this.Buffer.insert(arguments[0], Language(arguments[0], arguments[1]) );
		}
		else
		{
			var y = offz_y;				y = (y > 0) ? (y<10) ? 0 : y-10 : y;
			var y2 = lines_per_page;	y2 = (lines_per_page<5) ? lines_per_page + y2 + 10 : 30 + lines_per_page ;
			this.Buffer.splice(y, y2);
			this.Buffer = this.Buffer.insert(y, Language(y, y + y2) );
		}
		/**/
	}
	
	/********************************************************************************************
		GOTO
	********************************************************************************************/
	this.Goto = function(row)
	{
		if( row<EditorContent.length ){
			if(row>10){	
				Editor.OffzY(row-10);
				Curser.move_to(Editor.getTabIndex(row).length, row);
			}else{
				Editor.OffzY(0);
				Curser.move_to(Editor.getTabIndex(row).length, row);
			}
		}else{
			row = EditorContent.length-1;
			Editor.OffzY(row-10);
			Curser.move_to(Editor.getTabIndex(row).length, row);
		}
		if(arguments[1]) Curser.move_to(arguments[1]);
		
		Editor.print(true);
	}
	
	/********************************************************************************************
		JSLINT PARSER
	********************************************************************************************/
	this.errors = [];
	this.compile = function()
	{
		//quickfix:
		if(Language!==jsParser && Language!==htmlParser)
		{
			this.errors = [];
			return;
		}
		var NoErrors = JSLINT(EditorContent, {browser:true, laxbreak:true, evil:true});
		if(NoErrors){
			if(arguments[1]){ alert("Document is bulletproof!\n\nGood work!"); }
		}else{
			this.errors = [];
			for(var i=0,Bug; Bug=JSLINT.errors[i]; i++){
			    //this.errors[row].BugPos + "<span id='b_" + this.errors[row].BugIndex + "' class='bug'>&nbsp;</span>
				this.errors[Bug.line] = QuickFill(Bug.character) + "<span id='b_" + i + "' class='bug'>&nbsp;</span>";
				/*{ 
					BugIndex  : i, 
					BugPos    : QuickFill(RunLength(Bug.line, Bug.character))
				};*/
			}
		}
		if(arguments[0])
			this.print(true);
		if(arguments[1] && JSLINT.errors[0])
			this.Goto(JSLINT.errors[0].line, JSLINT.errors[0].character);
		else if(arguments[1])
			this.Goto(0,0);
	}
	
	var QuickFill = function(P)
	{
		if(P<=0) return "";
		var out = "";
		do{switch(P%4){
			case 1 : P-=1; out+="&nbsp;";					break;
			case 2 : P-=2; out+="&nbsp;&nbsp;";				break;
			case 3 : P-=3; out+="&nbsp;&nbsp;&nbsp;";		break;
			case 0 : P-=4; out+="&nbsp;&nbsp;&nbsp;&nbsp;"; break;
		}}while(P)
		
		return out;
	}
	
	this.test = function(){ return QuickFill(0) }
	
	this.ExplainErrorOver = function(evt)
	{
		var e = evt ? evt : window.event;
		var targ = getTarget(e);
		var errNum = targ.id.split("_")[1] * 1
		
		_ErrorExplain.innerHTML = JSLINT.errors[errNum].reason;
		_ErrorExplain.style.display = "block";
	}
	this.ExplainErrorOut = function(evt)
	{
		_ErrorExplain.innerHTML = "";
		_ErrorExplain.style.display = "none";
	}
	
	/********************************************************************************************
		EDITOR.PRINT - DISPLAY CONTENT AND SELECTION
	********************************************************************************************/
	var lastOffSetY = -1;
	var lastLength = -1;
	this.print = function()
	{
		if(EditorContent.length==0){
		    EditorContent.push("");
		}
		var out = ""; //new FStringCat();
			//out.push("<div id='errors'></div>");
		var out2 = new FStringCat();
		
		var lines = "", bugs = "";
		var cnt = offz_y
		
		if(EditorContent.length != this.Buffer.length){
			this.fillBuffer();
			//this.Buffer = parse();
		}
				
		if(!Selection.active || arguments[0]==true)
		{
			/**/
				if(!isScrolling ){//|| offz_y%10 == 0){
					this.reBufferRow(this.Row());
				}
				out = this.Buffer.slice(offz_y, offz_y+lines_per_page).join("");
		    /*/
				var y = offz_y;
				y = (y > 0) ? (y<20) ? 0 : y-20 : y;
				//this.Buffer.splice(y, lines_per_page);
				//this.Buffer = this.Buffer.insert(y, parse(y, y + lines_per_page) );
				out = parse(y, y+lines_per_page).splice(offz_y+y , y+lines_per_page).join("");
		    /**/
		    
		    bugs = this.errors.slice(offz_y, offz_y+lines_per_page).join("<br>");
		    
		    for(var row=offz_y ; row<offz_y+lines_per_page ; row++)
		    {
			    if(EditorContent[row] != undefined)
			    {
				    if(lastOffSetY != offz_y || lastLength != EditorContent.length)
				        lines += "<div class='line' id='r_" + row + "'>" + row + "</div>";
			    }
		    }
		}
		if( Selection.distance() )
		{
			for(var row=offz_y ; row<offz_y+lines_per_page ; row++)
				out2.push(this.formatSelection(row));
		}
		
		if(!Selection.active || arguments[0]==true)
		{
			__content = replaceHtml(__content, out);
			
			if(lastOffSetY != offz_y || lastLength != EditorContent.length)
			    _linenumbers.innerHTML = lines;
			_errors = replaceHtml(_errors, bugs);
			
			if(lastOffSetY != offz_y || lastLength != EditorContent.length)
			{
			    setTimeout(function()
			    {
					//var LineDivs = 
			        for(var i=0,line; line=_linenumbers.getElementsByTagName("div")[i]; i++)
			        {
			            line.onmousedown = Editor.selectLineStart;
		                line.onmousemove = Editor.selectLineMove;
		                line.onmouseup = Editor.selectLineEnd;
			        }
			        					
			    }, 1);
			}
			
			//var bugs = 
			for(var i=0, Bug; Bug=_errors.getElementsByTagName("span")[i]; i++)
			{
				Bug.onmousemove = Editor.ExplainErrorOver;
				Bug.onmouseout = Editor.ExplainErrorOut;
			}
		}
		_secondary.innerHTML = out2.value();
		
		Curser.update();
		
		if(lastOffSetY != offz_y)				lastOffSetY = offz_y;
		if(lastLength != EditorContent.length)	lastLength = EditorContent.length;
		
		if( Curser.Col()+1 >= Editor.width()+Editor.OffzX() )
			Curser.scrollX( Curser.Col()+20 );
			
		if( Curser.Col() < Editor.OffzX() )
			Curser.scrollX( Curser.Col() );
	}
	
	/********************************************************************************************
		BRACKET MATCHING: CURSOR EVENT
	********************************************************************************************/
	
	var beginBrackets = { "(" : ")", "{" : "}", "[" : "]", "<" : ">" };
	var endBrackets =	{ ")" : "(", "}" : "{", "]" : "[", ">" : "<" };
	
	var bracketplacements = {
		"pre1"  : [-1,-1],
		"pre2"  : [-1,-1],
		"post1" : [-1,-1],
		"post2" : [-1,-1]
	}
	
	var RunLength = function(row, col)
	{
		var runlength = EditorContent[row]
		runlength = runlength.substr(0,col)
		runlength = runlength.replace(/(\t)/g, "....");
		return runlength.length
	}
	
	this.bracketmatch = function(row, col)
	{
		var right = (EditorContent[row]) ? EditorContent[row].charAt(col) : false;
		var left  = (EditorContent[row]) ? EditorContent[row].charAt(col-1) : false;
		var searchleft = searchright = false;
		
		if(right)
			if(beginBrackets[right])
			{
				right_end = beginBrackets[right];
				searchright = true;
				bracketplacements["post1"] = [row,col];
				
				_post1.style.display = "block";
				_post1.style.top = (fontsize[1]*(row-offz_y)) + "px";
				_post1.style.left = (fontsize[0]*RunLength(row,col)) + "px";
			}
		if(left)
			if(endBrackets[left])
			{
				left_end = endBrackets[left];
				searchleft = true;
				bracketplacements["pre1"] = [row,col-1];
				
				_pre1.style.display = "block";
				_pre1.style.top = (fontsize[1]*(row-offz_y)) + "px";
				_pre1.style.left = (fontsize[0]*RunLength(row,col-1)) + "px";
			}
		
		if(!searchright || row<this.Row() || row>this.Row()+lines_per_page){
			_post1.style.display = "none";
			_post2.style.display = "none";
		}
		if(!searchleft || row<this.Row() || row>this.Row()+lines_per_page){
			_pre1.style.display = "none";
			_pre2.style.display = "none";
		}
		if(!searchleft && !searchright){
			return;
		}
		
		/***********************
			SEARCH LEFT
		***********************/
		if(searchleft)
		{
			var openClose = 1;
			for(var currentrow=row ; currentrow>=0; ){
				for(var i = (currentrow==row)? col-2 : EditorContent[currentrow].length ; i>=0; )
				{	
					if(EditorContent[currentrow].charAt(i) == left_end)		openClose--;
					else if(EditorContent[currentrow].charAt(i) == left)	openClose++;
					
					if(openClose == 0) break;
					i--;
				}
				
				if(currentrow<offz_y){
					_pre2.style.display = "none";
					break;
				}
				
				if(openClose == 0)
				{
					bracketplacements["pre2"] = [currentrow, i]
					
					_pre2.style.display = "block";
					_pre2.style.top = (fontsize[1]*(currentrow-offz_y)) + "px";
					_pre2.style.left = (fontsize[0]*RunLength(currentrow,i)) + "px";
					
					break;
				}
				currentrow--;
			}
		}
		
		/***********************
			SEARCH RIGHT
		***********************/
		if(searchright)
		{
			var openClose = 1;
			for(var currentrow=row ; currentrow<EditorContent.length ; )
			{
				for(var i = (row==currentrow)? col+1 : 0 ; i< EditorContent[currentrow].length ; )
				{	
					if(EditorContent[currentrow].charAt(i) == right_end)		openClose--;
					else if(EditorContent[currentrow].charAt(i) == right)		openClose++;
					
					if(openClose == 0) break;
					i++;
				}
				
				if(currentrow>(offz_y+lines_per_page) ){
					_post2.style.display = "none";
					break;
				}
				
				if(openClose == 0){
					bracketplacements["post2"] = [currentrow, i]
					
					_post2.style.display = "block";
					_post2.style.top = (fontsize[1]*(currentrow-offz_y)) + "px";
					_post2.style.left = (fontsize[0]*RunLength(currentrow,i)) + "px";
					
					break;
				}
				
				currentrow++;
			}
		}
	}
	/********************************************************************************************
		BRACKET MATCHING: MOUSE HOVER EVENT (TODO)
	********************************************************************************************/
	
	/********************************************************************************************
		XML ELEMENT MATCHING : Credits go to Alvaro !!!
	********************************************************************************************/
	function showMatch(element, row, begin, end)
	{
        element.style.display = "block";
        element.style.top = (fontsize[1] * (row - offz_y)) + "px";
        var left  = (fontsize[0] * RunLength(row, begin));
        var right = (fontsize[0] * RunLength(row, end));
        element.style.left = left + "px";
        element.style.width = (right - left) + "px";
	}
	
	function hideMatch(element)
	{
	    element.style.display = "none";
	}
	
	this.xmlMatch = function(row, col)
	{
	    // console.log('--------------xmlMatch--------------', row, col);
		hideMatch(_xmlStart);
		hideMatch(_xmlFinish);
		
		var r = (EditorContent[row]) ? EditorContent[row].charAt(col)     : false;
		var l = (EditorContent[row]) ? EditorContent[row].charAt(col - 1) : false;
		var NameChar = "[A-Za-z0-9_:.-]|[^\\x00-\\x7F]";
		var nameCharRe = new RegExp(NameChar + '|[!?/\\[\\]]');
		var char_ = null;
		
		     if (r && nameCharRe.test(r)) char_ = r;
		else if (l && nameCharRe.test(l)) char_ = l, --col;
		else return;
		
	    // console.log('char_', char_);
		
	    var text = EditorContent[row];
	    var i, j, rightEdge, leftEdge;
        var none = false;
	    
		for (i = col; i < text.length; ++i)
		    if (!nameCharRe.test(text.charAt(i)))
		        { rightEdge = text.charAt(i); break; }
		
		for (j = col; j >= 0; --j)
		    if (!nameCharRe.test(text.charAt(j)))
		        { leftEdge = text.charAt(j); break; }

	    var tag = text.substring(j + 1, i).replace(/[\/\?!\[\]]*/g, '');
		// console.log('rightEdge:', rightEdge);
		// console.log('leftEdge:', leftEdge);
		// console.log('tag:', tag);

	    function right(type) {
		    // console.log('right:', type);
		    showMatch(_xmlStart, row, j, i);
		
		/*if(row<this.Row() || row>this.Row()+lines_per_page){
			hideMatch(_xmlStart);
		}*/
		    
		    Editor.xmlSearchRight(row, col, type);
	    }
	    
	    function left(type) {
		    // console.log('left:', type);
		    showMatch(_xmlFinish, row, j + 1, i + 1);
		    
		    /*if(row<this.Row() || row>this.Row()+lines_per_page){
			    hideMatch(_xmlFinish);
		    }*/
		    
		    Editor.xmlSearchLeft(row, col, type);
	    }
	    
	    if (leftEdge == '<')
	    {
	        switch (text.charAt(j + 1))
	        {
	        case '/': --j; left(tag);       break;
	        case '?': right('instruction'); break;
	        case '!':
	            var rest = text.substring(j + 2);
	            
	            function check(s) {
	                if (rest.indexOf(s) != 0) return false;
	                var marker = 2 + j + s.length;
	                if (col < marker + 1) return i = marker, true;
	                return false;
	            }

	                 if (check('DOCTYPE')) right('doctype');
	            else if (check('[CDATA[')) right('cdata');
	            else if (check('--'))      right('comment');
	            break;
	        default:
	            var tail = text.substring(i);
	            // console.log('tail', tail);
	            
	            if (rightEdge == '>')
	            {
	                     if (char_ == '/')                                  right('close');
	                else if (text.substring(i - 1).indexOf('/>') == 0) --i, right('close'); 
	                else                                               ++i, right(tag);
	            }
	            else if (/^\s+\/>$/.test(tail)) right('close');
	            else                            right(tag);
	        }
	    }
	    else if (rightEdge == '>')
	    {
	        function check(c) {
                if (text.charAt(i - 2) != c) return false;
                var marker = i - 2;
                if (col >= marker) return j = marker - 1, true;
                return false;
	        }
	    
	        switch (text.charAt(i - 1))
	        {
	        case '?':                 left('instruction'); break;
	        case ']': if (check(']')) left('cdata');       break;
	        case '-': if (check('-')) left('comment');     break;
	        case '/':                 left('open');        break;
	        default:  j = i - 1;      left('doctype');     break;
	        }
	    }
	}
	  
    
    this.xmlSearchLeft = function(row, col, type)
    {
		var openClose = 1;
	    var re = null;
	    var tag = false;
		    
	    switch (type) {
	    // FIXME: Not sure if these character classes are correct per
	    //        XML 1.1, at http://www.w3.org/TR/xml11/#sec-common-syn.
	    case 'instruction': re = /([A-Za-z0-9_:.-]|[^\x00-\x7F])*\?</g; break;
	    case 'doctype':     re = /EPYTCOD!</g;     break;
	    case 'comment':     re = /--!</g;          break;
	    case 'cdata':       re = /\[ATADC\[!</g;   break;
	    case 'open':        re = /([A-Za-z0-9_:.-]|[^\x00-\x7F])*</g;   break;
	    default:
	        // console.log('tag', '[' + type + ']');
	        tag = true;
	        re = new RegExp('>(/)[^<]*<'                                 + '|' + 
	                        '([^>A-Za-z0-9_:.-])' + type.reverse() + '<' + '|' +
	                        '>\\s*'               + type.reverse() + '<' + '|' +
	                        '>\\s*'               + type.reverse() + '(/)<' , "g");
	    }
		    
		for (var currentrow = row; currentrow >= 0; --currentrow)
		{
			var offset = (row == currentrow) ? col /*+ 1*/ : EditorContent[currentrow].length;
			var r = EditorContent[currentrow].substring(0, offset).reverse();
		    // console.log('r', r, "         ", r.reverse());
		    var match, index, length;
		    re.lastIndex = 0;
		    
	        while (openClose && (match = re.exec(r))) {
	            // console.log('openClose', openClose);
	            // console.log('match.length', match.length);
	            // console.log('match', match);
	            
	            index  = match.index;
	            length = match[0].length;
	            
	                 if (tag && match[1]); // Skip.
	            else if (tag && match[3]) ++openClose;
	            else                      --openClose;
	            
	            if (tag && match[2]) ++index, --length;
	        }
			
			/*if (currentrow > (offz_y + lines_per_page)) {
				hideMatch(_xmlStart);
				break;
			}*/
			
			if (openClose == 0)
			{
	            // console.log('CLOSED');
			    var begin = offset - index - length;
			    showMatch(_xmlStart, currentrow,
			        begin, begin + length);
			    break;
			}
		}
			
	    //console.log('openClose', openClose);
    }
    
    this.xmlSearchRight = function(row, col, type)
    {
		var openClose = 1;
	    var re = null;
	    var tag = false, within = true;
		    
	    switch (type) {
	    case 'instruction': re = /\?>/g;  break;
	    case 'doctype':     re = />/g;    break;
	    case 'comment':     re = /-->/g;  break;
	    case 'cdata':       re = /]]>/g;  break;
	    case 'close':       re = /\/?>/g; break;
	    default:
	        // console.log('tag', '[' + type + ']');
	        tag = true;
	        re = new RegExp('(/)>|' + '<[^>]+(/)>'    + '|' +
	                        '<'     + type + '\\s*>'  + '|' + 
	                        '<'     + type + '\\s+>?' + '|' + 
	                        '<(/)'  + type + '\\s*>', "g");
	    }
		    
		for (var currentrow = row; currentrow < EditorContent.length; ++currentrow)
		{
			var offset = (row == currentrow) ? col + 1 : 0;
			var r = EditorContent[currentrow].substring(offset);
		    // console.log('r', r);
		    var match, index, length;
		    
		    re.lastIndex = 0;
	        while (openClose && (match = re.exec(r))) {
	            // console.log('openClose', openClose);
	            // console.log('match.length', match.length);
	            // console.log('match', match);
	        
	            index  = match.index;
	            length = match[0].length;
	            

	            if (tag) {
	                if (match[1])
	                {
	                    if (within) --openClose;
	                }
	                else if (match[2]); // Skip.
	                else if (match[3])
	                      --openClose;
	                else  ++openClose;
	                within = false;
	            }
	            else --openClose;
	        }
			
			/*if (currentrow > (offz_y + lines_per_page)) {
				hideMatch(_xmlFinish);
				break;
			}*/
			
			if (openClose == 0)
			{
	            // console.log('CLOSED');
			    var begin = index + offset;
			    showMatch(_xmlFinish, currentrow,
			        begin, begin + length);
			    break;
			}
		}
			
	    //console.log('openClose', openClose);
	}
}
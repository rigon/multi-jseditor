/// <reference path="CopyPaste.js" />
/// <reference path="Editor.js" />
/// <reference path="Initializer.js" />
/// <reference path="Keyhandler.js" />
/// <reference path="Selection.js" />
/// <reference path="UndoRedo.js" />
/// <reference path="Utilities.js" />

function Class_Curser(){
	var row = 0;
	var col = 0;
	var CharCount = 0;
	var LineCount = 0;
	var max_row = arguments[0] ? arguments[0] : 10 ;
	var max_col = arguments[1] ? arguments[1] : 40 ;
	var visible = true;
	
	/*****************************************************************************
		PROPERTY FUNCTIONS
	*****************************************************************************/
	this.Col = function(){ 
		return col; 
	};
	
	this.SwitchOnOff = function(status)
	{
		visible = status;
	};
	
	this.Row = function(){ 
		row = (arguments[0]!==undefined)? arguments[0] : row ;
		return row; 
	};
	
	this.Charcount = function(){
		CharCount = (arguments[0]!==undefined)? arguments[0] : CharCount ;
		return CharCount; 
	};
	
	/*****************************************************************************
		CURSOR MOVEMENT FUNCTIONS
	*****************************************************************************/
	this.move_up = function()
	{
		if( row < Editor.OffzY() || row > Editor.OffzY()+Editor.height() )
		{
			Editor.Goto(row);
			this.move_to(CharCount);
			return;
		}
		
		if(row>Editor.OffzY()){
			row--;
		}else{
			if(row>0){
				row--;
			}
			Editor.move_up();
		}
		setCurser();
		//return (Editor.Row()>0)? true : false;
	};
	
	this.move_dn = function()
	{
		if( row < Editor.OffzY() || row > Editor.OffzY()+Editor.height() )
		{
			Editor.Goto(row);
			this.move_to(CharCount);
			return;
		}
		
		if(row-Editor.OffzY()<max_row-1 && row<EditorContent.length-1){
			row++;
		}else{
			if(row<EditorContent.length-1){
				row++;
			}
			Editor.move_down();
		}
		
		setCurser();
		//return (Editor.Row()>EditorContent.length-1)? true : false;
	};
	
	this.move_le = function()
	{
		if( row < Editor.OffzY() || row > Editor.OffzY()+Editor.height() )
		{
			Editor.Goto(row);
			this.move_to(CharCount);
			return;
		}
		
		if(CharCount>0){
			CharCount--;
		}
		else if(Editor.Row()>0)
		{
			this.move_up();
			this.move_end();
		}
		setCurser();
	};
	
	this.move_ri = function()
	{
		if( row < Editor.OffzY() || row > Editor.OffzY()+Editor.height() )
		{
			Editor.Goto(row);
			this.move_to(CharCount);
			return;
		}
		
		var len = EditorContent[Editor.Row()].length;
		if( CharCount < len ){
			CharCount++;
		}
		else if(Editor.Row() < EditorContent.length-1)
		{
			this.move_dn();
			this.move_first();
			this.scrollX(0);
		}
		setCurser();
	};
	
	this.move_end = function()
	{
		if( row < Editor.OffzY() || row > Editor.OffzY()+Editor.height() )
		{
			Editor.Goto(row);
			this.move_to(CharCount);
			return;
		}
		
		col = getEditorLength();
		CharCount = EditorContent[Editor.Row()].length;
		setCurser();
	};
	
	this.move_first = function()
	{
		if( row < Editor.OffzY() || row > Editor.OffzY()+Editor.height() )
		{
			Editor.Goto(row);
			this.move_to(CharCount);
			return;
		}
		
		col = 0;
		CharCount = 0;
		setCurser();
	};
	
	this.move_to = function(x)
	{
		CharCount = x;
		row = (arguments[1]!==undefined)? arguments[1] : row;
		
		setCurser();
	};
	
	/*****************************************************************************
		CURSOR MOVEMENT: JUMP WORDS
	
		BEHAVIOR:
		|	while( EditorContent[Editor.Row()][CharCount-1].match(/[\d\w_]/i) )asd45
		|--^^-----^-^------------^^-----^---^^^^---------^^^^^----^^^^^^^-^^^^-^^----^	
	*****************************************************************************/
	this.move_next_space = function()
	{
		do{
			this.move_ri();
			if( !EditorContent[Editor.Row()].charAt(CharCount) 
			||  !EditorContent[Editor.Row()].charAt(CharCount-1) 
			|| (Editor.Row()==EditorContent.length-1 && CharCount==EditorContent[EditorContent.length-1]-1)
			|| !EditorContent[Editor.Row()].charAt(CharCount-1).match )
			{
				break;
			}
		}while( EditorContent[Editor.Row()].charAt(CharCount).match(/[\d\w_]/i)
		&& !EditorContent[Editor.Row()].charAt(CharCount-1).match(/[\W ]/i) );
	};
	
	this.move_last_space = function()
	{
		do{
			this.move_le();
			if( !EditorContent[Editor.Row()].charAt(CharCount) 
			||  !EditorContent[Editor.Row()].charAt(CharCount-1) 
			|| (Editor.Row()===0 && CharCount===0)
			|| !EditorContent[Editor.Row()].charAt(CharCount-1).match )
			{
				break;
			}
		}while( EditorContent[Editor.Row()].charAt(CharCount).match(/[\d\w_]/i)
		&& !EditorContent[Editor.Row()].charAt(CharCount-1).match(/[\W ]/i) );
	};
	
	/*****************************************************************************
		UTILITY METHOD: GET COL,ROW FROM X,Y COORDS
	*****************************************************************************/
	this.getMousePos = function(T){
		var tmpRow = 0;
		var tmpChar = 0;

		T[0] = Math.round(T[0]/fontsize[0]);
		tmpRow = Math.floor(T[1]/fontsize[1])-1;
		tmpRow = (tmpRow+Editor.OffzY()>EditorContent.length-1) ? EditorContent.length-Editor.OffzY()-1 : tmpRow;
		
		var runlength = EditorContent[tmpRow + Editor.OffzY()];
		
		if(runlength!==undefined)
		{
			runlength = runlength.replace(/(\t)/g, "┐┐┐┐");
			//runlength = expand(runlength, 4, "┐");
			
			if( T[0]>runlength.length ){
				tmpChar = runlength.length;
				
				if( Editor.OffzX() > 0 && runlength.length < Editor.OffzX() ){
					this.scrollX(runlength.length-3);
				}
				if(runlength.length === 0){
					this.scrollX(0);
				}
			}else{
				var indexTab = runlength.match(/(┐+)/);
				var preTab = false;
				
				try{ 
					preTab = (indexTab[0].length >= T[0]); 
				}
				catch(e){ 
					preTab = false; 
				}
				
				if( preTab ){
					tmpChar = Math.floor(T[0]/4);
				}else{
					runlength = runlength.substr(0,T[0]-1) + "└"; //+ runlength.substr(T[0])
					runlength = runlength.replace(/(┐┐┐┐)/g, "\t");
					tmpChar = runlength.indexOf("└");
				}
			}
		}else if(tmpRow>0){
			tmpChar = EditorContent[tmpRow].length;
		}
		
		return [tmpRow+Editor.OffzY(), tmpChar];
	};
	
	/*****************************************************************************
		UTILITY METHOD: SET CURSER VIA COORDINATES
	*****************************************************************************/
	this.setCurser = function(T){
		T[0] = Math.round(T[0]/fontsize[0]);
		row = Math.floor(T[1]/fontsize[1])-1 + Editor.OffzY();
		row = (row>EditorContent.length-1) ? EditorContent.length-1 : row;
		
		var WrappedLine = Editor.wrappedLines.contains(row,1);
		if( WrappedLine ){
			row = Test[0]; // + Editor.OffzY();
		}
		var runlength = EditorContent[Editor.Row()];
		if(runlength!==undefined)
		{
			runlength = runlength.replace(/(\t)/g, "┐┐┐┐");
			//runlength = expand(runlength, 4, "┐");
			if(T[0]>runlength.length)
			{
				CharCount = runlength.length;
			}
			else
			{
				var indexTab = runlength.match(/(┐+)/);
				var preTab = false;
				
				try{ preTab = (indexTab[0].length >= T[0]); }
				catch(e){ preTab = false; }
				
				if( preTab ){
					CharCount = Math.floor(T[0]/4);
				}else{
					runlength = runlength.substr(0,T[0]-1) + "└"; //+ runlength.substr(T[0])
					runlength = runlength.replace(/(┐┐┐┐)/g, "\t");
					CharCount = runlength.indexOf("└");
				}
				
			}
		}else if(row>0){
			CharCount = EditorContent[row].length;
		}
		
		if( WrappedLine ){
		    CharCount += (Test[0]+1)*max_col;
		}
		
		setCurser();
		
		if(Intellisense.visible){
			Intellisense.hide();
		}
		//throw("T:" + T[0] + " - indexTab:" + indexTab[0].length)
	};
	/*****************************************************************************
		SCROLLBAR-X
	*****************************************************************************/
	this.scrollX = function(cols){ 
			__content.style.left = '-' + (cols*fontsize[0]) + 'px';
			byid("cursorContainer").style.left = __content.offsetLeft + 'px';
			_secondary.style.left = __content.offsetLeft + 'px';
			_errors.style.left = __content.offsetLeft + 'px';
			__content.style.width = (Editor.width()*fontsize[0]) + (cols*fontsize[0])+'px';
			_secondary.style.width = __content.offsetWidth + 'px';
			_errors.style.width = __content.offsetWidth + 'px';
			byid("cursorContainer").style.width = __content.offsetWidth + 'px';
			Editor.OffzX(cols);	
			_scrollbarX.scrollLeft = fontsize[0] * Editor.OffzX();
	};
	
	/*****************************************************************************
		RENDER CURSOR
	*****************************************************************************/
	this.update = function(){ setCurser(); };
	
	var setCurser = function()
	{
		if(CharCount > getEditorLength() ){
			CharCount = getEditorLength();
		}
		if( EditorContent[Editor.Row()] !== undefined ){
			var runlength = EditorContent[Editor.Row()].substr(0,CharCount);
			runlength = runlength.replace(/(\t)/g, "    ");
			col = runlength.length;
		}else{
			col = 0;
		}
		
		if( row >= Editor.OffzY() && row < Editor.OffzY()+Editor.height() ){
			_curser.style.top = ((row-Editor.OffzY())*fontsize[1]) + "px";
			visible = true;
			_curser.className = Editor.overWriteMode ? "curserOverWriteON" : "curserWriteON";
		}else{
			visible = false;
			_curser.className = "curserOFF";
		}
		
		if( col+1 >= (Editor.width()+Editor.OffzX()) ){
			Curser.scrollX(Editor.OffzX()+10);
		}
		if( col < Editor.OffzX() ){
			Curser.scrollX(col);
		}
		_curser.style.left = (col*fontsize[0]) + "px";
		_curser.innerHTML = (Editor.overWriteMode && EditorContent[Editor.Row()].charAt(Curser.Charcount())!=undefined) ? 
			EditorContent[Editor.Row()].charAt(Curser.Charcount()) : "&nbsp";
		
		if(Editor.getLanguage() === xmlParser
		|| Editor.getLanguage() === htmlParser)
			Editor.xmlMatch(Editor.Row(), CharCount);
			
		Editor.bracketmatch(Editor.Row(), CharCount);
		
		if(!visible)
		{
			_post1.style.display = "none";
			_pre1.style.display = "none";
		}
		
		PrintEditorInfo();
	};
	
	/*****************************************************************************
		RENDER EDITOR INFO
	*****************************************************************************/
	var PrintEditorInfo = function()
	{
		_editorinfo.innerHTML = 
			"Row: " + row + //Editor.Row() + 
			"\tCol: " + col + 
			//" Line Length: " + getEditorLength() +
			"\tChar:" + CharCount
			//" Selection [row,char]:(" + Selection.from_row + "," + Selection.from_col + ")->" +
			//					 "(" + Selection.end_row + "," + Selection.end_col + "):" + Selection.active;
	};
	
	/*****************************************************************************
		UTILITY METHOD: GET LENGTH OF CURRENT LINE
	*****************************************************************************/
	var getEditorLength = function()
	{
		if( EditorContent[Editor.Row()]!== undefined){
			if(EditorContent[Editor.Row()].length > Editor.width() ){
				Editor.checkLongestLine(Editor.Row());
			}
			return EditorContent[Editor.Row()].length;
		}else{
			return 0;
		}
	};
	
	/*****************************************************************************
		CURSOR BLINK
	*****************************************************************************/
	this.onoff = function(){
		_curser.innerHTML = " ";
		if(visible){
			_curser.className = (_curser.className=="curserOFF")? 
				(Editor.overWriteMode ? "curserOverWriteON":"curserWriteON") : "curserOFF" ;
			
			_curser.innerHTML = 
				(_curser.className == "curserOverWriteON" && 
				EditorContent[Editor.Row()].charAt(Curser.Charcount()) !== undefined) ? 
				EditorContent[Editor.Row()].charAt(Curser.Charcount()) : " ";
		}else{
			_curser.className = "curserOFF";
		}
		setTimeout(Curser.onoff, 800);
	};
}
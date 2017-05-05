/// <reference path="CopyPaste.js" />
/// <reference path="Curser.js" />
/// <reference path="Editor.js" />
/// <reference path="Initializer.js" />
//--
/// <reference path="Selection.js" />
/// <reference path="UndoRedo.js" />
/// <reference path="Utilities.js" />


function Keyhandler_Char(char, evt)
{
	if(Selection.distance())
	{
	    UndoRedo.Delete([Selection.getStartRow(), Selection.getStartCol()], Selection.getText());
		Selection.deleteRange();
		Selection.release();
	}
	
	if(Intellisense.visible)
		Intellisense.Commit(String.fromCharCode(char));
	
	var row = Editor.Row()
	var col = Curser.Charcount();
	
	if( Editor.overWriteMode )
	    UndoRedo.overwrite([row,col], EditorContent[row].charAt(col) ,String.fromCharCode(char));
	else
	    UndoRedo.write([row,col], String.fromCharCode(char));
	    
	EditorContent[row] = 
		EditorContent[row].substr( 0, col ) + 
		String.fromCharCode(char) + 
		EditorContent[row].substr( col+(Editor.overWriteMode?1:0),
			EditorContent[row].length-(Editor.overWriteMode?1:0));
			
	Curser.move_ri();
	TimeDown(20);
	Editor.print();
	
	if(!htmlInEndTag && htmlInTag && (htmlInHtml || Intellisense.isParsing == "XML")
	&& (htmlIsAttributeName||!htmlIsTagName) && String.fromCharCode(char)==">")
	{
		Intellisense.hide();
		byid("clipboard").value = "</" + htmlTagName + ">";
		var lastCol = Curser.Charcount();
		CopyPaste.Paste();
		Curser.move_to(lastCol);
	}
	
	if(
		(
			Intellisense.visible 
			||
			Intellisense.CommitChars().indexOf(String.fromCharCode(char))==-1
		)&&(
			(Editor.getLanguage()===cssParser || htmlInStyle) && cssInDef 
			||
			(Editor.getLanguage()===jsParser || htmlInScript) //&& jsInDef
			||
			(Editor.getLanguage()===htmlParser || htmlInHtml) && htmlInTag
		)
	){
		if(Intellisense.CommitChars().indexOf(String.fromCharCode(char))!=-1)
			Intellisense.hide();
		else{
			Intellisense.word += String.fromCharCode(char)
			Intellisense.display();
		}
	}else
		Intellisense.hide(); //commited
	
	evt.stop();
}

function Keyhandler_Meta(Meta, evt, e){
	var row = Curser.Row()
	
	if(!evt.kill)
	{
		evt.kill = function()
		{
			if(e==undefined) evt.keyCode = false; //Kill IE6+7
			evt.stop();	
			evt.returnValue = false;
		}
	}
	
    
	
	switch(Meta){
		//Backspace
		case 8 : //Backspace
			TimeDown(20);
			if(evt.ctrlKey){
				Selection.release();
				Selection.end_col = Curser.Charcount();
				Selection.end_row = Editor.Row();
				Curser.move_last_space();
				Selection.from_col = Curser.Charcount();
				Selection.end_row = Editor.Row();
				Intellisense.hide();
			}
		
		    if(Selection.distance()){
		        UndoRedo.Delete([Selection.getStartRow(), Selection.getStartCol()], Selection.getText());
				Selection.deleteRange();
				Selection.release();
				Intellisense.hide();
			}else if(Curser.Charcount()>0){
				UndoRedo.Delete( [row, Curser.Charcount()-1], EditorContent[row].charAt(Curser.Charcount()-1) );
			    EditorContent[row] = EditorContent[row].substr( 0, Curser.Charcount()-1 ) +  EditorContent[row].substr( Curser.Charcount(), EditorContent[row].length-1);
			    Curser.move_le();
			    Intellisense.word = Intellisense.word.substr(0,Intellisense.word.length-1)
			    if(Intellisense.word.length>0)
					Intellisense.display();
				else
					Intellisense.hide();
			}else if(row>0){
			    var len = EditorContent[row-1].length
			    UndoRedo.Delete( [row-1, EditorContent[row-1].length], "\n" );
			    EditorContent[row-1] += EditorContent[row]
			    EditorContent.splice(row,1);
			    
			    Editor.Buffer.splice(row,1);
			    Editor.reBufferRow(row-1);
			    Editor.initScrollBar();
			    
			    Curser.move_up();
			    Curser.move_to(len);
			    Intellisense.hide()
			}
			Editor.print();
			return true;
		case 9 : //Tab
			TimeDown(20);
			var lastWord = Editor.getLastWord()
			if(Intellisense.snippet(lastWord)){
				Intellisense.commitSnippet(lastWord, Editor.getTabIndex(row) );
			}else if(Intellisense.visible && Intellisense.matched){
				Intellisense.Commit("",true);
			}else{
				Intellisense.hide();
				
				if(Selection.distance()){
					Selection.from_col = 0;
					Selection.end_col = EditorContent[Selection.end_row].length;
					
					if(evt.shiftKey)
					{
						UndoRedo.unindent( [Selection.getStartRow() , Selection.getEndRow()])
						for(var r=Selection.getStartRow() ; r<=Selection.getEndRow(); r++)
						{
							EditorContent[r] = EditorContent[r].replace(/^(\t|[ ]{4}|[ ]{1,3}?)/,"");
						}
						Editor.reBufferRow(Selection.getStartRow(), Selection.getEndRow());
					}else{
						UndoRedo.indent( [Selection.getStartRow() , Selection.getEndRow()])
						for(var r=Selection.getStartRow() ; r<=Selection.getEndRow(); r++)
						{
							EditorContent[r] = "\t" + EditorContent[r]
						}
						Editor.reBufferRow(Selection.getStartRow(), Selection.getEndRow());
					}
							
					Curser.move_end();
					Selection.from_col = 0;
					Selection.end_col = EditorContent[Selection.end_row].length;
					
				}else if(evt.shiftKey && Curser.Charcount()<=Editor.getTabIndex(row).length ){
					Curser.move_le();
					UndoRedo.unindent( [row,row] )
					EditorContent[row] = EditorContent[row].replace(/^\t/,"");
					Editor.reBufferRow(row);
				}else if(!evt.shiftKey){
					UndoRedo.write( [row,Curser.Charcount()], "\t" )
					EditorContent[row] = EditorContent[row].substr( 0, Curser.Charcount() ) + "\t" + EditorContent[row].substr( Curser.Charcount(), EditorContent[row].length);
					Editor.reBufferRow(row);
					Curser.move_ri();
				}
			}
			Editor.print(true);
			return true;
		case 13 : //Enter
			TimeDown(20);
			if(Intellisense.visible && Intellisense.matched){
				Intellisense.Commit("",true);
			}else{
				Intellisense.hide();
				
				var clip1 = EditorContent[row].substr(0, Curser.Charcount());
				var clip2 = EditorContent[row].substr(Curser.Charcount());
				var tab = Editor.getTabIndex(row);
			    var star = "" //(EditorContent[row].charAt( tab.length ) == "*") ? "*" : "" ;
			    
				if(Selection.distance())
				{
					UndoRedo.Delete([Selection.getStartRow(), Selection.getStartCol()], Selection.getText());
					Selection.deleteRange();
					Selection.release();
				}else{
					if(Curser.Charcount() > tab.length){
						EditorContent = EditorContent.insert(row+1, new Array(tab + star + clip2))
					}else{
						EditorContent = EditorContent.insert(row+1, new Array(tab.substr(0,Curser.Charcount()) + star + clip2))
					}
					UndoRedo.write( [row,Curser.Charcount()] , '\n'+tab + star );
					EditorContent[row] = clip1;
					
					Editor.Buffer = Editor.Buffer.insert(row+1,new Array(""));
					//Editor.reBufferRow(row)
					Editor.reBufferRow(row+1)
					Editor.initScrollBar();
					
					Curser.move_dn();
					Curser.move_to(tab.length + star.length);
				}
			}
			Editor.print();
			return true;
		case 27 : /* ESC		*/	
			Intellisense.hide(); 
			break;
		case 33 : /* page_up    */ 
			if(Intellisense.visible){
				for(var i=0; i<8; i++){
					Intellisense.prev();
				}
			}
			else 
			{
				if(evt.shiftKey && !Selection.active){
					Selection.from_row = Editor.Row();
					Selection.from_col = Curser.Charcount();
					Selection.active = true;
				}
				Editor.page_up();    
			}
			break;
		case 34 : /* Page_Down  */  
			if(Intellisense.visible){
				for(var i=0; i<8; i++){
					Intellisense.next();
				}
			}else
			{
				if(evt.shiftKey && !Selection.active){
					Selection.from_row = Editor.Row();
					Selection.from_col = Curser.Charcount();
					Selection.active = true;
				}
				Editor.page_down();  
			}
			break;
		case 35 : /* end        */  
			if(evt.shiftKey && !Selection.active){
				Selection.from_row = Editor.Row();
				Selection.from_col = Curser.Charcount();
				Selection.active = true;
			}
			if( evt.ctrlKey ){
				Editor.Goto( EditorContent.length-1 );
			}else
				Curser.move_end();
				
			if(Selection.active){
				Selection.end_row = Editor.Row();
				Selection.end_col = Curser.Charcount();
			}else{
				Selection.release();
			}
			Editor.print();
			return true;
		case 36 : /* home       */	
			if(evt.shiftKey && !Selection.active){
				Selection.from_row = Editor.Row();
				Selection.from_col = Curser.Charcount();
				Selection.active = true;
			}
			
			if(evt.ctrlKey){
				Editor.Goto(0);
			}else{
				if (Curser.Charcount()==0)
					Curser.move_to(Editor.getTabIndex(row).length)
				else if(Curser.Charcount() > Editor.getTabIndex(row).length)
					Curser.move_to(Editor.getTabIndex(row).length);
				else
					Curser.move_first();
				
			}
				
			if(Selection.active){
				Selection.end_row = Editor.Row();
				Selection.end_col = Curser.Charcount();
			}else{
				Selection.release();
			}
			Editor.print();
			 
			return true;
		case 37 : /* left       */  
		    Intellisense.hide();
		    
			if(evt.shiftKey && !Selection.active){
				Selection.from_row = Editor.Row();
				Selection.from_col = Curser.Charcount();
				Selection.active = true;
			}
			
			if(evt.ctrlKey)
				Curser.move_last_space();
			else
				Curser.move_le();
			
			
			if(Selection.active)
			{
				Selection.end_row = Editor.Row();
				Selection.end_col = Curser.Charcount();
				Editor.print(true);
			}
			else if( Selection.distance() )
			{
				Selection.release();
				Editor.print();
			}
			return true;
		case 38 : /* up         */	
			if(Intellisense.visible)
				Intellisense.prev();
			else
			{
				if(evt.shiftKey && evt.ctrlKey)
				{
					if(Editor.Row() > 0)
					{
						TimeDown(20);
						
						UndoRedo.swap( [Editor.Row(), Editor.Row()-1] )
					
						var tmp = EditorContent[Editor.Row()-1];
						EditorContent[Editor.Row()-1] = EditorContent[Editor.Row()]
						EditorContent[Editor.Row()] = tmp;
						
						Editor.reBufferRow(Editor.Row()-1)
						//Editor.reBufferRow(Editor.Row())
						Editor.print();
					}
				}
				else if(evt.shiftKey && !Selection.active)
				{
					Selection.from_row = Editor.Row();
					Selection.from_col = Curser.Charcount();
					Selection.active = true;
				}
				
				Curser.move_up(true);	
				
				if(Selection.active)
				{
					Selection.end_row = Editor.Row();
					Selection.end_col = Curser.Charcount();
					Editor.print(true);
				}
				else if( Selection.distance() )
				{
					Selection.release();
					Editor.print();
				}
			}
			return true;
		case 39 : /* right		*/  
		    Intellisense.hide();
		    
			if(evt.shiftKey && !Selection.active){
				Selection.from_row = Editor.Row();
				Selection.from_col = Curser.Charcount();
				Selection.active = true;
			}
			
			if(evt.ctrlKey)		Curser.move_next_space();
			else				Curser.move_ri();
			
			if(Selection.active)
			{
				Selection.end_row = Editor.Row();
				Selection.end_col = Curser.Charcount();
				Editor.print(true);
			}
			else if( Selection.distance() )
			{
				Selection.release();
				Editor.print();
			}
			return true;
		case 40 : /* down		*/  
			if(Intellisense.visible)
				Intellisense.next();
			else
			{
				if(evt.shiftKey && evt.ctrlKey)
				{
					if(Editor.Row() < EditorContent.length-1 )
					{
						TimeDown(20);
						
						UndoRedo.swap( [Editor.Row(), Editor.Row()+1] )
					
						var tmp = EditorContent[Editor.Row()+1];
						EditorContent[Editor.Row()+1] = EditorContent[Editor.Row()]
						EditorContent[Editor.Row()] = tmp;
						
						//Editor.reBufferRow(Editor.Row()+1)
						Editor.reBufferRow(Editor.Row())
						Editor.print();
					}
				}
				else if(evt.shiftKey && !Selection.active)
				{
					Selection.from_row = Editor.Row();
					Selection.from_col = Curser.Charcount();
					Selection.active = true;
				}
				
				Curser.move_dn(true); 	 
				
				if(Selection.active)
				{
					Selection.end_row = Editor.Row();
					Selection.end_col = Curser.Charcount();
					Editor.print(true);
				}
				else if( Selection.distance() )
				{
					Selection.release();
					Editor.print();
				}
			}
			return true;
		case 45 : //INSERT
			Editor.overWriteMode = (Editor.overWriteMode)? false:true;
			return true;
		case 46 : //Del
			TimeDown(20);
			if(evt.ctrlKey){
				Selection.release();
				Selection.from_col = Curser.Charcount();
				Selection.end_row = Editor.Row();
				Curser.move_next_space();
				Selection.end_col = Curser.Charcount();
				Selection.end_row = Editor.Row();
			}
			
			if(Selection.distance())
			{
			    UndoRedo.Delete([Selection.getStartRow(), Selection.getStartCol()], Selection.getText());
				Selection.deleteRange();
				Selection.release();
				Intellisense.hide()
			}else if(evt.shiftKey){
				if(row == EditorContent.length-1)
					UndoRedo.Delete([row,0], EditorContent[row]);
				else
					UndoRedo.Delete([row,0], EditorContent[row]+"\n");
					
				EditorContent.splice(row,1);
				Editor.Buffer.splice(row,1);
				if(Editor.Row() > EditorContent.length-1){
					Curser.move_up(true);
				}
				DisableGoto=true;
				Editor.initScrollBar();
			}else if(Curser.Charcount() == EditorContent[row].length && Editor.Row()<EditorContent.length-1 ){
				var nextTab = Editor.getTabIndex(row+1)
				
				UndoRedo.Delete( [row, EditorContent[row].length], "\n" + nextTab );
				
				EditorContent[row] += EditorContent[row+1].substr(nextTab.length);
			    EditorContent.splice(row+1,1);
			    
			    Editor.Buffer.splice(row+1,1);
			    Editor.reBufferRow(row);
			    Editor.initScrollBar();
			}else{
				UndoRedo.Delete( [row, Curser.Charcount()], EditorContent[row].charAt(Curser.Charcount()) );
				EditorContent[row] = EditorContent[row].substr( 0, Curser.Charcount() ) + EditorContent[row].substr( Curser.Charcount()+1, EditorContent[row].length-1);
			}
			Editor.print(true);
			return true;
		case 116 : //F5
			Editor.compile(true, true);
			evt.kill();
			break
		case 117 : //F6
			Editor.fillBuffer();
			evt.kill();
			Editor.print(true);
			break
		case 115 : //F4
			evt.kill();
			console.log("last word: '%s'", Editor.getLastWord() );
			break
		case 114 : //F3
			evt.kill();
			var p=new Date(); var sum = new FStringCat(); for (var i = 0; i < 50000; i++) {sum.push( i.toString() );};var f = sum.value(); 
			alert( (new Date()).getTime()-p.getTime() );
			break
		case 113 : //F2
			evt.kill();
			var p=new Date(); var sum = ""; for (var i = 0; i < 50000; i++) {sum+=i.toString();} 
			alert( (new Date()).getTime()-p.getTime() )
			break;
		case 118 : //F7
			evt.kill();
			var p=new Date(); 
			var j=0;
			var sum = "ajshdaklsdhjalkjhsdkljahsdlkjasd"; 
			for (var i = 0; i < 50000; i++) {
				j = sum.length;
			} 
			alert( (new Date()).getTime()-p.getTime() )
			break;
		case 119 : //F8
		case 120 : //F9
		case 121 : //F10
		case 122 : //F11
		case 123 : //F12
		case 112 : //F1 (note: F1 can't be disabled in IE7... Motherfuckers)
		    alert("F#-Button handler");
		    evt.kill();
		    window.focus();
		    break;
	}
	return false;
}

function Keyhandler_Combo(char, evt){
	//	Some steps must return a boolean:
	//	return FALSE if Editor handles the event (ctrl + a|d|s)
	//	return TRUE if the browser-event is needed (ctrl + c|v|x)
	
	if(evt.altKey)
		return true;
	
	switch(String.fromCharCode(char).toUpperCase())
	{
	    case ' ' : //Intellisense
	        Intellisense.word = Editor.getLastWord();
	        Intellisense.display();
	        return false;
		case 'A' : //SELECT ALL
			Selection.selectAll(); 	
			Editor.Goto(Selection.end_row);
			Curser.move_to(Selection.end_col);
			return false;
		case 'D' : //DUPLICATE LINE TO NEXT
			TimeDown(20);
			UndoRedo.write([Editor.Row()+1, 0], EditorContent[Editor.Row()] + "\n");
			EditorContent = EditorContent.insert( Editor.Row()+1, new Array(EditorContent[Editor.Row()]) )
			Editor.Buffer = Editor.Buffer.insert( Editor.Row()+1, new Array(Editor.Buffer[Editor.Row()]) )
			Editor.print();
			return false; //may do something in some browser...
		case 'G' : //GOTO LINE
			var test = prompt("goto line:","")
			if( isNaN(test) || test==undefined )
				return false;
			Editor.Goto(Math.abs(parseInt(test)));
			return false;
		case 'L' : //SELECT LINE
			Selection.from_row = Selection.end_row = Editor.Row();
			Selection.from_col = 0;
			Selection.end_col = EditorContent[Editor.Row()].length
			Editor.print();
			return false;
		case 'C' : //COPY
			byid("clipboard").value = Selection.getText();
			byid("clipboard").select();
			return true;
		case 'V' : //PASTE
			TimeDown(20);
			if( Selection.distance() )
			{
			    UndoRedo.Delete([Selection.getStartRow(), Selection.getStartCol()], Selection.getText());
				Selection.deleteRange();
				Selection.release();
			}
			byid("clipboard").value = "";
			byid("clipboard").select();
			setTimeout(CopyPaste.Paste, 100)
			return true;
		case 'X' : //CLIP
			TimeDown(20);
			byid("clipboard").value = Selection.getText();
			byid("clipboard").select();
			CopyPaste.Clip();
			return true;
		case 'Z' : 
			TimeDown(20);
		    UndoRedo.Undo();
		    Editor.print();
		    return false;
		case 'Y' : 
			TimeDown(20);
		    UndoRedo.Redo();
		    Editor.print();
		    return false;
		case '1' : //Sort selected
			TimeDown(20);
			if( Selection.distance() )
			{
				var from = Selection.getStartRow();
				var to = Selection.getEndRow();
				UndoRedo.sort([from, to]);
				var A = EditorContent.splice(from, to-from+1).sort();
				EditorContent = EditorContent.insert(from , A )
				
				//for(var i = from ; i <= to; i++)
					Editor.reBufferRow(from, to);
			}
			Editor.print();
			return false;
		    
		//---------------------------------------
		case 'S' : 
			if(evt.shiftKey)
				Editor.fireOnSaveAs();
			else
				Editor.fireOnSave();
				
			window.focus(); //for IE
			return false;
		
		/* window.focus(); <-- for IE */
		
		case 'W' : Editor.fireOnTabClose();		 window.focus(); return false;
		case 'F' : Editor.fireOnSearch();		 window.focus(); return false;
		case 'H' : Editor.fireOnSearchReplace(); window.focus(); return false;
		case 'T' : /* Allow new Tab in FF */					 return true;
		
		//hotkeys ?
		
		case '2' : alert("hotkey: 2"); 		window.focus(); return false;
		case '3' : alert("hotkey: 3"); 		window.focus(); return false;
		case '4' : alert("hotkey: 4"); 		window.focus(); return false;
		case '5' : alert("hotkey: 5"); 		window.focus(); return false;
	}
	
	return undefined;
}
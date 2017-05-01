/// <reference path="CopyPaste.js" />
/// <reference path="Curser.js" />
/// <reference path="Editor.js" />
/// <reference path="Initializer.js" />
/// <reference path="Keyhandler.js" />
/// <reference path="Selection.js" />
//--
/// <reference path="Utilities.js" />


/**************************************************************
	UNDO / REDO
	
	bookmarks are cattured on user-events and stored in
	an array - each bookmark carries an enum-type:
	
	'write' -> when user writes (delete range when undo)
	'overwrite' -> when user uses overwrite (insert range when undo)
	
	'paste' -> when user pastes text (delete range when undo)
	'delete' -> when user deletes text (paste range when undo)
	
	'indent' -> when user indents N lines (unindent when undo)
	'unindent' -> when user unindents N lines (indent when undo)
**************************************************************/
function Bookmark(coord, action, text)
{
	this.coord = coord      //coordinate array
	this.action = action    //ENUM
	this.text = text        //Original Source Text
	this.saved = false      //indicate if this alteration has been saved
}

function Class_UndoRedo()
{
    /*****************************************************
        PRIVATE
    *****************************************************/
	var History = new Array();
	var counter = 0;
	
	this.test = function(){ return History; }
	
	var store = function(bookmark)
	{
		if(counter == History.length)
		{
			History.push( bookmark );
			counter++;
		}
		else
		{
			History = History.slice(0,counter);
			History.push( bookmark );
			counter++;
		}	
	}
	var current = function()
	{
		return History[counter-1];
	}
	
	/*****************************************************
	    PUBLIC
	*****************************************************/
	this.Undo = function()
	{
	    if(counter>0)
	    {
		    var bookmark = History[--counter] //need check
		    switch( bookmark.action )
		    {
                case "write" :
                    this.un_write(bookmark);			    
                    break;
                case "overwrite" : 
					this.un_write(bookmark);
					this.un_delete(History[--counter])
					Curser.move_le();
                    break;
                case "paste" : 
                    this.un_paste(bookmark);
                    break;
                case "delete" : 
                    this.un_delete(bookmark);
                    break;
                case "indent" : 
					this.un_indent(bookmark);
					break;
				case "unindent" : 
					this.un_unindent(bookmark);
					break;
				case "swap" : 
					this.un_swap(bookmark.coord);
					break;
				case "sort" :
				    this.un_sort(bookmark);
				    break;
		    }
		}
	}
	this.Redo = function()
	{
	    if(counter<History.length)
	    {
		    var bookmark = History[counter++] //need check
		    switch( bookmark.action )
		    {
			    case "write" :
			        byid("clipboard").value = bookmark.text;
			        Editor.Goto(bookmark.coord[0]);
			        Curser.move_to(bookmark.coord[1]);
			        CopyPaste.Paste(true);
				    break;
			    case "overwrite" : 
					var B = History[counter++] //skip Old text
					EditorContent[ B.coord[0] ] = EditorContent[ B.coord[0] ].substr(0,B.coord[1]) + B.text + EditorContent[ B.coord[0] ].substr(B.coord[1]+1)
					Editor.reBufferRow( B.coord[0] )
					break;
			    case "paste" :
			        byid("clipboard").value = bookmark.text;
			        Editor.Goto(bookmark.coord[0]);
			        Curser.move_to(bookmark.coord[1]);
			        CopyPaste.Paste(true);
				    break;
			    case "delete" : 
					this.un_write(bookmark);
					break;
				case "indent" : 
					for(var r=bookmark.coord[0] ; r<=bookmark.coord[1] ; r++)
					{
						EditorContent[r] = "\t" + EditorContent[r]
					}Editor.reBufferRow(bookmark.coord[0], bookmark.coord[1]);
					break;
				case "unindent" : 
					for(var r=bookmark.coord[0] ; r<=bookmark.coord[1] ; r++)
					{
						EditorContent[r] = EditorContent[r].replace(/^\t/,"");
					}Editor.reBufferRow(bookmark.coord[0], bookmark.coord[1]);
					break;
				case "swap" : 
					this.un_swap(bookmark.coord);
					break;
				case "sort" :
				    counter--;
				    throw("redo.sort : not implemented")
				    break;
		    }
		}
	}
	//API: retrieve object status
	this.UndoPosition = function()
	{
		return [History.length, counter];
	}
	//API: retrieve changed lines
	this.changedLines = function()
	{
		var Changed = new Array(EditorContent.length);
		for(var p=0; p<Changed.length ; p++)
			Changed[p] = new Array();
		
		for(var j=0 ; j<History.length ; j++)
		{
			var bookmark = History[j];
			
			switch(bookmark.action) //investigate all lines...
			{
				case "write" :		//may span 1+ rows
					var L = changed_write_paste_delete(bookmark)
					for(var i=L[0] ; i<=L[1] ; i++)
						Changed[i].push( (bookmark.saved && Changed[i]!=2)? 2 : 1 )
					break;
                case "overwrite" :	//may span 1+ rows
					Changed[ bookmark.coord[0] ].push( (bookmark.saved && Changed[ bookmark.coord[0] ]!=2)? 2 : 1 );
					j++;
					break;
                case "paste" :		//usually span 1+ rows
					var L = changed_write_paste_delete(bookmark)
					for(var i=L[0] ; i<=L[1] ; i++)
						Changed[i].push( (bookmark.saved && Changed[i]!=2)? 2 : 1 )
					break;
                case "delete" :		//span 1 row
					Changed[ bookmark.coord[0] ].push( (bookmark.saved && Changed[ bookmark.coord[0] ]!=2)? 2 : 1 )
					var L = changed_write_paste_delete(bookmark)
					for(var i=L[0]+1 ; i<=L[1] ; i++)
						Changed[i].push( -1 )
					break;
                case "indent" :		//usually span 1+ rows
					for(var r=bookmark.coord[0] ; r<=bookmark.coord[1] ; r++)
						Changed[r].push((bookmark.saved && Changed[r]!=2)? 2 : 1)
					break;
				case "unindent" :	//usually span 1+ rows
					for(var r=bookmark.coord[0] ; r<=bookmark.coord[1] ; r++)
						Changed[r].push( (bookmark.saved && Changed[r]!=2)? 2 : 1 )
					break;
			}
		}
		return Changed;
	}
	
	//Helper
	var changed_write_paste_delete = function(bookmark)
	{	
		//num of rows
		var row = bookmark.coord[0] + bookmark.text.split('\n').length-1 
		return [bookmark.coord[0], row]
	}
	
	/*************************************
		INPUT EVENTS
	*************************************/
	this.swap = function(coord) //line1 <--> line2
	{
		var B = new Bookmark(coord, "swap", "");
		store(B);
	}
	
	this.sort = function(coord)
	{
	    if(current() != null){
	        var cur = current();
	        
	        if( cur.action != "sort" )
	        {
	            Selection.selectRows(coord[0], coord[1])
		        var B = new Bookmark(coord, "sort", Selection.getText() );
		        store(B);
	        }
	    }
	    else
	    {
		    Selection.selectRows(coord[0], coord[1])
		    var B = new Bookmark(coord, "sort", Selection.getText() );
		    store(B);
		}
	}
	
	this.write = function(coord, text)
	{
		if(current() != null && current().text)
		{
		    var cur = current();
		    var action = cur.action
		    var row = cur.coord[0] + cur.text.split('\n').length-1 //num of lines
		    var col = (cur.coord[1]+cur.text.length)
		    
			if(action == "write" 
			    && row == coord[0]   //same row
			    && col == coord[1] ) //col + length
			{
				History[counter-1].text += text;
			}
			else{
				var B = new Bookmark(coord, "write", text);
				store(B);
			}
		}else{
			var B = new Bookmark(coord, "write", text);
			store(B);
		}
	}
	
	this.overwrite = function(coord, Old, New)
	{
		var B = new Bookmark(coord, "overwrite", Old);	store(B);
		var B = new Bookmark(coord, "overwrite", New);	store(B);
	} 
	this.paste = function(coord, text)
	{
	    var B = new Bookmark(coord, "paste", text);		store(B);
	}
	this.Delete = function(coord, text)
	{
		var B = new Bookmark(coord, "delete", text);	store(B);	
	}
	this.backspace = function()
	{
		if(current() != null)
		{
			var cur = current();
			var action = cur.action
			var row = cur.coord[0] + cur.text.split('\n').length-1 //num of lines
			var col = (cur.coord[1] - cur.text.length)//diff to 'write'
		    
			if(action == "delete" 
				&& row == coord[0]   //same row
				&& col == coord[1] ) //col + length
			{
				History[counter-1].text = text + History[counter-1].text; //diff to 'write'
			}
			else{
				var B = new Bookmark(coord, "delete", text);
				store(B);
			}
		}else{
			var B = new Bookmark(coord, "delete", text);
			store(B);
		}
	}
	this.indent = function(coord) //coord = from_row, end_row
	{
		var str = ""
		for(var i=coord[0] ; i<=coord[1] ; i++) //remember indention
		{
			str += "," + Editor.getTabIndex(i);
		}
		var B = new Bookmark(coord, "indent", str);
		store(B);
	}
	this.unindent = function(coord) //coord = from_row, end_row
	{
		var str = ""
		for(var i=coord[0] ; i<=coord[1] ; i++) //remember indention
		{
			str += "," + Editor.getTabIndex(i);
		}
		var B = new Bookmark(coord, "unindent", str);
		store(B);
	}
	/*************************************
		COUNTER INPUT EVENTS
	*************************************/
	this.un_write = function(bookmark)
	{
	    Selection.from_row = bookmark.coord[0];
	    Selection.from_col = bookmark.coord[1];
	    Selection.end_row = bookmark.coord[0] + bookmark.text.split('\n').length-1;
	    
	    if(bookmark.text.split('\n').length-1>0)
	        Selection.end_col = bookmark.text.split('\n').pop().length;
	    else
	        Selection.end_col = bookmark.coord[1] + bookmark.text.length;
	        
	    Selection.deleteRange();
	    
	    //for(var row = Selection.from_row ; row <= Selection.end_row ; row++)
			Editor.reBufferRow(Selection.from_row, Selection.end_row);
	    
	    var least = Editor.OffzY()
	    var most = Editor.OffzY() + Editor.height()
		
		if( least<bookmark.coord[0] && most>bookmark.coord[0] )
		{	
			Curser.move_to(bookmark.coord[1], bookmark.coord[0] )
		}else{
			Editor.Goto(bookmark.coord[0])
			Curser.move_to(bookmark.coord[1])
		}
	    
	    Selection.release();
	}
	this.un_swap = function(coord)
	{
		var tmp = EditorContent[coord[0]];
		EditorContent[coord[0]] = EditorContent[coord[1]]
		EditorContent[coord[1]] = tmp;
		
		Editor.reBufferRow(coord[0], coord[1])
		//Editor.reBufferRow(coord[1])
		
		var Min = Math.min(coord[0], coord[1])
		var Max = Math.max(coord[0], coord[1])
		
		if( Min < Editor.OffzY() || Max > Editor.OffzY()+Editor.height() ){
			if(coord[0]<coord[1]){
				Editor.Goto(Min)
				Curser.move_to(Editor.getTabIndex(Min).length)
			}else{
				Editor.Goto(Max)
				Curser.move_to(Editor.getTabIndex(Max).length)
			}
		}else
			if(coord[0]<coord[1])
				Curser.move_to(Editor.getTabIndex(Min).length, Min);
			else
				Curser.move_to(Editor.getTabIndex(Max).length, Max);
	}
	this.un_sort = function(bookmark)
	{
	    Selection.selectRows(bookmark.coord[0], bookmark.coord[1])
	    Selection.deleteRange();
	    var B = new Bookmark([Math.min(bookmark.coord[0], bookmark.coord[1]), 0], "delete", bookmark.text)
	    this.un_delete(B);
	}
	this.un_paste = function(bookmark)
	{
	    this.un_write(bookmark);
	}
	this.un_delete = function(bookmark)         //Paste'a'like
	{
	    var tmp = bookmark.text;
	    
	    Curser.move_to(bookmark.coord[1], bookmark.coord[0] )
	    if(EditorContent[Editor.Row()])
	    {
			tmp = EditorContent[Editor.Row()].substr(0,Curser.Charcount()) + tmp
			tmp += EditorContent[Editor.Row()].substr(Curser.Charcount())
		}
		var arr = tmp.split('\n');
		
		EditorContent.splice(Editor.Row(),1)
		EditorContent = EditorContent.insert(Editor.Row(), arr);
		Editor.Buffer = Editor.Buffer.insert(Editor.Row(), new Array(arr.length-1))
		
		var len = bookmark.text.split('\n');
		var move = [len[len.length-1].length , arr.length-1 ]
		
		Editor.reBufferRow(Editor.Row(), Editor.Row()+len.length-1);
		
		if( bookmark.coord[0] < Editor.OffzY() || bookmark.coord[0]+move[1] > Editor.OffzY()+Editor.height() )
		{
			Editor.Goto(move[1] + Editor.Row())
			Curser.move_to(move[0]+Curser.Charcount())
		}
		else
			Curser.move_to(move[0]+Curser.Charcount(), move[1]+Curser.Row() );
		
		if(bookmark.action=="delete" && bookmark.text.length>1)
		{	
			Selection.from_row = bookmark.coord[0]
			Selection.from_col = bookmark.coord[1]
			Selection.end_row = Editor.Row()
			Selection.end_col = Curser.Charcount()
		}
		
		Editor.findLongest();
		Editor.initScrollBar();
		Editor.print();
	}
	this.un_indent = function(bookmark)
	{
		arr = bookmark.text.split(",")
		for(var i=bookmark.coord[0] ; i<=bookmark.coord[1] ; i++)
		{
			EditorContent[i] = arr[ i+1-bookmark.coord[0] ] + EditorContent[i].replace(/^\s+/,"");
		}Editor.reBufferRow(bookmark.coord[0], bookmark.coord[1]);
	}
	this.un_unindent = function(bookmark)
	{
		arr = bookmark.text.split(",")
		for(var i=bookmark.coord[0] ; i<=bookmark.coord[1] ; i++)
		{
			EditorContent[i] = arr[ i+1-bookmark.coord[0] ] + EditorContent[i].replace(/^\s+/,"");
		}Editor.reBufferRow(bookmark.coord[0], bookmark.coord[1]);
	}
}
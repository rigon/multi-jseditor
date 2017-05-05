/// <reference path="UndoRedo.js" />
/// <reference path="Initializer.js" />

/***************************************************************************************************
	Context Menu Handlers
***************************************************************************************************/
function ContextHandlerCopy()
{
	this.hide();
	
	var evObj = document.createEvent('KeyboardEvent');
		evObj.initKeyEvent ('keypress', true, true, null, true, false, false, false, 67, 99);
	document.dispatchEvent(evObj);
	
		evObj = document.createEvent('KeyboardEvent');
		evObj.initKeyEvent ('keyup', true, true, null, true, false, false, false, 67, 99);
	
	byid("clipboard").dispatchEvent(evObj);
}
function ContextHandlerCut()
{
	ContextMenu.hide();
	alert("Cut");
}
function ContextHandlerPaste()
{
	ContextMenu.hide();
	alert("Paste");
}
function ContextHandlerUndo()
{
	ContextMenu.hide();
	UndoRedo.Undo();
	Editor.print();
}
function ContextHandlerRedo()
{
	ContextMenu.hide();
	UndoRedo.Redo();
	Editor.print();
}
function ContextHandlerIndent()
{
	ContextMenu.hide();
	
	Selection.from_col = 0;
	Selection.end_col = EditorContent[Selection.end_row].length;

	UndoRedo.indent( [Selection.getStartRow() , Selection.getEndRow()]);
	for(var r=Selection.getStartRow() ; r<=Selection.getEndRow(); r++)
	{
		EditorContent[r] = "\t" + EditorContent[r];
	}
	Editor.reBufferRow(Selection.getStartRow(), Selection.getEndRow());
	
	Curser.move_end();
	Selection.from_col = 0;
	Selection.end_col = EditorContent[Selection.end_row].length;
	
	Editor.print();
}
function ContextHandlerUnIndent()
{
	ContextMenu.hide();
	
	Selection.from_col = 0;
	Selection.end_col = EditorContent[Selection.end_row].length;

	UndoRedo.unindent( [Selection.getStartRow() , Selection.getEndRow()]);
	for(var r=Selection.getStartRow() ; r<=Selection.getEndRow(); r++)
	{
		EditorContent[r] = EditorContent[r].replace(/^(\t|[ ]{4}|[ ]{1,3}?)/,"");	
	}
	Editor.reBufferRow(Selection.getStartRow(), Selection.getEndRow());	
	
	Curser.move_end();
	Selection.from_col = 0;
	Selection.end_col = EditorContent[Selection.end_row].length;
	
	Editor.print();
}
function ContextHandlerDelete()
{
	ContextMenu.hide();
	UndoRedo.Delete([Selection.getStartRow(), Selection.getStartCol()], Selection.getText());
	Selection.deleteRange();
	Selection.release();
	Editor.print();
}
function ContextHandlerRunTo()
{
	ContextMenu.hide();
	var t = Curser.Charcount();
	Editor.Goto(Curser.Row());
	Curser.move_to(t);
}


function ContextItem(text, img, id, click)
{
	this.text = text;
	this.img = img;
	this.id = id;
	this.click = click;
	this.enabled = true;
	
	this.toString = function()
	{
		var html = "";
		
		if(this.text=="Spacing")
		{
			html =	'<div class="ContextMenuItemSpacing">'+
						'<div id="ContextMenu_'+this.id+'ImgDiv" class="ContextMenuItemImg">' +
							'<img src="images/context/spacing.png" alt=""  />' +
						'</div>' +
						'<div style="padding:2px 0px 0px 35px;"><hr noshade style="display:table-cell;width:100px;height:1px;" size=1 color="#ddd"></div>' +
					'</div>';
		}
		else
		{
			if(this.enabled)
			{
				html = '<div id="ContextMenu_' + this.id + '" onclick="' + this.click + '()" class="ContextMenuItem">' +
							'<div id="ContextMenu_'+this.id+'ImgDiv" class="ContextMenuItemImg">' +
								'<img id="ContextMenu_'+this.id+'Img" src="'+this.img+'" alt=""  />' +
							'</div>' +
							'<div  id="ContextMenu_'+this.id+'Text" class="ContextMenuItemText">'+this.text+'</div>' +
						'</div>'; 
			}else{
				html = '<div id="ContextMenu_' + this.id + '" class="ContextMenuItemDisabled">' +
							'<div id="ContextMenu_'+this.id+'ImgDiv" class="ContextMenuItemImg">' +
								'<img id="ContextMenu_'+this.id+'Img" src="'+this.img+'" alt=""  />' +
							'</div>' +
							'<div  id="ContextMenu_'+this.id+'Text" class="ContextMenuItemTextDisabled">'+this.text+'</div>' +
						'</div>'; 
			}
		}
		
		return html;
	};
}

function Class_ContextMenu()
{
	this.Items = [];
	
	/***************************************************************************************************
		ENABLE / DISABLE ITEMS
	***************************************************************************************************/
    this.disableItem = function(id)
    {
    	for(var i=0, itm ; (itm = this.Items[i]) ; i++){
    		if(itm.id == id){
    			itm.enabled = false;
    		}
    	}
    };
    this.enableItem = function(id)
    {
    	for(var i=0, itm ; (itm = this.Items[i]) ; i++){
    		if(itm.id == id){
    			itm.enabled = true;
    		}
    	}
    };
    
	/***************************************************************************************************
		SHOW / HIDE CONTEXT MENU
	***************************************************************************************************/
    this.show = function(top,left)
    {
		if(Selection.distance())
		{
			this.enableItem("indent");
			this.enableItem("unindent");
			this.enableItem("delete");
		}else{
			this.disableItem("indent");
			this.disableItem("unindent");
			this.disableItem("delete");
		}
		
		this.disableItem("cut");
		this.disableItem("copy");
		this.disableItem("paste");
		//----------------------------------------------
		var info = UndoRedo.UndoPosition(); //[hist, pos]
		if(info[1]<info[0]){
			this.enableItem("redo");
		}else{
			this.disableItem("redo");
		}
		//----------------------------------------------
		if(info[1]>0 && info[0]>0){
			this.enableItem("undo");
		}else{
			this.disableItem("undo");
		}
		//----------------------------------------------
		var html = "";
		for(var i=0, itm ; (itm = this.Items[i]) ; i++){
			html += itm.toString();
		}
			
		byid("ContextMenu").innerHTML = html;
		//----------------------------------------------
		byid("ContextMenu").style.display = 'block';
		
		if((editor_x+left+byid("ContextMenu").offsetWidth >= (_editor.offsetLeft+_editor.offsetWidth))){
			left= (_editor.offsetLeft+_editor.offsetWidth)-(editor_x+byid("ContextMenu").offsetWidth);
		}
		if(top+byid("ContextMenu").offsetHeight+1 >= _editor.offsetHeight){
			top= ((_editor.offsetHeight-byid("ContextMenu").offsetHeight)-1);
		}
		//----------------------------------------------
		byid("ContextMenu").style.left = left+'px';
		byid("ContextMenu").style.top = top+'px';
		
    };
    //hide contextMenu
    this.hide = function()
    {
    	byid("ContextMenu").style.display = '';
    };
    
	/***************************************************************************************************
		ITEM INSTANTIATIONS
	***************************************************************************************************/
    this.Items.push( new ContextItem("Undo"		,"images/context/undo.png"		,"undo"		,"ContextHandlerUndo"));
    this.Items.push( new ContextItem("Redo"		,"images/context/redo.png"		,"redo"		,"ContextHandlerRedo"));
    this.Items.push( new ContextItem("Indent"	,"images/context/indent.png"	,"indent"	,"ContextHandlerIndent"));
    this.Items.push( new ContextItem("Unindent"	,"images/context/unindent.png"	,"unindent"	,"ContextHandlerUnIndent"));
    this.Items.push( new ContextItem("Spacing"	,""	,""	,""));
    this.Items.push( new ContextItem("Run to Cursor"	,"images/context/runtocursor.png"	,"runtocursor"	,"ContextHandlerRunTo"));
    this.Items.push( new ContextItem("Spacing"	,""	,""	,""));
    this.Items.push( new ContextItem("Delete"	,"images/context/delete.png"	,"delete"	,"ContextHandlerDelete"));
    this.Items.push( new ContextItem("Cut"		,"images/context/clip.png"		,"cut"		,"ContextHandlerCut"));
    this.Items.push( new ContextItem("Copy"		,"images/context/copy.png"		,"copy"		,"ContextHandlerCopy"));
    this.Items.push( new ContextItem("Paste"	,"images/context/paste.png"		,"paste"	,"ContextHandlerPaste"));
}
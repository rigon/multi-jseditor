//--
/// <reference path="Curser.js" />
/// <reference path="Editor.js" />
/// <reference path="Initializer.js" />
/// <reference path="Keyhandler.js" />
/// <reference path="Selection.js" />
/// <reference path="UndoRedo.js" />
/// <reference path="Utilities.js" />

function Class_CopyPaste()
{
	this.Clip = function()
	{
	    UndoRedo.Delete([Selection.getStartRow(), Selection.getStartCol()], Selection.getText());
		Selection.deleteRange();
		Selection.release();
		Editor.print();
	};
	
	this.Copy = function()
	{
		// Allways fun to have this method...
	};
	
	this.Paste = function()
	{
		var tmp = byid("clipboard").value;
		
		if(arguments != undefined){ //UndoRedo is Pasting...
		    UndoRedo.paste( [Editor.Row(),Curser.Charcount()], tmp );
		}
		tmp = EditorContent[Editor.Row()].substr(0,Curser.Charcount()) + tmp;
		tmp += EditorContent[Editor.Row()].substr(Curser.Charcount());
		
		var arr = tmp.split('\n');
		
		EditorContent.splice(Editor.Row(),1);
		EditorContent = EditorContent.insert(Editor.Row(), arr);
		Editor.Buffer = Editor.Buffer.insert(Editor.Row(), new Array(arr.length-1))
		
		var len = byid("clipboard").value.split('\n');
		var move = [len[len.length-1].length , arr.length-1 ];
		
		//for(var j=Editor.Row(); j< Editor.Row()+len.length; j++){
			//Editor.reBufferRow();
		//}
		//TimeDown(20);
		
		Editor.reBufferRow(Editor.Row(), Editor.Row()+len.length);
		
		Editor.findLongest();
		Editor.initScrollBar();
		Editor.print();
		
		if(move[1]+Curser.Row()-Editor.OffzY() > rows)
		{
			Editor.Goto(move[1] + Editor.Row());
			Curser.move_to(move[0]+Curser.Charcount());
		}
		else
		{
			Curser.move_to(move[0]+Curser.Charcount(), move[1]+Curser.Row() );
		}
		window.focus();
	};
}
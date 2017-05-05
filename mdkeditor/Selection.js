/// <reference path="Editor.js" />
/// <reference path="Initializer.js" />
/// <reference path="Curser.js" />

function Class_Selection(){
	this.from_row = 0; //which line (row)
	this.from_col = 0; //which char (CharCount|index)
	
	//mouse selection
	this.end_row = 0;
	this.end_col = 0;
	
	//if selection is visible
	this.active = false;
	
	this.release = function()
	{
		this.end_col = this.from_col = Curser.Charcount();
		this.end_row = this.from_row = Editor.Row();
	}
	
	this.selectRows = function(from, end)
	{
	    var f = Math.min(from, end)
	    var e = Math.max(from, end)
	    
	    this.from_row = f;
	    this.end_row = e;
	    this.from_col = 0;
	    this.end_col = EditorContent[e].length;
	}
	
	this.dubbleClick = function(T)
	{
		var E = EditorContent
		var row = T[0]
		var col = T[1]
		
		if( E[row] )
		if( E[row].charAt(col) )
			if( E[row].charAt(col).match(/[\d\w_]/i) )
			{
				this.from_row = this.end_row = row;
				
				while( E[row].charAt(--col).match(/[\d\w_]/i) )
				{
					this.from_col = col;
					if(col==0)
						break;
				}
				while( E[row].charAt(++col).match(/[\d\w_]/i) )
				{
					this.end_col = col+1;
					if(col == E[row].length-1)
						break;
				}
			}
	}
	
	this.selectAll = function()
	{
		this.from_col = 0;
		this.from_row = 0;
		
		this.end_col = EditorContent[EditorContent.length-1].length;
		this.end_row = EditorContent.length-1;
		Editor.print();
	}
	
	this.distance = function()
	{
		if( this.from_row != this.end_row || this.from_col != this.end_col)
			return true;
		return false;
	}
	
	this.getStartRow = function()
	{
		return (this.from_row > this.end_row)? this.end_row : this.from_row;
	}
	
	this.getEndRow = function()
	{
		return (this.from_row < this.end_row)? this.end_row : this.from_row;
	}
	
	this.getStartCol = function()
	{
		var fr = (this.from_row > this.end_row)? this.end_row : this.from_row;
		var er = (this.from_row < this.end_row)? this.end_row : this.from_row;
		
		if(fr!=er)	var fc = (this.from_row > this.end_row)? this.end_col : this.from_col;
		else		var fc = Math.min(this.end_col , this.from_col)
		
		return fc;
	}
	
	this.getEndCol = function()
	{
		var fr = (this.from_row > this.end_row)? this.end_row : this.from_row;
		var er = (this.from_row < this.end_row)? this.end_row : this.from_row;
		
		if(fr!=er)	var ec = (this.from_row < this.end_row)? this.end_col : this.from_col;
		else		var ec = Math.max(this.end_col , this.from_col)
	
		return ec;
	}
	
	this.deleteRange = function()
	{
	    var fr = (this.from_row > this.end_row)? this.end_row : this.from_row;
		var er = (this.from_row < this.end_row)? this.end_row : this.from_row;
		
		if(fr!=er)
		{
			var fc = (this.from_row > this.end_row)? this.end_col : this.from_col;
			var ec = (this.from_row < this.end_row)? this.end_col : this.from_col;
		}
		else
		{
			var fc = Math.min(this.end_col , this.from_col)
			var ec = Math.max(this.end_col , this.from_col)
		}
		
		var MoveEnd = (EditorContent[fr].length != fc)
		
		if(er>fr)
		{
			var clip1 = EditorContent[fr].substr(0,fc)
			var clip2 = EditorContent[er].substr(ec)
			EditorContent.splice(fr, er-fr)
			Editor.Buffer.splice(fr, er-fr)
			EditorContent[fr] = clip1 + clip2;
			Editor.reBufferRow(fr);
			Curser.move_to(fc, fr);
		}
		else if(er==fr)
		{
			var clip1 = EditorContent[fr].substr(0,fc)
			var clip2 = EditorContent[fr].substr(ec)
			
			EditorContent[fr] = clip1 + clip2;
			Curser.move_to(fc);
		}
		
		this.from_row = this.end_row = fr;
		this.from_col = this.end_col = fc;
		
		if(EditorContent.length==0)
			EditorContent.push("");
		if(EditorContent.length==fr)
			Curser.move_to(EditorContent[EditorContent.length-1].length , EditorContent.length -1);
		if(fr < Editor.OffzY())
		{
			Editor.Goto(fr)
			Curser.move_to(fc);
		}
	}
	
	this.getText = function()
	{
		var fr = (this.from_row > this.end_row)? this.end_row : this.from_row;
		var er = (this.from_row < this.end_row)? this.end_row : this.from_row;
		
		if(fr!=er)
		{
			var fc = (this.from_row > this.end_row)? this.end_col : this.from_col;
			var ec = (this.from_row < this.end_row)? this.end_col : this.from_col;
		}
		else
		{
			var fc = Math.min(this.end_col , this.from_col)
			var ec = Math.max(this.end_col , this.from_col)
		}
		
		var text = "";
		if(er>fr)
		{
			for(var i=0;i<EditorContent.length;i++)
			{
				if(i==fr)			text += EditorContent[i].substr(fc) + "\n"
				if(i>fr && i<er)	text += EditorContent[i] + "\n"
				if(i==er)			text += EditorContent[i].substr(0,ec)
			}
		}
		else if(er==fr)
		{
			text = EditorContent[fr].substr(fc, ec-fc)
		}
		
		return text;
	}
}
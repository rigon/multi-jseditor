/// <reference path="Editor.js" />
/// <reference path="UndoRedo.js" />
/// <reference path="Initializer.js" />
/// <reference path="Definitions.js" />
/// <reference path="Utilites.js" />
/// <reference path="Parsers.js" />

function Class_Intellisense()
{
	this.isParsing = ""; //what da hell am i doing ?
	
	this.visible = false;	//as Boolean
	var offset = 0;
	var content = null;		//array
	
	//chars that commit the selected match
	this.commitChar = "{}[]().,:;+-*/%&|^!~=<>?@#'\"\\";
	this.commitSpace = true;
	
	this.CommitChars = function()
	{
		if(Editor.getLanguage() === cssParser || htmlInStyle)
			return "{}[]().,:;+*/%&|^!~=<>?@#'\"\\ 0123456789"; //no minus + numbers
		else
			return this.commitSpace ? this.commitChar + " " : this.commitChar;
	}
	//------------------------------------
	this.snippet = function(word)
	{
		if(JSDefinition[word])
			return true;
	}
	
	this.commitSnippet = function(word, tabindex)
	{
		var snip = JSDefinition[word].value;
		var row = Editor.Row();
		var col = 0;
		
		for(var i=1; i<10; i++)
		{
			if( snip.indexOf("$"+i) > -1 )
			{
				var param = prompt("Parameter $"+i + " \n" + snip, "")
				if(param==null){
					window.focus();
					return;
				}
				snip = snip.replace(new RegExp("(\\$"+i+")","g") , param)
			}
		}
		snip = snip.split("\n");
		
		for(var i=0, Line; Line=snip[i]; i++)
		{
			if(Line.indexOf("$0") >-1)
			{
				row = row + i;
				col = tabindex.length + Line.indexOf("$0")
				Line = Line.replace("$0","");
			}
			
			if(i>0)//first line sets index
				snip[i] = tabindex + Line;
		}
		
		var row = Editor.Row();
		var col = Curser.Charcount() - word.length;
		
		Selection.from_row = Selection.end_row = row;
		Selection.from_col = col;
		Selection.end_col = Curser.Charcount();
		Selection.active = true;
		
		UndoRedo.Delete([Selection.from_row, Selection.from_col], Selection.getText() );
		Selection.deleteRange();
		Selection.active = false;
		
		UndoRedo.write([row,col], word);
		byid("clipboard").value = snip.join("\n");
		CopyPaste.Paste();
		window.focus();
	}
	
	this.Commit = function(Char)
	{
		var test = this.commitSpace ? this.commitChar + " " : this.commitChar;
		
		if( test.indexOf(Char) != -1 || arguments[1]) //or forced by enter
		{
			if( this.matched && this.word != content[this.index + offset][0]) //no need to commit...
			{
				var word = content[this.index + offset][0];
				var row = Editor.Row();
				var col = Curser.Charcount() - this.word.length;
				
				Selection.from_row = Selection.end_row = row;
				Selection.from_col = col;
				Selection.end_col = Curser.Charcount();
				Selection.active = true;
				
				if(col != Curser.Charcount()){
					UndoRedo.Delete([Selection.from_row, Selection.from_col], Selection.getText() );
					Selection.deleteRange();
				}
				Selection.active = false;
				
				//UndoRedo.write([row,col], word);
				if(htmlIsAttributeName && htmlInTag && !htmlIsTagName)
				{
				    byid("clipboard").value = word + '=""';
				    CopyPaste.Paste();
				    Curser.move_le();
				}
				else if(!htmlIsAttributeName && htmlInTag && !htmlIsTagName && htmlInHtml)
				{
				    byid("clipboard").value = word;
				    CopyPaste.Paste();
				    Curser.move_ri();
				}
				else{
				    byid("clipboard").value = word;
				    CopyPaste.Paste();
				}
				
				this.hide();
			}
			if(arguments[1]){ this.hide(); }
		}
	};
	
	this.Content = function(){ return content; }
	this.CommitIndex = function(index)
	{
		var word = Intellisense.Content()[index][0];
		var row = Editor.Row();
		var col = Curser.Charcount() - Intellisense.word.length;
		
		Selection.from_row = Selection.end_row = row;
		Selection.from_col = col;
		Selection.end_col = Curser.Charcount();
		Selection.active = true;
		
		if(col != Curser.Charcount()){
			UndoRedo.Delete([Selection.from_row, Selection.from_col], Selection.getText() );
			Selection.deleteRange();
		}
		Selection.active = false;
		
		//UndoRedo.write([row,col], word);
		byid("clipboard").value = word;
		CopyPaste.Paste();
		
		this.hide();
	};
	
	this.hide = function()
	{
		this.visible = false;
		this.word = "";
		offset = 0;
		_intellisense.style.display = "none";
	};

	//index of popup
	this.index = 0;
	this.matched = false;
	var isHTMLEntity = false;
	var isCSSKey = false;
	var isCSSValue = false;
	var isHTMLTagName = false;
	var isHTMLAttributeName = false;
	
	this.search = function(word)
	{
		var out = []; //as Array of strings
		this.matched = false;
		var Regx;
		isHTMLEntity = false;
		isCSSKey = false;
		isCSSValue = false;
		isHTMLTagName = false;
	    isHTMLAttributeName = false;
	    
		try{
			Regx = new RegExp("^" + word , "i");
		}catch(e){
			Regx = new RegExp("^" , "i");
		}
		
		if(word.charAt(0) == "&")
		{
			isHTMLEntity = true;
			for(var attr in HTMLEntities)
			{
				if(HTMLEntities.hasOwnProperty(attr))
					out.push( [attr, HTMLEntities[attr].type] );
			}
		}
		else if( this.isParsing == "Javascript" )//Editor.getLanguage()===jsParser || htmlInScript ) //need more work :-/
		{
			for(var attr in JSDefinition){
				if(JSDefinition.hasOwnProperty(attr))
					out.push( [attr.substr(0), JSDefinition[attr].type]);
			}
		}
		else if( this.isParsing == "CSS" )//Editor.getLanguage()===cssParser || htmlInStyle )
		{
			if(cssInKey)
			{
				isCSSKey = true;
				for(var attr in CSSDefinition)
				{
					if(CSSDefinition.hasOwnProperty(attr))
						out.push([attr, "Property"])
				}
			}
			else if(CSSDefinition[cssLastKey].length > 0)
			{
				isCSSValue = true;
				for(var i=0; i<CSSDefinition[cssLastKey].length; i++)
				{
					out.push([CSSDefinition[cssLastKey][i], "Property"])
				}
			}
		}
		else if( this.isParsing == "HTML" )// Editor.getLanguage()===htmlParser || htmlInHtml )
		{
			if(htmlIsTagName)
			{
				isHTMLTagName = true;
				for(var attr in HMTLDefinition)
				{
				    if(HMTLDefinition.hasOwnProperty(attr))
					    out.push([attr, "Property"])
				}
			}
			else if(htmlIsAttributeName 
			&& HMTLDefinition[htmlTagName] != null)
			{
				isHTMLAttributeName = true;
				if(HMTLDefinition[htmlTagName].push)
					for(var i=0,attr; attr=HMTLDefinition[htmlTagName][i]; i++)
					{
						out.push([attr, "Property"])
					}
				else
					for(var attr in HMTLDefinition[htmlTagName])
					{
						if(HMTLDefinition[htmlTagName].hasOwnProperty(attr))
							out.push([attr, "Property"])
					}
			}
			else if(!htmlIsAttributeName 
			&& HMTLDefinition[htmlTagName] != null 
			&& HMTLDefinition[htmlTagName][htmlAttributeName] != null)
			{
			    isHTMLAttributeName = false;
				if(HMTLDefinition[htmlTagName][htmlAttributeName].push)
					for(var i=0,attr; attr=HMTLDefinition[htmlTagName][htmlAttributeName][i]; i++)
					{
						out.push([attr, "Property"])
					}
				else
					for(var attr in HMTLDefinition[htmlTagName][htmlAttributeName])
					{
						if(HMTLDefinition[htmlTagName][htmlAttributeName].hasOwnProperty(attr))
							out.push([attr, "Property"])
					}
			}
		}
		
		if(!isHTMLEntity)
			out.sort(objSort);
		
		for(var i=0; i<out.length ; i++){
			if(out[i][0].match(Regx) )
			{
				this.index = i; 
				this.matched = true;
				break;
			}
		}
		return out;
	};
	
	this.next = function()
	{
		offset++;
		if(offset+this.index > content.length-1){
			offset = -1 * this.index;}
		this.display(true);
		this.matched = true;
	};
	this.prev = function()
	{
		offset--;
		if(offset+this.index < 0){
			offset = content.length - this.index -1;
		}
		this.display(true);
		this.matched = true;
	};
	
	var setPicture = function(type)
	{
		switch(type)
		{
			case "Property" : return "images/intellisense/Property.png";
			case "Function" : return "images/intellisense/Variable.png";
			case "Object" :	  return "images/intellisense/Type.png";
			case "Language" : return "images/intellisense/Language.png";
			case "Snippet"  : return "images/intellisense/Snippet.png";
			case "HTMLEntity" : return "images/intellisense/Language.png";
		}
		return "images/intellisense/Variable.png";
	};
	
	this.word = "";
	this.display = function()
	{
		content = this.search(this.word);
		
		if(!this.visible && this.word.length==0) 
			offset = 0;
		
		if(!this.visible)
		{
			var html = new FStringCat();
			for(var i=0, C; C=content[i]; i++)
			{
				html.push(
//					"<div onclick='Intellisense.CommitIndex("+i+")' class='ContextMenuItem'>" +
//						'<div class="ContextMenuItemImg">' +
//							'<img src="' + setPicture(C[1]) + '" />' +
//						'</div>' +
//						'<div class="ContextMenuItemText">' + (isHTMLEntity ? " " + C[0] + " " : "") + C[0].replace("&","&amp;") + '</div>' +
//					'</div>'
					
					"<span class='is_wrap' onclick='Intellisense.CommitIndex("+i+")'>"+
						"<img class='intpic' border=0 src='"+setPicture(C[1])+"'>" + 
						"<div name='value' class='is_li'>" + (isHTMLEntity ? " " + C[0] + " " : "") + C[0].replace("&","&amp;") + "</div>" +
					"</span><br>"
				);
			}
			_intellisense = replaceHtml(_intellisense, html.value());
		}
		
		for(var j=0,ILI; ILI = _intellisense.getElementsByTagName("div")[j]; j++)
		{	
			if((this.matched || arguments[0]) && (this.index + offset) == j)
				ILI.className = "is_li_selected";
			else
				ILI.className = "is_li";
			
			ILI.onmouseover = function(){ this.style.border = "1px solid black"; };
			ILI.onmouseout = function(){ this.style.border = "none"; };
			//ILI.onclick = function(){ Intellisense.CommitIndex(i) };
		}
		
		if(!this.visible && content.length)
		{
			var left = Curser.Col()*fontsize[0];
			var top = (Curser.Row()-Editor.OffzY()) * fontsize[1] + fontsize[1] + 5
			
			if((editor_x + left + _intellisense.offsetWidth >= (_editor.offsetLeft + _editor.offsetWidth)))
				left = (_editor.offsetLeft + _editor.offsetWidth)-(editor_x + _intellisense.offsetWidth);
			
			if(top + _intellisense.offsetHeight+1 >= _editor.offsetHeight)
				top = (_editor.offsetHeight - _intellisense.offsetHeight - fontsize[1]*3) - 5;
			
			_intellisense.style.top = top + "px";
			_intellisense.style.left = left + "px";
			
			_intellisense.style.display = "block"
			this.visible = true;
		}
		_intellisense.scrollTop = ((this.index + offset + 3)*16 - 160);
	};

	var objSort = function(a, b)
	{
		if(a[0].toLowerCase() < b[0].toLowerCase()) 
			return -1; 
		if(a[0].toLowerCase() > b[0].toLowerCase()) 
			return 1;
		return 0; 
	};
}

function context()
{
	var Tokenizer = /(\/\*[\s\S.]+?\*\/|[\/]{2,}.*|'((\\\')|.??)*'|"((\\\")|.??)*"|[*+-\/<>]?={1,2}|[-+]{2}|-?\d+\.\d+e?-?e?\d*|-?\.\d+e-?\d+|[\s\t\n\r]|\w+|[\[\]\(\)\{\}<:;>"'\-%&!|+,.\/*])/gi;
	var tmp = EditorContent.slice(0,1+Curser.Row());
	tmp[Curser.Row()] = tmp[Curser.Row()].substr(0,Curser.Charcount());

	
}

function FindFunctions()
{
	
}


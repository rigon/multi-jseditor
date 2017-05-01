/// <reference path="Initializer.js" />
/// <reference path="Editor.js" />
/// <reference path="Curser.js" />
/// <reference path="CopyPaste.js" />
/// <reference path="Definitions.js" />
/// <reference path="Selection.js" />
/// <reference path="UndoRedo.js" />
/// <reference path="Utilites.js" />


/*******************************************************************
	JAVASCRIPT Parser
*******************************************************************/
var jsTokenizer = /(\/\*[\s\S.]*?\*\/|[\/]{2,}[^\n\r]*|('|"|\/)((\\\2)|.??)*\2|[*+-\/<>]?={1,2}|[\-+]{2}|(([\-]|\b)\d+\.?\d*|[\-]?\.\d+)(e[\-]?\d+|\b)|[\s\t\n\r]|[\wæøåêâûîôãõñäëüöÿï]+|[^\wæøåêâûîôãõñäëüöÿï])/gi;
function jsParser()
{
	var code = "";
	var endingBR = false;
	var row = (Editor) ? Editor.Row() : 0;
	var col = (Editor) ? Curser.Charcount() : 0;
	var rowCount = 0, charCount = 0;
	
	if(arguments[0] && typeof arguments[0] == "string")
	{
		code = arguments[0];
		/* MAKE:ME */ splat = arguments[1];
		rowCount = arguments[2];
		if(rowCount==row){
			charCount = arguments[3]; //offset
		}
	}
	else
	{
		if(arguments[0] != undefined && arguments[1] != undefined)
		{
			code = EditorContent.slice(arguments[0], arguments[1]).join("\n");
			endingBR = true;
			rowCount = arguments[0];
		}else{
			code = EditorContent.join("\n");
		}
	}
	
	var arr = code.match( jsTokenizer );
	var old = 0;
	//scope count
	var BraceCount = 0;   //{}
	var ParenCount = 0;   //()
	var BracketCount = 0; //[]
	
	if(arr)
	{
		for(var j=0, token; (token = arr[j]); j++)
		{
			if(rowCount==row)
			{
				charCount += token.length;
				if(old < col && charCount >= col)
				{
					Intellisense.isParsing = "Javascript";
					console.log("JS");
				}
				old = charCount;
			}
			switch(token)
			{
				case "Array":
				case "Boolean":
				case "Date":
				case "Function":
				case "Math":
				case "Number":
				case "Object":
				case "RegExp":
				case "String":
					arr[j] = "<b class='jsObj'>"+token+"</b>";
					break;
				case "break":
				case "case":
				case "catch":
				case "continue":
				case "default":
				case "do":
				case "else":
				case "false":
				case "for":
				case "goto":
				case "if":
				case "in":
				case "int":
				case "label":
				case "new":
				case "null":
				case "return":
				case "substr":
				case "switch":
				case "this":
				case "throw":
				case "true":
				case "try":
				case "typeof":
				case "var":
				case "void":
				case "while":
				case "with":
					arr[j] = "<b class='jsLang'>"+token+"</b>";
					break;
				case "function" : 
					arr[j] = "<b class='jsFun'>" + token + "</b>";
					break;
				case "alert":
				case "blur":
				case "bottom":
				case "clearTimeout":
				case "close":
				case "confirm":
				case "document":
				case "element":
				case "elements":
				case "escape":
				case "eval":
				case "event":
				case "focus":
				case "innerHTML":
				case "isNaN":
				case "lastIndexOf":
				case "left":
				case "length":
				case "location":
				case "match":
				case "name":
				case "navigator":
				case "open":
				case "parent":
				case "parseFloat":
				case "parseInt":
				case "prompt":
				case "prototype":
				case "push":
				case "right":
				case "self":
				case "send":
				case "setTimeout":
				case "slice":
				case "splice":
				case "status":
				case "submit":
				case "toString":
				case "top":
				case "unescape":
				case "valueOf":
				case "window":
					arr[j] = "<b class='jsMeth'>" + token + "</b>";
					break;
				case "onabort":
				case "onblur":
				case "onchange":
				case "onclick":
				case "ondblclick":
				case "onerror":
				case "onfocus":
				case "onkeydown":
				case "onkeypress":
				case "onkeyup":
				case "onload":
				case "onmousedown":
				case "onmousemove":
				case "onmouseout":
				case "onmouseover":
				case "onmouseup":
				case "onreset":
				case "onresize":
				case "onselect":
				case "onsubmit":
				case "onunload":
				case "onselectionstart":
					arr[j] = "<b class='jsEvent'>" + token + "</b>";
					break;
				case " " : arr[j] = "&nbsp;";	break;
				case "\t": arr[j] = "&nbsp;&nbsp;&nbsp;&nbsp;"; break;
				case "<" : arr[j] = "&lt;";		break;
				case ">" : arr[j] = "&gt;";		break;
				case "&" : arr[j] = "&amp;";	break;
				case "\n": rowCount++;			break;
				case "{" : BraceCount++;		break;
				case "}" : BraceCount--;		break;
				case "(" : ParenCount++;		break;
				case ")" : ParenCount--;		break;
				case "[" : BracketCount++;		break;
				case "]" : BracketCount--;		break;
				default  :
					if( !isNaN(token) )
					{
						arr[j] = "<b class='jsNum'>" + token + "</b>";
						break;
					}
					else if(token.indexOf('"')==0 || token.indexOf("'")==0 )
					{
						arr[j] = "<b class='jsStr'>" + token.HTMLify().URLify() + "</b>";
						break;
					}
					else if(token.indexOf("//") == 0)
					{
						arr[j] = "<b class='jsCom'>" + token.HTMLify().URLify() + "</b>";
						break;
					}
					else if(token.indexOf("/*") == 0)
					{
						arr[j] = "<b class='jsCom'>" + token.HTMLify().URLify() + "</b>";
						arr[j] = arr[j].replace(/(^(&nbsp;)+)/gim,"<b class='tab'>$1</b>").
								 split("\n").join("</b>\n<b class='jsCom'>");
								 //replace(/\n/g,"</b>\n<b class='jsCom'>");
						break;
					}
					else if(token.charAt(0)=="/" && token.charAt(token.length-1) == "/" && token.length>1)
					{
						arr[j] = "<b class='jsRegx'>" + token.HTMLify().URLify() + "</b>";
						break;
					}
					else{}
			}
		}
	}
	
	if(arr)
	{
		return arr.join("").split("\n").join("<br>\n").push(endingBR ? "<br>" : "").replace(/(^(&nbsp;)+)/gim,"<b class='tab'>$1</b>").split("\n");
	}
	else
	{
		return [""];
	}
}

/*******************************************************************
	CSS Parser
*******************************************************************/
var cssInDef = false;
var cssInKey = false;
var cssLastKey = "";
var cssTokenizer = /(\/\*[\s\S.]*?\*\/|('|")((\\\2)|.??)*\2|[@\.#!]?\w[\w\d\-]*|[\W\S\n\t.])/gm;
function cssParser()
{
	var code = "";
	var endingBR = false;
	var row = (Editor) ? Editor.Row() : 0;
	var col = (Editor) ? Curser.Charcount() : 0;
	var rowCount = 0, charCount = 0;
	
	var inDef = false; //inside definiton: token= key|val
					   //outside definiton: token= selector
	var waitOnce = false; //@subclass selector has scope
	var key = true;
	
	if(arguments[0] && typeof arguments[0] == "string")
	{
		code = arguments[0];
		inDef = arguments[1];		//style="css" ? true : false;
		rowCount = arguments[2];
		if(rowCount==row){
			charCount = arguments[3]; //offset
		}
		//console.log("cc:%d \trow:%d",charCount, rowCount);
	}
	else
	{
		if(arguments[0] != undefined && arguments[1] != undefined)
		{
			endingBR = true;
			code = EditorContent.slice(arguments[0], arguments[1]).join("\n");
			rowCount = arguments[0];
		}else{
			code = EditorContent.join("\n");
		}
	}
	
	var arr = code.match( cssTokenizer );
	var old = 0;
	var lastKey = "";
	
	if(arr)
	{
		for(var j=0, token; (token = arr[j]); j++)
		{
			if(rowCount==row)
			{
				charCount += token.length;
				if(old <= col && charCount >= col)
				{
					Intellisense.isParsing = "CSS";
					cssInDef = inDef;
					cssInKey = key;
					cssLastKey = lastKey;
					//console.log("Inside definition: %s - writing Key: %s - lastKey: %s", inDef, key, lastKey);
				}
				old = charCount;
			}
			switch( token )
			{
				case "{" : 
					if(waitOnce){	waitOnce = false;}
					else{			inDef=true; }
					break;
				case ":" : 
					if(inDef){ key = false;}
					break;
				case ";" : 
					if(inDef){ key = true;}
					break;
				case "," : break;
				case "}" : 
					if(inDef){ key = true;}
					inDef=false; 
					break;
				case "\n": rowCount++; break;
				case "(" : break;
				case ")" : break;
				case "[" : break;
				case "]" : break;
				case " " : arr[j] = "&nbsp;"; break;
				case "\t" : arr[j] = "&nbsp;&nbsp;&nbsp;&nbsp;"; break;
				default : 
					if(token.indexOf("/*")==0)
					{
						arr[j] = "<b class='cssCom'>" + token.HTMLify().URLify() + "</b>";
						arr[j] = arr[j].replace(/(^(&nbsp;)+)/gim,"<b class='tab'>$1</b>").
								 split("\n").join("</b>\n<b class='cssCom'>");
								 //replace(/\n/g,"</b>\n<b class='cssCom'>");
						break;
					}
					else if(token.indexOf('"') == 0 || token.indexOf("'") == 0)
					{
						arr[j] = "<b class='cssStr'>" + token.HTMLify().URLify() + "</b>";
						break;
					}
					else if(token.indexOf("@")==0)
					{
						arr[j] = "<b class='cssMed'>" + token + "</b>";
						waitOnce = true;
						break;
					}
					else if(inDef)
					{
						if(key){
							lastKey = token;
							arr[j] = "<b class='cssKey'>" + token + "</b>";
							break;
						}else{
							arr[j] = "<b class='cssVal'>" + token + "</b>";
							break;
						}
					}
					else if(!inDef) //selector
					{
						arr[j] = "<b class='cssSel'>" + token + "</b>";
						break;
					}
					break;
			}
		}
	}
	
	if(arr){
		return arr.join("").split("\n").join("<br>\n").push(endingBR ? "<br>" : "").replace(/(^(&nbsp;)+)/gim,"<b class='tab'>$1</b>").split("\n");
	}else{
		return [""];
	}
}
/*******************************************************************
	HTML PARSER (testing)
*******************************************************************/
function RecordedContext(start, stop, text)
{
	this.start = start;
	this.stop = stop;
	this.text = text;
}
var htmlTokenizer = (navigator.userAgent.indexOf("Firefox/3")>-1) ?
	 /(<!--[.\S\s]*?-->|<|>|('|")((\\\2)|.??)*?\2|[\w\-]+|[^<>])/gi 
	 : /(<!--[.\S\s]*?-->|<|>|('|")((\\\2)|.??)*\2|[\w\-]+|[^<>])/gi;
var htmlInScript = false;
var htmlInStyle = false;
var htmlInHtml = false;
var htmlInTag = false;
var htmlInEndTag = false;
var htmlTagName = "";
var htmlIsAttributeName = false;
var htmlAttributeName = "";
var htmlIsTagName = false;
function htmlParser()
{
	var code = "";
	var endingBR = false;
	var row = (Editor) ? Editor.Row() : 0;
	var col = (Editor) ? Curser.Charcount() : 0;
	var rowCount = 0, charCount = 0;
	
	if(arguments[0] && typeof arguments[0] == "string")
	{
		code = arguments[0];
	}
	else
	{
		if(arguments[0] != undefined && arguments[1] != undefined)
		{
			endingBR = true;
			code = EditorContent.slice(arguments[0], arguments[1]).join("\n");
			rowCount = arguments[0];
		}else{
			code = EditorContent.join("\n");
		}
	}
	
	var arr = code.match( htmlTokenizer );
	var old = 0;
	var inTag = false;
	var inEndTag = false;
	var tagStart = true;
	var isAttributeName = false;
	var AttributeName = "";
	var justEntered = false;
	var recording = false;
	var LengthCounter = 0; LastCount = 0;
	var recordedValue = [];
	var Records = [];
	var recordStartRow = 0;
	var elementName = "";
	
	if(arr)
	{
		for(var j=0, token; (token = arr[j]); j++)
		{
			charCount += token.length;
			if(rowCount==row)
			{
				if(old < col && charCount >= col)
				{
					Intellisense.isParsing = "HTML";
					htmlInScript = ( (recording && !inTag && elementName=="script") || (!isAttributeName && inTag && AttributeName.indexOf("on")==0) );
					htmlInStyle = ( (recording && !inTag && elementName=="style") || (!isAttributeName && inTag && AttributeName=="style") );
					htmlInHtml = !(htmlInScript || htmlInStyle);
					htmlInTag = inTag;
					htmlInEndTag = inEndTag;
					htmlTagName = elementName;
					
					htmlIsTagName = justEntered || (recording && !inTag);
					htmlIsAttributeName = isAttributeName && inTag;
					htmlAttributeName = AttributeName;
					
//					console.log(
//						"Script:%d\t"+
//						"Style:%d\t"+
//						"HTML:%d\t"+
//						"isTagName:%d\t\t"+
//						"isAttributeName:%d\t"+
//						"AttributeName:%d\t"+
//						"TagName:%d\t"+
//						"inTag:%d",
//						htmlInScript, 
//						htmlInStyle, 
//						htmlInHtml, 
//						htmlIsTagName, 
//						htmlIsAttributeName, 
//						AttributeName, 
//						htmlTagName, 
//						inTag);
				}
				old = charCount;
			}
			
			LengthCounter += token.length;
			
			if(recording && !inTag){
				recordedValue.push(token);
			}
			
			switch(token)
			{
				case "<" :	
					if(recording && arr[j+1]=="/" && arr[j+2]==elementName && arr[j+3]==">"){
						recording = false;
						inTag = true;
						justEntered = true;
						
						//console.log("recorded: %s", recordedValue.slice(0,recordedValue.length-2).join(""));
						
						if(arr[j+2]=="script"){ Records.push(new RecordedContext(LastCount, j, jsParser(
							recordedValue.slice(0,recordedValue.length-1).join(""), !isAttributeName, recordStartRow, charCount ))); }
						if(arr[j+2]=="style") { Records.push(new RecordedContext(LastCount, j, cssParser(
							recordedValue.slice(0,recordedValue.length-1).join(""), !isAttributeName, recordStartRow, charCount ))); }
						recordedValue = [];
						
					}else if(recording){
						inTag = false;
						justEntered = false;
					}else{
						inTag = true;
						justEntered = true;
					}
					arr[j] = "<i>&lt;</i>";
					break;
				case '"' : break;
				case "'" : break;
				case "=" : if(inTag){ isAttributeName=false;}
					break;
				case "/" : 
					if(arr[j+1]==">"){ recording=false; inTag=true; }
					if(!justEntered){
						inTag = false;
					}else{
						inEndTag = true;
					}
					break;
				case " " :	
					arr[j] = "&nbsp;";
					//if(inTag) isAttributeName=true;
					if(justEntered){ inTag = false; }
					break;
				case "\n": 
					if(inTag && recording)
					{
						recording = false;
						recordedValue = [];
					}
					rowCount++;
					charCount=0;
					break;
				case "&":	
					arr[j] = "&amp;";			 
					break;
				case "\t":	
					arr[j] = "&nbsp;&nbsp;&nbsp;&nbsp;"; 
					break;
				case ">" :	
					if(inTag && recording){ LastCount = j;}
					inTag = false;
					inEndTag = false;
					recordStartRow = rowCount;
					arr[j] = "<i>&gt;</i>";
					break;
				default ://word
					if(token.indexOf("<!--") == 0)
					{
						arr[j] = "<b class='xmlComment'>" + token.HTMLify().URLify() + "</b>";
						arr[j] = arr[j].split("\n").join("</b>\n<b class='xmlComment'>");
					}
					else if(inTag && justEntered && !recording) //+validate string !
					{
						justEntered = false;
						isAttributeName = true;
						elementName = token.toLowerCase();
						
						if((token=="script" || token=="style") && !inEndTag){
							recording = true;
						}
						
						if(token=="script"){
							arr[j] = "<b class='xmlElementScript'>" + token + "</b>";
						}else if(token=="style"){
							arr[j] = "<b class='xmlElementStyle'>" + token + "</b>";
						}else{
							arr[j] = "<b class='xmlElement'>" + token + "</b>";
						}
					}
					else if(inTag && isAttributeName)
					{
						//isAttributeName = false;
						AttributeName = token;
						arr[j] = "<b class='xmlAttributeName'>" + token + "</b>";
					}
					else if(inTag && !isAttributeName)
					{
						if(token.indexOf('"')==0 || token.indexOf("'")==0){
							if(AttributeName=="style" && token.length>2){
								arr[j] = "<b class='xmlAttributeValue'>" + token.substr(0,1) + //"</b>" + 
								cssParser(token.substr(1,token.length-2), !isAttributeName, rowCount, (charCount - token.length+1) ) +
								//"<b class='xmlAttributeValue'>" + 
								token.substr(0,1) + "</b>";
							}else if(AttributeName.indexOf("on")==0 && token.length>2){
								arr[j] = "<b class='xmlAttributeValue'>" + token.substr(0,1) + //"</b>" + 
								jsParser(token.substr(1,token.length-2), !isAttributeName, rowCount, (charCount - token.length+1) ) +
								//"<b class='xmlAttributeValue'>" + 
								token.substr(0,1) + "</b>";
							}else{
								arr[j] = "<b class='xmlAttributeValue'>" + token.HTMLify().URLify() + "</b>";
							}
						}else{
							arr[j] = "<b class='xmlAttributeValue'>" + token + "</b>";
						}
							
						isAttributeName = true;
					}
					else //strings + comments + weird chars...
					{
						
					}
					break;
			}
		}
	}
	
	if(arr)
	{
		var newArr = [];
		old = 0;
		var range = 0;
		
		for(var p=0,rec; (rec=Records[p]); p++)
		{	
			if(rec.text)
			{
				newArr.push( arr.slice(0, rec.start+1 -old).join("") );
				arr.splice(0, rec.stop-old);
				old = rec.stop;
				
				var text = rec.text.join("\n");
				newArr.push( text.replace(/<br>/g,"") );
			}
		}
		newArr.push(arr.join(""));
		
		return newArr.join("").split("\n").join("<br>\n").push(endingBR ? "<br>" : "").replace(/(^(&nbsp;)+)/gim,"<b class='tab'>$1</b>").split("\n");
	}else{
		return [""];
	}
}

/*******************************************************************
	Text Parser
*******************************************************************/

function textParser()
{
	var code = "";
	
	if(arguments[0] && typeof arguments[0] == "string")
	{
		code = arguments[0];
	}else{
		if(arguments[0] != undefined && arguments[1] != undefined)
		{
			code = EditorContent.slice(arguments[0], arguments[1]);
		}else{
			code = EditorContent;
		}
	}
	
	Intellisense.isParsing = "Text";
	
	return code.join("\n").HTMLify().URLify().replace(/\n/g,"<br>\n").split("\n");
}

/*******************************************************************
	XML/XHTML Parser
*******************************************************************/
function xmlParser()
{
	var code = "";
	var endingBR = false;
	var row = (Editor) ? Editor.Row() : 0;
	var col = (Editor) ? Curser.Charcount() : 0;
	var rowCount = 0, charCount = 0;
	
	if(arguments[0] && typeof arguments[0] == "string")
	{
		code = arguments[0];
	}
	else
	{
		if(arguments[0] != undefined && arguments[1] != undefined)
		{
			endingBR = true;
			code = EditorContent.slice(arguments[0], arguments[1]).join("\n");
			rowCount = arguments[0];
		}else{
			code = EditorContent.join("\n");
		}
	}
	
	var arr = code.match( htmlTokenizer );
	var old = 0;
	var inTag = false;
	var inEndTag = false;
	var tagStart = true;
	var isAttributeName = false;
	var AttributeName = "";
	var justEntered = false;
	var LengthCounter = 0; LastCount = 0;
	var elementName = "";
	
	if(arr)
	{
		for(var j=0, token; (token = arr[j]); j++)
		{
			charCount += token.length;
			if(rowCount==row)
			{
				if(old < col && charCount >= col)
				{
					Intellisense.isParsing = "XML";
					htmlInHtml = false;
					htmlInTag = inTag;
					htmlInEndTag = inEndTag;
					htmlTagName = elementName;
					
					htmlIsTagName = justEntered;
					htmlIsAttributeName = isAttributeName && inTag;
					htmlAttributeName = AttributeName;
				}
				old = charCount;
			}
			
			LengthCounter += token.length;
			
			switch(token)
			{
				case "<" :	
					inTag = true;
					justEntered = true;
					arr[j] = "<i>&lt;</i>";
					break;
				case '"' : break;
				case "'" : break;
				case "=" : if(inTag){ isAttributeName=false;}
					break;
				case "/" : 
					if(arr[j+1]==">"){ recording=false; inTag=true; }
					if(!justEntered){
						inTag = false;
					}else{
						inEndTag = true;
					}
					break;
				case " " :	
					arr[j] = "&nbsp;";
					if(justEntered){ inTag = false; }
					break;
				case "\n": 
					rowCount++;
					charCount=0;
					break;
				case "&":	
					arr[j] = "&amp;";			 
					break;
				case "\t":	
					arr[j] = "&nbsp;&nbsp;&nbsp;&nbsp;"; 
					break;
				case ">" :	
					inTag = false;
					inEndTag = false;
					arr[j] = "<i>&gt;</i>";
					break;
				default ://word
					if(token.indexOf("<!--") == 0)
					{
						arr[j] = "<b class='xmlComment'>" + token.HTMLify().URLify() + "</b>";
						arr[j] = arr[j].split("\n").join("</b>\n<b class='xmlComment'>");
					}
					else if(inTag && justEntered) //+validate string !
					{
						justEntered = false;
						isAttributeName = true;
						elementName = token.toLowerCase();
						
						arr[j] = "<b class='xmlElement'>" + token + "</b>";
					}
					else if(inTag && isAttributeName)
					{
						AttributeName = token;
						arr[j] = "<b class='xmlAttributeName'>" + token + "</b>";
					}
					else if(inTag && !isAttributeName)
					{
						if(token.indexOf('"')==0 || token.indexOf("'")==0){
							arr[j] = "<b class='xmlAttributeValue'>" + token.HTMLify().URLify() + "</b>";
						}else{
							arr[j] = "<b class='xmlAttributeValue'>" + token + "</b>";
						}
						isAttributeName = true;
					}
					else //strings + comments + weird chars...
					{
						
					}
					break;
			}
		}
	}
	
	if(arr){
		return arr.join("").split("\n").join("<br>\n").push(endingBR ? "<br>" : "").replace(/(^(&nbsp;)+)/gim,"<b class='tab'>$1</b>").split("\n");
	}else{
		return [""];
	}
}
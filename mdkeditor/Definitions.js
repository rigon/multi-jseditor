/*******************************************************************
	Javascript Definition
*******************************************************************/
JSDefinition = {
	GlobalVariables : {
	/*
		"MyVar" : { type : "String" },	//var MyVar = "";
		"MyVar2" : {}						//var MyVar2;
	*/
	},
	Objects : {
	/* eg:
		"MyFunction" : { 
			Private : {
				"x" : "String",
				"y" : "String"
			},
			Public : {
				//this.MyVar = 5;
				"MyVar" : "Number",
				
				//this.Funk = function(){}
				"Funk" : {}
			}
		}
	*/	
	},
    GlobalSnippets : {
		"for"		: "for(var $1=$2;$1<$3;$1++)\n{\n\t$0\n}\n",
		"dorev"		: "do\n{\n\t$0\n}while($1);\n",
		"switch"	: "switch($1)\n{\n\tcase $2:\n\t\tbreak;\n\tdefault:\n\t\tbreak;\n}",
		"case"		: "case $1 :\n\tbreak;",
		"if"		: "if($1)\n{\n\t\n}",
		"else"		: "else\n{\n\t\n}",
		"elsif"		: "else if($1)\n{\n\t\n}",
		"prototype" : "$1.prototype.$2 = function($3)\n{\n\t\n};"
    },
	GlobalFunctions : {
		"decodeURI" : {
			params : "(URIstring)",
			text : "Decodes an encoded URI"
		},
		"decodeURIComponent" : {
			params : "(URIstring)",
			text : "Decodes an encoded URI component"
		},
		"encodeURI" : {
			params : "(URIstring)",
			text : "Encodes a string as a URI"
		},
		"encodeURIComponent" : {
			params : "(URIstring)",
			text : "Encodes a string as a URI component"
		},
		"escape" : {
			params : "(string)",
			text : "Encodes a string"
		},
		"eval" : {
			params : "(string)",
			text : "Evaluates a string and executes it as if it was script code"
		},
		"isFinite" : {
			params : "(number)",
			text : "Checks if a value is a finite number"
		},
		"isNaN" : {
			params : "(number)",
			text : "Checks if a value is not a number"
		},
		"Number" : {
			params : "(object)",
			text : "Converts an object's value to a number"
		},
		"parseFloat" : {
			params : "(string)",
			text : "Parses a string and returns a floating point number"
		},
		"parseInt" : {
			params : "(string, radix)",
			text : "Parses a string and returns an integer"
		},
		"String" : {
			params : "(object)",
			text : "Converts an object's value to a string"
		},
		"unescape" : {
			params : "(string)",
			text : "Decodes a string encoded by escape()"
		}
	},
	Language : {
		"Infinity" : {
			text : "A numeric value that represents positive or negative infinity"
		},
		"NaN" : {
			text : "Indicates that a value is 'Not a Number'"
		},
		"undefined" : {
			text : "Indicates that a variable has not been assigned a value"
		},
		"var" :		{},
		"function" :{},
		"this" :	{},
		"while" :	{},
		"true" :	{},
		"false" :	{},
		"do" :		{},
		"break" :	{},
		"default" : {},
		"typeof" :	{},
		"null" :	{},
		"return" :	{},
		"arguments":{}
	},
	GlobalObjects : {
		"Array" : {
			"concat" : {
    			params : "(arrayX,arrayX,......,arrayX)", 
    			text : "Joins two or more arrays and returns the result"
			},
			"join" : {
    			params : "(separator)", 
    			text : "Puts all the elements of an array into a string.\n"+
				"The elements will be separated by a specified separator."
			},
			"pop" : {
    			params : "()", 
    			text : "Removes and returns the last element of an array"
			},
			"push" : {
    			params : "(newelement1,newelement2,....,newelementX)", 
    			text : "Adds one or more elements to the end of an array and returns the new length"
			},
			"reverse" : {
    			params : "()", 
    			text : "Reverses the order of the elements in an array"
			},
			"shift" : {
    			params : "()", 
    			text : "Removes and returns the first element of an array"
			},
			"slice" : {
    			params : "(start,end)", 
    			text : "Returns selected elements from an existing array"
			},
			"sort" : {
    			params : "(Sort_Delegate)", 
    			text : "Sorts the elements of an array"
			},
			"splice" : {
    			params : "(index,howmany,element1,.....,elementX)", 
    			text : "Removes and adds new elements to an array"
			},
			"toString" : {
    			params : "()", 
    			text : "Converts an array to a string and returns the result"
			},
			"unshift" : {
    			params : "(newelement1,newelement2,....,newelementX)", 
    			text : "Adds one or more elements to the beginning of an array and returns the new length"
			},
			"valueOf" : {
    			params : "()", 
    			text : "Returns the primitive value of an Array object"
			}
		},
		"Boolean" : {
			"toString" : {
    			params : "()", 
    			text : "Converts an array to a string and returns the result"
			},
			"valueOf" : {
    			params : "()", 
    			text : "Returns the primitive value of an Array object"
			}
		},
		"Date" : {
			"getDate" : {
				text : "Returns the day of the month from a Date object (from 1-31)  "
			},
			"getDay" : {
				text : "Returns the day of the week from a Date object (from 0-6) "
			},
			"getMonth" : {
				text : "Returns the month from a Date object (from 0-11) "
			},
			"getFullYear" : {
				text : "Returns the year, as a four-digit number, from a Date object "
			},
			"getYear" : {
				text : "Returns the year, as a two-digit or a three/four-digit number, depending on the browser. Use getFullYear() instead !! "
			},
			"getHours" : {
				text : "Returns the hour of a Date object (from 0-23) "
			},
			"getMinutes" : {
				text : "Returns the minutes of a Date object (from 0-59) "
			},
			"getSeconds" : {
				text : "Returns the seconds of a Date object (from 0-59) "
			},
			"getMilliseconds" : {
				text : "Returns the milliseconds of a Date object (from 0-999) "
			},
			"getTime" : {
				text : "Returns the number of milliseconds since midnight Jan 1, 1970 "
			},
			"getTimezoneOffset" : {
				text : "Returns the difference in minutes between local time and Greenwich Mean Time (GMT) "
			},
			"getUTCDate" : {
				text : "Returns the day of the month from a Date object according to universal time (from 1-31) "
			},
			"getUTCDay" : {
				text : "Returns the day of the week from a Date object according to universal time (from 0-6) "
			},
			"getUTCMonth" : {
				text : "Returns the month from a Date object according to universal time (from 0-11) "
			},
			"getUTCFullYear" : {
				text : "Returns the four-digit year from a Date object according to universal time "
			},
			"getUTCHours" : {
				text : "Returns the hour of a Date object according to universal time (from 0-23) "
			},
			"getUTCMinutes" : {
				text : "Returns the minutes of a Date object according to universal time (from 0-59) "
			},
			"getUTCSeconds" : {
				text : "Returns the seconds of a Date object according to universal time (from 0-59) "
			},
			"getUTCMilliseconds" : {
				text : "Returns the milliseconds of a Date object according to universal time (from 0-999) "
			},
			"parse" : {
				text : "Takes a date string and returns the number of milliseconds since midnight of January 1, 1970 "
			},
			"setDate" : {
				text : "Sets the day of the month in a Date object (from 1-31) "
			},
			"setMonth" : {
				text : "Sets the month in a Date object (from 0-11) "
			},
			"setFullYear" : {
				text : "Sets the year in a Date object (four digits) "
			},
			"setYear" : {
				text : "Sets the year in the Date object (two or four digits). Use setFullYear() instead !! "
			},
			"setHours" : {
				text : "Sets the hour in a Date object (from 0-23) "
			},
			"setMinutes" : {
				text : "Set the minutes in a Date object (from 0-59) "
			},
			"setSeconds" : {
				text : "Sets the seconds in a Date object (from 0-59) "
			},
			"setMilliseconds" : {
				text : "Sets the milliseconds in a Date object (from 0-999) "
			},
			"setTime" : {
				text : "Calculates a date and time by adding or subtracting a specified number of milliseconds to/from midnight January 1, 1970 "
			},
			"setUTCDate" : {
				text : "Sets the day of the month in a Date object according to universal time (from 1-31) "
			},
			"setUTCMonth" : {
				text : "Sets the month in a Date object according to universal time (from 0-11) "
			},
			"setUTCFullYear" : {
				text : "Sets the year in a Date object according to universal time (four digits) "
			},
			"setUTCHours" : {
				text : "Sets the hour in a Date object according to universal time (from 0-23) "
			},
			"setUTCMinutes" : {
				text : "Set the minutes in a Date object according to universal time (from 0-59) "
			},
			"setUTCSeconds" : {
				text : "Set the seconds in a Date object according to universal time (from 0-59) "
			},
			"setUTCMilliseconds" : {
				text : "Sets the milliseconds in a Date object according to universal time (from 0-999) "
			},
			"toString" : {
				text : "Converts a Date object to a string "
			},
			"toGMTString" : {
				text : "Converts a Date object, according to Greenwich time, to a string. Use toUTCString() instead !! "
			},
			"toUTCString" : {
				text : "Converts a Date object, according to universal time, to a string "
			},
			"toLocaleString" : {
				text : "Converts a Date object, according to local time, to a string "
			},
			"UTC" : {
				text : "Takes a date and returns the number of milliseconds since midnight of January 1, 1970 according to universal time "
			},
			"valueOf" : {
				text : "Returns the primitive value of a Date object "
			}
		},
		"Math" : {
			"abs" : {
				text : "Returns the absolute value of a number  "
			},
			"acos" : {
				text : "Returns the arccosine of a number "
			},
			"asin" : {
				text : "Returns the arcsine of a number "
			},
			"atan" : {
				text : "Returns the arctangent of x as a numeric value between -PI/2 and PI/2 radians "
			},
			"atan2" : {
				text : "Returns the angle theta of an (x,y) point as a numeric value between -PI and PI radians "
			},
			"ceil" : {
				text : "Returns the value of a number rounded upwards to the nearest integer "
			},
			"cos" : {
				text : "Returns the cosine of a number "
			},
			"exp" : {
				text : "Returns the value of Ex "
			},
			"floor" : {
				text : "Returns the value of a number rounded downwards to the nearest integer "
			},
			"log" : {
				text : "Returns the natural logarithm (base E) of a number "
			},
			"max" : {
				text : "Returns the number with the highest value of x and y "
			},
			"min" : {
				text : "Returns the number with the lowest value of x and y "
			},
			"pow" : {
				text : "Returns the value of x to the power of y "
			},
			"random" : {
				text : "Returns a random number between 0 and 1 "
			},
			"round" : {
				text : "Rounds a number to the nearest integer "
			},
			"sin" : {
				text : "Returns the sine of a number "
			},
			"sqrt" : {
				text : "Returns the square root of a number "
			},
			"tan" : {
				text : "Returns the tangent of an angle "
			},
			"valueOf" : {
				text : "Returns the primitive value of a Math object "
			},
			"E" : {
				text : "Returns Euler's constant (approx. 2.718)  "
			},
			"LN2" : {
				text : "Returns the natural logarithm of 2 (approx. 0.693) "
			},
			"LN10" : {
				text : "Returns the natural logarithm of 10 (approx. 2.302) "
			},
			"LOG2E" : {
				text : "Returns the base-2 logarithm of E (approx. 1.414) "
			},
			"LOG10E" : {
				text : "Returns the base-10 logarithm of E (approx. 0.434) "
			},
			"PI" : {
				text : "Returns PI (approx. 3.14159) "
			},
			"SQRT1_2" : {
				text : "Returns the square root of 1/2 (approx. 0.707) "
			},
			"SQRT2" : {
				text : "Returns the square root of 2 (approx. 1.414) "
			}
		},
		"Number" : {
			"toExponential" : {
				text : "Convert the value of the object into an exponential notation  "
			},
			"toFixed" : {
				text : "Round a Number to the specified number of decimals "
			},
			"toPrecision" : {
				text : "Converts the value of the object into an exponential notation if it has more digits than specified "
			},
			"toString" : {
				text : "Converts a Number object to string "
			},
			"valueOf" : {
				text : "Returns the primitive value of a Number object "
			},
			"MAX_VALUE" : {
				text : "Largest number that is less than infinity "
			},
			"MIN_VALUE" : {
				text : "Smallest number that is greater than negative infinity "
			},
			"NaN" : {
				text : "Not a number "
			},
			"NEGATIVE_INFINITY" : {
				text : "Out of range negative number "
			},
			"POSITIVE_INFINITY" : {
				text : "Out of range positive number "
			}
		},
		"String" : {
			"anchor" : {
				text : "Creates an HTML anchor  "
			},
			"big" : {
				text : "Displays a string in a big font "
			},
			"blink" : {
				text : "Displays a blinking string "
			},
			"bold" : {
				text : "Displays a string in bold "
			},
			"charAt" : {
				text : "Returns the character at a specified position "
			},
			"charCodeAt" : {
				text : "Returns the Unicode of the character at a specified position "
			},
			"concat" : {
				text : "Joins two or more strings "
			},
			"fixed" : {
				text : "Displays a string as teletype text "
			},
			"fontcolor" : {
				text : "Displays a string in a specified color "
			},
			"fontsize" : {
				text : "Displays a string in a specified size "
			},
			"fromCharCode" : {
				text : "Takes the specified Unicode values and returns a string "
			},
			"indexOf" : {
				text : "Returns the position of the first occurrence of a specified string value in a string "
			},
			"italics" : {
				text : "Displays a string in italic "
			},
			"lastIndexOf" : {
				text : "Returns the position of the last occurrence of a specified string value, searching backwards from the specified position in a string "
			},
			"link" : {
				text : "Displays a string as a hyperlink "
			},
			"match" : {
				text : "Searches for a specified value in a string "
			},
			"replace" : {
				text : "Replaces some characters with some other characters in a string "
			},
			"search" : {
				text : "Searches a string for a specified value "
			},
			"slice" : {
				text : "Extracts a part of a string and returns the extracted part in a new string "
			},
			"small" : {
				text : "Displays a string in a small font "
			},
			"split" : {
				text : "Splits a string into an array of strings "
			},
			"strike" : {
				text : "Displays a string with a strikethrough "
			},
			"sub" : {
				text : "Displays a string as subscript "
			},
			"substr" : {
				text : "Extracts a specified number of characters in a string, from a start index "
			},
			"substring" : {
				text : "Extracts the characters in a string between two specified indices "
			},
			"sup" : {
				text : "Displays a string as superscript "
			},
			"toLowerCase" : {
				text : "Displays a string in lowercase letters "
			},
			"toUpperCase" : {
				text : "Displays a string in uppercase letters "
			},
			"valueOf" : {
				text : "Returns the primitive value of a String object "
			},
			"length" : {
				text : "Returns the number of characters in a string  "
			}
		},
		"RegExp" : {
			"compile" : {
				text : "Change the regular expression (what to search for)  "
			},
			"exec" : {
				text : "Search a string for a specified value. Returns the found value and remembers the position "
			},
			"test" : {
				text : "Search a string for a specified value. Returns true or false "
			},
			"global" : {
				text : "Specifies if the 'g' modifier is set  "
			},
			"ignoreCase" : {
				text : "Specifies if the 'i' modifier is set "
			},
			"input" : {
				text : "The string on which the pattern match is performed "
			},
			"lastIndex" : {
				text : "An integer specifying the index at which to start the next match "
			},
			"lastMatch" : {
				text : "The last matched characters "
			},
			"lastParen" : {
				text : "The last matched parenthesized substring "
			},
			"leftContext" : {
				text : "The substring in front of the characters most recently matched "
			},
			"multiline" : {
				text : "Specifies if the 'm' modifier is set "
			},
			"prototype" : {
				text : "Allows you to add properties and methods to the object "
			},
			"rightContext" : {
				text : "The substring after the characters most recently matched "
			},
			"source" : {
				text : "The text used for pattern matching "
			}
		}
	}
}

/*******************************************************************
	HTML Entities
*******************************************************************/
HTMLEntities = {
	"&quot;" : {
		type : "HTMLEntity",
		text : "quotation mark  ",
		value : "&ampquot;"
	},
	"&apos;" : {
		type : "HTMLEntity",
		text : "apostrophe  ",
		value : "&ampapos;"
	},
	"&amp;" : {
		type : "HTMLEntity",
		text : "ampersand ",
		value : "&ampamp;"
	},
	"&lt;" : {
		type : "HTMLEntity",
		text : "less-than ",
		value : "&amplt;"
	},
	"&gt;" : {
		type : "HTMLEntity",
		text : "greater-than ",
		value : "&ampgt;"
	},
	"&nbsp;" : {
		type : "HTMLEntity",
		text : "non-breaking space  ",
		value : "&ampnbsp;"
	},
	"&iexcl;" : {
		type : "HTMLEntity",
		text : "inverted exclamation mark ",
		value : "&ampiexcl;"
	},
	"&cent;" : {
		type : "HTMLEntity",
		text : "cent ",
		value : "&ampcent;"
	},
	"&pound;" : {
		type : "HTMLEntity",
		text : "pound ",
		value : "&amppound;"
	},
	"&curren;" : {
		type : "HTMLEntity",
		text : "currency ",
		value : "&ampcurren;"
	},
	"&yen;" : {
		type : "HTMLEntity",
		text : "yen ",
		value : "&ampyen;"
	},
	"&brvbar;" : {
		type : "HTMLEntity",
		text : "broken vertical bar ",
		value : "&ampbrvbar;"
	},
	"&sect;" : {
		type : "HTMLEntity",
		text : "section ",
		value : "&ampsect;"
	},
	"&uml;" : {
		type : "HTMLEntity",
		text : "spacing diaeresis ",
		value : "&ampuml;"
	},
	"&copy;" : {
		type : "HTMLEntity",
		text : "copyright ",
		value : "&ampcopy;"
	},
	"&ordf;" : {
		type : "HTMLEntity",
		text : "feminine ordinal indicator ",
		value : "&ampordf;"
	},
	"&laquo;" : {
		type : "HTMLEntity",
		text : "angle quotation mark (left) ",
		value : "&amplaquo;"
	},
	"&not;" : {
		type : "HTMLEntity",
		text : "negation ",
		value : "&ampnot;"
	},
	"&shy;" : {
		type : "HTMLEntity",
		text : "soft hyphen ",
		value : "&ampshy;"
	},
	"&reg;" : {
		type : "HTMLEntity",
		text : "registered trademark ",
		value : "&ampreg;"
	},
	"&macr;" : {
		type : "HTMLEntity",
		text : "spacing macron ",
		value : "&ampmacr;"
	},
	"&deg;" : {
		type : "HTMLEntity",
		text : "degree ",
		value : "&ampdeg;"
	},
	"&plusmn;" : {
		type : "HTMLEntity",
		text : "plus-or-minus  ",
		value : "&ampplusmn;"
	},
	"&sup2;" : {
		type : "HTMLEntity",
		text : "superscript 2 ",
		value : "&ampsup2;"
	},
	"&sup3;" : {
		type : "HTMLEntity",
		text : "superscript 3 ",
		value : "&ampsup3;"
	},
	"&acute;" : {
		type : "HTMLEntity",
		text : "spacing acute ",
		value : "&ampacute;"
	},
	"&micro;" : {
		type : "HTMLEntity",
		text : "micro ",
		value : "&ampmicro;"
	},
	"&para;" : {
		type : "HTMLEntity",
		text : "paragraph ",
		value : "&amppara;"
	},
	"&middot;" : {
		type : "HTMLEntity",
		text : "middle dot ",
		value : "&ampmiddot;"
	},
	"&cedil;" : {
		type : "HTMLEntity",
		text : "spacing cedilla ",
		value : "&ampcedil;"
	},
	"&sup1;" : {
		type : "HTMLEntity",
		text : "superscript 1 ",
		value : "&ampsup1;"
	},
	"&ordm;" : {
		type : "HTMLEntity",
		text : "masculine ordinal indicator ",
		value : "&ampordm;"
	},
	"&raquo;" : {
		type : "HTMLEntity",
		text : "angle quotation mark (right) ",
		value : "&ampraquo;"
	},
	"&frac14;" : {
		type : "HTMLEntity",
		text : "fraction 1/4 ",
		value : "&ampfrac14;"
	},
	"&frac12;" : {
		type : "HTMLEntity",
		text : "fraction 1/2 ",
		value : "&ampfrac12;"
	},
	"&frac34;" : {
		type : "HTMLEntity",
		text : "fraction 3/4 ",
		value : "&ampfrac34;"
	},
	"&iquest;" : {
		type : "HTMLEntity",
		text : "inverted question mark ",
		value : "&ampiquest;"
	},
	"&times;" : {
		type : "HTMLEntity",
		text : "multiplication ",
		value : "&amptimes;"
	},
	"&divide;" : {
		type : "HTMLEntity",
		text : "division ",
		value : "&ampdivide;"
	},
	"&Agrave;" : {
		type : "HTMLEntity",
		text : "capital a, grave accent  ",
		value : "&ampAgrave;"
	},
	"&Aacute;" : {
		type : "HTMLEntity",
		text : "capital a, acute accent ",
		value : "&ampAacute;"
	},
	"&Acirc;" : {
		type : "HTMLEntity",
		text : "capital a, circumflex accent ",
		value : "&ampAcirc;"
	},
	"&Atilde;" : {
		type : "HTMLEntity",
		text : "capital a, tilde ",
		value : "&ampAtilde;"
	},
	"&Auml;" : {
		type : "HTMLEntity",
		text : "capital a, umlaut mark ",
		value : "&ampAuml;"
	},
	"&Aring;" : {
		type : "HTMLEntity",
		text : "capital a, ring ",
		value : "&ampAring;"
	},
	"&AElig;" : {
		type : "HTMLEntity",
		text : "capital ae ",
		value : "&ampAElig;"
	},
	"&Ccedil;" : {
		type : "HTMLEntity",
		text : "capital c, cedilla ",
		value : "&ampCcedil;"
	},
	"&Egrave;" : {
		type : "HTMLEntity",
		text : "capital e, grave accent ",
		value : "&ampEgrave;"
	},
	"&Eacute;" : {
		type : "HTMLEntity",
		text : "capital e, acute accent ",
		value : "&ampEacute;"
	},
	"&Ecirc;" : {
		type : "HTMLEntity",
		text : "capital e, circumflex accent ",
		value : "&ampEcirc;"
	},
	"&Euml;" : {
		type : "HTMLEntity",
		text : "capital e, umlaut mark ",
		value : "&ampEuml;"
	},
	"&Igrave;" : {
		type : "HTMLEntity",
		text : "capital i, grave accent ",
		value : "&ampIgrave;"
	},
	"&Iacute;" : {
		type : "HTMLEntity",
		text : "capital i, acute accent ",
		value : "&ampIacute;"
	},
	"&Icirc;" : {
		type : "HTMLEntity",
		text : "capital i, circumflex accent ",
		value : "&ampIcirc;"
	},
	"&Iuml;" : {
		type : "HTMLEntity",
		text : "capital i, umlaut mark ",
		value : "&ampIuml;"
	},
	"&ETH;" : {
		type : "HTMLEntity",
		text : "capital eth, Icelandic ",
		value : "&ampETH;"
	},
	"&Ntilde;" : {
		type : "HTMLEntity",
		text : "capital n, tilde ",
		value : "&ampNtilde;"
	},
	"&Ograve;" : {
		type : "HTMLEntity",
		text : "capital o, grave accent ",
		value : "&ampOgrave;"
	},
	"&Oacute;" : {
		type : "HTMLEntity",
		text : "capital o, acute accent ",
		value : "&ampOacute;"
	},
	"&Ocirc;" : {
		type : "HTMLEntity",
		text : "capital o, circumflex accent ",
		value : "&ampOcirc;"
	},
	"&Otilde;" : {
		type : "HTMLEntity",
		text : "capital o, tilde ",
		value : "&ampOtilde;"
	},
	"&Ouml;" : {
		type : "HTMLEntity",
		text : "capital o, umlaut mark ",
		value : "&ampOuml;"
	},
	"&Oslash;" : {
		type : "HTMLEntity",
		text : "capital o, slash ",
		value : "&ampOslash;"
	},
	"&Ugrave;" : {
		type : "HTMLEntity",
		text : "capital u, grave accent ",
		value : "&ampUgrave;"
	},
	"&Uacute;" : {
		type : "HTMLEntity",
		text : "capital u, acute accent ",
		value : "&ampUacute;"
	},
	"&Ucirc;" : {
		type : "HTMLEntity",
		text : "capital u, circumflex accent ",
		value : "&ampUcirc;"
	},
	"&Uuml;" : {
		type : "HTMLEntity",
		text : "capital u, umlaut mark ",
		value : "&ampUuml;"
	},
	"&Yacute;" : {
		type : "HTMLEntity",
		text : "capital y, acute accent ",
		value : "&ampYacute;"
	},
	"&THORN;" : {
		type : "HTMLEntity",
		text : "capital THORN, Icelandic ",
		value : "&ampTHORN;"
	},
	"&szlig;" : {
		type : "HTMLEntity",
		text : "small sharp s, German ",
		value : "&ampszlig;"
	},
	"&agrave;" : {
		type : "HTMLEntity",
		text : "small a, grave accent ",
		value : "&ampagrave;"
	},
	"&aacute;" : {
		type : "HTMLEntity",
		text : "small a, acute accent ",
		value : "&ampaacute;"
	},
	"&acirc;" : {
		type : "HTMLEntity",
		text : "small a, circumflex accent ",
		value : "&ampacirc;"
	},
	"&atilde;" : {
		type : "HTMLEntity",
		text : "small a, tilde ",
		value : "&ampatilde;"
	},
	"&auml;" : {
		type : "HTMLEntity",
		text : "small a, umlaut mark ",
		value : "&ampauml;"
	},
	"&aring;" : {
		type : "HTMLEntity",
		text : "small a, ring ",
		value : "&amparing;"
	},
	"&aelig;" : {
		type : "HTMLEntity",
		text : "small ae ",
		value : "&ampaelig;"
	},
	"&ccedil;" : {
		type : "HTMLEntity",
		text : "small c, cedilla ",
		value : "&ampccedil;"
	},
	"&egrave;" : {
		type : "HTMLEntity",
		text : "small e, grave accent ",
		value : "&ampegrave;"
	},
	"&eacute;" : {
		type : "HTMLEntity",
		text : "small e, acute accent ",
		value : "&ampeacute;"
	},
	"&ecirc;" : {
		type : "HTMLEntity",
		text : "small e, circumflex accent ",
		value : "&ampecirc;"
	},
	"&euml;" : {
		type : "HTMLEntity",
		text : "small e, umlaut mark ",
		value : "&ampeuml;"
	},
	"&igrave;" : {
		type : "HTMLEntity",
		text : "small i, grave accent ",
		value : "&ampigrave;"
	},
	"&iacute;" : {
		type : "HTMLEntity",
		text : "small i, acute accent ",
		value : "&ampiacute;"
	},
	"&icirc;" : {
		type : "HTMLEntity",
		text : "small i, circumflex accent ",
		value : "&ampicirc;"
	},
	"&iuml;" : {
		type : "HTMLEntity",
		text : "small i, umlaut mark ",
		value : "&ampiuml;"
	},
	"&eth;" : {
		type : "HTMLEntity",
		text : "small eth, Icelandic ",
		value : "&ampeth;"
	},
	"&ntilde;" : {
		type : "HTMLEntity",
		text : "small n, tilde ",
		value : "&ampntilde;"
	},
	"&ograve;" : {
		type : "HTMLEntity",
		text : "small o, grave accent ",
		value : "&ampograve;"
	},
	"&oacute;" : {
		type : "HTMLEntity",
		text : "small o, acute accent ",
		value : "&ampoacute;"
	},
	"&ocirc;" : {
		type : "HTMLEntity",
		text : "small o, circumflex accent ",
		value : "&ampocirc;"
	},
	"&otilde;" : {
		type : "HTMLEntity",
		text : "small o, tilde ",
		value : "&ampotilde;"
	},
	"&ouml;" : {
		type : "HTMLEntity",
		text : "small o, umlaut mark ",
		value : "&ampouml;"
	},
	"&oslash;" : {
		type : "HTMLEntity",
		text : "small o, slash ",
		value : "&amposlash;"
	},
	"&ugrave;" : {
		type : "HTMLEntity",
		text : "small u, grave accent ",
		value : "&ampugrave;"
	},
	"&uacute;" : {
		type : "HTMLEntity",
		text : "small u, acute accent ",
		value : "&ampuacute;"
	},
	"&ucirc;" : {
		type : "HTMLEntity",
		text : "small u, circumflex accent ",
		value : "&ampucirc;"
	},
	"&uuml;" : {
		type : "HTMLEntity",
		text : "small u, umlaut mark ",
		value : "&ampuuml;"
	},
	"&yacute;" : {
		type : "HTMLEntity",
		text : "small y, acute accent ",
		value : "&ampyacute;"
	},
	"&thorn;" : {
		type : "HTMLEntity",
		text : "small thorn, Icelandic ",
		value : "&ampthorn;"
	},
	"&yuml;" : {
		type : "HTMLEntity",
		text : "small y, umlaut mark ",
		value : "&ampyuml;"
	}
};

/*******************************************************************
	CSS Definition
*******************************************************************/
var CSSBorderStyles = ["none","hidden","dotted","dashed","solid","double","groove","ridge","inset","outset"];
var CSSColors = ["Transparent","rgb(,,)","AliceBlue","AntiqueWhite","Aqua","Aquamarine","Azure","Beige","Bisque","Black","BlanchedAlmond","Blue","BlueViolet","Brown","BurlyWood","CadetBlue","Chartreuse","Chocolate","Coral","CornflowerBlue","Cornsilk","Crimson","Cyan","DarkBlue","DarkCyan","DarkGoldenRod","DarkGray","DarkGrey","DarkGreen","DarkKhaki","DarkMagenta","DarkOliveGreen","Darkorange","DarkOrchid","DarkRed","DarkSalmon","DarkSeaGreen","DarkSlateBlue","DarkSlateGray","DarkSlateGrey","DarkTurquoise","DarkViolet","DeepPink","DeepSkyBlue","DimGray","DimGrey","DodgerBlue","FireBrick","FloralWhite","ForestGreen","Fuchsia","Gainsboro","GhostWhite","Gold","GoldenRod","Gray","Grey","Green","GreenYellow","HoneyDew","HotPink","IndianRed","Indigo","Ivory","Khaki","Lavender","LavenderBlush","LawnGreen","LemonChiffon","LightBlue","LightCoral","LightCyan","LightGoldenRodYellow","LightGray","LightGrey","LightGreen","LightPink","LightSalmon","LightSeaGreen","LightSkyBlue","LightSlateGray","LightSlateGrey","LightSteelBlue","LightYellow","Lime","LimeGreen","Linen","Magenta","Maroon","MediumAquaMarine","MediumBlue","MediumOrchid","MediumPurple","MediumSeaGreen","MediumSlateBlue","MediumSpringGreen","MediumTurquoise","MediumVioletRed","MidnightBlue","MintCream","MistyRose","Moccasin","NavajoWhite","Navy","OldLace","Olive","OliveDrab","Orange","OrangeRed","Orchid","PaleGoldenRod","PaleGreen","PaleTurquoise","PaleVioletRed","PapayaWhip","PeachPuff","Peru","Pink","Plum","PowderBlue","Purple","Red","RosyBrown","RoyalBlue","SaddleBrown","Salmon","SandyBrown","SeaGreen","SeaShell","Sienna","Silver","SkyBlue","SlateBlue","SlateGray","SlateGrey","Snow","SpringGreen","SteelBlue","Tan","Teal","Thistle","Tomato","Turquoise","Violet","Wheat","White","WhiteSmoke","Yellow","YellowGreen"];
var CSSUnits = ["%","in","cm","mm","em","ex","pt","pc","px"];
var CSSLength = ["auto"].concat(CSSUnits);

CSSDefinition = {
	"azimuth" : [],
	"background" : [],
	"background-attachment" : [],
	"background-color" : [].concat(CSSColors),
	"background-image" : [],
	"background-position" : ["top left","top center","top right","center left","center center","center right","bottom left","bottom center","bottom right"],
	"background-repeat" : ["repeat","repeat-x","repeat-y","no-repeat"],
	"border" : [].concat(CSSColors,CSSBorderStyles),
	"border-bottom" : [].concat(CSSColors,CSSBorderStyles),
	"border-bottom-color" : [].concat(CSSColors),
	"border-bottom-style" : [].concat(CSSBorderStyles),
	"border-bottom-width" : [].concat(CSSUnits),
	"border-collapse" : ["collapse","separate"],
	"border-color" : [].concat(CSSColors),
	"border-left" : [].concat(CSSColors,CSSBorderStyles),
	"border-left-color" : [].concat(CSSColors),
	"border-left-style" : [].concat(CSSBorderStyles),
	"border-left-width" : [].concat(CSSUnits),
	"border-right" : [].concat(CSSColors,CSSBorderStyles),
	"border-right-color" : [].concat(CSSColors),
	"border-right-style" : [].concat(CSSBorderStyles),
	"border-right-width" : [].concat(CSSUnits),
	"border-spacing" : [],
	"border-style" : [].concat(CSSBorderStyles),
	"border-top" : [].concat(CSSColors,CSSBorderStyles),
	"border-top-color" : [].concat(CSSColors),
	"border-top-style" : [].concat(CSSBorderStyles),
	"border-top-width" : [].concat(CSSUnits),
	"border-width" : ["thin","medium","thick"],
	"bottom" : [].concat(CSSLength),
	"caption-side" : ["top","bottom","left","right"],
	"clear" : ["left","right","both","none"],
	"clip" : [],
	"color" : [].concat(CSSColors),
	"content" : [],
	"counter-increment" : [],
	"counter-reset" : [],
	"cue" : [],
	"cue-after" : [],
	"cue-before" : [],
	"cursor" : ["url","auto","crosshair","default","pointer","move","e-resize","ne-resize","nw-resize","n-resize","se-resize","sw-resize","s-resize","w-resize","text","wait","help"],
	"direction" : ["ltr","rtl"],
	"display" : ["none","inline","block","list-item","run-in","compact","marker","table","inline-table","table-row-group","table-header-group","table-footer-group","table-row","table-column-group","table-column","table-cell","table-caption"],
	"elevation" : [],
	"empty-cells" : ["show","hide"],
	"float" : ["left","right","none"],
	"font" : [],
	"font-family" : [],
	"font-size" : ["xx-small","x-small","small","medium","large","x-large","xx-large","smaller","larger"],
	"font-size-adjust" : [],
	"font-stretch" : ["normal","wider","narrower","ultra-condensed","extra-condensed","condensed","semi-condensed","semi-expanded","expanded","extra-expanded","ultra-expanded"],
	"font-style" : ["normal","italic","oblique"],
	"font-variant" : ["normal","small-caps"],
	"font-weight" : ["normal","bold","bolder","lighter","100","200","300","400","500","600","700","800","900"],
	"height" : [].concat(CSSLength),
	"left" : [].concat(CSSLength),
	"letter-spacing" : [],
	"line-height" : ["normal"].concat(CSSUnits),
	"list-style" : [],
	"list-style-image" : ["none"],
	"list-style-position" : ["inside","outside"],
	"list-style-type" : ["none","disc","circle","square","decimal","decimal-leading-zero","lower-roman","upper-roman","lower-alpha","upper-alpha","lower-greek","lower-latin","upper-latin","hebrew","armenian","georgian","cjk-ideographic","hiragana","katakana","hiragana-iroha","katakana-iroha"],
	"margin" : [],
	"margin-bottom" : [],
	"margin-left" : [],
	"margin-right" : [],
	"margin-top" : [],
	"max-height" : ["none"].concat(CSSUnits),
	"max-width" : ["none"].concat(CSSUnits),
	"min-height" : ["none"].concat(CSSUnits),
	"min-width" : ["none"].concat(CSSUnits),
	"orphans" : [],
	"outline" : [],
	"outline-color" : [],
	"outline-style" : ["none","dotted","dashed","solid","double","groove","ridge","inset","outset"],
	"outline-width" : ["thin","medium","thick"],
	"overflow" : ["visible","hidden","scroll","auto"],
	"padding" : [],
	"padding-bottom" : [],
	"padding-left" : [],
	"padding-right" : [],
	"padding-top" : [],
	"page-break-after" : [],
	"page-break-before" : [],
	"page-break-inside" : [],
	"pause" : [],
	"pause-after" : [],
	"pause-before" : [],
	"pitch" : [],
	"pitch-range" : [],
	"play-during" : [],
	"position" : ["static","relative","absolute","fixed"],
	"quotes" : [],
	"richness" : [],
	"right" : [].concat(CSSLength),
	"speak" : [],
	"speak-header" : [],
	"speak-numeral" : [],
	"speak-punctuation" : [],
	"speech-rate" : [],
	"stress" : [],
	"table-layout" : [],
	"text-align" : ["left","right","center","justify"],
	"text-decoration" : ["none","underline","overline","line-through","blink"],
	"text-indent" : [],
	"text-transform" : ["none","capitalize","uppercase","lowercase"],
	"top" : [].concat(CSSLength),
	"unicode-bidi" : [],
	"vertical-align" : ["baseline","sub","super","top","text-top","middle","bottom","text-bottom"],
	"visibility" : ["visible","hidden","collapse"],
	"voice-family" : [],
	"volume" : [],
	"white-space" : ["normal","pre","nowrap"],
	"widows " : [],
	"width" : [],
	"word-spacing" : [],
	"z-index" : []
};

/*******************************************************************
	HTML Definition
*******************************************************************/

var HTMLWindowEvents = ["onload","onunload"];
var HTMLFormElementEvents = ["onchange","onsubmit","onreset","onselect","onblur","onfocus"];
var HTMLKeyboardEvents = ["onkeydown","onkeypress","onkeyup"];
var HTMLMouseEvents = ["onclick","ondblclick","onmousedown","onmousemove","onmouseover","onmouseout","onmouseup"];

var HTMLElementEvents = [].concat(HTMLMouseEvents, HTMLKeyboardEvents);

var FishyEvents = ["onload","onfocus","onreset","onresize","onselect","onsubmit","onunload"];
var BaseElements = ["dir", "lang", "xml:lang"];
var BlockElemets = ["id", "class", "title", "style"];
var Charsets = ["UTF-8", "ISO-8859-1"];
var HTMLStyleRelations = ["alternate","appendix","bookmark","chapter","contents","copyright","glossary",
						"help","home","index","next","prev","section","start","stylesheet","subsection"];
var HTMLLinkRelations = ["alternate","stylesheet","start","next","prev","contents","index","glossary",
						"copyright","chapter","section","subsection","appendix","help","bookmark"];
HMTLDefinition = {
	"a" : {
		"charset" : [].concat(Charsets),
		"coords" : [],
		"href" : [],
		"hreflang" : [],
		"name" : [],
		"rel" : [].concat(HTMLLinkRelations),
		"rev" : [].concat(HTMLLinkRelations),
		"shape" : ["rect","rectangle","circ","circle","poly","polygon"],
		"target" : ["_blank","_parent","_self","_top"],
		"type" : []
	},
	"br"   : [], 
	"body" : [].concat(BaseElements, BlockElemets,HTMLWindowEvents), 
	"div"  : [].concat(HTMLElementEvents, BlockElemets),
	"fieldset" : [].concat(HTMLElementEvents, BlockElemets), 
	"form" : {
		"action" : [],
		"accept" : [],
		"accept-charset" : ["UTF-8", "ISO-8859-1"],
		"enctype" : ["multipart/form-data","application/x-www-form-urlencoded"],
		"method" : ["GET", "POST"],
		"name" : [],
		"target" : ["_blank","_parent","_self","_top"]
	}.InsertDefs(BaseElements, BlockElemets,HTMLMouseEvents,HTMLKeyboardEvents,["onsubmit","onreset"]),
	"html" : {
		"dir" : [], 
		"lang" : [], 
		"xml:lang" : [],
		"xmlns" : ["http://www.w3.org/1999/xhtml"]
	},
	"head" : ["profile"].concat(BaseElements), 
	"input" : {
		"accept" : [],
		"align" : ["left","right","top","texttop","middle","absmiddle","baseline","bottom","absbottom"],
		"alt" : [],
		"checked" : ["checked"],
		"disabled" : ["disabled"],
		"maxlength" : [],
		"name" : [],
		"readonly" : [],
		"size" : [],
		"src" : [],
		"type" : ["button","checkbox","file","hidden","image","password","radio","reset","submit","text"],
		"value" : []
	}.InsertDefs(HTMLFormElementEvents, BaseElements, BlockElemets),
	"legend" : ["align"].concat(HTMLElementEvents, BlockElemets),
	"link" : {
		"charset" : ["UTF8", "ISO-8859-1"],
		"href" : [],
		"hreflang" : [],
		"media" : ["screen","tty","tv","projection","handheld","print","braille","aural","all"],
		"rel" : [].concat(HTMLStyleRelations),
		"rev" : [].concat(HTMLStyleRelations),
		"target" : ["_blank","_self","_top","_parent"],
		"type" : ["text/css", "text/javascript", "image/gif"]
	},
	"meta" : {
		"http-equiv" : ["content-type","expires","refresh","set-cookie"],
		"name" : ["author","description","keywords","generator","revised"],
		"content" : ["some text"],
		"scheme" : ["some text"]
	}, 
	"hr" : {
		"noshade" : ["noshade"]
	},
	"script" : {
		"type" : ["text/ecmascript","text/javascript","application/ecmascript","application/javascript","text/vbscript"],
		"charset" : ["UTF-8", "ISO-8859-1"],
		"defer" : ["defer"],
		"language" : ["javascript","livescript","vbscript"],
		"src" : []
	},
	"span" : [].concat(HTMLElementEvents, BlockElemets),
	"style" : {
		"type" : ["text/css"],
		"media" : ["screen","tty","tv","projection","handheld","print","braille","aural","all"]
	},
	"table" : {
		"align" : ["left","center","right"],
		"bgcolor" : [],
		"border" : [],
		"cellpadding" : [],
		"cellspacing" : [],
		"frame" : ["void","above","below","hsides","lhs","rhs","vsides","box","border"],
		"rules" : ["none","groups","rows","cols","all"],
		"summary" : [],
		"width" : []
	}.InsertDefs(BaseElements, BlockElemets,HTMLMouseEvents,HTMLKeyboardEvents)
};
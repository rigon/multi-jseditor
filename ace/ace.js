/**************************************************************************
 * Library to handle multiple JavaScript-based source code editors - https://github.com/rigon/multi-jseditor
 * Copyright (C) 2017  rigon<ricardompgoncalves@gmail.com>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *************************************************************************/

multieditor.prototype.editor_class = function(element) {

	this.themes = {
		ambiance: "Ambiance",
		chaos: "Chaos",
		chrome: "Chrome",
		clouds: "Clouds",
		clouds_midnight: "Clouds Midnight",
		cobalt: "Cobalt",
		crimson_editor: "Crimson Editor",
		dawn: "Dawn",
		dreamweaver: "Dreamweaver",
		eclipse: "Eclipse",
		github: "GitHub",
		gob: "Gob",
		idle_fingers: "Idle Fingers",
		iplastic: "IPlastic",
		katzenmilch: "Katzenmilch",
		kr_theme: "Kr Theme",
		kuroir: "Kuroir",
		merbivore: "Merbivore",
		merbivore_soft: "Merbivore Soft",
		mono_industrial: "Mono Industrial",
		monokai: "Monokai",
		pastel_on_dark: "Pastel On Dark",
		solarized_dark: "Solarized Dark",
		solarized_light: "Solarized Light",
		sqlserver: "SQL Server",
		terminal: "Terminal",
		textmate: "TextMate",
		tomorrow: "Tomorrow",
		tomorrow_night: "Tomorrow Night",
		tomorrow_night_blue: "Tomorrow Night Blue",
		tomorrow_night_bright: "Tomorrow Night Bright",
		tomorrow_night_eighties: "Tomorrow Night Eighties",
		twilight: "Twilight",
		vibrant_ink: "Vibrant Ink",
		xcode: "XCode"
	}

	this.langs = {
		abap: "ABAP",
		abc: "ABC",
		actionscript: "ActionScript",
		ada: "ADA",
		apache_conf: "Apache Conf",
		asciidoc: "AsciiDoc",
		assembly_x86: "Assembly x86",
		autohotkey: "AutoHotKey",
		batchfile: "BatchFile",
		bro: "Bro",
		c_cpp: "C and C++",
		c9search: "C9Search",
		cirru: "Cirru",
		clojure: "Clojure",
		cobol: "Cobol",
		coffee: "CoffeeScript",
		coldfusion: "ColdFusion",
		csharp: "C#",
		css: "CSS",
		curly: "Curly",
		d: "D",
		dart: "Dart",
		diff: "Diff",
		django: "Django",
		dockerfile: "Dockerfile",
		dot: "Dot",
		drools: "Drools",
		dummy: "Dummy",
		dummysyntax: "DummySyntax",
		eiffel: "Eiffel",
		ejs: "EJS",
		elixir: "Elixir",
		elm: "Elm",
		erlang: "Erlang",
		forth: "Forth",
		fortran: "Fortran",
		ftl: "FreeMarker",
		gcode: "Gcode",
		gherkin: "Gherkin",
		gitignore: "Gitignore",
		glsl: "Glsl",
		gobstones: "Gobstones",
		golang: "Go",
		groovy: "Groovy",
		haml: "HAML",
		handlebars: "Handlebars",
		haskell: "Haskell",
		haskell_cabal: "Haskell Cabal",
		haxe: "haXe",
		hjson: "Hjson",
		html: "HTML",
		html_elixir: "HTML (Elixir)",
		html_ruby: "HTML (Ruby)",
		ini: "INI",
		io: "Io",
		jack: "Jack",
		jade: "Jade",
		java: "Java",
		javascript: "JavaScript",
		json: "JSON",
		jsoniq: "JSONiq",
		jsp: "JSP",
		jsx: "JSX",
		julia: "Julia",
		kotlin: "Kotlin",
		latex: "LaTeX",
		less: "LESS",
		liquid: "Liquid",
		lisp: "Lisp",
		livescript: "LiveScript",
		logiql: "LogiQL",
		lsl: "LSL",
		lua: "Lua",
		luapage: "LuaPage",
		lucene: "Lucene",
		makefile: "Makefile",
		markdown: "Markdown",
		mask: "Mask",
		matlab: "MATLAB",
		maze: "Maze",
		mel: "MEL",
		mushcode: "MUSHCode",
		mysql: "MySQL",
		nix: "Nix",
		nsis: "NSIS",
		objectivec: "Objective-C",
		ocaml: "OCaml",
		pascal: "Pascal",
		perl: "Perl",
		pgsql: "pgSQL",
		php: "PHP",
		powershell: "Powershell",
		praat: "Praat",
		prolog: "Prolog",
		properties: "Properties",
		protobuf: "Protobuf",
		python: "Python",
		r: "R",
		razor: "Razor",
		rdoc: "RDoc",
		rhtml: "RHTML",
		rst: "RST",
		ruby: "Ruby",
		rust: "Rust",
		sass: "SASS",
		scad: "SCAD",
		scala: "Scala",
		scheme: "Scheme",
		scss: "SCSS",
		sh: "SH",
		sjs: "SJS",
		smarty: "Smarty",
		snippets: "snippets",
		soy_template: "Soy Template",
		space: "Space",
		sql: "SQL",
		sqlserver: "SQLServer",
		stylus: "Stylus",
		svg: "SVG",
		swift: "Swift",
		tcl: "Tcl",
		tex: "Tex",
		text: "Text",
		textile: "Textile",
		toml: "Toml",
		tsx: "TSX",
		twig: "Twig",
		typescript: "Typescript",
		vala: "Vala",
		vbscript: "VBScript",
		velocity: "Velocity",
		verilog: "Verilog",
		vhdl: "VHDL",
		wollok: "Wollok",
		xml: "XML",
		xquery: "XQuery",
		yaml: "YAML"
	}

	this.setOptions = function(options) {
		for(var name in options) {
			var value = options;

			switch(name) {
				case "theme": this.setTheme(value); break;
				case "lang": this.setLang(value); break;
				default:
					throw "Option not supported: " + name;
			}
		}
	}


	// Set theme
	this.setTheme = function(theme) {
		if(!(theme in this.themes))
			throw "Theme " + theme + " is not supported";
		this.obj.setTheme("ace/theme/" + theme);
	}

	// Set Language
	this.setLang = function(lang) {
		if(!(lang in this.langs))
			throw "Language mode " + lang + " is not supported";
		this.obj.getSession().setMode("ace/mode/" + lang);
	}

	
	this.element = element;

	// Check if Ace editor is loaded
	if(typeof ace !== "object")
		throw "Ace editor is not loaded";

	// Create Ace editor
	this.obj = ace.edit(element);
}

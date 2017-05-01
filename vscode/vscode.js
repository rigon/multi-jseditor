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
		'vs': "Visual Studio",
		'vs-dark': "Visual Studio Dark",
		'hc-black': "High Contrast Dark"
	}

	this.langs = {
		bat: "Batch",
		c: "C",
		coffeescript: "CoffeeScript",
		cpp: "C++",
		csharp: "C#",
		css: "CSS",
		dockerfile: "DockerFile",
		fsharp: "F#",
		go: "Go",
		handlebars: "Handlebars",
		html: "HTML",
		ini: ".ini",
		jade: "Jade",
		java: "Java",
		javascript: "JavaScript",
		json: "JSON",
		less: "LESS",
		lua: "Lua",
		markdown: "Markdown",
		'objective-c': "Objective-C",
		php: "PHP",
		plaintext: "Plain Text",
		postiats: "Postiats",
		powershell: "Power Shell",
		python: "Python",
		r: "R",
		razor: "Razor",
		ruby: "Ruby",
		scss: "SCSS",
		sql: "SQL",
		swift: "Swift",
		typescript: "TypeScript",
		vb: "Visual Basic",
		xml: "XML",
		yaml: "YAML"
	}

	this.setOptions = function(options) {
		var vsOptions = {}
		console.log(options);

		for(var name in options) {
			var value = options[name];

			switch(name) {
				case "theme": vsOptions.theme = value; break;
				case "lang": vsOptions.language = value; break;
				default:
					throw "Option not supported: " + name;
			}
		}

		require.config({ paths: { 'vs': 'bower_components/monaco-editor/release/min/vs' }});
		require(['vs/editor/editor.main'], function() {
			var editor = monaco.editor.create(element, vsOptions);
		});
	}

	this.element = element;
}

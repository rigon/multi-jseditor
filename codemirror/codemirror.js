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
	}

	this.langs = {
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

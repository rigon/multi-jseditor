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

// https://en.wikipedia.org/wiki/Comparison_of_JavaScript-based_source_code_editors

function multieditor(container, customOptions) {
	var self = this;					// Reference for this object

	this.container = container;			// HTML element where to place the editor
	this.editor;						// Handler for Editor
	this.actions;						// General actions for the selected language
	this.options = {					// List of default options
		editor: "textarea",
		lang: "plaintext",
	};

	this.isEditorLoaded = false;
	this.isActionsLoaded = false;

	this.processOptions = function(newOptions) {
		// Incompatible data type
		if(typeof newOptions !== "object") return;

		// Iterate over newOptions
		for(var attribute in newOptions) {
			// Copy values to in options
			this.options[attribute] = newOptions[attribute];
		}
	}

	this.loadEditor = function(editor) {
		$.getScript(editor + "/" + editor + ".js", function (script, textStatus, jqXHR) {
			self.isEditorLoaded = true;
			self.create();
		});
	}
	this.loadActions = function(lang) {
		$.getScript("actions/" + lang + ".js", function (script, textStatus, jqXHR) {
			self.isActionsLoaded = true;
			self.create();
		});
	}

	this.create = function() {
		// If editor or actions are not loaded
		if(!this.isEditorLoaded || !this.isActionsLoaded) return;

		console.log("Let's create the editor");

		this.editor = new this.editor_class(this.container);
		this.actions = new this.actions_class(this.editor);
	}

	// Process options
	this.processOptions(customOptions);
	// Load editor
	this.loadEditor(this.options.editor);
	// Load actions
	this.loadActions(this.options.lang);
}

jQuery.fn.extend({
	multieditor: function(options) {
		// If custom options not provided
		if(typeof options === "undefined")
			options = {};

		return this.each(function() {
			// Deep copy of options
			return new multieditor(this, jQuery.extend(true, {}, options));
		});
	}
});

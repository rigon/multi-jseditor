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

function multieditor(container, customOptions) {
	var self = this;					// Reference for this object

	this.container = container;			// HTML element where to place the editor
	this.editor;						// Handler for Editor
	this.actions;						// General actions for the selected language
	this.options = {					// List of default options
		editor: "textarea",
		lang: "plaintext",
		target: "desktop",
		editors: { default: {}}
	};

	this.isEditorLoaded = false;
	this.isActionsLoaded = false;

	this.processOptions = function(newOptions) {
		// Incompatible data type
		if(typeof newOptions !== "object") return;

		// Replace default list of editors
		if(typeof newOptions.editors === "object")
			this.options.editors = newOptions.editors;
		
		// Iterate over newOptions
		for(var attribute in newOptions) {
			// Skip editors option
			if(attribute === "editors") continue;

			// Copy values to in options
			this.options[attribute] = newOptions[attribute];

			// Copy general options to all editors
			for(editor in this.options.editors)
				if(typeof this.options.editors[editor][attribute] === "undefined")	// Copy option if not present
					this.options.editors[editor][attribute] = newOptions[attribute];
		}
	}

	this.selectEditor = function(list) {
		var selected = list[Object.keys(list)[0]];

		var md = new MobileDetect(window.navigator.userAgent);
		var isMobile = (md.mobile() != null);

		for(var editorId in list) {
			var editor = list[editorId];
			// Conditions to select the best editor
			if(isMobile && editor.target == "desktop")	// Mobile browser
				selected = editor;
		}

		return selected;
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

		this.editor = new this.editor_class(this.container);
		this.actions = new this.actions_class(this.editor);

		this.editor.setOptions({
			lang: this.options.lang,
			theme: this.options.theme
		});
	}

	// Process options
	this.processOptions(customOptions);
	var selectedEditor = this.selectEditor(this.options.editors);
	// Load editor
	this.loadEditor(selectedEditor.editor);
	// Load actions
	this.loadActions(selectedEditor.lang);
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

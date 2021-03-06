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

function multieditor_plaintext(editor) {
	this.editor = editor;
	
	this.bold	= function() { this.editor.addText("****"); this.editor.moveCursor(2); }
	this.italic	= function() { this.editor.addText("**"); this.editor.moveCursor(2); }
	this.quote	= function() { this.editor.addText("\n\n> "); }
	this.code	= function() { this.editor.addText("\n\n    "); }
	this.ul		= function() { this.editor.addText("\n\n - "); }
	this.ol		= function() { this.editor.addText("\n\n 1. "); }
	this.header	= function() { this.editor.addText("\n\n# "); }
	this.undo	= function() { this.editor.undo(); }
	this.redo	= function() { this.editor.redo(); }
}

// Set actions for this language
multieditor.prototype.actions_class = multieditor_plaintext;

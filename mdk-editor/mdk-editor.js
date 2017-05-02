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
		'style1.css': "White",
		'style2.css': "Black",
		'style3.css': "Chalkboard",
		'style4.css': "Neutral (VS)",
		'style5.css': "Dreamweaver"
	}

	this.langs = {
		Javascript: "Javascrip",
		XML: "XML",
		HTML: "HTML (test)",
		CSS: "CSS",
		Text: "Text"
	}

	this.setOptions = function(options) {

	}

	this.element = element;

	$(element).append('\
		<div id="editor">\
			<div id="contentContainer">\
				<div id="contentContatiner">\
					<div id="secondary"></div>\
					<div id="content"></div>\
					<div id="errors"></div>\
				</div>\
				\
				<div id="cursorContainer">\
					<div id="curser">&nbsp;</div>\
					<div id="pre1">&nbsp;</div>\
					<div id="pre2">&nbsp;</div>\
					<div id="post1">&nbsp;</div>\
					<div id="post2">&nbsp;</div>\
					<div id="xmlStart">&nbsp;</div>\
					<div id="xmlFinish">&nbsp;</div>\
				</div>\
			</div>\
			\
			<div id="linenumbers"></div>\
			<div id="scrollbarX"></div>\
			<div id="scrollbarX_bg"></div>\
			<div id="editorinfo"></div>\
			<div id="scrollbarY"></div>\
			<div id="ContextMenu"></div>\
			<div id="Intellisense"></div>\
			<div id="errorexplain"></div>\
		</div>');
	
	createMDKEditor();
}

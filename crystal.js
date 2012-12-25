
(function ($) {
	"use strict";
	$(document).ready(function () {
		$('.collapsible>:first-child').on('click', function () {
			$(this).parent().toggleClass('collapsed');
		});
		crystal.init();
	});
	var crystal = {
		settings: {
			width: 5,
			height: 5,
			colors: ["red", "green", "blue"]
		},
		objs: {
			output: $('ul#output'),
			board: null
		},
		log: function(msg) {
			window.console.log("crystal: " + msg);
			var li = document.createElement("li");
			li.textContent = msg;
			output.appendChild(li);
		},
		init: function() {
			if(!window.console) {
				window.console = {};
			}
			if(!window.console.log) {
				window.console.log = function() {
				};
			}
			var table = document.createElement("table");
			document.getElementById('board').appendChild(table);
			crystal.objs.board = table;
			var row, col, tr, td;
			for(row=0; row<crystal.settings.height; row++) {
				tr = document.createElement('tr');
				for(col=0; col<crystal.settings.width; col++) {
					td = document.createElement('td');
					td.textContent = "Elem " + row + "-" + col;
					tr.appendChild(td);
				}
				table.appendChild(tr);
			}
			crystal.log('Initialized board of ' + crystal.settings.width + "x" + crystal.settings.height + ".");
		}
	};
}(jQuery));


(function ($) {
	"use strict";
	$(document).ready(function () {
		$('.collapsible>:first-child').on('click', function () {
			$(this).parent().toggleClass('collapsed');
		});
		crystal.init();
	});
	var Rng = function() {
			this.offset = 0;
			this.step = 10;
			this.next = function(max) {
				var rand = Date.now(),
					number;
				rand += this.offset;
				this.offset += this.step;
				number = rand % +max;
				return number;
			}
		},
		crystal = {
			settings: {
				width: 5,
				height: 5,
				colours: ["#EECC88", "#CCEE88", "#CC88EE"]
			},
			objs: {
				output: $('ul#output'),
				board: null,
				rng: new Rng()
			},
			log: function(msg) {
				window.console.log("crystal: " + msg);
				var li = document.createElement("li");
				li.textContent = msg;
				output.appendChild(li);
			},
			getRandomColour : function() {
				var index = crystal.objs.rng.next(crystal.settings.colours.length),
					colour = crystal.settings.colours[index];
				return colour;
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
						var colour = crystal.getRandomColour();
						td.setAttribute('style', 'background-color: ' + colour + ';');
						td.setAttribute('data-color', colour);
						td.setAttribute('data-row', row);
						td.setAttribute('data-col', col);
						tr.appendChild(td);
					}
					table.appendChild(tr);
				}
				crystal.log('Initialized board of ' + crystal.settings.width + "x" + crystal.settings.height + ".");
				$('#board').on('click', 'td', function() {
					var row = this.getAttribute('data-row'),
						col = this.getAttribute('data-col');
					crystal.log('clicked [' + row + '-' + col + ']');
				});
			}
		};
}(jQuery));

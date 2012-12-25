
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
				crystal.objs.output.prepend(li);
			},
			getRandomColour : function() {
				var index = crystal.objs.rng.next(crystal.settings.colours.length),
					colour = crystal.settings.colours[index];
				return colour;
			},
			_swap: function(one, other) {
				var a = one.dataset,
					b = other.dataset,
					acolor = a.color;
				a.color = b.color;
				b.color = acolor;
				one.style["backgroundColor"] = one.dataset.color;
				other.style["backgroundColor"] = other.dataset.color;
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
				if(!table.dataset) {
					crystal.log("This browser does not support dataset.");
					return;
				}
				document.getElementById('board').appendChild(table);
				crystal.objs.board = table;
				var row, col, tr, td;
				for(row=0; row<crystal.settings.height; row++) {
					tr = document.createElement('tr');
					for(col=0; col<crystal.settings.width; col++) {
						td = document.createElement('td');
						var colour = crystal.getRandomColour();
						td.setAttribute('style', 'background-color: ' + colour + ';');
						td.dataset.color = colour;
						td.dataset.row = row;
						td.dataset.col = col;
						tr.appendChild(td);
					}
					table.appendChild(tr);
				}
				crystal.log('Initialized board of ' + crystal.settings.width + "x" + crystal.settings.height + ".");
				$('#board').on('click', 'td', function() {
					var row = this.dataset.row,
						col = this.dataset.col,
						$this = $(this),
						previous = crystal.objs.selected || null;
					if(previous === null) {
						$this.addClass('selected');
						crystal.objs.selected = this;
					} else{
						if(previous !== this) {
							crystal._swap(previous, this);
							crystal.objs.selected = null;
						}
						$(previous).removeClass('selected');
						crystal.objs.selected = null;
					}
				});
			}
		};
}(jQuery));


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
				$board: null,
				rows: null,
				rng: new Rng()
			},
			log: function(msg) {
				window.console.log("crystal: " + msg);
				var li = document.createElement("li");
				li.textContent = msg;
				crystal.objs.output.prepend(li);
			},
			get: function(row, col) {
				var tr = crystal.objs.rows[row],
					td = tr.children[col];
				return td;
			},
			getRandomColour : function() {
				var index = crystal.objs.rng.next(crystal.settings.colours.length),
					colour = crystal.settings.colours[index];
				return colour;
			},
			swap: function(one, other) {
				var a = one.dataset,
					b = other.dataset,
					acolor = a.color;
				if (a.color === b.color) {
					return;
				}
				a.color = b.color;
				b.color = acolor;
				one.style["backgroundColor"] = one.dataset.color;
				other.style["backgroundColor"] = other.dataset.color;
				crystal.log("Swapped " + a.row + "-" + a.col + " with " + b.row + "-" + b.col);
				crystal.mergeWithNeighbours(one);
				crystal.mergeWithNeighbours(other);
			},
			mergeWithNeighbours: function(cell) {
				var row = +cell.dataset.row,
					col = +cell.dataset.col;
				return crystal.mergeWithNeighbour(cell, row - 1, col - 1)
						|| crystal.mergeWithNeighbour(cell, row - 1, col + 1)
						|| crystal.mergeWithNeighbour(cell, row + 1, col - 1)
						|| crystal.mergeWithNeighbour(cell, row + 1, col + 1);
			},
			mergeWithNeighbour: function(cell, row, col) {
				var data = cell.dataset,
					color = data.color,
					neighbour;
				if (col < 0
						|| row < 0
						|| col > crystal.settings.width - 1
						|| row > crystal.settings.height - 1
						) {
					return false;
				}
				neighbour = crystal.get(row, col);
				if (neighbour.dataset.color !== color) {
					return false;
				}
				var otherCornerA = crystal.get(data.row, col);
				if(otherCornerA.dataset.color !== color) {
					return false;
				}
				var otherCornerB = crystal.get(row, data.col);
				if(otherCornerB.dataset.color !== color) {
					return false;
				}
				crystal.log("Want to merge " + data.row + "-" + data.col + " with " + row + "-" + col);
				return true;
			},
			init: function() {
				if (!window.console) {
					window.console = {};
				}
				if (!window.console.log) {
					window.console.log = function() {
					};
				}
				var table = document.createElement("table"),
					$table = $(table);
				if (!table.dataset) {
					crystal.log("This browser does not support dataset.");
					return;
				}
				document.getElementById('board').appendChild(table);
				crystal.objs.board = table;
				crystal.objs.$board = $table;
				crystal.objs.rows = [];
				var row, col, tr, td;
				for(row=0; row<crystal.settings.height; row++) {
					tr = document.createElement('tr');
					for(col=0; col<crystal.settings.width; col++) {
						td = document.createElement('td');
						var colour = crystal.getRandomColour();
						td.setAttribute('style', 'background-color: ' + colour + ';');
						td.setAttribute('title', row + "-" + col);
						td.dataset.color = colour;
						td.dataset.row = row;
						td.dataset.col = col;
						tr.appendChild(td);
					}
					table.appendChild(tr);
					crystal.objs.rows.push(tr);
				}
				crystal.log('Initialized board of ' + crystal.settings.width + "x" + crystal.settings.height + ".");
				$('#board').on('click', 'td', function() {
					var row = this.dataset.row,
						col = this.dataset.col,
						$this = $(this),
						previous = crystal.objs.selected;
					if (previous === undefined) {
						$this.addClass('selected');
						crystal.objs.selected = this;
					} else{
						$(previous).removeClass('selected');
						crystal.objs.selected = undefined;
						if (previous !== this) {
							crystal.swap(previous, this);
						}
					}
				});
				var previousHandler = window.onerror || function() { return false; },
					jsErrorHandler = function (a, b, c, d, e) {
						try {
							// TODO: improve this.
							crystal.log("JS error: " + a + " / " + b + " / " + c);
						} catch (e) {
						}
						return previousHandler();
					};
				window.onerror = jsErrorHandler;
			}
		};
}(jQuery));

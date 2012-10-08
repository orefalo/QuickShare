var Flipper = (
	function () {
		function Flipper() {
			this.sides = $('#slides .slide');
			this.lastIndex = -1;
			this.index = -1;
			this.side = false;

			this.sides.addClass("hidden");
			this.setTo(0);
		}

		Flipper.prototype.setTo = function (idx) {

			if (idx === this.index)
				alert("You cannot call the same screen in a row");

			if (this.lastIndex >= 0)
				this.sides.eq(this.lastIndex).addClass("hidden");

			var el = this.sides.eq(idx);
			el.removeClass("hidden");

			if (this.side === false) {
				el.addClass("front").removeClass("back");
				$('#slides').removeClass("rotated");
			}
			else {
				el.addClass("back").removeClass("front");
				$('#slides').addClass("rotated");
			}

			this.side = !this.side;

			if (this.index >= 0)
				this.lastIndex = this.index;

			this.index = idx;
		};
		return Flipper;
	}
	)();
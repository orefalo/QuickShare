var Labels = (
	function () {
		function Labels() {
		}

		Labels.prototype.setTo = function (index) {
			$('#label' + index).addClass('animated').addClass('fadeOutDown');
			$('#label' + (
				index + 1
				)).removeClass("hidden").addClass('animated').addClass('fadeInUp');
		};
		return Labels;
	}
	)();
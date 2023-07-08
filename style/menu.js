$(function () {
	if ($("#mainmenu ul.l1 a.current").offset() != null) {
		 $("html,body").animate({"scrollTop": $("#mainmenu ul.l1 a.current").offset().top - 50});
	}

	var accentMap = {"ی":"ي","ک":"ك","ي":"ی",	"ك":	"ک"};
	var normalize = function(term) {
		var ret = "";
		for (var i = 0; i < term.length; i++) {
			ret += accentMap[term.charAt(i)] || term.charAt(i);
		}
		return ret;
	};

	m = $('#mainmenu ul.l1');
	var items = [];
	m.find('a').each(function() {
		items.push({label: $(this).text(), url: $(this).attr('data-commandUrl'), link: this});
		// items.push($(this).text().trim());
	});
	$('#autoCompleteBox').autocomplete({
		source: function(request, response) {
			var matcher = new RegExp($.ui.autocomplete.escapeRegex(request.term), "i");
			response($.grep(items, function(value) {
				value = value.label;
				return matcher.test(value) || matcher.test(normalize(value));
			}));
		},
		select: function(event, ui) {
			//alert(ui.item.url);
			gotoUrl("itoForm",ui.item.url);
			 return false;
		},
		position: { my : "right top", at: "right bottom" }
	});
});

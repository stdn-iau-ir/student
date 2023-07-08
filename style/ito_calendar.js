var weekend = [6];
var weekendColor = "#E2EAF5";
var fontface = "Tahoma";
var fontsize = 8;			// in "pt" units; used with "font-size" style element

var monthly_header_bgcolor = "#ffffff";
var month_days_align = "center";
var monthly_header_style= "border: 0px #8eaccc; border-collapse:collapse;";
var before_first_day_style="BORDER-COLLAPSE: collapse; height:30; vertical-align:middle; BORDER-RIGHT:#CEDAED 1px solid; BORDER-TOP:#CEDAED 1px solid; BORDER-LEFT:none; BORDER-BOTTOM:none; text-align:" + month_days_align + ";";
var normal_week_days_style ="BORDER-COLLAPSE: collapse; height:30; vertical-align:middle; BORDER-RIGHT: #CEDAED 1px solid; BORDER-TOP:#CEDAED 1px solid; BORDER-LEFT:none; BORDER-BOTTOM:none; text-align:" + month_days_align + ";";
var next_month_week_days_style ="BORDER-COLLAPSE: collapse; height:30; vertical-align:middle; BORDER-RIGHT:#CEDAED 1px solid; BORDER-TOP:#CEDAED 1px solid; BORDER-LEFT:none; BORDER-BOTTOM:none; text-align:" + month_days_align + ";";
var normal_days_Style="vertical-align:middle; BORDER-RIGHT: #d5e2f1 13px ridge; BORDER-TOP: #d5e2f1 1px ridge; BORDER-LEFT: #d5e2f1 1px ridge; BORDER-BOTTOM: #d5e2f1 1px ridge";
var current_day_style="color:#FAC450;"

var default_date_formatting = "YYYY/MM/DD";

var _gNow = new DateClass();
var gNow = _gNow.getJalali();

var ggWinContent;
var ggPosX = -1;
var ggPosY = -1;

Calendar.months = ["فروردين", "ارديبهشت", "خرداد", "تير", "مرداد", "شهريور",
                   "مهر", "آبان", "آذر", "دي", "بهمن", "اسفند"];
Calendar.weekDays = ["شنبه", "يك‌شنبه", "دوشنبه", "سه‌شنبه", "چهارشنبه", "پنج‌شنبه", "جمعه"];

var selected_year = "";
var selected_month = "";
var selected_date = "";

// Image Cacheing...
new Image().src="Pages/images/cal/P-Year.gif";
new Image().src="Pages/images/cal/N-Year.gif";
new Image().src="Pages/images/cal/P-Month.gif";
new Image().src="Pages/images/cal/N-Month.gif";
new Image().src="Pages/images/cal/Cancel.gif";
new Image().src="Pages/images/cal/Today.gif";
new Image().src="Pages/images/cal/BG-Bar.gif";
new Image().src="Pages/images/cal/BG-Week.gif";

function Calendar(p_item, p_month, p_year, p_format) {
	if ((p_month == null) && (p_year == null))	return;

	if (p_month == null) {
		this.gMonthName = null;
		this.gMonth = null;
		this.gYearly = true;
	} else {
		this.gMonthName = Calendar.get_month(p_month);
		this.gMonth = new Number(p_month);
		this.gYearly = false;
	}

	this.gYear = p_year;
	this.gFormat = p_format;
	this.gBGColor = "white";
	this.gFGColor = "#284567";
	this.gTextColor = "#284567";
	this.gHeaderColor = "#284567";
	this.gReturnItem = p_item; // p_item is the target widget to be filled with selected date
}

Calendar.get_month = Calendar_get_month;
Calendar.get_daysofmonth = Calendar_get_daysofmonth;
Calendar.calc_month_year = Calendar_calc_month_year;

function Calendar_get_month(monthNo) {
	return Calendar.months[monthNo];
}

/**
 * Just give it a month and a year (Jalali), it returns the number of days inthat month
 * using a simple algorithm.
 */
function Calendar_get_daysofmonth(month, year) {
    if (month > 11) return -1;

    var jalali1 = new DateClass();
    var jalali2 = new DateClass();

    var gregDate1 = new Date();
    var gregDate2 = new Date();
    var greg1 = new DateStructure();
    var greg2 = new DateStructure();

    jalali1.setTime(year, month, 1);
    jalali2.setTime(month >= 11 ? parseInt(year)+1 : year, (month + 1) % 12, 1);

    greg1 = jalali1.getGreg();
    gregDate1.setDate(greg1.date);
    gregDate1.setMonth(greg1.month);
    gregDate1.setYear(greg1.year);

    greg2 = jalali2.getGreg();
    gregDate2.setDate(greg2.date);
    gregDate2.setMonth(greg2.month);
    gregDate2.setYear(greg2.year);

    return (((parseInt(gregDate2.getTime() / (3600*24*1000))) -
             (parseInt(gregDate1.getTime() / (3600*24*1000)))));
  }

function Calendar_calc_month_year(p_Month, p_Year, incr) {
	/*
	Will return an 1-D array with 1st element being the calculated month
	and second being the calculated year
	after applying the month increment/decrement as specified by 'incr' parameter.
	'incr' will normally have 1/-1 to navigate thru the months.
	*/
	var ret_arr = new Array();

	if (incr == -1) {
		// B A C K W A R D
		if (p_Month == 0) {
			ret_arr[0] = 11;
			ret_arr[1] = parseInt(p_Year) - 1;
		}
		else {
			ret_arr[0] = parseInt(p_Month) - 1;
			ret_arr[1] = parseInt(p_Year);
		}
	} else if (incr == 1) {
		// F O R W A R D
		if (p_Month == 11) {
			ret_arr[0] = 0;
			ret_arr[1] = parseInt(p_Year) + 1;
		}
		else {
			ret_arr[0] = parseInt(p_Month) + 1;
			ret_arr[1] = parseInt(p_Year);
		}
	}

	return ret_arr;
}

// This is for compatibility with Navigator 3, we have to create
// and discard one object before the prototype object exists.
new Calendar();

Calendar.prototype.getMonthlyCalendarCode = function() {
	var vCode = "";
	var vHeader_Code = "";
	var vData_Code = "";

	// Begin Table Drawing code here.
	vCode += ("<div align=left dir=\"rtl\"><TABLE cellpadding=0 CELLSPACING=0 border=0 BGCOLOR=\"" +
	          this.gBGColor + "\" style='font-size:" + fontsize + "pt;'>");

	vHeader_Code = this.cal_header();
	vData_Code = this.cal_data();
	vCode += (vHeader_Code + vData_Code);

	vCode += "</TABLE></div>";

	return vCode;
}

Calendar.prototype.show = function() {
	var vCode = "";

	// build content into global var ggWinContent
	//ggWinContent += ("<FONT FACE='" + fontface + "' ><B><span style='text-align:center; padding-left: 100'>");
	//ggWinContent += (this.gMonthName + " " + this.gYear);
	//ggWinContent += "</B></span><BR>";

	// Show navigation buttons
	var prevMMYYYY = Calendar.calc_month_year(this.gMonth, this.gYear, -1);
	var prevMM = prevMMYYYY[0];
	var prevYYYY = prevMMYYYY[1];

	var nextMMYYYY = Calendar.calc_month_year(this.gMonth, this.gYear, 1);
	var nextMM = nextMMYYYY[0];
	var nextYYYY = nextMMYYYY[1];
//Menu Befor & Next***************************************************************
	ggWinContent += ("<TABLE dir=ltr WIDTH='100%' BORDER=0  CELLSPACING=0 CELLPADDING=0 BGCOLOR=" + monthly_header_bgcolor + " style='" + monthly_header_style + " font-size:" + fontsize + "pt;'><TR><TD bgcolor=#4468BA ALIGN=center>");
	ggWinContent += ("<div style='width:100%; cursor:pointer; cursor:hand' TITLE=\"سال بعد\" " +
		"onMouseOver=\"window.status='سال بعد'; return true;\" " +
		"onMouseOut=\"window.status=''; return true;\" " +
		"onClick=\"Build(" +
		"'" + this.gReturnItem + "', '" + this.gMonth + "', '" + (parseInt(this.gYear)+1) + "', '" + this.gFormat + "', false" +
		");" + "\">" +
                "<img src=Pages/images/cal/P-Year.gif>" +
                "</div></TD><TD ALIGN=center bgcolor=#4468BA>");
	ggWinContent += ("<div style='width:100%; cursor:pointer; cursor:hand' TITLE=\"ماه بعد\" " +
		"onMouseOver=\"window.status='ماه بعد'; return true;\" " +
		"onMouseOut=\"window.status=''; return true;\" " +
		"onClick=\"Build(" +
		"'" + this.gReturnItem + "', '" + nextMM + "', '" + nextYYYY + "', '" + this.gFormat + "', false" +
		");" + "\">" +
                "<img src=Pages/images/cal/P-Month.gif>" +
                "</div></TD><TD ALIGN=center bgcolor=#4468BA style='FONT-WEIGHT: bold; COLOR: white; size:12px' background=Pages/images/cal/BG-Bar.gif>");

	today_link = "<div style='background-color: #6666cc; width:100%; cursor:pointer; cursor:hand' TITLE=\"امروز: " + this.getTimeString(gNow.year, gNow.month, gNow.date, gNow.weekDay) + "\"" +
		"onMouseOver=\"this.style.backgroundColor='#3333aa'; window.status='امروز'; return true;\" " +
		"onMouseOut=\"this.style.backgroundColor='#6666cc'; window.status=''; return true;\" " +
		"onClick=\"" +
                ((this.gMonth == gNow.month && this.gYear == gNow.year) ?
				("document.getElementById('" + this.gReturnItem + "').value='" +
				this.format_data(gNow.date) +
				"';ggPosX=-1;ggPosY=-1;nd();nd();\"")
                                :
				("Build(" +
				"'" + this.gReturnItem + "', '" + gNow.month + "', '" + (parseInt(gNow.year)) + "', '" + this.gFormat + "', false" +
				");\""))
                + ">" +
                "امروز" +
                "</div>";

	ggWinContent += "<div style='width:117px;'>"
	ggWinContent += (this.gMonthName + " " + this.gYear);
	ggWinContent += ("</div>" + today_link + "</TD><TD ALIGN=center bgcolor=#4468BA>");
//        ggWinContent += ("</div><div><font size="-2">امروز</div></TD><TD ALIGN=center bgcolor=#4468BA>");

	ggWinContent += ("<div style='width:100%; cursor:pointer; cursor:hand' TITLE=\"ماه قبل\" " +
		"onMouseOver=\"window.status='ماه قبل'; return true;\" " +
		"onMouseOut=\"window.status=''; return true;\" " +
		"onClick=\"Build(" +
		"'" + this.gReturnItem + "', '" + prevMM + "', '" + prevYYYY + "', '" + this.gFormat + "', false" +
		");" + "\">" +
		"<IMG SRC=Pages/images/cal/N-Month.gif>" +
                "</div></TD><TD bgcolor=#4468BA ALIGN=center>");
	ggWinContent += ("<div style='width:100%; cursor:pointer; cursor:hand' TITLE=\"سال قبل\" " +
		"onMouseOver=\"window.status='سال قبل'; return true;\" " +
		"onMouseOut=\"window.status=''; return true;\" " +
		"onClick=\"Build(" +
		"'" + this.gReturnItem + "', '" + this.gMonth + "', '" + (parseInt(this.gYear)-1) + "', '" + this.gFormat + ", false'" +
		");" + "\">" +
                 "<img src=Pages/images/cal/N-Year.gif>" +
                "</div></TD></TR></TABLE>");

	// Get the complete calendar code for the month, and add it to the
	//	content var
	vCode = this.getMonthlyCalendarCode();
	ggWinContent += vCode;
}

Calendar.prototype.showY = function() {
	var vCode = "";
	var i;

	ggWinContent += "<FONT FACE='" + fontface + "' ><B>"
	ggWinContent += ("Year : " + this.gYear);
	ggWinContent += "</font></B>";

	// Show navigation buttons
	var prevYYYY = parseInt(this.gYear) - 1;
	var nextYYYY = parseInt(this.gYear) + 1;

	ggWinContent += ("<TABLE WIDTH='100%' BORDER=0 bgcolor=#4468BA CELLSPACING=0 CELLPADDING=0 style='font-size:" + fontsize + "pt;'><TR><TD ALIGN=center>");
	ggWinContent += ("[<A HREF=\"javascript:void(0);\" " +
		"onMouseOver=\"window.status='Go back one year'; return true;\" " +
		"onMouseOut=\"window.status=''; return true;\" " +
		"onClick=\"Build(" +
		"'" + this.gReturnItem + "', null, '" + prevYYYY + "', '" + this.gFormat + "', false" +
		");" +
		"\">&lt;&lt;Year<\/A>]</TD><TD ALIGN=center>");
	ggWinContent += "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</TD><TD ALIGN=center>";
	ggWinContent += ("[<A HREF=\"javascript:void(0);\" " +
		"onMouseOver=\"window.status='Go forward one year'; return true;\" " +
		"onMouseOut=\"window.status=''; return true;\" " +
		"onClick=\"Build(" +
		"'" + this.gReturnItem + "', null, '" + nextYYYY + "', '" + this.gFormat + "', false" +
		");" +
		"\">Year&gt;&gt;<\/A>]</TD></TR></TABLE>");

	// Get the complete calendar code for each month.
	// start a table and first row in the table
	ggWinContent += ("<TABLE WIDTH='100%' BORDER=0 CELLSPACING=0 CELLPADDING=0   style='font-size:" + fontsize + "pt;'><TR>");
	var j;
	for (i=0; i<12; i++) {
		// start the table cell
		ggWinContent += "<TD ALIGN='center'   >";
		this.gMonth = i;
		this.gMonthName = Calendar.get_month(this.gMonth);
		vCode = this.getMonthlyCalendarCode();
		ggWinContent += (this.gMonthName + "/" + this.gYear);
		ggWinContent += vCode;
		ggWinContent += "</TD>";
		if (i == 3 || i == 7) {
			ggWinContent += "</TR><TR>";
			}

	}


}

Calendar.prototype.cal_header = function() {
	var vCode = "";

	vCode = vCode + "<TR>";
	vCode = vCode + "<TD NOWRAP WIDTH=34px HEIGHT=24px BORDER=0px bgcolor=#CEDAED background=Pages/images/cal/BG-Week.gif align=center><FONT FACE='" + fontface + "' COLOR='" + this.gHeaderColor + "'>شنبه</FONT></TD>";
	vCode = vCode + "<TD NOWRAP WIDTH=34px HEIGHT=24px border=0px bgcolor=#CEDAED background=Pages/images/cal/BG-Week.gif align=center><FONT FACE='" + fontface + "' COLOR='" + this.gHeaderColor + "'>1شنبه</FONT></TD>";
	vCode = vCode + "<TD NOWRAP WIDTH=34px HEIGHT=24px border=0px bgcolor=#CEDAED background=Pages/images/cal/BG-Week.gif align=center><FONT FACE='" + fontface + "' COLOR='" + this.gHeaderColor + "'>2شنبه</FONT></TD>";
	vCode = vCode + "<TD NOWRAP WIDTH=34px HEIGHT=24px border=0px bgcolor=#CEDAED background=Pages/images/cal/BG-Week.gif align=center><FONT FACE='" + fontface + "' COLOR='" + this.gHeaderColor + "'>3شنبه</FONT></TD>";
	vCode = vCode + "<TD NOWRAP WIDTH=34px HEIGHT=24px BORDER=0px bgcolor=#CEDAED background=Pages/images/cal/BG-Week.gif align=center><FONT FACE='" + fontface + "' COLOR='" + this.gHeaderColor + "'>4شنبه</FONT></TD>";
	vCode = vCode + "<TD NOWRAP WIDTH=34px HEIGHT=24px BORDER=0px bgcolor=#CEDAED background=Pages/images/cal/BG-Week.gif align=center><FONT FACE='" + fontface + "' COLOR='" + this.gHeaderColor + "'>5شنبه</FONT></TD>";
	vCode = vCode + "<TD NOWRAP WIDTH=33px HEIGHT=24px BORDER=0px bgcolor=#CEDAED background=Pages/images/cal/BG-Week.gif align=center><FONT FACE='" + fontface + "' COLOR='" + this.gHeaderColor + "'>جمعه</FONT></TD>";
	vCode = vCode + "</TR>";

	return vCode;
}


Calendar.prototype.cal_data = function() {
	var vDate = new DateClass();
	vDate.setTime(this.gYear, this.gMonth, 1);
//todo
	var vFirstDay = (vDate.getGreg().weekDay+1) % 7;
	var vDay=1;
	var vLastDay=Calendar.get_daysofmonth(this.gMonth, this.gYear);
	var vOnLastDay=0;
	var vCode = "";

	/*
	Get day for the 1st of the requested month/year..
	Place as many blank cells before the 1st day of the month as necessary.
	*/
	vCode = vCode + "<TR>";
	for (i=0; i<vFirstDay; i++) {
		vCode = vCode + "<TD style='" + before_first_day_style + "' WIDTH=33px " + this.write_weekend_string(i) + ">&nbsp;</TD>";
	}

	// Write rest of the 1st week
	for (j=vFirstDay; j<7; j++) {
		vCode = vCode + "<TD  style='" + normal_week_days_style + "' WIDTH=33px height=35 " + this.write_weekend_string(j) + ">" +
			"<A  style='padding: 4px 0px; width:100%; border-width=0' HREF='javascript:void(0);' " + (this.format_day(vDay).length > 2 ? "id=\"_FOCUS_ID_\"" : " ") +
				"onMouseOver=\"window.status='تنظيم تاريخ به " + this.format_data(vDay) + "'; return true;\" " +
				"onMouseOut=\"window.status=' '; return true;\" " +
				"onClick=\"var elem = document.getElementById('" + this.gReturnItem + "'); "
				+"elem.value='" + 	this.format_data(vDay) 
				+ "';nd(); nd();" 
				+ " if (typeof elem.onchange == 'function') elem.onchange.apply(elem);"+
				" \">" +
			this.format_day(vDay, j) +
			"</A>" +
			"</TD>";
		vDay=vDay + 1;
	}
	vCode = vCode + "</TR>";

	// Write the rest of the weeks
	for (k=2; k<7; k++) {
		vCode = vCode + "<TR>";

		for (j=0; j<7; j++) {
			vCode = vCode + "<TD valign=center style='" + normal_week_days_style + "' WIDTH=33px " + this.write_weekend_string(j) + ">" +
				"<A style='width:100%; padding: 4px 0px ;border-width=0' HREF='javascript:void(0);' " + (this.format_day(vDay).length > 2 ? "id=\"_FOCUS_ID_\"" : " ") +
					"onMouseOver=\"window.status='تنظيم تاريخ به " + this.format_data(vDay) + "'; return true;\" " +
					"onMouseOut=\"window.status=' '; return true;\" " +
					"onClick=\"var elem = document.getElementById('" + this.gReturnItem + "'); "
					+"elem.value='" + 	this.format_data(vDay) 
					+ "';nd(); nd();" 
					+ " if (typeof elem.onchange == 'function') elem.onchange.apply(elem);"+
					" \">" +
				this.format_day(vDay, j) +
				"</A>" +
				"</TD>";
			vDay=vDay + 1;

			if (vDay > vLastDay) {
				vOnLastDay = 1;
				break;
			}
		}


		if (j == 6)
			vCode = vCode + "</TR>";
		if (vOnLastDay == 1)
			break;
	}

	// Fill up the rest of last week with proper blanks, so that we get proper square blocks
	for (m=1; m<(7-j); m++) {
		if (this.gYearly)
			vCode = vCode + "<TD  style='" + next_month_week_days_style + "' WIDTH='14%'" + this.write_weekend_string(j+m) +
			"><FONT FACE='" + fontface + "' COLOR=Gray >&nbsp;</FONT></TD>";
		else
			vCode = vCode + "<TD style='" + next_month_week_days_style + "' WIDTH='14%'" + this.write_weekend_string(j+m) +
			"><FONT FACE='" + fontface + "' COLOR='Gray'>" + m + "</FONT></TD>";
	}
	return vCode;
}

Calendar.prototype.format_day = function(vday, week_day) {
	var vDay = gNow.date;
	var vMonth = gNow.month;
	var vYear = gNow.year;

	if (vday == vDay && this.gMonth == vMonth && this.gYear == vYear) { // current day
		return ("<span style='cursor:pointer; cursor:hand; width:100%; color:red'><B TITLE='امروز: " + this.getTimeString(this.gYear, this.gMonth, vday, week_day) +
		        "'>" + vday + "</B></span>");
	}
	if (selected_date == vday && selected_month == this.gMonth && selected_year == this.gYear) {// selected day
		return ("<span TITLE='روز انتخاب شده: "+ this.getTimeString(this.gYear, this.gMonth, vday, week_day) +
		        "' STYLE='cursor:pointer; cursor:hand; width:100%; border: 0px dotted Gray; color:#284567'><B>" + vday + "</B></span>");
	}
	else
		return ("<span style='cursor:pointer; cursor:hand; width:100%;' title='" + this.getTimeString(this.gYear, this.gMonth, vday, week_day) + "'>"+vday+"</span>");
}

Calendar.prototype.getTimeString = function(y, m, d, wd) {
	return Calendar.weekDays[wd]+"، "+y+"/"+(m+1)+"/"+d;
}

Calendar.prototype.write_weekend_string = function(vday) {
	var i;

	// Return special formatting for the weekend day.
	for (i=0; i<weekend.length; i++) {
		if (vday == weekend[i])
			return (" BGCOLOR=\"" + weekendColor + "\"");
	}

	return "";
}

Calendar.prototype.format_data = function(p_day) {
	var vData;
	var vMonth = 1 + this.gMonth;
	vMonth = (vMonth.toString().length < 2) ? "0" + vMonth : vMonth;
	var vMon = Calendar.get_month(this.gMonth).substr(0,3).toUpperCase();
	var vFMon = Calendar.get_month(this.gMonth).toUpperCase();
	var vY4 = new String(this.gYear);
	var vY2 = new String(this.gYear.substr(2,2));
	var vDD = (p_day.toString().length < 2) ? "0" + p_day : p_day;

	switch (this.gFormat) {
		case "YYYY\/MM\/DD" :
			vData = vY4 + "\/" + vMonth + "\/" + vDD;
			break;

		case "MM\/DD\/YYYY" :
			vData = vMonth + "\/" + vDD + "\/" + vY4;
			break;
		case "MM\/DD\/YY" :
			vData = vMonth + "\/" + vDD + "\/" + vY2;
			break;
		case "MM-DD-YYYY" :
			vData = vMonth + "-" + vDD + "-" + vY4;
			break;
		case "YYYY-MM-DD" :
			vData = vY4 + "-" + vMonth + "-" + vDD;
			break;
		case "MM-DD-YY" :
			vData = vMonth + "-" + vDD + "-" + vY2;
			break;
		case "DD\/MON\/YYYY" :
			vData = vDD + "\/" + vMon + "\/" + vY4;
			break;
		case "DD\/MON\/YY" :
			vData = vDD + "\/" + vMon + "\/" + vY2;
			break;
		case "DD-MON-YYYY" :
			vData = vDD + "-" + vMon + "-" + vY4;
			break;
		case "DD-MON-YY" :
			vData = vDD + "-" + vMon + "-" + vY2;
			break;
		case "DD\/MONTH\/YYYY" :
			vData = vDD + "\/" + vFMon + "\/" + vY4;
			break;
		case "DD\/MONTH\/YY" :
			vData = vDD + "\/" + vFMon + "\/" + vY2;
			break;
		case "DD-MONTH-YYYY" :
			vData = vDD + "-" + vFMon + "-" + vY4;
			break;
		case "DD-MONTH-YY" :
			vData = vDD + "-" + vFMon + "-" + vY2;
			break;
		case "DD\/MM\/YYYY" :
			vData = vDD + "\/" + vMonth + "\/" + vY4;
			break;
		case "DD\/MM\/YY" :
			vData = vDD + "\/" + vMonth + "\/" + vY2;
			break;
		case "DD-MM-YYYY" :
			vData = vDD + "-" + vMonth + "-" + vY4;
			break;
		case "DD-MM-YY" :
			vData = vDD + "-" + vMonth + "-" + vY2;
			break;
		default :
			vData = vMonth + "\/" + vDD + "\/" + vY4;
	}
	return vData;
}

function Build(p_item, p_month, p_year, p_format, firstShow) {
//	gCal = new Calendar(p_item, p_month, p_year, p_format);  escaping an error when clicking on next and previous year days
	gCal = new Calendar(p_item, p_month, p_year, default_date_formatting);

	// Customize your Calendar here.
	gCal.gBGColor="#ffffff";
	gCal.gLinkColor="006666";
	gCal.gTextColor="#042A79";
	gCal.gHeaderColor="#006666";
	gCal.gBGHeaderColor="#006666";

	// initialize the content string
	ggWinContent = "";

	// Choose appropriate show function
	if (gCal.gYearly) {
		// and, since the yearly calendar is so large, override the positioning and fontsize
		// warning: in IE6, it appears that "select" fields on the form will still show
		//	through the "over" div; Note: you can set these variables as part of the onClick
		//	javascript code before you call the show_yearly_calendar function
		if (ggPosX == -1) ggPosX = 15;
		if (ggPosY == -1) ggPosY = 15;
		if (fontsize == 8) fontsize = 6;
		// generate the calendar
		gCal.showY();
		}
	else {
		if (fontsize == 6) fontsize = 8;
		gCal.show();
		}

	var textBox = document.getElementById(p_item);
	boxX = getElementX(textBox);
	boxY = getElementY(textBox) + 20; // 20 is the textbox height

	// if this is the first calendar popup, use autopositioning with an offset
	if (firstShow) {
          overlib(ggWinContent, AUTOSTATUSCAP, STICKY, CLOSECLICK, CSSSTYLE,
                  TEXTSIZEUNIT, "pt", TEXTSIZE, 8, CLOSESIZE, 9, CLOSECOLOR, "white",
                  CAPTION, " ", FIXX, boxX, FIXY, boxY);
          // save where the 'over' div ended up; we want to stay in the same place if the user
          //	clicks on one of the year or month navigation links
          if ( (ns4) || (ie4) ) {
                  ggPosX = parseInt(over.left);
                  ggPosY = parseInt(over.top);
          } else if (ns6) {
                  ggPosX = parseInt(over.style.left);
                  ggPosY = parseInt(over.style.top);
          }
	}
	else {
          // we have a saved X & Y position, so use those with the FIXX and FIXY options

          overlib(ggWinContent, AUTOSTATUSCAP, STICKY, CLOSECLICK, CSSSTYLE,
                  TEXTSIZEUNIT, "pt", TEXTSIZE, 8, CLOSESIZE, 9, CLOSECOLOR, "white",
                  CAPTION, " ", FIXX, boxX, FIXY, boxY);
	}
	Drag.init(document.getElementById("handleDatePicker"), document.getElementById("overDiv"));
}

/**
 * @param now: current date: a numeric value representing the number of elapsed
*              milliseconds since midnight, January 1, 1970 UTC.
 */
function show_calendar(now, inputId) {
  var date = new Date();
  date.setTime(now);
  var convertor = new DateClass();

  // mozilla returns 105 as year 2005 (it counts from 1900)
  convertor.setTime(date.getYear() > 1900 ? date.getYear() : date.getYear() + 1900  , date.getMonth(), date.getDate());
  var jalaliDate = convertor.getJalali();
  gNow = jalaliDate;
  main_show_calendar(inputId);
}

function main_show_calendar(inputId) {
	/*
		p_month : 0-11 for Jan-Dec; 12 for All Months.
		p_year	: 4-digit year
		p_format: Date format (mm/dd/yyyy, dd/mm/yy, ...)
		p_item	: Return Item.
	*/
//	p_item = arguments[0];
	p_item = inputId;
	str = document.getElementById(p_item).value;
//	str = document.getElementsByName(p_item).item(0).value;

	if (str == "") { // not filled yet
		if (arguments[1] == null)
			p_month = new String(gNow.month);
		else
			p_month = arguments[1];
		if (arguments[2] == "" || arguments[2] == null)
			p_year = new String(gNow.year.toString());
		else
			p_year = arguments[2];
		if (arguments[3] == null)
			p_format = "YYYY/MM/DD";
		else
			p_format = arguments[3];
		selected_year = "";
		selected_month = "";
		selected_date = "";
	}
	else {
		p_format = default_date_formatting;
		p_year = gNow.year.toString();
		p_month = gNow.month.toString();

		// be very careful about a zero before a number,
		// which means a that the number is octal

		str = reformat_date(str); // match the regular expression
		if (str == null) {
			Build(p_item, p_month, p_year, p_format, true);
			return;
		}

		var tmp;
		selected_year  = (tmp = extractField(str, p_format, "YYYY"))  == null ? gNow.year.toString()  : parseInt(tmp, 10);
		selected_month = (tmp = extractField(str, p_format, "MM"))    == null ? gNow.month.toString() : parseInt(tmp, 10) - 1;
		selected_date  = (tmp = extractField(str, p_format, "DD"))    == null ? gNow.date.toString()  : parseInt(tmp, 10);
		Build(p_item, selected_month.toString(), selected_year.toString(), p_format, true);
		return;

	}
	Build(p_item, p_month, p_year, p_format, true);
}

function reformat_date(str) {
	// Regular expression to match (xxxx|xx)/(xx|x)/(xx|x) which means
	// day is 1 or 2 digits, month is 1 or 2 digits and year is 2 or 4 digits.
	// Some matching expressions are 1383/12/3, 84/3/04, 9999/99/88.
	var regex = new RegExp("(\\d{2})?\\d{2}/(\\d{1})?\\d{1}/(\\d{1})?\\d{1}", "ig");
	var dd, mm, yyyy;
	arr = regex.exec(str);
	if (arr == null || arr[0] != str)
		return null;
	yyyy = str.substring(0, str.indexOf("/"));
	if (arr[1] == "" || arr[1] == null)
		yyyy = "13" + str.substring(0, str.indexOf("/"));

	str = str.substring(str.indexOf("/") + 1, str.length);
	mm = str.substring(0, str.indexOf("/"));
	if (arr[2] == "" || arr[2] == null)
		mm = "0" + str.substring(0, str.indexOf("/"));

	str = str.substring(str.indexOf("/") + 1, str.length);
	dd = str;
	if (arr[3] == "" || arr[3] == null)
		dd = "0" + str;

	if (mm < 0 || mm > 12 || dd < 0 || dd > 31) return null;

	return ("" + yyyy + "/" + mm + "/" + dd);
}

function extractField(str, format, field) {
	var fieldIndex = format.indexOf(field); // find the specified field
	if (fieldIndex == -1) return null;
	return str.substr(fieldIndex, field.length);
}

/*
Yearly Calendar Code Starts here
*/
function show_yearly_calendar() {
	// Load the defaults..
	//if (p_year == null || p_year == "")
	//	p_year = new String(gNow.getFullYear().toString());
	//if (p_format == null || p_format == "")
	//	p_format = "YYYY-MM-DD";

	p_item = arguments[0];
	if (arguments[1] == "" || arguments[1] == null)
		p_year = new String(gNow.year.toString());
	else
		p_year = arguments[1];
	if (arguments[2] == null)
		p_format = "YYYY/MM/DD";
	else
		p_format = arguments[2];

	Build(p_item, null, p_year, p_format);
}

/**
 * DateClass is an easy to use JavaScript class to convert between Jalali and Gregorian dates
 */

var g_days_in_month = Array (31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31); // Gregorian days (Jan, Feb, ...)
var j_days_in_month = Array (31, 31, 31, 31, 31, 31, 30, 30, 30, 30, 30, 29); // Jalali days (Far, Ord, ...)

var pinglish_month_names = Array ("Farvardin", "Ordibehesht", "Khordad", "Tir",
                                  "Mordad", "Shahrivar", "Mehr", "Aban", "Azar",
                                  "Dey", "Bahman", "Esfand");
var pinglish_weekday_name = Array ("Shanbe", "Yekshanbe", "Doshanbe", "Seshanbe", "Chaharshanbe", "Panjshanbe", "Jome");

function DateStructure() {
   this.date    = "";
   this.month   = "";
   this.year    = "";
   this.weekDay = "";
}

function DateClass() {
   var nowDate = new Date();
   var date    = nowDate.getDate();
   var month   = nowDate.getMonth();
   var year    = nowDate.getFullYear();
   var weekDay = nowDate.getDay();

   var jalaliDate;
   var gregDate;

   this.setTime = function(newYear, newMonth, newDate) {
      year   = newYear;
      month  = newMonth;
      date   = newDate;
   }

   this.getJalali = function() {
      jalaliDate = Greg2Jalali(year, month, date);
      return jalaliDate;
   }

   this.getGreg = function() {
      gregDate = Jalali2Greg(year, month, date);
      return gregDate;
   }

   this.toString = function() {
	   return "" + pinglish_weekday_name[weekDay] + " " + date + " " + month + " " + year;
   }
}

/**
 * This function returns Gregorian equivalent of Jalali (year, month, date).
 * Note that month is counted from 0: January = 0, ..., December = 11.
 * A sample input may be (2004, 8, 9), which means 9-September-2004, and the
 * return value should be (1383, 5, 19, 5), which means Thursday-19-Shahrivar-1383.
 */
function Greg2Jalali(year, month, date) {
   var gy, gm, gd;
   var jy, jm, jd;
   var g_day_no, j_day_no;
   var j_np;
   var i;
   var retDate = new DateStructure();
   var tempDate = new Date();

   gy = year - 1600;
   gm = month;    // month is cunted from 0 in JavaScript
   gd = date - 1; // because date is counted from 1 in JavaScript

   g_day_no = 365*gy + parseInt((gy+3)/4) -
                       parseInt((gy+99)/100) + parseInt((gy+399)/400);
   for (i=0; i<gm; ++i)
      g_day_no += g_days_in_month[i];
   if (gm>1 && ((gy%4==0 && gy%100!=0) || (gy%400==0)))
      // leap and after Feb
      ++g_day_no;
   g_day_no += gd;

   j_day_no = g_day_no-79;

   j_np = parseInt(j_day_no / 12053);
   j_day_no %= 12053;

   jy = 979 + 33*j_np + 4*parseInt((j_day_no/1461));
   j_day_no %= 1461;

   if (j_day_no >= 366) {
      jy += parseInt((j_day_no-1)/365);
      j_day_no = (j_day_no-1)%365;
   }

   for (i = 0; i < 11 && j_day_no >= j_days_in_month[i]; ++i) {
      j_day_no -= j_days_in_month[i];
   }
   jm = i;
   jd = j_day_no+1;

   tempDate.setYear(year);
   tempDate.setMonth(month);
   tempDate.setDate(date);

   retDate.year  = jy;
   retDate.month = jm;
   retDate.date  = jd;
   retDate.weekDay = (tempDate.getDay() + 1) % 7; // Sat=0, ..., Fri=6

   return retDate;
}

/**
 * This function returns Jalali equivalent of (year, month, date).
 * Note that month is counted from 0: Farvardin = 0, ..., Esfand = 11.
 * A sample input may be (1383, 5, 19), which means 19-Shahrivar-1383, and the
 * return value should be (2004, 8, 9, 4), which means Thursday-9-September-2004.
 */
function Jalali2Greg (year, month, date) {
   var gy, gm, gd;
   var jy, jm, jd;
   var g_day_no, j_day_no;
   var leap;
   var i;
   var retDate = new DateStructure();
   var tempDate = new Date();

   jy = year-979;
   jm = month;
   jd = date-1;

   j_day_no = 365*jy + parseInt((jy/33))*8 + parseInt((jy%33+3)/4);
   for (i=0; i < jm; ++i)
      j_day_no += j_days_in_month[i];

   j_day_no += jd;

   g_day_no = j_day_no+79;

   gy = 1600 + 400*parseInt((g_day_no/146097));
   g_day_no = g_day_no%146097;

   leap = 1;
   if (g_day_no >= 36525)
   {
      g_day_no--;
      gy += 100*parseInt((g_day_no/36524));
      g_day_no = g_day_no%36524;

      if (g_day_no >= 365)
         g_day_no++;
      else
         leap = 0;
   }

   gy += 4*(parseInt(g_day_no/1461));
   g_day_no %= 1461;

   if (g_day_no >= 366) {
      leap = 0;
      g_day_no--;
      gy += parseInt(g_day_no/365);
      g_day_no = g_day_no%365;
   }

   for (i = 0; g_day_no >= g_days_in_month[i] + (i == 1 && leap); i++)
      g_day_no -= g_days_in_month[i] + (i == 1 && leap);
   gm = i;
   gd = g_day_no+1;

   tempDate.setYear(gy);
   tempDate.setMonth(gm);
   tempDate.setDate(gd);

   retDate.year  = gy;
   retDate.month = gm;
   retDate.date  = gd;
   retDate.weekDay = tempDate.getDay(); // Sun=0, ..., Sat=6

   return retDate;
}


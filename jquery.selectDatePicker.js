/**
 * selectDatePicker jQuery plugin
 * by phongkt
 */
(function(old) {
  $.fn.attr = function() {
    if(arguments.length === 0) {
      if(this.length === 0) {
        return null;
      }

      var obj = {};
      $.each(this[0].attributes, function() {
        if(this.specified) {
          obj[this.name] = this.value;
        }
      });
      return obj;
    }

    return old.apply(this, arguments);
  };
})($.fn.attr);
;(function ( $, window, document, undefined ) {
    var datePickerPlg = 'selectDatePicker',
        defaults = {
            format: "yyyy/mm/dd",
            startYear: 1920,
            endYear: 2000,
            yearReverse: true,
            selectClass: "form-control",
            dayPrefix: "",
            daySuffix: "",
            dayWrapper: "<div/>",
            dayStyle: {},
            dayDefaultText: "",
            dayDefaultValue: "",
            monthPrefix: "",
            monthSuffix: "",
            monthWrapper: "<div/>",
            monthStyle: {},
            monthDefaultText: "",
            monthDefaultValue: "",
            yearPrefix: "",
            yearSuffix: "",
            yearWrapper: "<div/>",
            yearStyle: {},
            yearDefaultText: "",
            yearDefaultValue: "",
            wrapper: "<div/>",
            selectDayWarning: "Please select day again",
            callback: function() {}
        };
    function selectDatePicker( element, options ) {
        this.element = element;
        this.options = $.extend( {}, defaults, options, $(this.element).data()) ;
        this._defaults = defaults;
        this._name = datePickerPlg;
        this.day = $('<select/>').addClass(this.options.selectClass);
        this.day.css(this.options.dayStyle);
        this.month = $('<select/>').addClass(this.options.selectClass).data($(this.element).data());
        this.month.css(this.options.monthStyle);
        this.year = $('<select/>').addClass(this.options.selectClass).data($(this.element).data());
        this.year.css(this.options.yearStyle);
        if($(this.element).data() !== undefined) {
        	var $this = this;
        	$.each($(this.element).data(), function(index, value) {
        		$this.day.attr('data-' + index, value);
        		$this.month.attr('data-' + index, value);
        		$this.year.attr('data-' + index, value);
        	});
        }


        this.errorBlock = $('<div class="alert alert-warning" style="display: none; margin: 5px 0;"/>');
        this.daysInYearMonth = function (year, month) {
            return new Date(year, month, 0).getDate();
        };
        this.onSelectChanged = function() {
        	this.errorBlock.html("").hide();
            if((this.year.val() >= this.options.startYear && this.year.val() <= this.options.endYear) && (this.month.val() >= 1 && this.month.val() <= 12)) {
                var dayVal = this.day.val();
                var days = this.daysInYearMonth(this.year.val(), this.month.val());
                if(dayVal > days) {
                    dayVal = false;
                }
                this.day.html('');
                if(this.options.dayDefaultText.length > 0) {
		        	var option = $('<option/>', {
		        		'value': this.options.dayDefaultValue
		        	}).text(this.options.dayDefaultText);
		        	this.day.prepend(option);
		        }
                for(i=1; i<=days; i++) {
                	var option = $('<option/>', {
                        'value': i
                    }).text(this.options.dayPrefix + i.toString() + this.options.daySuffix);
                    this.day.append(option);
                    if(i == 1 && !this.options.dayDefaultText.length) this.day.val(i);
                    if(this.options.dayDefaultText.length > 0) this.day.val(this.options.dayDefaultValue);
                }
                if(dayVal !== false) {
                    this.day.val(dayVal);
                } else {
                	this.errorBlock.html(this.options.selectDayWarning).show();
                }
                $(this.element).val(this.formatDate(this.year.val(), this.month.val(), this.day.val()));
            } else {
            	$(this.element).val("");
            }
            if(this.options.callback && typeof this.options.callback == 'function') {
                this.options.callback();
            }
        };
        this.onElementChanged = function() {
        	 if($(this.element).val().length > 0) {
        		var date = this.parseDate($(this.element).val());
	            this.year.val(date.getFullYear());
	            this.month.val(date.getMonth() + 1);
	            this.day.val(date.getDate());
	            return true;
        	}
        	return false;
        };
        this.formatDate = function (yearIn, monthIn, dayIn) {
	        var date = new Date(yearIn, monthIn - 1, dayIn),
	        	day = date.getDate(),
		        month = date.getMonth() + 1,
		        year = date.getFullYear(),
		        hours = date.getHours(),
		        minutes = date.getMinutes(),
		        seconds = date.getSeconds();
	        var format = this.options.format;
		    if (!format) {
		        format = "mm/dd/yyyy";
		    }

		    format = format.replace("mm", month.toString().replace(/^(\d)$/, '0$1'));

		    if (format.indexOf("yyyy") > -1) {
		        format = format.replace("yyyy", year.toString());
		    } else if (format.indexOf("yy") > -1) {
		        format = format.replace("yy", year.toString().substr(2, 2));
		    }

		    format = format.replace("dd", day.toString().replace(/^(\d)$/, '0$1'));

		    if (format.indexOf("t") > -1) {
		        if (hours > 11) {
		            format = format.replace("t", "pm");
		        } else {
		            format = format.replace("t", "am");
		        }
		    }

		    if (format.indexOf("HH") > -1) {
		        format = format.replace("HH", hours.toString().replace(/^(\d)$/, '0$1'));
		    }

		    if (format.indexOf("h") > -1) {
		        if (hours > 12) {
		            hours -= 12;
		        }

		        if (hours === 0) {
		            hours = 12;
		        }
		        format = format.replace("h", hours.toString().replace(/^(\d)$/, '0$1'));
		    }

		    if (format.indexOf("i") > -1) {
		        format = format.replace("i", minutes.toString().replace(/^(\d)$/, '0$1'));
		    }

		    if (format.indexOf("s") > -1) {
		        format = format.replace("s", seconds.toString().replace(/^(\d)$/, '0$1'));
		    }

		    return format;
		};

		this.parseDate = function(input) {
			var parts = input.match(/(\d+)/g),
				i = 0,
				fmt = {};
			// extract date-part indexes from the format
			this.options.format.replace(/(yyyy|dd|mm)/g, function(part) { fmt[part] = i++; });
			return new Date(parts[fmt['yyyy']], parts[fmt['mm']]-1, parts[fmt['dd']]);
		};

        this.init();
    }

    selectDatePicker.prototype.init = function () {
        var $this = this;

        this.day.on('change', function() {
            $this.onSelectChanged();
        });
        this.month.on('change', function() {
            $this.onSelectChanged();
        });
        this.year.on('change', function() {
            $this.onSelectChanged();
        });
        $(this.element).on('change', function() {
        	$this.onElementChanged();
        });

        if(this.options.yearDefaultText.length > 0) {
        	var option = $('<option/>', {
        		'value': this.options.yearDefaultValue
        	}).text(this.options.yearDefaultText);
        	this.year.prepend(option);
        }

        for(i=this.options.startYear; i<=this.options.endYear; i++) {
        	var option = $('<option/>', {
        		'value': i
        	}).text(this.options.yearPrefix + i.toString() + this.options.yearSuffix);
        	this.year.append(option);
        	if(i == this.options.startYear && !this.options.yearDefaultText.length) this.year.val(i);
        	if(this.options.yearDefaultText.length > 0) this.year.val(this.options.yearDefaultValue);
        }

        if(this.options.yearReverse) {
            this.year.html('');
            if(this.options.yearDefaultText.length > 0) {
	        	var option = $('<option/>', {
	        		'value': this.options.yearDefaultValue
	        	}).text(this.options.yearDefaultText);
	        	this.year.prepend(option);
        	}
            for(i=this.options.endYear; i>=this.options.startYear; i--) {
	            var option = $('<option/>', {
	        		'value': i
	        	}).text(this.options.yearPrefix + i.toString() + this.options.yearSuffix);
	        	this.year.append(option);
	        	if(i == this.options.endYear && !this.options.yearDefaultText.length) this.year.val(i);
	        	if(this.options.yearDefaultText.length > 0) this.year.val(this.options.yearDefaultValue);
        	}
        }

        if(this.options.monthDefaultText.length > 0) {
        	var option = $('<option/>', {
        		'value': this.options.monthDefaultValue
        	}).text(this.options.monthDefaultText);
        	this.month.prepend(option);
        }
        for(i=1; i<=12; i++) {
        	var option = $('<option/>', {
        		'value': i
        	}).text(this.options.monthPrefix + i.toString() + this.options.monthSuffix);
        	this.month.append(option);
        	if(i == 1 && !this.options.monthDefaultText.length) this.month.val(i);
        	if(this.options.monthDefaultText.length > 0) this.month.val(this.options.monthDefaultValue);
        }

        if(this.options.dayDefaultText.length > 0) {
        	var option = $('<option/>', {
        		'value': this.options.dayDefaultValue
        	}).text(this.options.dayDefaultText);
        	this.day.prepend(option);
        }
        for(i=1; i<=31; i++) {
        	var option = $('<option/>', {
                'value': i
            }).text(this.options.dayPrefix + i.toString() + this.options.daySuffix);
            this.day.append(option);
            if(i == 1 && !this.options.dayDefaultText.length) this.day.val(i);
            if(this.options.dayDefaultText.length > 0) this.day.val(this.options.dayDefaultValue);
        }
        var yearBlock = this.year;
        if(this.options.yearWrapper.length > 0) {
            yearBlock = $(this.options.yearWrapper).html(yearBlock);
        }
        var monthBlock = this.month;
        if(this.options.monthWrapper.length > 0) {
            monthBlock = $(this.options.monthWrapper).html(monthBlock);
        }
        var dayBlock = this.day;
        if(this.options.dayWrapper.length > 0) {
            dayBlock = $(this.options.dayWrapper).html(dayBlock);
        }
        if($.inArray(this.options.format, ["Y/mm/dd", "yyyy/mm/dd", "Y/m/d", "y/m/d"]) !== -1) {
        	var selectBlock = yearBlock.add(monthBlock).add(dayBlock);
        }
        else if($.inArray(this.options.format, ["dd/mm/Y", "dd/mm/yyyy", "d/m/Y", "d/m/y"]) !== -1) {
        	var selectBlock = dayBlock.add(monthBlock).add(yearBlock);
        }
        else {
        	var selectBlock = monthBlock.add(dayBlock).add(yearBlock);
        }
        if(this.options.wrapper.length > 0) {
            $(this.element).attr('type', 'hidden').after($(this.options.wrapper).attr('id', $(this.element).data('id')).addClass('select-date-picker').html(selectBlock).add(this.errorBlock));
        } else {
            $(this.element).attr('type', 'hidden').after(selectBlock.add(this.errorBlock));
        }

        if(!this.onElementChanged()) {
        	this.onSelectChanged();
        }
    };

    $.fn[datePickerPlg] = function ( options ) {
        return this.each(function () {
            if (!$.data(this, 'pkt_' + datePickerPlg)) {
                $.data(this, 'pkt_' + datePickerPlg, 
                new selectDatePicker( this, options ));
            }
        });
    }
})( jQuery, window, document );
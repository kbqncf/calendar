/**
 * @version 1.0.0
 * @author gangli
 * @deprecated 简易日历控件
 */
(function ($, w) {
    var Calendar = function () {
        this.ver = '1.0.0';
    }
    Calendar.prototype = {
        init: function (op) {
            this.args = $.extend({
                wrap: $('#J-calendar'),
                time: [2014, 7, 9],
                skeleton: {
                    nav: '<div class="panel"><span class="btn prev-btn">&lt;</span><div class="info"><span>{{year}}</span>年<span>{{month}}</span>月</div><span class="btn next-btn">&gt;</span></div>',
                    thead: '<thead><tr><th>日</th><th>一</th><th>二</th><th>三</th><th>四</th><th>五</th><th>六</th></tr></thead>',
                    tbody: '<tbody></tbody>',
                    normalCell: '<td></td>'
                },
                skin: 'default',
                callback: null
            }, op || {});
            this.create();
        },
        stuffDate: function (yyyy, mth, dd) {
            mth -= 1;
            var _this = this,
                _startTofill = _this.getFirstDayInMonth(yyyy, mth) + 1,
                _endTofill = _startTofill + _this.getDaysInMonth(yyyy, mth) - 1,
                _strCells = [];
            dd = arguments.length === 3 ? dd : 1;
            //生成7x6的表格
            for (var i = 0, count = 0; i < 6; i++) {
                _strCells.push('<tr>');
                for (var j = 0; j < 7; j++, count++) {
                    if (count >= _startTofill && count <= _endTofill) {
                        if (count < _startTofill + dd - 1) {
                            _strCells.push('<td class="passed">' + (count - _startTofill + 1) + '</td>');
                        }
                        //如果当前日期是设置日期
                        else if (count === _startTofill + dd - 1) {
                            _strCells.push('<td class="current">' + (count - _startTofill + 1) + '</td>');
                        }
                        else {
                            _strCells.push('<td>' + (count - _startTofill + 1) + '</td>');
                        }
                    } else {
                        _strCells.push('<td></td>');
                    }
                }
                _strCells.push('</tr>');
            }
            return _strCells.join('');
        },
        create: function () {
            var _this = this,
                _args = _this.args,
                _build = [],
                _year = _args.time[0],
                _month = _args.time[1],
                _day = _args.time[2];
            _build.push('<div class="calendar">' + _args.skeleton.nav.replace('{{year}}', _year).replace('{{month}}', _month));
            _build.push('<table>' + _args.skeleton.thead);
            _build.push('<tbody>' + _this.stuffDate(_year, _month, _day) + '</tbody></table></div>');
            _args.wrap.html(_build.join(''));
            var $spans = _args.wrap.find('div.panel div.info span');
            _args.elem_year = $spans.eq(0);
            _args.elem_month = $spans.eq(1);
            _args.content = _args.wrap.find('tbody');
            _args.btn = _args.wrap.find('span.btn');
            _this.addListener();
        },
        reflash: function () {
            var _this = this,
                _args = _this.args;
            _args.content.html(_this.stuffDate(_args.time[0], _args.time[1]));
        },
        addListener: function () {
            var _this = this,
                _args = _this.args;
            _args.btn.each(function (i, n) {
                switch (i) {
                    case 0:
                        $(n).on('click', function (e) {
                            --_args.time[1];
                            _args.time[1] === 0 ? (_args.time[1] = 12, _args.time[0] -= 1) : _args.time[1];
                            _this.reflash();
                            _args.elem_year.html(_args.time[0]), _args.elem_month.html(_args.time[1]);
                        });
                        break;
                    case 1:
                        $(n).on('click', function (e) {
                            ++_args.time[1];
                            _args.time[1] > 12 ? (_args.time[1] = 1, _args.time[0] += 1) : _args.time[1];
                            _this.reflash();
                            _args.elem_year.html(_args.time[0]), _args.elem_month.html(_args.time[1]);
                        });
                        break;
                    default :
                        return;
                }
            });
            _args.content.on('click', function (e) {
                var $target = $(e.target), _day = $target.text();
                if (_day !== '') {
                    _args.callback ? _args.callback.apply($target, [_args.time[0], _args.time[1], parseInt(_day)]) : null;
                }
            });
        },
        getDaysInMonth: function (year, month) {
            return new Date(year, month + 1, 0).getDate();
        },
        getFirstDayInMonth: function (year, month) {
            return new Date(year, month, 0).getDay();
        }
    }
    window.Calender = Calendar;
})(jQuery, window);

var Search = (function (w) {
    /* termList示例 {
         type:'',//类型 text select date selectcascader
         label:'',//标题
         placeholder:'',//提示语
         fieldName:'',//字段名
         selectMap:{1:'未开始'},//select数据map
         selectList:[],//select数据列表
         selectListValueName:,//select数据key(仅selectList有效)
         selectListTxtName:,//select数据value(仅selectList有效)
         selectFilter:true,//是否高级搜索
         hidden:true,//是否隐藏
     }*/
    /**
     * @returns {Search.init|init}
     * @constructor
     */
    var Search = function (conf) {
        return new Search.fn.init(conf.elid, conf.termList, conf.vm_q, conf.callback);
    };

    Search.fn = Search.prototype = {
        constructor: Search,
        init: function (elid, termList, vm_q, callback) {
            this.id_dom_parent = elid;
            this.termList = (termList == null ? [] : termList);
            this.vm_q = vm_q;
            this.callback = (callback == null ? function () {} : callback);
            this.viewFilter = [];
            this.id_search_ordinary = 'id_search_ordinary_' + uuid(16);
            this.id_search_filtrate = 'id_search_filtrate_' + uuid(16);
            this.id_btn_filtrate = elid+'id_btn_filtrate_' + uuid(16);
            this.elid = 'id_elid_' + uuid(16);
            this.initView = function () {
                this.initializeView(termList);
            }
        },
        initializeView: function (termList) {
            var parentDom = $('#' + this.id_dom_parent);
            var dom = '<div class="list-search-title-box">'
            + ' <form class="layui-form" style="box-shadow: 0 0 20px #eee;padding-right: 15px;">'
            + '     <section class="jxc-section" style="display: flex;align-items: flex-start;white-space: nowrap;">'
            + '         <div class="card layui-row" style="flex: 1" id="'+this.elid+'"></div>';
          
            if(this.termList != null){
                dom += (
                   '<div style="display: flex;align-items: center;">'
                    + '<a class="layui-btn search-btn" id="'+this.id_dom_parent+'query">查询</a>'
                    + '<a class="layui-btn reset-btn" id="'+this.id_dom_parent+'reset">重置</a>'
                    +'<div id="'+this.id_btn_filtrate+'" style="margin-left: 10px;cursor: pointer;user-select: none;">');
                if(this.termList.length > 3) {
                    dom += '                 <span style="color: #3FACB3;">高级筛选</span>';
                    dom += '                 <img src="../../../statics/images/gjsx2x.png" style="width:14px">';
                }
                dom += '             </div>';
            }
            dom += (
             '         </div>'
            + '     </section>'
            + ' </form>'
            + '</div>'
            );
            parentDom.prepend(dom);
            var parent = $('#' + this.elid);
            //
            var searchView =
                '       <div class="layui-form-item" id="'+this.id_search_ordinary+'">' +
                '           <section id="'+this.id_search_filtrate+'"></section>' +
                '       </div>';
            var flag = true;
            for (let i = 0; i < termList.length ; i++) {
                if(termList[i].selectFilter == true){
                    flag = false;
                    break;
                }
            }
            parent.prepend(searchView);
            this.initSearchItemView();
            this.initClickListener();
            $('#' + this.id_search_filtrate).hide();
        },
        initSearchItemView: function(){
            var search_ordinary = $('#' + this.id_search_ordinary);
            var search_filtrate = $('#' + this.id_search_filtrate);
            var _viewFilter = this.viewFilter;
            var _this = this;
            if (this.termList != null && this.termList.length > 0){
                this.termList.forEach(function (term) {
                    var itemView = '';
                    var viewTag = term.type + '_' + term.fieldName;
                    var ishidden = term.hidden?'style="display: none"':'';
                    switch (term.type) {
                        case 'text':{
                            itemView += '<div class="layui-inline layui-col-md3 layui-col-sm6 layui-col-xs12" style="display: flex;" searchDiv="'+viewTag+'" '+ishidden+'>';
                            itemView += '   <label class="layui-form-label">'+term.label+'</label>';
                            itemView += '   <div class="layui-input-inline">';
                            itemView += '       <input type="text" class="layui-input searchVal" id="'+viewTag+'" placeholder="'+term.placeholder+'" ';
                            if (_this.vm_q[term.fieldName] && String(_this.vm_q[term.fieldName]).length > 0) {
                                itemView += '       value="'+_this.vm_q[term.fieldName]+'"';
                            }
                            itemView += '       autocomplete="off"/>';
                            itemView += '   </div>';
                            itemView += '</div>';
                            _viewFilter.push({type: 'text', filter: viewTag, fieldName: term.fieldName});
                            break;
                        }
                        case 'select':{
                            itemView += '<div class="layui-inline layui-col-md3 layui-col-sm6 layui-col-xs12" style="display: flex;" searchDiv="'+viewTag+'" '+ishidden+'>';
                            itemView += '   <label class="layui-form-label">'+term.label+'</label>';
                            itemView += '   <div class="layui-input-inline">';
                            itemView += '       <select lay-search="" lay-filter="'+viewTag+'" id="'+viewTag+'">';
                            itemView += '           <option value="">全部</option>';
                            if (term.selectMap != null){
                                for (var key in term.selectMap) {
                                    itemView += '<option value="'+key+'" ';
                                    if (_this.vm_q[term.fieldName] && String(_this.vm_q[term.fieldName]).length > 0 && _this.vm_q[term.fieldName] == key) {
                                        itemView += ' selected';
                                    }
                                    itemView += '>'+term.selectMap[key]+'</option>';
                                }
                            }else if (term.selectList != null && term.selectList.length > 0){
                                term.selectList.forEach(function (item) {
                                    itemView += '<option value="'+item[term.selectListValueName]+'"';
                                    if (_this.vm_q[term.fieldName] && String(_this.vm_q[term.fieldName]).length > 0 && _this.vm_q[term.fieldName] == item[term.selectListValueName]) {
                                        itemView += ' selected';
                                    }
                                    itemView += '>';
                                    itemView += item[term.selectListTxtName];
                                    itemView += '</option>';
                                });
                            }
                            itemView += '       </select>';
                            itemView += '   </div>';
                            itemView += '</div>';
                            _viewFilter.push({type: 'select', filter: viewTag, fieldName: term.fieldName});
                            break;
                        }
                        case 'selectmultiple':{
                            itemView += '<div class="layui-inline layui-col-md3 layui-col-sm6 layui-col-xs12" style="display: flex;" searchDiv="'+viewTag+'" '+ishidden+'>';
                            itemView += '   <label class="layui-form-label">'+term.label+'</label>';
                            itemView += '   <div class="layui-input-inline">';
                            itemView += '       <div id="'+viewTag+'"></div>';
                            itemView += '   </div>';
                            itemView += '</div>';
                            var dataList = [];
                            if (term.selectMap != null){
                                for (var key in term.selectMap) {
                                    dataList.push({
                                        name: term.selectMap[key],
                                        value: key
                                    })
                                }
                            }else if (term.selectList != null && term.selectList.length > 0){
                                term.selectList.forEach(function (item) {
                                    dataList.push({
                                        name: item[term.selectListTxtName],
                                        value: item[term.selectListValueName]
                                    })
                                });
                            }
                            _viewFilter.push({type: 'selectmultiple', filter: viewTag, fieldName: term.fieldName, dataList: dataList});
                            break;
                        }
                        case 'date':{
                            itemView += '<div class="flex-box layui-inline layui-col-md12 layui-col-sm12 layui-col-xs12" style="display: flex;" searchDiv="'+viewTag+'" '+ishidden+'>';
                            itemView += '   <label class="layui-form-label">'+term.label+'</label>';
                            itemView += '   <div class="list-search-sup-title new-layui-title">';
                            itemView += '       <div class="task-content-box-tab">';
                            itemView += '           <div class="display task-content-box-tab layui-col-md8 layui-col-sm8 layui-col-xs12" type="'+viewTag+'">';
                            itemView += '               <div value="0" class="layui-col-md2 layui-col-sm2 layui-col-xs2">昨天</div>';
                            itemView += '               <div value="1" class="layui-col-md2 layui-col-sm2 layui-col-xs2">今天</div>';
                            itemView += '               <div value="2" class="layui-col-md2 layui-col-sm2 layui-col-xs2">上周</div>';
                            itemView += '               <div value="3" class="layui-col-md2 layui-col-sm2 layui-col-xs2">本周</div>';
                            itemView += '               <div value="4" class="layui-col-md2 layui-col-sm2 layui-col-xs2">上月</div>';
                            itemView += '               <div value="5" class="layui-col-md2 layui-col-sm2 layui-col-xs2">本月</div>';
                            itemView += '               <div value="6" class="layui-col-md2 layui-col-sm2 layui-col-xs2">本季</div>';
                            itemView += '               <div value="7"class="layui-col-md2 layui-col-sm2 layui-col-xs2">本年</div>';
                            itemView += '           </div>';
                            itemView += '           <div class="layui-col-md3 layui-col-sm4 layui-col-xs12">';
                            itemView += '               <input type="text" class="layui-input" id="'+viewTag+'" readonly placeholder="'+term.placeholder+'" style="width: 300px;" autocomplete="off">';
                            itemView += '           </div>';
                            itemView += '       </div>';
                            itemView += '   </div>';
                            itemView += '</div>';
                            _viewFilter.push({type: 'date', filter: viewTag, fieldName: term.fieldName});
                            break;
                        }
                        case 'dateori':{
                            itemView += '<div class="layui-inline layui-col-md3 layui-col-sm6 layui-col-xs12" style="display: flex;" searchDiv="'+viewTag+'" '+ishidden+'>';
                            itemView += '   <label class="layui-form-label">'+term.label+'</label>';
                            itemView += '   <div class="layui-input-inline">';
                            itemView += '       <input type="text" class="layui-input searchVal" id="'+viewTag+'" readonly placeholder="'+term.placeholder+'" autocomplete="off"/>';
                            itemView += '   </div>';
                            itemView += '</div>';
                            _viewFilter.push({type: 'dateori', filter: viewTag, fieldName: term.fieldName});
                            break;
                        }
                        case 'selectcascader':{
                            itemView += '<div class="layui-inline layui-col-md3 layui-col-sm6 layui-col-xs12" style="display: flex;" searchDiv="'+viewTag+'" '+ishidden+'>';
                            itemView += '   <label class="layui-form-label">'+term.label+'</label>';
                            itemView += '   <div class="layui-input-inline">';
                            itemView += '       <input type="text" class="layui-input searchVal" id="'+viewTag+'" placeholder="'+term.placeholder+'" autocomplete="off" readonly />';
                            itemView += '   </div>';
                            itemView += '</div>';
                            _viewFilter.push({type: 'selectcascader', filter: viewTag, fieldName: term.fieldName, dataList: term.selectList});
                            break;
                        }
                    }
                    if (term.selectFilter){
                        search_filtrate.append(itemView);
                    } else {
                        search_filtrate.before(itemView);
                    }
                });
            }
        },
        initClickListener: function(){
            var _this = this;
            $('#' + this.id_btn_filtrate).on('click', function(){
                _this.selectFilterChange();
            });

            $('#'+this.id_dom_parent+'reset').on('click', function () {
                _this.reset();
            });

            $('#'+this.id_dom_parent+'query').on('click', function () {
                _this.query();
            });

            $('#exports').on('click', function () {
                _this.exports();
            });

            _this.initViewFilter();
        },
        initViewFilter: function(){
            var _this = this;
            if (_this.viewFilter != null && _this.viewFilter.length > 0){
                var hascascader = false;
                _this.viewFilter.forEach(function (filter) {
                    switch (filter.type) {
                        case 'select':{
                            layui.form.on('select('+filter.filter+')', function (data) {
                                Vue.set(_this.vm_q, filter.fieldName, data.value);
                                _this.callback('onChange.select.' + filter.fieldName, data);
                            });
                            break;
                        }
                        case 'selectmultiple':{
                            var selectObj = xmSelect.render({
                                el: ('#'+filter.filter),
                                language: 'zn',
                                data: filter.dataList
                            })
                            filter['selectObj'] = selectObj;
                            break;
                        }
                        case 'date':{
                            layui.laydate.render({
                                elem : ('#'+filter.filter),
                                range : true,
                                trigger: 'click',
                                done: function (value, date, endDate) {
                                    Vue.set(_this.vm_q, filter.fieldName, value);
                                    _this.initializeSearchDate(_this.vm_q, filter.fieldName, value);
                                    $('div[type="'+filter.filter+'"]>div').removeClass('task-content-box-tab-child-active');
                                    _this.callback('onChange.date.' + filter.fieldName, value);
                                }
                            });
                            $('div[type="'+filter.filter+'"]>div').on('click', function(){
                                var selected = $(this);
                                $('div[type="'+filter.filter+'"]>div').removeClass('task-content-box-tab-child-active');
                                selected.addClass('task-content-box-tab-child-active');
                                $('#'+filter.filter).val('');
                                var value = selected.attr('value');
                                var dateValue = _this.getSearchDateByType(value);
                                Vue.set(_this.vm_q, filter.fieldName, dateValue);
                                _this.initializeSearchDate(_this.vm_q, filter.fieldName, dateValue);
                                _this.callback('onChange.date.' + filter.fieldName, value);
                            });
                            break;
                        }
                        case 'dateori':{
                            layui.laydate.render({
                                elem : ('#'+filter.filter),
                                range : true,
                                trigger: 'click',
                                done: function (value, date, endDate) {
                                    Vue.set(_this.vm_q, filter.fieldName, value);
                                    _this.initializeSearchDate(_this.vm_q, filter.fieldName, value);
                                    _this.callback('onChange.dateori.' + filter.fieldName, value);
                                }
                            });
                            break;
                        }
                        case 'selectcascader':{
                            // layui.cascader({
                            //     elem: ('#'+filter.filter),
                            //     data: filter.dataList,
                            //     success: function (valData,labelData) {
                            //         Vue.set(_this.vm_q, filter.fieldName, valData[2]);
                            //     }
                            // });
                            //
                            // layui.config({
                            //     base: "../statics/common/cascader/layui/lay/mymodules/"
                            // }).use(['form',"jquery","cascader","form"], function(){
                            //     layui.cascader({
                            //         elem: ('#'+filter.filter),
                            //         data: filter.dataList,
                            //         success: function (valData,labelData) {
                            //             Vue.set(_this.vm_q, filter.fieldName, valData[2]);
                            //             _this.callback('onChange.selectcascader.' + filter.fieldName, valData);
                            //         }
                            //     });
                            // });
                            hascascader = true;
                            break;
                        }
                    }
                });
                if (hascascader) {
                    layui.config({
                        base: "../../statics/common/cascader/layui/lay/mymodules/"
                    }).use(['form',"jquery","cascader","form"], function(){
                        _this.viewFilter.forEach(function (filter) {
                            if ('selectcascader' === filter.type){
                                layui.cascader({
                                    elem: ('#'+filter.filter),
                                    data: filter.dataList,
                                    success: function (valData,labelData) {
                                        Vue.set(_this.vm_q, filter.fieldName, valData[2]);
                                        _this.callback('onChange.selectcascader.' + filter.fieldName, valData);
                                    }
                                });
                            }
                        });
                    });
                }
            }
        },
        hideItems: function(...itemFieldName){
            if (itemFieldName != null && itemFieldName.length > 0){
                this.searchItemsVisibleChanged(false, itemFieldName);
            }else {
                $('div[searchDiv]').hide();
                this.reset();
            }
        },
        showItems: function(...itemFieldName){
            if (itemFieldName != null && itemFieldName.length > 0){
                this.searchItemsVisibleChanged(true, itemFieldName);
            }else {
                $('div[searchDiv]').show();
            }
        },
        searchItemsVisibleChanged: function(visible, itemFieldName){
            var _this = this;
            itemFieldName.forEach(function (item) {
                var view = $('div[searchDiv$="'+item+'"]');
                if (visible) {
                    if (view.css("display") === 'none'){
                        view.show();
                    }
                }else {
                    if (view.css("display") !== 'none'){
                        view.hide();
                        if (_this.viewFilter != null && _this.viewFilter.length > 0) {
                            _this.viewFilter.forEach(function (filter) {
                                if (filter.fieldName === item) {
                                    var _view = $('#' + filter.filter);
                                    _view.val('');
                                    Vue.set(_this.vm_q, filter.fieldName, null);
                                    switch (filter.type) {
                                        case 'date':{
                                            $('div[type="'+filter.filter+'"]>div').removeClass('task-content-box-tab-child-active');
                                            break;
                                        }
                                        case 'select':{
                                            _view.parent().find('>div>div>input').val('');
                                            break;
                                        }
                                    }
                                }
                            });
                        }
                    }
                }
            });
        },
        selectFilterChange: function(){
            var _this = this;
            var search_filtrate = $('#' + _this.id_search_filtrate);
            var btn_filtrate = $('#' + _this.id_btn_filtrate);
            if (search_filtrate.is(':hidden')){
                search_filtrate.show();
                btn_filtrate.children('i').removeClass('layui-icon-down layui-icon-up');
                btn_filtrate.children('i').addClass('layui-icon-up');
            }else {
                search_filtrate.hide();
                btn_filtrate.children('i').removeClass('layui-icon-down layui-icon-up');
                btn_filtrate.children('i').addClass('layui-icon-down');
            }
        },
        exports: function(){
            var _this = this;
            _this.viewFilter.forEach(function (filter) {
                switch (filter.type) {
                    case 'text':{
                        var view = $('#'+filter.filter);
                        var value = view.val();
                        if (value && (typeof value=='string') && value.constructor == String){
                            value = value.trim();
                        }
                        Vue.set(_this.vm_q, filter.fieldName, value);
                        view.val(value)
                        break;
                    }
                    case 'selectmultiple':{
                        var v = jointStr(',', filter.selectObj.getValue().map(x => {return x.value}))
                        Vue.set(_this.vm_q, filter.fieldName, v);
                        break;
                    }
                }
            });
            // trimQueryParam(_this.vm_q);
            _this.callback('exports');
        },
        query: function(){
            var _this = this;
            _this.viewFilter.forEach(function (filter) {
                switch (filter.type) {
                    case 'text':{
                        var view = $('#'+filter.filter);
                        var value = view.val();
                        if (value && (typeof value=='string') && value.constructor == String){
                            value = value.trim();
                        }
                        Vue.set(_this.vm_q, filter.fieldName, value);
                        view.val(value)
                        break;
                    }
                    case 'selectmultiple':{
                        var v = jointStr(',', filter.selectObj.getValue().map(x => {return x.value}))
                        Vue.set(_this.vm_q, filter.fieldName, v);
                        break;
                    }
                }
            });
            // trimQueryParam(_this.vm_q);
            _this.callback('query');
        },
        reset: function(){
            var _this = this;
            if (_this.viewFilter != null && _this.viewFilter.length > 0){
                _this.viewFilter.forEach(function (filter) {
                    var view = $('#'+filter.filter);
                    switch (filter.type) {
                        case 'date':{
                            $('div[type="'+filter.filter+'"]>div').removeClass('task-content-box-tab-child-active');
                            break;
                        }
                        case 'select':{
                            view.parent().find('>div>div>input').val('');
                            break;
                        }
                        case 'selectmultiple':{
                            filter.selectObj.setValue([]);
                            break;
                        }
                    }
                    view.val('');
                    Vue.set(_this.vm_q, filter.fieldName, null);
                });
            }
            _this.callback('reset');
        },
        initializeSearchDate: function(target, prefix, daterange) {
            var dateSelected = daterange.split(' - ');
            var start = dateSelected[0] + ' 00:00:00';
            var end = dateSelected[1] + ' 23:59:59';
            target[prefix+'start'] = start;
            target[prefix+'end'] = end;
        },
        getSearchDateByType: function(type){
            var _this = this;
            var now = new Date();
            var year = now.getFullYear();
            var month = now.getMonth();
            var day = now.getDate();
            var dayOfWeek = now.getDay();
            var dateValue = '';
            switch (parseInt(type)) {
                case 0:{//昨天
                    var aback = new Date();
                    aback.setDate(now.getDate() - 1);
                    dateValue = _this.formatDate(aback) + ' - ' + _this.formatDate(aback);
                    break;
                }
                case 1:{//今天
                    dateValue = _this.formatDate(now) + ' - ' + _this.formatDate(now);
                    break;
                }
                case 2:{//上周
                    var aback = new Date();
                    aback.setDate(now.getDate() - 7);
                    var aback_year = aback.getFullYear();
                    var aback_month = aback.getMonth();
                    var aback_day = aback.getDate();
                    var aback_dayOfWeek = aback.getDay();
                    dateValue = _this.getWeekStartDate(aback_year, aback_month, aback_day, aback_dayOfWeek) + ' - ' + _this.getWeekEndDate(aback_year, aback_month, aback_day, aback_dayOfWeek);
                    break;
                }
                case 3:{//本周
                    dateValue = _this.getWeekStartDate(year, month, day, dayOfWeek) + ' - ' + _this.getWeekEndDate(year, month, day, dayOfWeek);
                    break;
                }
                case 4:{//上月
                    var nowdays = new Date();
                    var aback_year = nowdays.getFullYear();
                    var aback_month = nowdays.getMonth();
                    if(aback_month==0){
                        aback_month = 12;
                        aback_year = aback_year-1;
                    }
                    dateValue = (aback_year + '-' + _this.formatDayNum(aback_month) + '-01') + ' - ' + (aback_year + '-' + _this.formatDayNum(aback_month) + '-' + _this.getMonthLastday(aback_year, aback_month));
                    break;
                }
                case 5:{//本月
                    dateValue = (year + '-' + _this.formatDayNum(month+1) + '-01') + ' - ' + (year + '-' + _this.formatDayNum(month+1) + '-' + _this.getMonthLastday(year, month+1));
                    break;
                }
                case 6:{//本季
                    if (month == 0 || month == 1 || month == 2) {
                        dateValue = year + '-01-01' + ' - ' + year + '-3-31';
                    }else if (month == 3 || month == 4 || month == 5) {
                        dateValue = year + '-04-01' + ' - ' + year + '-6-30';
                    }else if (month == 6 || month == 7 || month == 8) {
                        dateValue = year + '-07-01' + ' - ' + year + '-9-30';
                    }else if (month == 9 || month == 10 || month == 11) {
                        dateValue = year + '-10-01' + ' - ' + year + '-12-31';
                    }
                    break;
                }
                case 7:{//本年
                    dateValue = year + '-01-01' + ' - ' + year + '-12-31';
                    break;
                }
            }
            return dateValue;
        },
        formatDate: function(date) {
            var year = date.getFullYear();
            var month = date.getMonth()+1;
            var day = date.getDate();
            return (year + '-' + this.formatDayNum(month) + '-' + this.formatDayNum(day));
        },
        formatDayNum: function(num) {
            if(num < 10){
                num = '0' + num;
            }
            return num;
        },
        getWeekStartDate: function(year, month, day, dayOfWeek) {
            var weekStartDate = new Date(year, month, day-(dayOfWeek-1));
            return this.formatDate(weekStartDate);
        },
        getWeekEndDate: function(year, month, day, dayOfWeek) {
            var weekEndDate = new Date(year, month, day + (7 - dayOfWeek));
            return this.formatDate(weekEndDate);
        },
        getMonthLastday: function(year, month) {
            switch (month) {
                case 1:
                case 3:
                case 5:
                case 7:
                case 8:
                case 10:
                case 12:{
                    return 31;
                }
                case 4:
                case 6:
                case 9:
                case 11:{
                    return 30;
                }
                case 2:{
                    if ((year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0)) {
                        return 29;
                    } else {
                        return 28;
                    }
                }
            }
        },
        reSetSelectData: function (type, fieldName, dataConf) {
            var _this = this;
            switch (type) {
                case 'select':{
                    var viewTag = type + '_' + fieldName;
                    var view = $(('#'+viewTag));
                    view.empty();
                    view.append('<option value="">全部</option>');
                    switch (dataConf.type) {
                        case 'map': {
                            for (var key in dataConf.data) {
                                view.append('<option value="'+key+'">'+dataConf.data[key]+'</option>');
                            }
                        }
                        case 'list': {
                            dataConf.data.forEach(function (item) {
                                view.append('<option value="'+item[dataConf.selectListValueName]+'">'+item[dataConf.selectListTxtName]+'</option>');
                            });
                        }
                    }
                    view.parent().find('>div>div>input').val('');
                    view.val('');
                    Vue.set(_this.vm_q, fieldName, null);
                    layui.form.render("select");
                    break;
                }
            }
        }
    };

    Search.fn.init.prototype = Search.fn;

    return Search;
})();

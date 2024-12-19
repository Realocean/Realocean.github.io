document.write('<script src="../../statics/js/upload.js"></script>');

var BpmChart = (function (w) {
    /**
     * @returns {BpmChart.init|init}
     * @constructor
     */
    var BpmChart = function (conf) {
        return new BpmChart.fn.init(conf.elid, conf.instanceId);
    };

    BpmChart.fn = BpmChart.prototype = {
        constructor: BpmChart,
        init: function (elid, instanceId) {
            this.id_dom_parent = elid?elid:'bpmChart';
            this.instanceId = instanceId;
            this.bpmChartList = [];
            this.elid = 'id_elid_' + uuid(16);
            this.initView = function () {
                this.initializeView();
            }
        },
        initializeView: function () {
            var _this = this;
            if (_this.instanceId == null || _this.instanceId === '') {
                return;
            }
            $.ajaxSettings.async = false;
            $.get(baseURL + "activity/bpmApproveList?instanceId=" + _this.instanceId, function (r) {
                _this.bpmChartList = r.bpmChartList;
            });
            $.ajaxSettings.async = true;
            if (_this.bpmChartList == null || _this.bpmChartList.length < 1) {
                return;
            }
            var parentDom = $('#' + this.id_dom_parent);
            var dom = '<div class="car-flowChart">';
            var hasViewTime = false;
            _this.bpmChartList.forEach(node => {
                dom += '<div class="car-flowChart-circle" style="align-items: baseline !important;">';
                dom += '    <div class="car-flowChart-images">';
                if (node.approveStatus == 1) {
                    dom += '    <img class="car-flowChart-icon" src="../../statics/images/point2.png" alt="">';
                    dom += '    <img class="car-flowChart-line" src="../../statics/images/line3.png" alt="">';
                } else {
                    dom += '    <img class="car-flowChart-icon" src="../../statics/images/point.png" alt="">';
                    dom += '    <img class="car-flowChart-line" src="../../statics/images/line4.png" alt="">';
                }
                dom += '    </div>';
                dom += '';
                dom += '    <div class="car-flowChart-content">';
                dom += '        <div class="car-flowChart-status">';
                dom += '            <p class="car-flowChart-title">'+node.userName+'-'+node.nodeName+'</p>';
                if (node.approveTime) {
                    dom += '        <p class="car-flowChart-text">' + node.approveTime + '</p>';
                }
                if (node.approveFileList != null && node.approveFileList.length > 0) {
                    dom += '        <a class="layui-grid-btn-xs viewApproveFile" nodeId="'+node.id+'">查看附件</a>';
                }
                dom += '        </div>';
                dom += '';
                dom += '        <div class="car-flowChart-status-feedback">';
                dom += '            <p class="car-flowChart-title car-flowChar-color">'+node.approveNodeStatus+'</p>';
                if (node.approveStartTime) {
                    hasViewTime = true;
                    dom += '        <p class="car-flowChart-text viewTime" nodeId="'+node.id+'">耗时:' + node.elapsedTime + '</p>';
                }
                dom += '        </div>';
                dom += '';
                dom += '        <div class="car-flowChart-status">';
                if (node.approveContent) {
                    if (node.approveType == 1 || node.approveType == 3) {
                        dom += '      <p class="car-flowChart-title">' + node.approveContent + '</p>';
                    } else {
                        dom += '      <p class="car-flowChart-title">审核意见:' + node.approveContent + '</p>';
                    }
                }
                dom += '              <p class="car-flowChart-text"></p>';
                dom += '        </div>';
                dom += '    </div>';
                dom += '</div>';
            })
            dom += '</div>';
            parentDom.prepend(dom);
            _this.initClickListener();
            if (hasViewTime) {
                _this.initTimeView();
            }
        },
        initClickListener: function(){
            var _this = this;
            $(document).on('click', '.viewApproveFile', function () {
                var nodeId = this.attributes['nodeId'].value.trim();
                var filterList = _this.bpmChartList.filter(function (item) {
                    return item.id == nodeId;
                });
                if (filterList && filterList.length > 0) {
                    var index = layer.open({
                        title: "查看",
                        type: 1,
                        content: '<div id="approvefileview" style="margin-left: 30px"></div>',
                        // btn: ['关闭'],
                        // btnAlign: 'c',
                        success: function (layero, num) {
                            Upload({
                                elid: 'approvefileview',
                                fileLst: filterList[0].approveFileList,
                            }).initView();
                        },
                        end: function () {
                            layer.close(index);
                        }
                    });
                    layer.full(index);
                }
            });
        },
        initTimeView: function(){
            var _this = this;
            setTimeout(function(){
                _this.bpmChartList.forEach(node => {
                    if (node.approveStartTime) {
                        var view = $('p[nodeId="'+node.id+'"]');
                        view.text('耗时:' + _this.getDateDiff(node.approveStartTime));
                    }
                });
                _this.initTimeView();
            },999);
        },
        getDateDiff: function (startTime) {
            var sTime =new Date(startTime.replace(/\-/g, "/")); //开始时间
            var eTime = new Date(); //结束时间
            var nd = 1000 * 24 * 60 * 60;
            var nh = 1000 * 60 * 60;
            var nm = 1000 * 60;
            var ns = 1000;
            var diff = eTime.getTime() - sTime.getTime();
            var day = parseInt(diff / nd);
            var hour = parseInt(diff % nd / nh);
            var min = parseInt(diff % nd % nh / nm);
            var sec = parseInt(diff % nd % nh % nm / ns);
            var diff = '';
            if(day!=0){
                diff += (day+"天")
            }
            if(hour!=0){
                diff += (hour+"小时");
            }
            if(min!=0){
                diff += (min+"分钟");
            }
            if(sec!=0){
                diff += (sec+"秒");
            }
            return diff;
        }
    };

    BpmChart.fn.init.prototype = BpmChart.fn;

    return BpmChart;
})();

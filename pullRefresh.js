$.fn.extend({
    refresh: function(option) {
        var el = $(this);
        var defaults = {
            height:60,//���ô�������ˢ�µľ��룻
            loading_text:$('.loading_text'),//��������������
            loading_icon:$('.loading_icon'),//���ü���icon��������
            coefficient:0.6,//����ϵ����ע������ϵ��ԽС��Խ�Ѵ�����
            pullFunction:function(){},//����ˢ���������ݺ�����
        }
        var settings = $.extend(defaults, option || {}); //init
        console.log(settings)
        var _hasPhone = navigator.userAgent.match(/(iPhone|iPod|Android|ios)/i);
        var height=settings.height;
        var className="loading_icon";
        var _hasTouch = 'ontouchstart' in window;
        var _pulldownConfig = { normalStatus: "��������ˢ��", maxStatus: "�ɿ�����ˢ��", releaseStatus: "���ڼ��ء�" };
        var _start = 0,_end = 0;
        var _TransitionObj = {
            translate: function (height) {
                el.css({ "-webkit-transform": "translate(0," + height + "px)", "transform": "translate(0," + height + "px)" });
            },
            translitionTime: function (time) {
                el.css({ "-webkit-transition": "all " + time + "s", "transition": "all " + time + "s" });
            },
            goDefault: function () {
                _TransitionObj.translitionTime(0.5);
                _TransitionObj.translate(0);
            }
        };
        var flag=true
        var _bindTouchEvents = function () {
            if(_hasPhone){
                el.bind("touchstart", _touchstartHandler);
                el.bind("touchmove", _touchmoveHandler);
                el.bind("touchend", _touchendHandler);
            }else{
                el.bind("mousedown", _touchstartHandler);
                el.bind("mousemove", _touchmoveHandler);
                el.bind("mouseup", _touchendHandler);
            }

        };
        var _touchstartHandler = function (e) {
            flag=false;
            settings.loading_icon.removeClass(className);
            var even = typeof event == "undefined" ? e : event;
            //���浱ǰ���Y����
            _start = _hasTouch ? even.touches[0].pageY : even.pageY;
            if (el.scrollTop() > 0) {
                console.log(el.scrollTop());
                //�������鶯��ʱ��
                _TransitionObj.translitionTime(0);
            }
        };
        var changeHeight;
        var _touchmoveHandler = function (e) {
            if($(document).scrollTop()>=10||flag){
                return
            }
            changeHeight=_end - _start;
            var even = typeof event == "undefined" ? e : event;
            //���浱ǰ���Y����
            _end = _hasTouch ? even.touches[0].pageY : even.pageY;
            if (changeHeight<0||changeHeight>200){
                return
            }
            if (changeHeight*settings.coefficient > height) {
                settings.loading_text.html(_pulldownConfig.maxStatus);
            } else {
                settings.loading_text.html(_pulldownConfig.normalStatus);
            }
            even.preventDefault();
            //�������鶯��ʱ��
            _TransitionObj.translitionTime(0);
            _TransitionObj.translate(changeHeight*settings.coefficient);
        };
        var back=function(){
            _TransitionObj.translate(0)
        }
        var _touchendHandler = function (e) {
            flag=true;
            if($(document).scrollTop()>0){
                return
            }
            //�жϻ��������Ƿ���ڵ���ָ��ֵ
            if (changeHeight*settings.coefficient>= height) {
                settings.loading_icon.addClass(className);
                //���û���ص�ʱ��
                _TransitionObj.translitionTime(1);

                //����ˢ��ʱ������
                settings.loading_text.html(_pulldownConfig.releaseStatus);
                //������ʾ����
                _TransitionObj.translate(40);
                //ִ�лص�����
                settings.pullFunction(3000,function(){ _TransitionObj.translate(0)})


            } else {
                //���س�ʼ״̬
                _TransitionObj.goDefault();
            }
        }
        _bindTouchEvents();
    }
})
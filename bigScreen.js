(function (global) {
    var table;
    var element;
    var layer;
    var laytpl;
    var title;
    // 列表接口
    var url;
    // 列表展示字段
    var cols;
    // 列表的参数
    var wheres;
    var laydate;
    // 单位排名下拉类型
    var dataType;
    // 当前点击的元素
    var el;
    var tableData = [
        {
            name:'安装',
            workTimes:80,
            hight:80,
            footer:80
        },
        {
            name:'安装',
            workTimes:80,
            hight:80,
            footer:80
        },
        {
            name:'安装',
            workTimes:80,
            hight:80,
            footer:80
        },
        {
            name:'安装',
            workTimes:80,
            hight:80,
            footer:80
        },
        {
            name:'安装',
            workTimes:80,
            hight:80,
            footer:80
        }
    ];
    var imgIcon1 = '../bigScreenHtml/img/png/158mdpi.png';
    // 起重机械在用情况一览echart全局变量
    var SURVEY_CURRENT_CHAR = {chart:null,option:null};
    // 当前数据起重机械在用情况一览数据
    var CURRENT_SURVEY_DATA = {};
    var positionArray = [
        {
            msg: "广州市碧湖房地产开发有限公司建设增城荔湖项目",
            name: "增城区",
            propertyCode: "粤ED-S00829",
            superviseOrgId: "8a818a396cae816e016caea618e61237",
            value:['113.82357', '23.27402']
        }
    ];
    layui.use(['element','table','layer','laytpl','laydate'], function() {
        element = layui.element;
        table = layui.table;
        layer = layui.layer;
        laytpl = layui.laytpl;
        laydate = layui.laydate;



    });
    var type;
    type = 1;
    getWorkData(type);
    // 作业情况的tab切换
    $(".tab-ul").on("click", "li", function () {
        $(this)
            .addClass("tab-this")
            .siblings("li")
            .removeClass("tab-this");
        type=Number($(this).attr('data-index'))
        getWorkData(type)
    });
    // 点击从业单位，和特种人员的tab
    $('.right-top .right-head').on('click', 'a', function () {
        console.log($(this));
        // //给当前的a添加高亮，兄弟移除
        $(this).addClass('active').siblings('a').removeClass('active');
        //点击a切换下面的content
        $('.content').eq($(this).index()).show().siblings('.content').hide();
        var text = $(this).innerText;
        getCountCompanyAndDuty(text)


    });
    //实现滚动效果
    //先将marquee里面的子元素克隆
    $('.marquee-view .marquee').each(function (i, item) {
        // console.log(item);
        var rows = $(this).children().clone();
        $(item).append(rows)
    });
    // 点击模块右侧
    $('.operation').off('click').on('click',function () {
        // console.log($(this));
        el=$(this);
        var obj;
        // 单位
        if ($(this).attr('data-method') === 'company'){
            obj= $(this).siblings().eq(2);
        }else if($(this).attr('data-method') === 'area'){
            // 区域
            obj= $(this).siblings().eq(0);
        }else{
            obj= $(this).siblings().eq(1);
        }
        if(obj.css('display')==='none'){
            obj.css('display','block');
            obj.addClass('select-head')
        }else{
            obj.css('display','none');
            obj.addClass('dian')
        }
    });
    // 点击下拉的li
    $('.pull-down').off('click','li').on('click','li',function () {
        dataType = $(this).attr('data-method');
        $(this).addClass('select-this').siblings('li').removeClass('select-this');
        el[0].innerHTML = $(this)[0].innerText;
        getCompanyRanking(dataType)

    });

    // 获取计划作业数据
    function getWorkData(type) {
        var  params={
            businessType:type
        };
        $.ajax({
            url: '/largeScreenData/getPlanWorkData',
            type: 'post',
            data:JSON.stringify(params),
            dataType: 'json',
            contentType: 'application/json',
            async: false,
            success: function (res) {
                // console.log(res)
                var timeData = [];
                var valueArray = [];
                res.data.forEach(item=>{
                    timeData.push(item.time)
                    valueArray.push(item.value)
                })
                getWork(timeData,valueArray,type);

            }
        });
    }
    // 柱状图
    function getWork(timeData,valueArray,typeIndex) {
        var typeIndex = typeIndex;
        var valueArray1 =[];
        valueArray.forEach(item=>{
            if(item!=0){
            valueArray1.push(item)
        }else{
            item=-1;
            valueArray1.push(item)
        }
    })
        var chartDom = document.getElementById('categoryWork');
        var myChart = echarts.init(chartDom);
        var option;


        option = {
            grid: {
                left: '2%',
                top:'16%',
                right: '0',
                bottom: '12%',
                containLabel: true
            },
            xAxis: {
                type: 'category',
                data: timeData,
                axisLabel: {
                    textStyle: {
                        color:'#fff'
                    },
                    fontSize:14
                },
                axisTick:{
                    show: true,
                    lineStyle:{
                        color:'#3277AE'
                    }
                },
                axisLine:{
                    show: true,
                    lineStyle:{
                        color:'#3277AE'
                    }
                }
            },
            yAxis: {
                type: 'value',
                axisLabel: {
                    textStyle: {
                        color:'#fff'
                    },
                    fontSize:14
                },
                axisTick:{
                    show: true,
                    lineStyle:{
                        color:'#3277AE'
                    }
                },
                axisLine:{
                    show: true,
                    lineStyle:{
                        color:'#3277AE'
                    }
                },
                splitLine: {
                    show: false
                }
            },
            series: [
                {
                    showBackground: true,
                    backgroundStyle: {
                        color: 'rgba(180, 180, 180, 0.2)'
                    },
                    data: valueArray,
                    // data: [120, 200, 150, 80, 70, 110, 130],
                    markPoint: {
                        formatter:function(params){
                            return '<img src="'
                                +params.data.symbol.replace('image://','')
                                +'"/>'

                        },
                        // 柱状图上方的图片显示
                        // coord:[0,10],一个参数是我们想要添加icon柱形图的index,第二个是柱形图的value,即我们显示在柱形图上的数据
                        // symbol:是我们添加icon的路径，格式是image://+图片路径
                        data: [
                            { coord:[0,valueArray1[0]], name: 'lala',symbol:'image://../../bigScreenHtml/img/png/categorycircly.png'},
                            { coord:[1,valueArray1[1]], name: 'tiantian' ,symbol:'image://../../bigScreenHtml/img/png/categorycircly.png'},
                            { coord:[2,valueArray1[2]], name: 'weix' ,symbol:'image://../../bigScreenHtml/img/png/categorycircly.png'},
                            { coord:[3,valueArray1[3]], name: 'tiantian',symbol:'image://../../bigScreenHtml/img/png/categorycircly.png' },
                            { coord:[4,valueArray1[4]], name: 'tiantian',symbol:'image://../../bigScreenHtml/img/png/categorycircly.png' },
                            { coord:[5,valueArray1[5]], name: 'weix',symbol:'image://../../bigScreenHtml/img/png/categorycircly.png' },
                            { coord:[6,valueArray1[6]], name: '555',symbol:'image://../../bigScreenHtml/img/png/categorycircly.png'},
                        ],
                        // symbolOffset：使我们icon在柱状图上的位置，分别代表x,y轴的偏移量
                        symbolOffset:[0,8],
                        symbolSize:[35,35]


                    },
                    type: 'bar',

                    itemStyle:{
                        normal:{
                            // 顶部显示数据
                            label:{
                                show:true,
                                position:'top',
                                textStyle: {
                                    color:'#00FFEA',
                                    fontSize:18,
                                },
                            },
                            // 柱状图的渐变色
                            color: new echarts.graphic.LinearGradient(
                                0, 1, 0, 0,
                                [
                                    {offset: 1, color: '#00FFEA'},                  //柱图渐变色
                                    {offset: 0, color: '#12488a'},                   //柱图渐变色

                                ]
                            ),
                            //---图形形状
                            barBorderRadius:[10,10,0,0],
                        },

                    },
                    // 柱状图的宽度
                    barWidth:'10',
                }
            ]
        };

        option && myChart.setOption(option);


        myChart.on('click', function (params) {
            // if (params.componentType === 'series'){
                if (typeIndex===1){
                    title = '近期安装作业'
                }else if(typeIndex===2){
                    title = '近期检测作业'
                }else if(typeIndex===3){
                    title = '近期维保作业'
                }else if(typeIndex===4){
                    title = '近期顶升作业'
                }else if(typeIndex===5){
                    title = '近期拆卸作业'
                }
                url = '/largeScreenData/planWorkDataList';
                cols = [[{
                    type: 'numbers',
                    title: '序号',
                    align: 'center'
                },{
                    field: 'propertyCode',
                    title: '产权编号'
                },{
                    field: 'sectionName',
                    width:'25%',
                    title: '工程名称'
                },{
                    field: 'buildingSiteNum',
                    title: '自编号',
                    align: 'center'
                },{
                    field: 'installCompanyName',
                    title: '安装单位',
                    width:'25%',
                    align: 'left'
                },{
                    field: 'planTime',
                    title: '计划安装时间',
                    align: 'center'
                }]];
                wheres = {
                    businessType:typeIndex
                }
                getOpen(title,table,typeIndex,url,cols,wheres);

            // }
        })
        window.addEventListener("resize", function() {
            // 让我们的图表调用 resize这个方法
            myChart.resize();
        });
    }


    // 获取表格
    getTableWork();
    function getTableWork(){
        table.render({
            elem: '#demo'
            ,height: 312
            ,skin: 'nob'
            // ,url: '/demo/table/user.json' //数据接口
            ,data:tableData
            // ,page: true //开启分页
            ,cols: [[ //表头
                {field: 'name', title: '类型',align:'center'}
                ,{field: 'workTimes', title: '作业次数',align:'center'}
                ,{field: 'hight', title: '高完成度',align:'center'}
                ,{field: 'footer', title: '低完成度',align:'center'}
            ]]
        });
    }
    getCompanyRanking('unit_type_62');
    // 获取单位排名
    function getCompanyRanking(uniType) {
        // 单位
        var companyData = [];
        $.ajax({
            url: '/largeScreenData/companyScoreRanking',
            type: 'post',
            // data:JSON.stringify(params),
            dataType: 'json',
            contentType: 'application/json',
            async: false,
            success: function (res) {
                // console.log(res,'单位排名')
                $('#dateRanking')[0].innerText = res.data.date+'评价排名';
                var htmlStr = '';
                if (uniType === 'unit_type_62'){
                    $('.marquee').html('');
                    companyData=res.data.companyScoreRankingDataVOMap.unit_type_62
                }else if(uniType === 'unit_type_65'){
                    // 切换单位类型时清空html结构
                    $('.marquee').html('');
                    companyData=res.data.companyScoreRankingDataVOMap.unit_type_65;
                }else{
                    $('.marquee').html('');
                    companyData = res.data.companyScoreRankingDataVOMap.unit_type_64;
                }
                for (var i=0;i<companyData.length;i++){
                    htmlStr +='<div class="row" onclick="getCompanyScoreList(this)" data-id='+companyData[i].companyId+'>';
                    if (companyData[i].ranking===1){
                        htmlStr +='<span class="icon-dot">';
                        htmlStr +=' <i class="icon-index">'+companyData[i].ranking+'</i>';
                        htmlStr +=' <svg class="icon_paimingicon" aria-hidden="true">';
                        htmlStr+='<use xlink:href="#icon-paimingicon"></use>';
                        htmlStr +='</svg>';
                        htmlStr +='</span>';
                    }else if (companyData[i].ranking===2){
                        htmlStr +='<span class="icon-dot">';
                        htmlStr +=' <i class="icon-index">'+companyData[i].ranking+'</i>';
                        htmlStr +=' <svg class="icon_paimingicon" aria-hidden="true">';
                        htmlStr+='<use xlink:href="#icon-a-qizhongjidaping169_paiming4"></use>';
                        htmlStr +='</svg>';
                        htmlStr +='</span>';
                    }else if (companyData[i].ranking===3) {
                        htmlStr +='<span class="icon-dot">';
                        htmlStr +=' <i class="icon-index">'+companyData[i].ranking+'</i>';
                        htmlStr +=' <svg class="icon_paimingicon" aria-hidden="true">';
                        htmlStr+='<use xlink:href="#icon-a-qizhongjidaping169_paiming3"></use>';
                        htmlStr +='</svg>';
                        htmlStr +='</span>';
                    }else{
                        htmlStr +='<span class="icon-dot">';
                        htmlStr +=' <i class="icon-index">'+companyData[i].ranking+'</i>';
                        htmlStr +=' <svg class="icon_paimingicon" aria-hidden="true">';
                        htmlStr+='<use xlink:href="#icon-a-qizhongjidaping169_paiming2"></use>';
                        htmlStr +='</svg>';
                        htmlStr +='</span>';
                    }

                    htmlStr +=' <span class="col">'+companyData[i].companyName+'</span>';
                    htmlStr +='<span class="col">作业<span class="titleData">'+companyData[i].jobsNumber+'</span>次</span>';
                    htmlStr +='<span class="col">综合得分<span class="titleData">'+companyData[i].compositeScore+'</span>分</span>';
                    htmlStr +='</div>'
                }
                $('.marquee').append(htmlStr)

            }
        });
    }

    // 获取单位排名列表
    getCompanyScoreList =  function (obj) {
       var id = $(obj).attr('data-id');
        console.log(id );
        url = '/largeScreenData/ydCompanyScoreList';
        cols = [[{
            type: 'numbers',
            title: '序号',
            align: 'center',
            // width: '3%'
        },{
            field: 'propertyCode',
            width:'12%',
            title: '产权编号'
        },{
            field: 'sectionName',
            width:'20%',
            title: '工程名称'
        },{
            field: 'businessType',
            title: '评价环节',
            align: 'center',
            templet: function(d) {
                return manageData(d.businessType);
            }
        },{
            field: 'companyName',
            title: '被评价单位',
            width:'20%',
            align: 'left'
        },{
            field: 'sumScore',
            title: '总分',
            align: 'center'
        },{
            field: 'constructionScore',
            title: '施工单位评分',
            align: 'center'
        },{
            field: 'moniorScore',
            title: '监理单位评分',
            align: 'center'
        },{
            field: 'supervisionScore',
            title: '监督员评分',
            align: 'center'
        }]];
        wheres = {
            id: id
        };
        getOpen('企业排名',table,null,url,cols,wheres)
    };

    // 处理单位排名中的评价环节
    function manageData(businessType) {
        if (businessType === 'evaluation_link_1'){
            return '安装过程'
        }else if (businessType === 'evaluation_link_2'){
            return '顶升过程'
        }else if (businessType === 'evaluation_link_3'){
            return '检测过程'
        }else if (businessType === 'evaluation_link_4') {
            return '维保过程'
        }else{
            return '拆卸过程'
        }


    }

// 点击作业情况和在用设备
    $('.tab').off('click','div').on('click','div',function () {
        console.log($(this),'地图');
        var childEl =$(this).children();
        $(this).addClass('div-title-1').siblings('div').removeClass('div-title-1');
        childEl.addClass('icon-blue');
        $(this).siblings('div').children().removeClass('icon-blue');
        if ($(this)[0].innerText ==' 在用设备'){
            console.log($('.middle-col-title'),'地图');
            $('.tab').css('right','-522px');
            $('#jrzyTitle').hide();
            $('#jrzyry').hide();
            $('#zysbTitle').show();
            $('#useEquipment').show();
            $('#gc').hide()
        }else{
            $('.tab').css('right','-315px');
            $('#jrzyTitle').show();
            $('#jrzyry').show();
            $('#zysbTitle').hide();
            $('#useEquipment').hide();
            $('#gc').show()


        }
    });
    gzMap();
    // 广州地图
    function gzMap(){
        $.get('js/app/json/gz.json', function (sr) {
            console.log(sr)
            echarts.registerMap('myMap', sr);
            var chart = echarts.init(document.getElementById('gz'))
            var option = {
                geo: {
                    map: 'myMap',
                    roam: false,
                    zoom: 1.2,
                    label: {
                        emphasis: {
                            show: false, // 开启悬浮事件
                            // color: "#fff",
                        },
                    },

                    itemStyle: {
                        color: '#ddb926',
                        normal: {
                            borderWidth: 1,//边际线大小
                            borderColor: '#37A5D5',//边界线颜色
                            areaColor: '#04097D',//默认区域颜色
                        },
                        emphasis: {
                            show: false,
                            areaColor: '#04097D',//鼠标滑过区域颜色
                        }

                    },
                },
                series: [{
                    name: "data",
                    type: "effectScatter",
                    coordinateSystem: "geo",
                    type: "custom",
                    markPoint: {
                        formatter:function(params){
                            return '<img src="'
                                +params.data.symbol.replace('image://','')
                                +'"/>'
                                +'<img src="../../bigScreenHtml/img/png/map.png"/>'
                        },
                        // 文字位置
                        label:{
                            position: [20, 15],
                            color:'#fff',
                            fontSize:'16'
                        },
                        // 柱状图上方的图片显示
                        // coord:[0,10],一个参数是我们想要添加icon柱形图的index,第二个是柱形图的value,即我们显示在柱形图上的数据
                        // symbol:是我们添加icon的路径，格式是image://+图片路径
                        data: [
                            { coord:[113.82357, 23.27402], name: 'lala',symbol:'image://../../bigScreenHtml/img/png/biaoz-1.png',value:'增城区'},
                        ],
                        // symbolOffset：使我们icon在柱状图上的位置，分别代表x,y轴的偏移量
                        symbolSize:[120,95],


                    },
                    lineStyle: {
                        normal: {
                            color: "#fff",
                            width: 0,
                            opacity: 0.6,
                            curveness: 0.2,
                        },
                    },
                    itemStyle: {
                        normal: {
                            color: ['#44e5e0'],
                            shadowBlur: 10,
                            shadowColor: "#333",
                        },
                    },
                    data: positionArray
                },
                ]

            };
            chart.setOption(option);
            SURVEY_CURRENT_CHAR.chart = chart;
            SURVEY_CURRENT_CHAR.option = option
            var type
            $(".chart1 .shishi").on("click", "a", function () {
                index = $(this).index()
                $(this).addClass('dianji').siblings('a').removeClass('dianji')
                type = $(this).attr('data-type')
                var craneType = $(this).attr('crane-type');
                var businessType = $(this).attr('business-type');

                // 参数
                GET_SURVEY_PARAM.craneType = craneType;
                GET_SURVEY_PARAM.businessType = businessType;

                // 重新获取数据
                var surveyData = getSurveyData(GET_SURVEY_PARAM);
                var positionArray = assemblySurveyData(surveyData);
                var display = $('.chart1 .shuju').css('display');
                if (display !== 'none') {
                    appendSurveyStatistics(surveyData);
                }
                SURVEY_CURRENT_CHAR.option.series[0].data = positionArray
                SURVEY_CURRENT_CHAR.chart.setOption(SURVEY_CURRENT_CHAR.option,true);
            });
            //设置地图点击事件，判断点击的是哪个区的
            chart.on('click', function (params) {
                // 判断当前点击的是否为markPoint上
                if (params.componentType === 'markPoint'){
                    var title='今日作业次数';
                    getOpen(title,table);
                    return;

                }
                // console.log(params)
                // 点击描点获取名称不正确
                if (params.data) {
                    return
                }
                var city = params.name;
                var positionArray = getPositionArrayBySuperviseOrgName(city);
                console.log(city)
                var data
                if (city === "增城区") {
                    $('.shuju').css('display','none')
                    areaMap('js/app/json/zc.json', positionArray,type)
                    // chart.clear()
                } else if (city === "从化区") {
                    $('.shuju').css('display','none')
                    areaMap('js/app/json/ch.json', positionArray,type)
                } else if (city === "花都区") {
                    $('.shuju').css('display','none')
                    areaMap('js/app/json/hd.json', positionArray,type)
                } else if (city === "白云区") {
                    $('.shuju').css('display','none')
                    areaMap('js/app/json/by.json', positionArray,type)
                } else if (city === "黄埔区") {
                    $('.shuju').css('display','none')
                    areaMap('js/app/json/hp.json', positionArray,type)
                } else if (city === "天河区") {
                    $('.shuju').css('display','none')
                    areaMap('js/app/json/th.json', positionArray,type)
                } else if (city === "越秀区") {
                    $('.shuju').css('display','none')
                    areaMap('js/app/json/yx.json', positionArray,type)
                } else if (city === "荔湾区") {
                    $('.shuju').css('display','none')
                    areaMap('js/app/json/lw.json', positionArray,type)
                } else if (city === "海珠区") {
                    $('.shuju').css('display','none')
                    areaMap('js/app/json/hz.json', positionArray,type)
                } else if (city === "番禺区") {
                    $('.shuju').css('display','none')
                    areaMap('js/app/json/py.json', positionArray,type)
                } else if (city === "南沙区") {
                    $('.shuju').css('display','none')
                    areaMap('js/app/json/ns.json', positionArray,type)
                }


            });
            // 点击画布空白区域时返回广州地图
            chart.getZr().on('click', function (params) {
                if (!params.target) {
                    GET_SURVEY_PARAM.superviseOrgId = ''
                    var surveyData = getSurveyData(GET_SURVEY_PARAM);
                    var positionArray = assemblySurveyData(surveyData);
                    appendSurveyStatistics(surveyData);
                    var colors
                    //var data1
                    if (!type){
                        colors=BUSINESS_TYPE_COLORS.install
                    }else {
                        colors=BUSINESS_TYPE_COLORS[type]
                    }
                    chart = echarts.init(document.getElementById('gz'))
                    var option = {
                        tooltip: {//提示框组件
                            trigger: 'item',
                            backgroundColor: "#03cfd5",
                            extraCssText: 'max-width:200px;word-wrap:break-word;white-space: normal;',
                            formatter: function (params) {
                                var htmlStr = '';
                                // htmlStr += surveyTipFormatter(params);
                                htmlStr +='</br><button class="more" type="button" onclick="">查 看</button>'
                                return htmlStr;
                            }

                        },
                        geo: {
                            map: 'myMap',
                            roam: true,
                            zoom: 1.2,
                            label: {
                                emphasis: {
                                    show: true, // 开启悬浮事件
                                    color: "#fff",
                                },
                                normal: {
                                    show: true,
                                    textStyle: {
                                        color: "#fff",
                                        fontSize: 16,
                                    },
                                },
                            },
                            itemStyle: {
                                color: '#ddb926',
                                normal: {
                                    borderWidth: 2,//边际线大小
                                    borderColor: '#7bc5fe',//边界线颜色
                                    areaColor: '#0c3997',//默认区域颜色
                                },
                                emphasis: {
                                    show: true,
                                    areaColor: '#1b93be',//鼠标滑过区域颜色
                                }

                            },
                        },
                        series: [{
                            name: "data",
                            type: "effectScatter",
                            coordinateSystem: "geo",
                            hoverAnimation: true,
                            lineStyle: {
                                normal: {
                                    color: "#fff",
                                    width: 0,
                                    opacity: 0.6,
                                    curveness: 0.2,
                                },
                            },
                            itemStyle: {
                                normal: {
                                    color: colors,
                                    shadowBlur: 10,
                                    shadowColor: "#333",
                                },
                            },
                            data: positionArray,


                        },
                        ]
                    };
                    chart.setOption(option,true);
                    SURVEY_CURRENT_CHAR.chart = chart;
                    SURVEY_CURRENT_CHAR.option = option;
                    $('.shuju').css('display', 'block')
                }
            })
            window.addEventListener("resize", function () {
                // 让我们的图表调用 resize这个方法
                chart.resize();
            });
        })
    };

    getCountCompanyAndDuty('从业单位');
// 获取从业单位和特人员的数量
function getCountCompanyAndDuty(text) {
    $.ajax({
        url: '/largeScreenData/countCompanyAndDuty',
        type: 'post',
        // data:JSON.stringify(params),
        dataType: 'json',
        contentType: 'application/json',
        async: false,
        success: function (res) {
            if (text === '从业单位'){
                $('#install')[0].innerText = res.data.countCompany.company01;
                $('#detection')[0].innerText = res.data.countCompany.company02;
                $('#maintenance')[0].innerText = res.data.countCompany.company03;
                $('#property')[0].innerText = res.data.countCompany.company04;
            }else{
                $('#SpeciaTotal')[0].innerText = res.data.countDuty.tatol;
                $('#erectorTotal')[0].innerText = res.data.countDuty.duty01;
                $('#deteTotal')[0].innerText = res.data.countDuty.duty02;
                $('#driverTotal')[0].innerText = res.data.countDuty.duty03;
                $('#mainTotal')[0].innerText = res.data.countDuty.duty04;
                $('#safetyTotal')[0].innerText = res.data.countDuty.duty05;
                $('#techTotal')[0].innerText = res.data.countDuty.duty06;
                $('#technicianTotal')[0].innerText = res.data.countDuty.duty07;
                $('#riggerTotal')[0].innerText = res.data.countDuty.duty08;
            }
        }
    });
}
// 获取从业单位列表
$('#companyType').off('click','.layui-col-md6').on('click','.layui-col-md6',function () {
  var companyType = $(this).attr('data-method');
  title = '企业列表';
    url = '/largeScreenData/getCompanyList';
    cols = [[{
        type: 'numbers',
        title: '序号',
        align: 'center'
    },{
        field: 'unitName',
        width:'20%',
        title: '企业名称'
    },{
        field: 'aptitudeTypes',
        width:'20%',
        title: '类型'
    },{
        field: 'unifiedcode',
        width:'18%',
        title: '统一社会信用代码'
    },{
        field: 'address',
        title: '注册地',
        align: 'left'
    }]];
    wheres = {
        companyType:companyType,
        companyName:'',
        unifiedcode:''
    };
    getOpen(title,table,null,url,cols,wheres)
});

// 点击特种人员的弹框
    $('.specialDiv').off('click','.layui-col-md6').on('click','.layui-col-md6',function () {
       var countPersonAge=[];
       var countDuty;
        var ageTotal;
        $.ajax({
            url: '/largeScreenData/countAgeAndCredit',
            type: 'post',
            dataType: 'json',
            contentType: 'application/json',
            async: false,
            success: function (res) {
                ageTotal = res.data.countPersonAge.tatoal;
                countPersonAge = [
                    {value:res.data.countPersonAge.age20,name:'20-30岁'},
                    {value:res.data.countPersonAge.age30,name:'30-40岁'},
                    {value:res.data.countPersonAge.age40,name:'40-50岁'},
                    {value:res.data.countPersonAge.age50,name:'50岁以上'}
                    ];
                countDuty = [
                    res.data.countDuty.credit5,
                    res.data.countDuty.credit6,
                    res.data.countDuty.uncredit
                ]
            }
        });
        var str = '<div class="open-big" style="">';
        str+='<div class="open-title"><span>特种人员统计图</span><span class="layui-icon layui-icon-close" style="font-size: 30px; color: #FFF;"></span></div>';
        str+='<div class="open-continer">';
        str +=' <div class="layui-row" style="height: 100%">';
        str +='<div class="layui-col-md5" style="height: 100%;">';
        str+='<div id="pie"></div>';
        str+='</div>';
        str+='<div class="layui-col-md6" style="height: 100%;">';
        str+='<div id="bar"></div>';
        str+='</div>';
        str+='</div>';
        str+='</div>';
        str+='</div>';
        layer.open({
            type: 1,
            title: false,
            skin: 'special-div',
            area: ['65vw', '60vh'],
            content: str //这里content是一个普通的String
        });

        getPie(countPersonAge,ageTotal);
        getBar(countDuty);
        $('.layui-icon-close').off('click');
        $('.layui-icon-close').on('click',function () {
            layer.closeAll()
        });
    });
// 饼状图
function getPie(countPersonAge,ageTotal) {
    var chartDom = document.getElementById('pie');
    var myChart = echarts.init(chartDom);
    var option;

    option = {
        color:['#e9b51a','#578af1','#56cfa3','#596d90'],
        legend: {
            bottom: '2%',
            left: 'center',
            icon: "circle", //这个字段控制形状
            itemWidth: 10,// 设置宽度
            itemHeight: 10, // 设置高度
            itemGap: 20, // 设置间距
            textStyle: { //图例文字的样式
                color: '#b2b6be',
                fontSize: 14
            },
        },
        graphic: {
            elements: [{
                type: 'text',
                left: 'center',
                top: '45%',
                style: {
                    text: "总",
                    textAlign: 'center',
                    fill: '#fff',
                    width: 30,
                    height: 30,
                    fontSize: 16,
                    // color:'#ffffff'
                }
            }, {
                type: 'text',
                left: 'center',
                top: '50%',
                style: {
                    text: ageTotal, //这里改用实际值
                    textAlign: 'center',
                    fill: '#fff',
                    width: 30,
                    height: 25,
                    fontSize: 14,
                    // color:'red'
                }
            }]
        },
        series: [
            {
                name: 'Access From',
                type: 'pie',
                radius: ['40%', '70%'],
                avoidLabelOverlap: false,
                label: {
                    show: false,
                    position: 'center',
                    normal: {
                        show: true,
                        formatter: function (param) {
                            return param.data.value
                        },
                        textStyle: {
                            fontSize: 14,
                            color: "#fff"
                        },
                    },
                },
                labelLine: {
                    show: true,
                    normal: {
                        lineStyle: {
                            color: 'rgba(255, 255, 255, 0.3)'
                        },
                        smooth: 0.2,
                        length: 15,
                        length2: 12
                    }
                },
                data: countPersonAge
            }
        ]
    };

    option && myChart.setOption(option);
}
// 统计图
function getBar(countDuty) {
    var chartDom = document.getElementById('bar');
    var myChart = echarts.init(chartDom);
    var option;

    option = {
        legend: {
            show:true,
            data:['人员信息'],
            left: 'center',
            itemWidth:10,
            itemHeight:10,
            textStyle: { //图例文字的样式
                color: '#b2b6be',
                fontSize: 14
            },
        },
        xAxis: {
            type: 'category',
            data: ['0-5次', '6次以上', '存疑'],
            axisLabel: {
                textStyle: {
                    color:'#fff'
                },
                fontSize:14,
            },
            axisTick:{
                show: false,
                lineStyle:{
                    color:'#4d5562'
                }
            },
            axisLine:{
                show: true,
                lineStyle:{
                    color:'#4d5562'
                }
            }
        },
        yAxis: {
            type: 'value',
            axisLabel: {
                textStyle: {
                    color:'#fff'
                },
                fontSize:14,
            },
            axisLine:{
                show: false,
            },
            splitLine:{
                show:true,
                lineStyle:{
                    color:'#4d5562'
                }
            }
        },
        series: [
            {
                name:'人员信息',
                data: countDuty,
                type: 'bar',
                itemStyle:{
                    normal:{
                        // 顶部显示数据
                        label:{
                            show:true,
                            position:'top',
                            textStyle: {
                                color:'#fff',
                                fontSize:14,
                            },
                        },
                        // 柱状图的颜色
                        color: '#578af1'
                    },

                },
                // 柱状图的宽度
                barWidth:'25',
            }
        ]
    };

    option && myChart.setOption(option);
}

    getRealMonitoring();
    // 实时监控
    function getRealMonitoring() {
        $.ajax({
            url: '/largeScreenData/countRealData',
            type: 'post',
            dataType: 'json',
            contentType: 'application/json',
            async: false,
            success: function (res) {
                console.log(res.data);
                $('#craneMonitoredTotal')[0].innerText =res.data.craneMonitoredTotal;
                $('#tower')[0].innerText = res.data.tdMonitoredTotal;
                $('#towerPercent')[0].innerText=res.data.tdInstallPercent;
                element.progress('tower', res.data.tdInstallPercent);
                $('#lift')[0].innerText = res.data.liftMonitoredTotal;
                $('#liftPercent')[0].innerText=res.data.liftInstallPercent;
                element.progress('lift', res.data.liftInstallPercent);
                $('#onLine')[0].innerText = res.data.craneOnlineTotal;
                $('#onLinePercent')[0].innerText=res.data.craneOnlinePercent;
                element.progress('onLine', res.data.craneOnlinePercent);
                $('#zyTotal')[0].innerText = res.data.normalTimes;
                $('#bzyTotal')[0].innerText = res.data.alarmTimes

            }
        });
    }

    // 实时监控的列表
    $('.right-middle-top').off('click','.monitoring-title').on('click','.monitoring-title',function () {
        var craneType = $(this).attr('data-method');
        title = '实时监控设备';
        url = '/largeScreenData/realMonitoringList';
        cols = [[{
            type: 'numbers',
            title: '序号',
            align: 'center'
        },{
            field: 'propertyCode',
            title: '产权编号'
        },{
            field: 'sectionName',
            width:'25%',
            title: '工程名称'
        },{
            field: 'buildingSiteNum',
            title: '自编号',
            align: 'center'
        },{
            field: 'craneMonitored',
            title: '是否纳入监控',
            width:'25%',
            align: 'left',
            template:function (d) {
                if (d.craneMonitored){
                    return '是'
                }else{
                    return '否'
                }
            }
        },{
            field: 'craneStatus',
            title: '设备状态',
            align: 'center',
            template:function (d) {
                if (d.craneStatus){
                    return '<span class="iconfont icon-a-qizhongjidaping169_paiming2" style="color: #05abc2"></span>'
                }else{
                    return '<span class="iconfont icon-a-qizhongjidaping169_paiming2" style="color: #bfbfbf"></span>'
                }
            }
        }]];
        wheres = {
            craneType:craneType
        };
        getOpen(title,table,null,url,cols,wheres)
    });
    getTableYw();
    function getTableYw() {
        table.render({
            elem: '#yw'
            ,height: 312
            ,skin: 'nob'
            // ,url: '/demo/table/user.json' //数据接口
            ,data:tableData
            // ,page: true //开启分页
            ,cols: [[ //表头
                {field: 'name', title: '类型',align:'center'}
                ,{field: 'workTimes', title: '办结',align:'center'}
                ,{field: 'hight', title: '平均时效',align:'center'}
                ,{field: 'footer', title: '通过率',align:'center'}
                ,{field: 'footer', title: '一次性通过率',align:'center'}
            ]]
        });
    }
})(this);
function getOpen(title,table,type,url,cols,wheres) {
    var str = '<div class="open-big" style="">';
    str+='<div class="open-title"><span>'+title+'</span><span class="layui-icon layui-icon-close" style="font-size: 30px; color: #FFF;"></span></div>';
    str+='<div class="open-continer">';
    if (title==='今日作业次数'){
        str+='<div class="open-head">';
        str+='<div  class="open-head-1">全部作业<span class="open-head-data">3102</span></div>';
        str+='<div class="open-head-1">安装过程<span class="open-head-data">3102</span></div>';
        str+='<div class="open-head-1">检测过程<span class="open-head-data">3102</span></div>';
        str+='<div class="open-head-1 open-head-1-1">维保过程<span class="open-head-data">3102</span></div>';
        str+='<div class="open-head-1">顶升过程<span class="open-head-data">3102</span></div>';
        str+='<div class="open-head-1">拆卸过程<span class="open-head-data">3102</span></div>';
        str+='</div>'
    }else if(title==='实时监控设备'){
        str+='<div class="open-head" style="justify-content: left">';
        str+='<div class="open-head-1">塔吊总数<span class="open-head-data">3102</span></div>';
        str+='<div class="open-head-1">已装监控<span class="open-head-data">3102</span></div>';
        str+='<div class="open-head-1 open-head-1-1">未装监控<span class="open-head-data">3102</span></div>';
        str+='</div>'
    }
    str+='<div class="form-table">';
    if (title === '企业列表'){

        str +='<form class="layui-form" action="">';
        str +='<div class="layui-col-lg3"><div class="layui-form-item"><label class="layui-form-label">企业名称</label><div class="layui-input-block">';
        str+='<input type="text" name="companyName" placeholder="" autocomplete="off" class="layui-input"> </div> </div></div>';
        str +='<div class="layui-col-lg3"><div class="layui-form-item"><label class="layui-form-label">统一信用代码</label><div class="layui-input-block">';
        str+='<input type="text" name="unifiedcode"  placeholder="" autocomplete="off" class="layui-input"> </div> </div></div>';
        str+='<div class="layui-col-lg6 btn"><div class="layui-form-item">';
        str+='<div class="layui-input-block">';
        str+='<button class="layui-btn" lay-submit lay-filter="submitBtn">查询</button>';
        str+='<button type="reset" class="layui-btn">重置</button>';
        str+='</div>';
        str+='</div>';
        str+='</div>';
        str +='</form>';
    }else if(title != '今日作业次数' && title != '企业列表'&&title !='企业排名'&&title !='实时监控设备'){
        str +='<form class="layui-form" action="">';
        str +='<div class="layui-col-lg3"><div class="layui-form-item"><label class="layui-form-label">产权编号</label><div class="layui-input-block">';
        str+='<input type="text" name="propertyCode" placeholder="" autocomplete="off" class="layui-input"> </div> </div></div>';
        str +='<div class="layui-col-lg3"><div class="layui-form-item"><label class="layui-form-label">工程名称</label><div class="layui-input-block">';
        str+='<input type="text" name="sectionName"  placeholder="" autocomplete="off" class="layui-input"> </div> </div></div>';
        str +='<div class="layui-col-lg3"><div class="layui-form-item"><label class="layui-form-label">计划安装时间</label><div class="layui-input-block">';
        str+=' <input type="text" class="layui-input" id="planTime" name="planTime" placeholder="" /></div> </div></div>';
        str+='<div class="layui-col-lg3 btn" ><div class="layui-form-item">';
        str+='<div class="layui-input-block">';
        str+='<button class="layui-btn" lay-submit lay-filter="submitBtn">查询</button>';
        str+='<button type="reset" class="layui-btn">重置</button>';
        str+='</div>';
        str+='</div>';
        str+='</div>';
        str +='</form>';
    }


    str+='<table id="data-table'+type+'" lay-filter="data-table"></table>';
    str+='</div>';
    str+='</div>';
    str+='</div>';
    str+='</div>';


    layer.open({
        type: 1,
        title: false,
        skin: 'demo-class',
        area: ['65vw', '70vh'],
        content: str //这里content是一个普通的String
    });

    $('.layui-icon-close').off('click');
    $('.layui-icon-close').on('click',function () {
        layer.closeAll()
    });

    layuiUtil.date({
        elem: 'planTime'
    });
    layui.use('form', function(){
        var form = layui.form;

        //监听提交
        form.on('submit(submitBtn)', function(data){
            var params;
            if (title==='企业列表'){
                params={
                    page:1,
                    companyType:wheres.companyType,
                    companyName:data.field.companyName,
                    unifiedcode:data.field.unifiedcode
                };
                console.log(url)
            }else{
                params = {
                    page:1,
                    propertyCode:data.field.propertyCode,
                    sectionName:data.field.sectionName,
                    planTime:data.field.planTime
                };

            }
            table.reload('data-table'+type, {
                 url: url
                ,where: params //设定异步数据接口的额外参数
            });
            return false;
        });
    });

    getDataTable(table,type,url,cols,wheres)
}
// 列表数据
function getDataTable(table,type,url,cols,wheres) {
    table.render({
        id: "data-table"+type,
        elem: "#data-table"+type,
        page: true, //开启分页
        method: "POST",
        skin:'nob',
        url:url,
        where:wheres,
        cols: cols
    });
}
// 从当前起重机械在用情况一览数据根据区域名称获取 echart格式数组
function getPositionArrayBySuperviseOrgName (superviseOrgName) {
    var projectList = getProjectListBySuperviseOrgName(superviseOrgName)
    return assemblyPositionArray(projectList)
}
// 根据区域名称在当前一览数据中获取数据
function getProjectListBySuperviseOrgName (superviseOrgName) {
    var projectList = [];
    if (CURRENT_SURVEY_DATA) {
        var areaDetailList = CURRENT_SURVEY_DATA.areaDetailList;
        if (areaDetailList) {
            for (var i = 0; i < areaDetailList.length; i++) {
                var detail = areaDetailList[i];
                if (superviseOrgName === detail.districtName) {
                    projectList = detail.projectList;
                    break;
                }
            }
        }
    }
    return projectList;
}
//客户类型
var customerType = [
    {
        name:'车辆销售至终端客户',
        code:1
    },{
        name:'渠道客户',
        code:2
    },{
        name:'B端大客户',
        code:3
    },
]


function getCustomerType(type){
    return customerType.find(item=>{
        if(item.code == type){
            return item
        }
    })&&customerType.find(item=>{
        if(item.code == type){
            return item
        }
    }).name
}

//意向等级
var intentionLevel = [
    {
        name:'初意向',
        code:1
    },{
        name:'中意向',
        code:2
    },{
        name:'高意向',
        code:3
    },
]

function getIntentionLevel(type){
    return intentionLevel.find(item=>{
        if(item.code == type){
            return item
        }
    })&&intentionLevel.find(item=>{
        if(item.code == type){
            return item
        }
    }).name
}

//线索来源1、电话营销 2、客户介绍 3、线下到访 4、网络搜索 5、抖音推广 6、渠道合作 7、其他  8、主动来电   9、自己挖掘
var cluesSource = [
    {
        name:'电话营销',
        code:1
    },{
        name:'客户介绍',
        code:2
    },{
        name:'线下到访',
        code:3
    },{
        name:'网络搜索',
        code:4
    },{
        name:'抖音推广',
        code:5
    },{
        name:'渠道合作',
        code:6
    },{
        name:'其他',
        code:7
    },{
        name:'主动来电',
        code:8
    },{
        name:'自己挖掘',
        code:9
    },
]

function getCluesSource(type){
    return cluesSource.find(item=>{
        if(item.code == type){
            return item
        }
    })&&cluesSource.find(item=>{
        if(item.code == type){
            return item
        }
    }).name
}

//跟进结果：1、继续跟进 2、成交 3、战败 4、无效线索
var followResult = [
    {
        name:'继续跟进',
        code:1
    },{
        name:'成交',
        code:2
    },{
        name:'战败',
        code:3
    },{
        name:'无效线索',
        code:4
    }
]

function getFollowResult(type){
    return followResult.find(item=>{
        if(item.code == type){
            return item
        }
    })&&followResult.find(item=>{
        if(item.code == type){
            return item
        }
    }).name
}


//线索记录跟进方式：1、电话 2、微信
var followType = [
    {
        name:'电话',
        code:1
    },{
        name:'微信',
        code:2
    }
]

function getFollowType(type){
    return followType.find(item=>{
        if(item.code == type){
            return item
        }
    })&&followType.find(item=>{
        if(item.code == type){
            return item
        }
    }).name
}
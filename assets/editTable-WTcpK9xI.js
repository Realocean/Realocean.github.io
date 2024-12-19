import{g as D,u as q}from"./gen-DivptXO0.js";import{o as P}from"./type-BjPdWT9T.js";import R from"./basicInfoForm-DgchADQK.js";import G from"./genInfoForm-Bs4Bguv7.js";import{u as O,r as p,d,o as g,l as x,f as o,e,h as r,F as S,c as M,L as Q,M as z,m as h,z as E,p as N,C as H,v as K}from"./index-C6lKsOwd.js";import"./menu-Ch-LqoiY.js";const W={style:{float:"left"}},J={style:{float:"right",color:"#8492a6","font-size":"13px"}},A={style:{"text-align":"center","margin-left":"-100px","margin-top":"10px"}},X=H({name:"GenEdit"}),ne=Object.assign(X,{setup(Y){const v=O(),{proxy:c}=K(),V=p("columnInfo"),C=p(document.documentElement.scrollHeight-245+"px"),y=p([]),w=p([]),U=p([]),i=p({});function $(){const m=c.$refs.basicInfo.$refs.basicInfoForm,n=c.$refs.genInfo.$refs.genInfoForm;Promise.all([m,n].map(k)).then(b=>{if(b.every(s=>!!s)){const s=Object.assign({},i.value);s.columns=w.value,s.params={treeCode:i.value.treeCode,treeName:i.value.treeName,treeParentCode:i.value.treeParentCode,parentMenuId:i.value.parentMenuId},q(s).then(a=>{c.$modal.msgSuccess(a.msg),a.code===200&&T()})}else c.$modal.msgError("表单校验未通过，请重新检查提交内容")})}function k(m){return new Promise(n=>{m.validate(b=>{n(b)})})}function T(){const m={path:"/tool/gen",query:{t:Date.now(),pageNum:v.query.pageNum}};c.$tab.closeOpenPage(m)}return(()=>{const m=v.params&&v.params.tableId;m&&(D(m).then(n=>{w.value=n.data.rows,i.value=n.data.info,y.value=n.data.tables}),P().then(n=>{U.value=n.data}))})(),(m,n)=>{const b=d("el-tab-pane"),u=d("el-table-column"),s=d("el-input"),a=d("el-option"),_=d("el-select"),f=d("el-checkbox"),B=d("el-table"),F=d("el-tabs"),I=d("el-button"),L=d("el-form"),j=d("el-card");return g(),x(j,null,{default:o(()=>[e(F,{modelValue:r(V),"onUpdate:modelValue":n[0]||(n[0]=l=>S(V)?V.value=l:null)},{default:o(()=>[e(b,{label:"基本信息",name:"basic"},{default:o(()=>[e(r(R),{ref:"basicInfo",info:r(i)},null,8,["info"])]),_:1}),e(b,{label:"字段信息",name:"columnInfo"},{default:o(()=>[e(B,{ref:"dragTable",data:r(w),"row-key":"columnId","max-height":r(C)},{default:o(()=>[e(u,{label:"序号",type:"index","min-width":"5%"}),e(u,{label:"字段列名",prop:"columnName","min-width":"10%","show-overflow-tooltip":!0}),e(u,{label:"字段描述","min-width":"10%"},{default:o(l=>[e(s,{modelValue:l.row.columnComment,"onUpdate:modelValue":t=>l.row.columnComment=t},null,8,["modelValue","onUpdate:modelValue"])]),_:1}),e(u,{label:"物理类型",prop:"columnType","min-width":"10%","show-overflow-tooltip":!0}),e(u,{label:"Java类型","min-width":"11%"},{default:o(l=>[e(_,{modelValue:l.row.javaType,"onUpdate:modelValue":t=>l.row.javaType=t},{default:o(()=>[e(a,{label:"Long",value:"Long"}),e(a,{label:"String",value:"String"}),e(a,{label:"Integer",value:"Integer"}),e(a,{label:"Double",value:"Double"}),e(a,{label:"BigDecimal",value:"BigDecimal"}),e(a,{label:"Date",value:"Date"}),e(a,{label:"Boolean",value:"Boolean"})]),_:2},1032,["modelValue","onUpdate:modelValue"])]),_:1}),e(u,{label:"java属性","min-width":"10%"},{default:o(l=>[e(s,{modelValue:l.row.javaField,"onUpdate:modelValue":t=>l.row.javaField=t},null,8,["modelValue","onUpdate:modelValue"])]),_:1}),e(u,{label:"插入","min-width":"5%"},{default:o(l=>[e(f,{"true-label":"1","false-label":"0",modelValue:l.row.isInsert,"onUpdate:modelValue":t=>l.row.isInsert=t},null,8,["modelValue","onUpdate:modelValue"])]),_:1}),e(u,{label:"编辑","min-width":"5%"},{default:o(l=>[e(f,{"true-label":"1","false-label":"0",modelValue:l.row.isEdit,"onUpdate:modelValue":t=>l.row.isEdit=t},null,8,["modelValue","onUpdate:modelValue"])]),_:1}),e(u,{label:"列表","min-width":"5%"},{default:o(l=>[e(f,{"true-label":"1","false-label":"0",modelValue:l.row.isList,"onUpdate:modelValue":t=>l.row.isList=t},null,8,["modelValue","onUpdate:modelValue"])]),_:1}),e(u,{label:"查询","min-width":"5%"},{default:o(l=>[e(f,{"true-label":"1","false-label":"0",modelValue:l.row.isQuery,"onUpdate:modelValue":t=>l.row.isQuery=t},null,8,["modelValue","onUpdate:modelValue"])]),_:1}),e(u,{label:"查询方式","min-width":"10%"},{default:o(l=>[e(_,{modelValue:l.row.queryType,"onUpdate:modelValue":t=>l.row.queryType=t},{default:o(()=>[e(a,{label:"=",value:"EQ"}),e(a,{label:"!=",value:"NE"}),e(a,{label:">",value:"GT"}),e(a,{label:">=",value:"GTE"}),e(a,{label:"<",value:"LT"}),e(a,{label:"<=",value:"LTE"}),e(a,{label:"LIKE",value:"LIKE"}),e(a,{label:"BETWEEN",value:"BETWEEN"})]),_:2},1032,["modelValue","onUpdate:modelValue"])]),_:1}),e(u,{label:"必填","min-width":"5%"},{default:o(l=>[e(f,{"true-label":"1","false-label":"0",modelValue:l.row.isRequired,"onUpdate:modelValue":t=>l.row.isRequired=t},null,8,["modelValue","onUpdate:modelValue"])]),_:1}),e(u,{label:"显示类型","min-width":"12%"},{default:o(l=>[e(_,{modelValue:l.row.htmlType,"onUpdate:modelValue":t=>l.row.htmlType=t},{default:o(()=>[e(a,{label:"文本框",value:"input"}),e(a,{label:"文本域",value:"textarea"}),e(a,{label:"下拉框",value:"select"}),e(a,{label:"单选框",value:"radio"}),e(a,{label:"复选框",value:"checkbox"}),e(a,{label:"日期控件",value:"datetime"}),e(a,{label:"图片上传",value:"imageUpload"}),e(a,{label:"文件上传",value:"fileUpload"}),e(a,{label:"富文本控件",value:"editor"})]),_:2},1032,["modelValue","onUpdate:modelValue"])]),_:1}),e(u,{label:"字典类型","min-width":"12%"},{default:o(l=>[e(_,{modelValue:l.row.dictType,"onUpdate:modelValue":t=>l.row.dictType=t,clearable:"",filterable:"",placeholder:"请选择"},{default:o(()=>[(g(!0),M(Q,null,z(r(U),t=>(g(),x(a,{key:t.dictType,label:t.dictName,value:t.dictType},{default:o(()=>[h("span",W,E(t.dictName),1),h("span",J,E(t.dictType),1)]),_:2},1032,["label","value"]))),128))]),_:2},1032,["modelValue","onUpdate:modelValue"])]),_:1})]),_:1},8,["data","max-height"])]),_:1}),e(b,{label:"生成信息",name:"genInfo"},{default:o(()=>[e(r(G),{ref:"genInfo",info:r(i),tables:r(y)},null,8,["info","tables"])]),_:1})]),_:1},8,["modelValue"]),e(L,{"label-width":"100px"},{default:o(()=>[h("div",A,[e(I,{type:"primary",onClick:n[1]||(n[1]=l=>$())},{default:o(()=>[N("提交")]),_:1}),e(I,{onClick:n[2]||(n[2]=l=>T())},{default:o(()=>[N("返回")]),_:1})])]),_:1})]),_:1})}}});export{ne as default};

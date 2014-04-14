// 0. 前端先验证输入题号的合法性

function range(start, end) {
  //start 和 end 只接受整数
  var rangeArray = []
  if (start < end) {
    for (var i = start; i <= end; i++) {
      rangeArray.push(i);
    }
  } else {
    for (var i = end; i <= start; i++) {
      rangeArray.push(i);
    }
  }
  return rangeArray;
}





// 1. pass进一个 pb-info-group，收集其中的 input value
function get_pb_info_input_val (target) {
  var numVal = $(target).find(".pb-info-num input").val()+",";

  var inputVal = {};
  inputVal.type = $(target).find(".pb-info-type input").val();
  inputVal.need_score = ($(target).find('.need-score:checked').length)? true:false;

  inputVal.fullscore = (inputVal.need_score) ? $(target).find(".pb-info-fullscore input").val() : '';
  inputVal.has_part_score = ($(target).find('input.score-input-mode:checked').val()==="true")? true:false;
  
  
  var pbNumArray = [],
      buffer="",
      rangeStart = rangeEnd = 0,
      waitForRangeEnd = false;

  for(var count = 0; count <= numVal.length-1; count++) {
    // 当输入那位char为数字时
    if( !isNaN(parseInt(numVal[count],10)) ){

      buffer += numVal[count];

    } else if(numVal[count] === "-"){

      rangeStart = parseInt(buffer);
      buffer="";
      waitForRangeEnd = true;

    } else if(numVal[count] === "," || numVal[count] === " " || numVal[count] === "，") {
      if (buffer === "") {
        /*do nothing*/
      } else if(waitForRangeEnd) {

        rangeEnd = parseInt(buffer);
        waitForRangeEnd = false;
        pbNumArray = pbNumArray.concat(range(rangeStart, rangeEnd));
        buffer = "";

      } else {
        pbNumArray.push(parseInt(buffer));
        buffer = "";
      }
      
    } 

  } // end for loop

  pbNumArray = _.sortBy(pbNumArray, function(eachNum) {return eachNum;} );
  var noRepeatArray = [];

  if (pbNumArray.length===1) {
    noRepeatArray = pbNumArray;
  }
  else { 
    var j = 0;
      noRepeatArray[j++] = pbNumArray[0];
    for (i = 1; i < pbNumArray.length; i++) {
      if (pbNumArray[i-1]===pbNumArray[i]) { 
        /*do nothing */ 
      } else {
        noRepeatArray[j++] = pbNumArray[i];
      }
    }
  }

  inputVal.num = noRepeatArray;
  return inputVal;
}

function each_pb_info_html(num,score) {
  var html = '<div class="each-pb-info" id=\"pb-info-'+num+'\">'+
      '<div class="pb-info-target">' + num + 
        '<div class="pb-info-target-score">' + score + '/'+ score + '</div>' +
      '</div>' +
    '</div>'
  return html;
}

// 2. 根据input value 生成题目表的 html
function pb_map_html (targetGroup) {
  var inputVal = get_pb_info_input_val (targetGroup);
  var pbNumArray = inputVal.num

  var htmlContent = '<div class="pb-map-group">';

  for (var i = 0; i < pbNumArray.length; i++) {
    htmlContent += each_pb_info_html(pbNumArray[i],inputVal.fullscore);
  };

  htmlContent +="</div>" // close div.pb-map-group
  return htmlContent;
}


function pb_title_html (targetGroup) {
  var inputVal = get_pb_info_input_val (targetGroup);
  var htmlTitle = '<div class="pb-info-title">';
  var scoreConfig = "";

  htmlTitle += '<span class="pb-type-title">' + inputVal.type + '</span>';

  if (inputVal.need_score === true) {
    scoreConfig += "（";
    if (inputVal.need_score===true) {
      scoreConfig += "默认每题" + inputVal.fullscore + "分&nbsp&nbsp";}
    if (inputVal.has_part_score===true){
      scoreConfig += "计分方式：输入得分";
    } else { 
      scoreConfig += "计分方式：错则0分";
    }
    scoreConfig += "）";
  }


  htmlTitle += scoreConfig;
  htmlTitle += '</div>';
  return htmlTitle;
}

// 准备object模型，为最终生成json准备
function pbInfoProto(){
  this.id = "";
  this.type = "";
  this.fullscore = 0;
  this.has_part_score = false;
  this.has_children = false;
  this.father_id = "";
  this.need_score = false;
  this.correct = true;
}





function add_pb_info_group () {

  var pbInfoIdPrev = $(".exam-setup").find(".pb-info-group").last().attr("id");

  var groupNum = parseInt(get_num_from_string(pbInfoIdPrev)) + 1;
  var radioNameArr = ["nanny","pappy","mommy","daddy","brother","sister"];

  var new_pb_info_group_html =
  '<div class="form-group pb-info-group" id="pb-info-group-' + groupNum + '\">'+
  '<div class="pb-info-title"></div>'+
  '<div class="pb-info-inputs">'+
    '<div class="group-as-inline">'+
      '<label class="pb-info-type">题型&nbsp'+
        '<input type="text">&nbsp'+
        '<div class="pb-type-select-wrapper">'+
        '</div>'+
      '</label>'+
      '<label class="pb-info-num">题号范围&nbsp'+
        '<span class="input-tooltip-wrapper">'+
          '<input type="text" placeholder="例: 1-9,15,17">&nbsp'+
          '<div class="success-tick">ok</div>'+
          '<div class="error-cross">&#215</div>'+
          '<div class="tooltip"><div class="arrow"></div><div class="tooltip-content"></div></div>'+
        '</span>'+
      '</label>'+
      '<label><input class="need-score" type="checkbox" value="true">统计分数&nbsp</label>&nbsp'+
      '<a class="btn gen-btn">生成题号表</a>'+
    '</div>'+
    '<div class="need-score-config"></div>'+
  '</div>'+
  '<div class="pb-map"></div>'+
  '<div class="pb-info-config" style="display:none;"><hr>'+
    '<table>'+
      '<tr><td rowspan="2">'+
        '<div class="pb-icon-wrapper"><div class="pb-icon-basestyle pb-icon">?</div></div>'+
      '</td>'+
      '<td class="config-detail">'+
        '<span class="input-group"><label>添加小题<input type="checkbox" class="each-sub-toggle"> </label></span>'+
        '<span class="input-group each-sub-config" style="display:none;"><label>本题下有<input type="text" maxlength="2" class="each-sub-input">小题&nbsp&nbsp</label><a class="gen-sub-btn">生成小题</a></span>'+
      '</td></tr>'+
      '<tr>'+
        '<td class="config-detail">'+
          '<span class="input-group"><label>统计分数<input type="checkbox" class="each-fullscore-toggle"> </label></span>'+
          '<span class="each-fullscore-config" style="display:none;">'+
            '<span class="input-group"><label>本题分值<input type="text" class="each-fullscore-input"></label></span>'+
            '<span class="input-group">计分方式'+
              '<label><input type="radio" name=\"' + radioNameArr[groupNum-1] +'\" checked="checked" class="each-input-mode" value="">错则0分</label>'+
              '<label><input type="radio" name=\"' + radioNameArr[groupNum-1] + '\" class="each-input-mode" value="true">输入得分</label>'+
            '</span>'+
          '</span>'+
        '</td>'+
        '<td class="config-null">点选上面的题号可对其单独设置参数</td>'+
      '</tr>'+
    '</table></div></div>'

  $(new_pb_info_group_html).insertBefore("#add-pb-info-group");
  setTimeout(function(){activate_gen_function();},100);
  $(".gen-btn").on("click", function(){
    do_gen($(this).parents(".pb-info-group"));
  });

}


function get_class_list() {
  var class_list =[];
  for (var i = 0; i < $("#class-list").find("input").length; i++) {
    console.log(i);
    class_list.push( $("#class-list").find("input:nth-child("+(i+1)+")").val() );
  };
  class_list.removeByValue("");
  return class_list;
}


function testCreateStatistic() {
  var prefix = 'http://42.96.165.209:8192';
  // var prefix = 'http://localhost:8192';
  var url = prefix+'/create/statistic';
  // fields and default values of a 'problem': id, type, score=0, has_part_score=False, is_sub=False, parent_id=None

  
  var PostData = {
    project_name: "",
    creator_id:'teacher0',
    class_list:[],
    problems:[]
  };

  PostData.project_name = $("#project-name").val();
  PostData.class_list = get_class_list();
  PostData.problems = problemsArray;

  $.ajax({
    url: url,
    type: 'POST',
    data: {data: JSON.stringify(PostData)},
    crossDomain: true,
    dataType: "json",
    success: function(result) {
      console.log(result);
    }
  });
}

function need_score(checkbox){
  var scoreConfigHtml = ''+
  '<label class="pb-info-fullscore">默认每题分值'+
    '<span class="input-tooltip-wrapper">'+
      '<input type="text" maxlength="2">'+
      '<div class="success-tick">ok</div>'+
      '<div class="error-cross">&#215</div>'+
      '<div class="tooltip"><div class="arrow"></div><div class="tooltip-content"></div></div>'+
    '</span>'+
  '</label>'+'默认计分方式'+
  '<label><input type="radio" value="false" class="score-input-mode" name="mode-group-'+ 1 +'\" checked="checked">错则0分</label>'+
  '<label><input type="radio" value="true" class="score-input-mode" name="mode-group-'+ 1 +'\">输入得分</label>';
  
  if (checkbox.checked) { 
    $(checkbox).parents(".pb-info-group").find(".need-score-config").html(scoreConfigHtml);
    setTimeout(function(){activate_gen_function();},100);
  } else {
    $(checkbox).parents(".pb-info-group").find(".need-score-config").html("");
  }  
}



function input_validation(input) {
  // onblur时候触发该判断语句
  var numVal = $(input).val();
  var numCount = 0;
  for(var i=0; i <= numVal.length-1; i++){

    if( isNaN(parseInt(numVal[i])) && numVal[i]!=","&& numVal[i]!="，" && numVal[i]!=" " && numVal[i]!="-" ) {

      return '只能输入数字和分隔符[空格、逗号(,)、或连字符(-)]'

    } else if (numVal[i] == "-" && (isNaN(parseInt(numVal[i-1])) || isNaN(parseInt(numVal[i+1]))) ) {

      return '连字符(-)的前后应该紧跟数字，表示题号范围'

    } else {
      numCount += (!isNaN(parseInt(numVal[i])))? 1:0;
    }

  } // end for loop

  if (numCount > 0){
    return "success";
  } else {
    return "请输入题号，用空格或逗号(,)分隔，或用连字符(-)表示题号范围"
  }
}


function fullscore_validation(input){
  var numVal = $(input).val();
  var numCount = 0;
  for(var i=0; i <= numVal.length-1; i++){
    if (isNaN(parseInt(numVal[i]))) {
      return "只能输入数字";
    } else {
      numCount += (!isNaN(parseInt(numVal[i])))? 1:0;
    }
  }
  if (numCount > 0){
    return "success";
  } else {
    return "请输入每题分值";
  }
}




function show_validate_message(target, string){
  var tooltip = $(target).siblings(".tooltip"), 
      tick = $(target).siblings(".success-tick"),
      x = $(target).siblings(".error-cross");
  if(string==="success"){
    $(tick).show();
    $(x).hide();
    return true;
  } else{
    $(tick).hide();
    $(x).show();
    $(tooltip).find(".tooltip-content").html(string);
    $(tooltip).show();
    setTimeout(function(){
      $(tooltip).css({transition:"all 0.5s"});
    },10);
    setTimeout(function(){
      $(tooltip).css({opacity:1});
    },200);
    setTimeout(function(){
      $(tooltip).css({opacity:0});
    },2000);
    setTimeout(function(){
      $(tooltip).hide();
    },3000);
    return false;
  }
}

var gang, bang;
var do_validation = {

  once: function(targetInput){
    
    this.cancel();
    this.timeoutID = setTimeout( function(){
      gang = show_validate_message(targetInput, input_validation(targetInput));
    }, 400);
    return gang;
  },
  cancel: function(){
    window.clearTimeout(this.timeoutID);
    delete this.timeoutID;
  }
}

var do_fullscore_validation = {
  once: function(targetInput){
    this.cancel();
    this.timeoutID = setTimeout( function(){
      bang = show_validate_message(targetInput, fullscore_validation(targetInput));
    }, 400);
    return bang;
  },
  cancel: function(){
    window.clearTimeout(this.timeoutID);
    delete this.timeoutID;
  }
}


function gen_validation(targetGroup) {
  var input_success = do_validation.once($(targetGroup).find(".pb-info-num input")),
      fullscore_success;

  if ($(targetGroup).find(".need-score").is(":checked")){
    fullscore_success = do_fullscore_validation.once($(targetGroup).find(".pb-info-fullscore input"));
    if (input_success&&fullscore_success){

      return true;
    } else if (input_success){

      return "请填每题分数";
    } else if (fullscore_success){

      return "请正确填写题号范围";
    } else {
      
      return "请正确填写题号范围和每题分数";
    }
  } else {
    if (input_success){
      return true;
    } else {
      return "请正确填写题号范围";
    }
  }
}

var problemsArray = [];
var pbGroupIdTypeLog = [];

function do_gen(targetGroup){
  var inputVal = get_pb_info_input_val(targetGroup), 
      htmlContent = pb_map_html (targetGroup),
      htmlTitle = pb_title_html (targetGroup);
  var validate_result = gen_validation(targetGroup);
  
  var groupIdTypePair = {};
  groupIdTypePair.id = $(targetGroup).attr("id");
  groupIdTypePair.type = inputVal.type;
  pbGroupIdTypeLog.push(groupIdTypePair);
  
  var problemsArrayPartial = [];
  if (validate_result===true) {
    console.log("test");
    for (var i = 0; i<inputVal.num.length; i++) {
      var eachPbInfo = new pbInfoProto();
      eachPbInfo.id = inputVal.num[i].toString();
      eachPbInfo.type = inputVal.type;
      eachPbInfo.need_score = inputVal.need_score;
      eachPbInfo.fullscore = (inputVal.need_score)? parseInt(inputVal.fullscore):null;
      eachPbInfo.has_part_score = inputVal.has_part_score;

      problemsArrayPartial.push(eachPbInfo);
    }

    problemsArray = problemsArray.concat(problemsArrayPartial);

    $(targetGroup).find(".pb-map").html(htmlContent);
    $(targetGroup).find(".pb-info-inputs").hide();
    $(targetGroup).find(".pb-info-title").html(htmlTitle);
    $(targetGroup).find(".pb-info-config").show();
    setTimeout(function(){activate_gen_function();},100);

  } else  {
    console.log(validate_result);
  }
}



var curSelectObj={};
var curSelectArray=[];

function get_num_from_string(string){
  var buffer="";
  for (var i = 0; i < string.length; i++) {
    if (!isNaN(parseInt(string[i],10))||string[i]==="."){
      buffer+=string[i];
    }
  }
  return buffer;
}

function pb_info_select_unselect(){
  $(document).on("click",function(){
    var curTarget = $(event.target);

    // 逻辑 1
    if($(curTarget).closest(".pb-info-group").length!=0){
      // 记录现在点击的pb-info-group是什么题型
      var curGroupId = $(curTarget).closest(".pb-info-group").attr("id");
      var curType = pbGroupIdTypeLog.getById( curGroupId ).type;
      curSelectArray.keeyObjWithType(curType);
      $(".pb-info-group").not("#"+curGroupId).find(".selected").removeClass("selected");

    }

    // 逻辑 2
    if(0 === $(event.target).closest(".pb-info-target,.pb-info-config").length ) {
      // 如果没点到 target 或 config，就取消选中所有已选中的东西
      $(".selected").removeClass("selected");
      curSelectObj={};
      curSelectArray=[];
      configPanel.render($(event.target).closest(".pb-info-group"));

    } else if( $(event.target).closest(".pb-info-target").length!=0 ){
      curTarget = $(event.target).closest(".pb-info-target");
      // 如果点到pb-info-target，首先找到其题目Obj.id：
      var pbNumId = get_num_from_string($(curTarget).closest(".each-pb-info").attr("id"));

      // 情况一：如果不是selected，则选中
      if(!$(curTarget).hasClass("selected")){

        $(curTarget).addClass("selected");
        curSelectObj = problemsArray.getById(pbNumId);
        curSelectArray.push(curSelectObj);

      } else {
        // 情况二：如果是selected，则取消选中，并从curSelectArray里删除
        $(curTarget).removeClass("selected");
        curSelectArray.removeById(pbNumId);
      }
      configPanel.render($(event.target).closest(".pb-info-group"));
    }
    
    console.log(curSelectArray);
  });
}



function sub_toggle_action (thisSubToggle){
  console.log("sub toggle");
  if( $(thisSubToggle).is(":checked") ){
    for (var i = 0; i < curSelectArray.length; i++) {
      
    }
    $(thisSubToggle).closest("tr").find(".each-sub-config").show();
  } else {
    for (var i = 0; i < curSelectArray.length; i++) {
      curSelectArray[i].has_children = false;
    }
    $(thisSubToggle).closest("tr").find(".each-sub-config").hide();
  }
}

function fullscore_toggle_action (thisfullscoreToggle){
  console.log("fscore toggle");
  if( $(thisfullscoreToggle).is(":checked") ){
    $(thisfullscoreToggle).closest("tr").find(".each-fullscore-config").show();
    
    for (var i = 0; i < curSelectArray.length; i++) {
      curSelectArray[i].need_score = true;
    }
  } else {
    for (var i = 0; i < curSelectArray.length; i++) {
      curSelectArray[i].need_score = false;
    }
    $(thisfullscoreToggle).closest("tr").find(".each-fullscore-config").val(null).hide();
  }
}



// MMM

function each_pb_info_html(num,score) {
  var html = '<div class="each-pb-info" id=\"pb-info-'+num+'\">'+
      '<div class="pb-info-target">' + num + 
        '<div class="pb-info-target-score">' + score + '/'+ score + '</div>' +
      '</div>' +
    '</div>'
  return html;
}

// 2. 根据input value 生成题目表的 html
function pb_map_html (targetGroup) {
  var inputVal = get_pb_info_input_val (targetGroup);
  var pbNumArray = inputVal.num

  var htmlContent = '<div class="pb-map-group">';

  for (var i = 0; i < pbNumArray.length; i++) {
    htmlContent += each_pb_info_html(pbNumArray[i],inputVal.fullscore);
  };

  htmlContent +="</div>" // close div.pb-map-group
  return htmlContent;
}




function gen_sub(btn){
  
  var subNum = parseInt($(btn).closest(".each-sub-config").find(".each-sub-input").val());

  if ( !isNaN(subNum) ){
    
    var fatherPbArray = [];
    var subPbArray = [];

    for (var i = 0; i < curSelectArray.length; i++) {
      curSelectArray[i].has_children = true;
      fatherPbArray.push(curSelectArray[i]);
    }

    for (var j = 0; j < fatherPbArray.length; j++) {
      
      for (var i=subNum; i>=1; i--){
        var subPbObj = new pbInfoProto();
        subPbObj.type = fatherPbArray[j].type;
        subPbObj.need_score = (subPbObj.type==="填空题")? fatherPbArray[j].need_score : false ;
        subPbObj.fullscore = (subPbObj.type==="填空题"&&subPbObj.need_score)? parseInt(fatherPbArray[j].fullscore/subNum) : null;
        subPbObj.has_part_score = false;
        subPbObj.has_children = false;

        subPbObj.father_id = fatherPbArray[j].id;
        subPbObj.id = fatherPbArray[j].id+'.'+i;
        subPbArray.push(subPbObj);
      } 
    }

    problemsArray.concat(subPbArray); //至此小题应该已经输入problemsArray
    console.log(subPbArray);

  } else {
    console.log("can't gen sub");
    return false;
  }
}





var configPanel = {
  
  input: function(){

    var interval_id_1, interval_id_2;

    $(".each-fullscore-input").on("focus", function(){
      var targetInputUnit = $(this);
      interval_id_1 = setInterval(function(){
        for (var i = 0; i < curSelectArray.length; i++) {
          curSelectArray[i].fullscore = $(targetInputUnit).val();
          $("#pb-info-"+curSelectArray[i].id).find(".pb-info-target-score").html(curSelectArray[i].fullscore+'/'+curSelectArray[i].fullscore);
        }
      },200);
    });

    $(".each-fullscore-input").on("blur", function(){
      clearInterval(interval_id_1);
    });

    $(".each-input-mode").on("focus", function(){
      var targetInputUnit = $(this);
      interval_id_2 = setInterval(function(){
        for (var i = 0; i < curSelectArray.length; i++) {
          curSelectArray[i].has_part_score = ($(targetInputUnit).is(":checked")) ? Boolean($(targetInputUnit).val()) : ! Boolean($(targetInputUnit).val());
        }
      },200);
    });

    $(".each-input-mode").on("blur", function(){
      clearInterval(interval_id_2);
    });

  },

  oneSelect: function(targetPanel){

    $(".config-null").hide();
    $(".config-detail").show();
    $(targetPanel).find(".pb-icon").html(curSelectArray[0].id).addClass("pb-icon-on");
    
    if(curSelectArray[0].has_children===true){
      $(targetPanel).find(".each-sub-input").val(problemsArray.countByFatherId(curSelectArray[0].id));
      $(targetPanel).find(".each-sub-toggle").prop("checked",true);
      $(targetPanel).find(".each-sub-config").show();
    } else {
      $(targetPanel).find(".each-sub-toggle").prop("checked",false);
      $(targetPanel).find(".each-sub-config").hide();
    }

    if(curSelectArray[0].need_score===true){
      $(targetPanel).find(".each-fullscore-input").val(curSelectArray[0].fullscore);
      $(targetPanel).find(".each-fullscore-toggle").prop("checked",true);

      if(curSelectArray[0].has_part_score===true){
        $(targetPanel).find(".each-input-mode[value='true']").prop("checked",true);
      } else {$(targetPanel).find(".each-input-mode[value='']").prop("checked",true);}

      $(targetPanel).find(".each-fullscore-config").show();

    } else {
      $(targetPanel).find(".each-fullscore-toggle").prop("checked",false);
      $(targetPanel).find(".each-fullscore-config").hide();
    }
    
  },
  noneSelect: function(targetPanel){

    $(".config-null").show();
    $(".config-detail").hide();
    $(".pb-info-config").find(".pb-icon").html("?").removeClass("pb-icon-on");

  },

  multiSelect: function(targetPanel){
    $(targetPanel).find(".pb-icon").html('x'+curSelectArray.length).addClass("pb-icon-on");
    $(targetPanel).find(".each-fullscore-toggle").prop("checked",false);
    $(targetPanel).find(".each-fullscore-config").hide();

  },

  render: function(targetGroup){
    
    var configTarget= $(targetGroup).find(".pb-info-config");
    if(curSelectArray.length===0){this.noneSelect(configTarget);}
    if(curSelectArray.length===1){this.oneSelect(configTarget);}
    if(curSelectArray.length>1){this.multiSelect(configTarget);}
  }
}


var presetPbTypes = ['选择题','填空题','问答题'];

function pbTypeDropdown(placeholder){
  var htmlContent = '<div class="pb-type-select">';
  var skipIndex = [];
  for (var i = 0; i < pbGroupIdTypeLog.length; i++) {
    if (-1 != presetPbTypes.indexOf(pbGroupIdTypeLog[i].type) ) {
      // 也就是说tmd在typeLog里居然找到这个type了，那就记下这个type的index
      skipIndex += presetPbTypes.indexOf(pbGroupIdTypeLog[i].type);
    }
  }

  for (var i = 0; i < presetPbTypes.length; i++) {
    if (skipIndex.indexOf(i)===-1) {
      // 在skipIndex里找不到这个index，也即可以用
      htmlContent += '<a class="each-type">' + presetPbTypes[i] + '</a>';
    }
  }
  htmlContent+='</div>';
  $(placeholder).html(htmlContent);
  activate_gen_function();
}



// 对新加入的pb-info-group中各个元素对应的函数要重新加载
function activate_gen_function () {
  // group内一个按钮，还有3个input要重新加载
  $(".each-type").on("click",function(){
    
    $(this).parents(".pb-info-type").find("input").val($(this).html());
  });
  // 题号范围
  $(".pb-info-num input").keyup(function(){
    do_validation.once(this);
  });
  $(".pb-info-num input").on("focus",function(){
    do_validation.once(this);
  });

  // 题型下拉菜单生成，以及输入validation
  $(".pb-info-type input").on("focus",function(){
    pbTypeDropdown($(this).siblings(".pb-type-select-wrapper"));
  });

  $(".pb-info-type input").on("blur",function(){
    var targetInput = $(this);
    setTimeout(function(){
      $(targetInput).siblings(".pb-type-select-wrapper").html("");
    },200);
  });


  $(".pb-info-fullscore input").keyup(function(){
    do_fullscore_validation.once(this);
  });
  $(".pb-info-fullscore input").on("focus",function(){
    do_fullscore_validation.once(this);
  });


  $(".need-score").on("click",function(){
    need_score(this);
  });

  $(".each-sub-toggle").on("click", function(){
    sub_toggle_action(this);
  });

  $(".each-fullscore-toggle").on("click", function(){
    fullscore_toggle_action(this);
  });

  pb_info_select_unselect();

}


// function watcher(){
//   var disID
//   setInterval(function(){

//   },100);
//   problemsArray.getById(disID)
//   get_num_from_string($(".pb-info-target-score").parents(".each-pb-info").attr("id"))
// }


$(document).ready(function(){
  
  activate_gen_function();
  configPanel.input();
  $(".gen-btn").on("click", function(){
    do_gen($(this).parents(".pb-info-group"));
  });

  $(".add-class-btn").click(function(){
    $('<input type="text" class="each-class">').insertBefore(this);
  });
  $("#add-pb-info-group").on("click", function(){
    add_pb_info_group();
    configPanel.input();
  });

  $(".gen-sub-btn").click(function(){
    gen_sub($(this));
  });


});

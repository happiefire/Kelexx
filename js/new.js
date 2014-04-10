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


function do_validate (target) {
  var message = input_validation (target);
  $("#message").html(message);
}


// 规则：逗号或者空格作为“分割符”
// 连续多个空格或逗号等效于一个逗号
// “-”前后必须是数字，否则报错 //
// var numVal="3-12, 5, 9 17, 15 - 3,"; // 测试用

function input_validation(input) {
  // onblur时候触发该判断语句
  var numVal = $(input).val();
  var check=0
  for(var i=0; i <= numVal.length-1; i++){

    if( isNaN(parseInt(numVal[i])) && numVal[i]!="," && numVal[i]!=" " && numVal[i]!="-" ) {

      return "只能包含数字、\",\"、\"-\"!"

    } else if (numVal[i] == "-" && (isNaN(parseInt(numVal[i-1])) || isNaN(parseInt(numVal[i+1]))) ) {

      return "\"-\"的前后应该紧跟数字，表示题号范围"

    } else {
      check++;
    }

  } // end for loop

  if (check == numVal.length){
    return "success"
  }

}




// 1. pass进一个 pb-info-group，收集其中的 input value
function get_pb_info_input_val (target) {
  var numVal = $(target).find(".pb-info-num input").val()+",";

  var inputVal = {};
  inputVal.type = $(target).find(".pb-info-type select").val();
  inputVal.fullscore = $(target).find(".pb-info-fullscore input").val();

  
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

    } else if(numVal[count] === "," || numVal[count] === " ") {
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

function each_pb_info_html(num) {
  var html = "<div class=\"each-pb-info\" id=\"pb-info-" + num + "\"><div class=\"pb-info-target\">" + num + "</div></div>"
  return html;
}

// 2. 根据input value 生成题目表的 html
function pb_map_html (targetGroup) {
  var inputVal = get_pb_info_input_val (targetGroup);
  var pbNumArray = inputVal.num

  var htmlContent = "<br><div class=\"pb-map-group\">";

  for (var i = 0; i < pbNumArray.length; i++) {
    htmlContent += each_pb_info_html(pbNumArray[i]);
  };

  htmlContent +="</div>" // close div.pb-map-group
  return htmlContent;
}

// 准备object模型，为最终生成json准备
function pbInfoProto(){
  this.id = "";
  this.type = "";
  this.fullscore = 0;
  this.score = 0;
  this.has_part_score = false;
  this.has_children = false;
  this.father_id = "";
  this.correct = true;
}

var jsonObj = [];


function do_gen(targetGroup){
  var inputVal = get_pb_info_input_val(targetGroup), htmlContent = pb_map_html (targetGroup);  
  
  var jsonObjPartial = [];
  for (var i = 0; i<inputVal.num.length; i++) {
    var eachPbInfo = new pbInfoProto();
    eachPbInfo.id = inputVal.num[i].toString();
    eachPbInfo.type = inputVal.type;
    eachPbInfo.fullscore = parseInt(inputVal.fullscore);

    jsonObjPartial.push(eachPbInfo);
  }

  jsonObj = jsonObj.concat(jsonObjPartial);

  $(targetGroup).find(".pb-map").html(htmlContent);
}



// 对新加入的pb-info-group中各个元素对应的函数要重新加载
function activate_gen_function () {
  // group内一个按钮，还有3个input要重新加载
  
  $(".gen-btn").on("click", function(){
    do_gen($(this).parents(".pb-info-group"));
  });
}

function add_pb_info_group () {

  var pbInfoIdPrev = $(".exam-setup").find(".pb-info-group").last().attr("id");

  var groupNum = parseInt(pbInfoIdPrev[pbInfoIdPrev.length-1]) + 1;

  var groupNumString = groupNum.toString();

  var new_pb_info_group_html =
  "<div class=\"form-group pb-info-group\" id=\"pb-info-group-" + groupNumString + "\">"+
    "<div class=\".pb-info-inputs\">"+
      "<label class=\"pb-info-type\">题型&nbsp"+
        "<select>"+
          "<option value=\"type-tiankong\">填空题</option>"+
          "<option value=\"type-xuanze\">选择题</option>"+
          "<option value=\"type-wenda\">问答题</option>"+
        "</select>"+
      "</label>"+"&nbsp"+
      "<label class=\"pb-info-num\">"+
        "题号范围&nbsp"+
        "<input type=\"text\" placeholder=\"例: 1-9,15,17\">"+
      "</label>"+"&nbsp"+
      "<label class=\"pb-info-fullscore\">"+
        "默认每题分值&nbsp"+
        "<input type=\"number\">"+
      "</label>"+"&nbsp"+
      "<a class=\"btn gen-btn\">生成题号表</a>"+
    "</div>"+
    "<div class=\"pb-map\"></div>"+
  "</div>";

  $(new_pb_info_group_html).insertBefore("#add-pb-info-group");
  activate_gen_function();

}




$(document).ready(function(){
  activate_gen_function();

  $(".pb-info-num input").keyup(function(){
    do_validate(this);
  });
  $("#add-pb-info-group").on("click", add_pb_info_group);

});

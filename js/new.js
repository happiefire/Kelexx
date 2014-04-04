function add_pb_info_group () {
  var new_pb_info_group_html =
  "<div class=\"form-group pb-info-group\" id=\"pb-info-2\">"+
    "<label>题型&nbsp"+
      "<select class=\"pb-info-type\">"+
        "<option value=\"type-tiankong\">填空题</option>"+
        "<option value=\"type-xuanze\">选择题</option>"+
        "<option value=\"type-wenda\">问答题</option>"+
      "</select>"+
    "</label>"+"&nbsp"+
    "<label>"+
      "题号范围&nbsp"+
      "<input class=\"pb-info-num\" type=\"text\" placeholder=\"例: 1-9,15,17\">"+
    "</label>"+"&nbsp"+
    "<label>"+
      "默认每题分值&nbsp"+
      "<input class=\"pb-info-score\" type=\"text\">"+
    "</label>"+"&nbsp"+
    "<a class=\"btn pb-info-group-gen\">生成题号表</a>"+
  "</div>";

  $(new_pb_info_group_html).insertBefore("#new-pb-info-group-placeholder");
  activate_gen_function();
}

// 1. pass进一个 pb-info-group，收集其中的 input value
function get_pb_info_input_val (target) {
  var typeVal = $(target).find(".pb-info-type select").val(),
      numVal = $(target).find(".pb-info-num input").val(),
      scoreVal = $(target).find(".pb-info-score input").val();
  
  var inputVal = { type: typeVal, score: scoreVal }
  var numArray = [], i=j=0;
  // numVal="3-12, 5, 9"; // 测试用

  var range=[],
      buffer="",
      rangeStart = rangeEnd = 0;

  for(var count = 0 ,count <= numVal.length-1, count++) {
    // 当输入那位char为数字时
    if( !(isNaN(parseInt(numVal[count],10))) ){
      buffer += numVal[count];
    } else if(numVal[count] == ",") {
      numArray[i++] = parseInt(buffer, 10);
      buffer="";
    } else if(numVal[count] == "-"){
      if(j==0){
        rangeStart = parseInt(buffer, 10);
        buffer="";
        j++;
      } else if(j==1){
        rangeEnd = parseInt(buffer, 10);
      }

    }

  }
  inputVal.num = numArray;
  return inputVal; 
}

// 2. 根据input value 生成题目表的 html
function gen_pb_info_list_html (argument) {
  
}


function gen_pb_info_list (target) {
  var html_val = "<p>well</p>";
  $(target).append(html_val);
}


function activate_gen_function () {
  $(".pb-info-group-gen").on("click", function() {
    generate_pb_info_list($(this).parent(".pb-info-group"));
  });
}

$(function(){
  activate_gen_function();
  $("#add-pb-info-group").on("click", add_pb_info_group);

});

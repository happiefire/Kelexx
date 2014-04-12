var cf = 0; //指向的是each-pb
var current_subpb = 0;
var timeout_hide, timeout_show;
var motherpb = 0;
var data =[];
var prev_score_input = "";//这个用于储存本次输入前的输入框结果，避免输入错误后整个框的内容被cancel
var prev_all_score = "";//
//如无特殊说明，target均必须是each-pb

//用来把题目变红的
function do_focus(){
  $(".pb-focus").removeClass("pb-focus");
  cf.find(".pb-target").addClass("pb-focus");
  //此选择结构为了保证快捷键时候，没有触发mouseenter的情况下，motherpb能够进行更新
  if (cf.hasClass("sub-pb")){
    find_mother(cf);
  }
  else{};
}

//用来找母题的
function find_mother(target){
  motherpb = target;
  do
  {
    motherpb = motherpb.prev();
  }
  while(motherpb.hasClass("has-sub-pb") == false)
}

//当母题为cf时候，可以执行，对问答题的母题也有效
function unselect_subpbs(){
  current_subpb = cf.next();
  do
  {
    current_subpb.find(".pb-target").removeClass("pb-selected");
    if(!cf.hasClass("has-score")){
      current_subpb.find(".score_get").removeClass("done");
      current_subpb.find(".score_get").html(current_subpb.find(".full_score").text());
    }
    else{};
    current_subpb = current_subpb.next();
  }
  while(current_subpb.hasClass("sub-pb") == true);
}

//当母题为cf的时候可以执行,对问答题的母题也有效
function select_all_subpbs(){
  current_subpb = cf.next();
  do
  {
    current_subpb.find(".pb-target").addClass("pb-selected");
    if (!cf.hasClass("has-score")){
      current_subpb.find(".score_get").html("0");
      current_subpb.find(".score_get").addClass("done");
    }
    else{};
    current_subpb = current_subpb.next();
  }
  while(current_subpb.hasClass("sub-pb") == true);
}

//错题被取消判定，成为非错题时，把分数改回满分
function delete_score(){
  cf.find(".score_get").removeClass("done");
  var cf_fullscore = cf.find(".full_score").text();
  cf.find(".score_get").html(cf_fullscore);
}

//用来判断题目是否被选为错题
function pbselection(target){
  if ($(target).find(".pb-target").hasClass("pb-selected")){return true;}
  else{return false;}
}

//当点击小题，使得小题对错发生变化时使用的改分函数。此函数需要与delete_score进行整合整理。number()的使用也应更加一致
function sub_pb_selected(){
  var cf_fullscore = Number(cf.find(".full_score").text());
  if(pbselection(cf)){
    cf.find(".score_get").html("0");
    cf.find(".score_get").addClass("done");
    var motherpb_score = Number(motherpb.find(".score_get").text()) - cf_fullscore;
    motherpb.find(".score_get").html(motherpb_score);
    //加上done，保证不加重复。此段不加，将导致快捷键问题。疑似done与score-focus有关导致
    if(motherpb.find(".score_get").hasClass("done")){}
      else{
        motherpb.find(".score_get").addClass("done");
      }
  }
  else{
    cf.find(".score_get").html(cf_fullscore);
    cf.find(".score_get").removeClass("done");
    var motherpb_score = Number(motherpb.find(".score_get").text()) + cf_fullscore;
    motherpb.find(".score_get").html(motherpb_score);
    //以下保证，非问答题的motherpb因为小题取消点中而成为满分时候，标记成为未登分的题（没有done），并且取消选中
    if(motherpb.find(".score_get").text() === motherpb.find(".full_score").text()){
      motherpb.find(".score_get").removeClass("done");
      motherpb.find(".pb-target").removeClass("pb-selected");
    }
    else{};
  }
}

//在pb onclick里面调用的
function clickpb(){
    selectpb();
    //用来处理母题选中的情形
    if (cf.hasClass("has-sub-pb")){
      if(pbselection(cf)){
        select_all_subpbs();
        if(!cf.hasClass("has-score")){
          cf.find(".score_get").html("0");
          cf.find(".score_get").addClass("done");
        }
        else{};
      }
      else{
        delete_score();
        unselect_subpbs();
      }
    }
    else{};
    //用途见sub_pb_selected的注释
    if(cf.hasClass("sub-pb") && !motherpb.hasClass("has-score")){
      sub_pb_selected();
    }
    else{};
    //用来处理选择题的分数变化
    if(!cf.hasClass("has-sub-pb") && !cf.hasClass("sub-pb")){
      if(pbselection(cf)){
        cf.find(".score_get").html("0");
      }
      else{
        var cf_fullscore = Number(cf.find(".full_score").text());
        cf.find(".score_get").html(cf_fullscore);
      }
    }
}

//见里面的注释
function selectpb(){
  cf.find(".pb-target").toggleClass("pb-selected");
  //这个选择结构用于实现：小题选中，母题也选中
  if (cf.hasClass("sub-pb")){
    if (pbselection(motherpb))
    {
      //这为了保证分数如果输入过，则不再显示输入框
      if(scored(motherpb)){}
        else{
          score_input_focus(motherpb);
        }
    }
    else{
      motherpb.find(".pb-target").toggleClass("pb-selected");
      toggle_score_focus(motherpb);
    }
  } 
  else{
    toggle_score_focus(cf);
  }
}

//用于计算这张卷子的总分
// function calculate_score(){  
//   var pb_number = $(".each-pb").size();
//   var c_group = $(document).find(".pb-group").first();
//   var c_object = $(document).find(".each-pb").first();
//   var i = 0;
//   while(i < pb_number)
//   {
//     if(c_object.hasClass("has-score")){

//     }
//     else{

//     }

//     if (c_object.is(":last-child")) {
//         c_group = c_group.next();
//         c_object = c_group.find(".each-pb").first();
//     }
//     else{
//       c_object = c_object.next();
//     }
//     i++;
//   }
//   $("#score").val(final_score);
// }

//判断是否已经输入过分数
function scored(target){
  if($(target).find(".score_get").hasClass("done")){
    return true;
  }
  else{return false;}
}

//有分但没有出现输入框的，弹出，有分但已经弹出输入框的，隐去。其他的do nothing
function toggle_score_focus(target){
  if ($(target).hasClass("has-score") && !$(target).hasClass("input-on")){
    score_input_focus(target);
  } 
  else {
    if ($(target).hasClass("input-on")){
      score_input_hide(target);
    }
    else{}
  }
}

//隐藏得分框，enable快捷键
function score_input_hide(target){
  if($(target).hasClass("has-score")){
    $(target).find(".score-input").css("display","none");
    $(target).removeClass("input-on");
    KeyboardJS.enable();
  }
  else{};
}

//弹出得分框，disable快捷键
function score_input_focus(target){
  if($(target).hasClass("has-score")){
    if (pbselection(target)){
      $(target).find(".score-input").css("display","block");
      $(target).find("input").focus();
      $(target).addClass("input-on");
      KeyboardJS.disable();
    } //为了实现，红色的题取消选中，不出现input框
    else{}
  }
  else{};
}

//用来判断输入的合法性
function legal_judge(target){
  if(!isNaN($(target).val()) && $(target).val()%1 === 0){
    return true;
  }
  else{return false;}
}

//其中为快捷键相关
function focus_first_pb(){
  cf = $(".pb-list").find(".each-pb").first();
  do_focus();
}

function press_right() {
  if (cf == 0) {
    focus_first_pb();
  } else if (cf.is(":last-child")){
    if (cf.parent().is(":last-child")) {
      cf = cf;
    } else {
      cf = cf.parent().next(".pb-group").find(".each-pb").first();
      do_focus();
    }
  } else {
    cf = cf.next(".each-pb");
    do_focus();
  }
} 

function press_left() {
  if (cf == 0) {
    focus_first_pb();
  } else if (cf.prev().is(":first-child")){ //注意，此处题型的h4影响了child的位置，故做了.prev的修改
    if (cf.parent().is(":first-child")) {
      cf = cf;
    } else {
      cf = cf.parent().prev(".pb-group").find(".each-pb").last();
      do_focus();
    }
  } else {
    cf = cf.prev(".each-pb");
    do_focus();
  }
}

function press_down() {
  if (cf == 0) {
    focus_first_pb();
  } 
  else {
    if(cf.parent().is(":last-child")){
      cf = cf;
    }
    else{
      cf = cf.parent().next(".pb-group").find(".each-pb").first();
      do_focus();
    }
  }
}

function press_up() {
  if (cf == 0) {
    focus_first_pb();
  } 
  else {
    if(cf.parent().is(":first-child")){
      cf=cf;
    }
    else{
      cf = cf.parent().prev(".pb-group").find(".each-pb").first();
      do_focus();
    }
  }
}

function press_enter(){
  if (cf == 0){}
    else{
        clickpb();
    }
}

function press_number(target){
  if($(target).hasClass("each-pb")){
    cf = $(target);
    do_focus();
  }
  else{
    cf=cf;
  }
}

//弹出得分框
function press_space(){score_input_focus(cf);}

function hotkeys(){
  KeyboardJS.on('right', press_right);
  KeyboardJS.on('left', press_left);
  KeyboardJS.on('down', press_down);
  KeyboardJS.on('up', press_up);
  KeyboardJS.on('1', function() {
    if($("#1").find(".pb-target").hasClass("pb-focus")){
      press_number($("#11"))
    }
    else{
      press_number($("#1"));
    }
  });
  KeyboardJS.on('2', function() {
    if($("#2").find(".pb-target").hasClass("pb-focus")){
      press_number($("#22"))
    }
    else{
      press_number($("#2"));
    }
  });
  KeyboardJS.on('3', function() {press_number($("#3"))});
  KeyboardJS.on('4', function() {press_number($("#4"))});
  KeyboardJS.on('5', function() {press_number($("#5"))});
  KeyboardJS.on('6', function() {press_number($("#6"))});
  KeyboardJS.on('7', function() {press_number($("#7"))});
  KeyboardJS.on('8', function() {press_number($("#8"))});
  KeyboardJS.on('9', function() {press_number($("#9"))});
  KeyboardJS.on('1>0', function() {press_number($("#10"))});
  KeyboardJS.on('1>2', function() {press_number($("#12"))});
  KeyboardJS.on('1>3', function() {press_number($("#13"))});
  KeyboardJS.on('1>4', function() {press_number($("#14"))});
  KeyboardJS.on('1>5', function() {press_number($("#15"))});
  KeyboardJS.on('1>6', function() {press_number($("#16"))});
  KeyboardJS.on('1>7', function() {press_number($("#17"))});
  KeyboardJS.on('1>8', function() {press_number($("#18"))});
  KeyboardJS.on('1>9', function() {press_number($("#19"))});
  KeyboardJS.on('2>0', function() {press_number($("#20"))});
  KeyboardJS.on('2>1', function() {press_number($("#21"))});
  KeyboardJS.on('2>3', function() {press_number($("#23"))});
  KeyboardJS.on('2>4', function() {press_number($("#24"))});
  KeyboardJS.on('2>5', function() {press_number($("#25"))});
  KeyboardJS.on('2>6', function() {press_number($("#26"))});
  KeyboardJS.on('2>7', function() {press_number($("#27"))});
  KeyboardJS.on('2>8', function() {press_number($("#28"))});
  KeyboardJS.on('2>9', function() {press_number($("#29"))});
  KeyboardJS.on('3>0', function() {press_number($("#30"))});
  KeyboardJS.on('enter',press_enter);
  KeyboardJS.on('space',press_space);
}
//其中为快捷键相关

//传数据
function testUpdateStatisticItems() {
  var prefix = 'http://42.96.165.209:8192';
  var url = prefix+'/update/statistic_items';
  var testPostData = {
    project_name:'测试项目3',
    creator_id:'teacher0',
    student_id:$("#student").val(),
    totalscore:$("#score").val(),
    problems:data
  };
  $.ajax({
    url: url,
    type: 'POST',
    data: {data: JSON.stringify(testPostData)},
    crossDomain: true,
    dataType: "json",
    success: function(result) {
      console.log(result);
    }
  });
}

//以下为正主儿。其他玩意儿load进了 new-standard.js
$(function(){
    $(".submit-this").on("click", function(){
    if($("#student").val() == ""){
      alert("请输入学号!");
    }
    else{
      var c_group = $(document).find(".pb-group").first();
      var c_object = c_group.find(".each-pb").first();
      var pb_number = $(".each-pb").size();
      var i = 0;
      while(i < pb_number)
      {
        var this_id;
        var this_score;
        var this_wrong;
        if(pbselection(c_object)){
          this_wrong = false;//表示此题错了
          if(c_object.hasClass("has-score")){
            if(scored(c_object)){
              this_score = c_object.find(".score_get").text();//有分
            }
            else{
              this_score = "?";//表示没有输分数
            }
          }
          else{
            if(c_object.find(".score-indicator").text()==""){
              this_score = null;//问答题小题是没有分数滴
            }
            else{
              this_score = 0;//即得零分
            }
          }
        }
        else{
          this_wrong = true;//表示此题正确
          if(c_object.find(".score-indicator").text()==""){
            this_score = null;//该题不统计分数
          }
          else{
            this_score = c_object.find(".full_score").text();//有分
          }
        };
        
        data[i] = {
          id: $(c_object).attr("id"),
          score: this_score,
          correct: this_wrong
        }
        i++;
        if (c_object.is(":last-child")) {
          c_group = c_group.next();
          c_object = c_group.find(".each-pb").first();
        }
        else{
          c_object = c_object.next();
        }
      }

      testUpdateStatisticItems();

      //刷新页面
      $("#placeholder").html("");
      $("input").val("");
      generate_standard();
    }
  });
});





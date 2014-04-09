var cf = 0; //指向的是each-pb
var current_subpb = 0;
var timeout_hide, timeout_show;
var motherpb = 0;

//如无特殊说明，target均必须是each-pb

//用来把题目变红的
function do_focus(){
  $(".pb-focus").removeClass("pb-focus");
  cf.find(".pb-target").addClass("pb-focus");
  //此选择结构为了保证快捷键时候，没有触发mouseenter的情况下，motherpb能够进行更新
  if (cf.hasClass("sub-pb")){
    find_mother();
  }
  else{};
}

//用来找母题的
function find_mother(){
  motherpb = cf;
  do
  {
    motherpb = motherpb.prev();
  }
  while(motherpb.hasClass("has-sub-pb") == false)
}

//当母题为cf时候，可以执行
function unselect_subpb(){
  current_subpb = cf.next();
  do
  {
    current_subpb.find(".pb-target").removeClass("pb-selected");
    current_subpb = current_subpb.next();
  }
  while(current_subpb.hasClass("sub-pb") == true)
}

//错题被取消判定，成为非错题时，把分数改回满分
//默认分数要pass进去，未改
function delete_score(){
  cf.find(".score_get").removeClass("done");
  cf.find(".score_get").html("15");
}

//用来判断题目是否被选为错题
function pbselection(target){
  if ($(target).find(".pb-target").hasClass("pb-selected")){return true;}
  else{return false;}
}

//在pb onclick里面调用的
function clickpb(){
    selectpb();
    if (cf.hasClass("has-sub-pb") && pbselection(cf) == false){
      delete_score();
      unselect_subpb();
    }
    else{};
}

//见里面的注释
function selectpb(){
  cf.find(".pb-target").toggleClass("pb-selected");
  //这个选择结构用于实现：小题选中，母题也选中
  if (cf.hasClass("sub-pb")){
    if (pbselection(motherpb))
    {
      if (pbselection(cf)){
        //这为了保证分数如果输入过，则不再显示输入框
        if(scored(motherpb)){}
        else{
          score_input_focus(motherpb);
        }
      }
      else{
        motherpb.find("input").focus();
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
  $(target).find(".score-input").css("display","none");
  $(target).removeClass("input-on");
  KeyboardJS.enable();
}

//弹出得分框，disable快捷键
function score_input_focus(target){
  if (pbselection(target)){
    $(target).find(".score-input").css("display","block");
    $(target).find("input").focus();
    $(target).addClass("input-on");
    KeyboardJS.disable();
  } //为了实现，红色的题取消选中，不出现input框
  else{}
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
    cf = cf.parent().next(".pb-group").find(".each-pb").first();
    do_focus();
  }
}

function press_up() {
  if (cf == 0) {
    focus_first_pb();
  } 
  else {
    cf = cf.parent().prev(".pb-group").find(".each-pb").first();
    do_focus();
  }
}

function press_enter(){
  if (cf == 0){}
    else{
        clickpb();
    }
}

function press_number(target){
  cf = $(target);
  do_focus();
}

//弹出得分框
function press_space(){score_input_focus(cf);}

function hotkeys(){
  KeyboardJS.on('right', press_right);
  KeyboardJS.on('left', press_left);
  KeyboardJS.on('down', press_down);
  KeyboardJS.on('up', press_up);
  KeyboardJS.on('1', function() {press_number($("#pb-1"))});
  KeyboardJS.on('2', function() {press_number($("#pb-2"))});
  KeyboardJS.on('3', function() {press_number($("#pb-3"))});
  KeyboardJS.on('4', function() {press_number($("#pb-4"))});
  KeyboardJS.on('5', function() {press_number($("#pb-5"))});
  KeyboardJS.on('6', function() {press_number($("#pb-6"))});
  KeyboardJS.on('7', function() {press_number($("#pb-7"))});
  KeyboardJS.on('8', function() {press_number($("#pb-8"))});
  KeyboardJS.on('9', function() {press_number($("#pb-9"))});
  KeyboardJS.on('1>0', function() {press_number($("#pb-10"))});
  KeyboardJS.on('. + 1', function() {press_number($("#pb-11"))});
  KeyboardJS.on('1>2', function() {press_number($("#pb-12"))});
  KeyboardJS.on('1>3', function() {press_number($("#pb-13"))});
  KeyboardJS.on('1>4', function() {press_number($("#pb-14"))});
  KeyboardJS.on('1>5', function() {press_number($("#pb-15"))});
  KeyboardJS.on('1>6', function() {press_number($("#pb-16"))});
  KeyboardJS.on('1>7', function() {press_number($("#pb-17"))});
  KeyboardJS.on('1>8', function() {press_number($("#pb-18"))});
  KeyboardJS.on('1>9', function() {press_number($("#pb-19"))});
  KeyboardJS.on('2>0', function() {press_number($("#pb-20"))});
  KeyboardJS.on('2>1', function() {press_number($("#pb-21"))});
  KeyboardJS.on('. + 2', function() {press_number($("#pb-22"))});
  KeyboardJS.on('2>3', function() {press_number($("#pb-23"))});
  KeyboardJS.on('2>4', function() {press_number($("#pb-24"))});
  KeyboardJS.on('2>5', function() {press_number($("#pb-25"))});
  KeyboardJS.on('2>6', function() {press_number($("#pb-26"))});
  KeyboardJS.on('2>7', function() {press_number($("#pb-27"))});
  KeyboardJS.on('2>8', function() {press_number($("#pb-28"))});
  KeyboardJS.on('2>9', function() {press_number($("#pb-29"))});
  KeyboardJS.on('3>0', function() {press_number($("#pb-30"))});
  KeyboardJS.on('enter',press_enter);
  KeyboardJS.on('space',press_space);
}
//其中为快捷键相关


//以下为正主儿
$(function(){
  window.onload = function(){
    hotkeys();
  }

  //此函数用于处理score input打开时候的键盘行为监视
  $(".score-input input").keydown(function(event){
    if (event.keyCode == 13){
      score_input_hide($(this).parents(".each-pb"));//不放这儿，放在前面，enable会导致按键还没有弹起的时候，press enter被触发
      return false;
    }
    else{}
  });

  $(".score-input input").on("blur",function(){
    var target_pb = $(this).parents(".each-pb");
    score_input_hide(target_pb);
    var score = $(this).val().toString();
    //这是为了显示该题的得分没有被输入
    if(score == ""){
      score = "?";
    }
    else{
      target_pb.find(".score_get").addClass("done");
      //此处还应有判断输入是否合法的函数。输入总分之时也可公用。学号的时候就无所谓了，反正是生成一张自由的表格
    };
    target_pb.find(".score_get").html(score);
  });

  //仍然不work
  $("#student, #score").on("focus", function(){
    KeyboardJS.disable();
  });

  $("#student, #score").on("blur",function(){
    KeyboardJS.enable();
  });

  $(".each-pb").mouseenter(function(){
    cf = $(this);
    do_focus();
  });

  $(".pb-target").on("click", function(){
    clickpb();
  });

});





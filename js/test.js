// 记住以下先是javascript，然后是jQuery
var timeout_hide, timeout_show;

function popover_show(target){
  timeout_show = window.setTimeout(function(){
    $(".popover-show").removeClass("popover-show").addClass("popover-hide");
    $(target).find(".popover").removeClass("popover-hide").addClass("popover-show");
  }, 300);
  window.clearTimeout(timeout_hide);

function popover_hide(target){
  timeout_hide = window.setTimeout(function(){
    $(target).find(".popover").removeClass("popover-show").addClass("popover-hide");
  }, 400);
}



//快捷键
function hotkeys(){
  KeyboardJS.on('1>2', function() {
    popover_show($("#button12"));
});
  KeyboardJS.on('1', function() {
    popover_show($("#button1"));
});
  KeyboardJS.on('2', function() {
    popover_show($("#button2"));
});
//  KeyboardJS.on('left', function() {
//     currentfocus = $(currentfocus).next();
// //right为prev()
// //全局变量currentfocus:必须在click，show之后，将currentfocus进行重新赋值，赋的值为一个元素
//     popover_show($(currentfocus));
// });
  
}

$(function(){
  window.onload = function(){
    hotkeys();
  }
  $(".test").mouseover(function(){
    popover_show($(this));
  });
  $(".test").mouseout(function(){
    popover_hide($(this));
  });
});
















// 记住以下先是javascript，然后是jQuery
var timeout_hide, timeout_show;
function popover_show(target){
  timeout_show = window.setTimeout(function(){
    jQuery(target).find(".popover").removeClass("popover-hide").addClass("popover-show");
  }, 400);
  window.clearTimeout(timeout_hide);
}

function popover_hide(target){
  timeout_hide = window.setTimeout(function(){
    jQuery(target).find(".popover").removeClass("popover-show").addClass("popover-hide");
  }, 400);
}

// 记住以上先是javascript，然后是jQuery


$(function(){

  $(".test").mouseover(function(){
    popover_show($(this));
  });
  $(".test").mouseout(function(){
    popover_hide($(this));
  });
});















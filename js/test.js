function popover_show(target){
  setTimeout(function(){jQuery(target).find(".popover").show();}, 3000);
}

function popover_hide(target){
  setTimeout(function(){jQuery(target).find(".popover").hide();}, 3000);
}

$(function(){
  $(".test .popover").css("display","none");

  $(".test").mouseover(function(){
    popover_show($(this));
  });
  $(".test").mouseout(function(){
    popover_hide($(this));
  });
});
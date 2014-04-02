var cf = 0;
var count = 0;
var timeout_hide, timeout_show;

function popover_show(target) {
  timeout_show = window.setTimeout(function(){
    $(".popover-show").removeClass("popover-show").addClass("popover-hide");
    $(target).find(".popover").removeClass("popover-hide").addClass("popover-show");
  }, 300);
  window.clearTimeout(timeout_hide);
}

function popover_hide(target) {
  timeout_hide = window.setTimeout(function(){
    $(target).find(".popover").removeClass("popover-show").addClass("popover-hide");
  }, 400);
}

function do_focus() {
  cf.focus();
  popover_show(cf); // 不应该把这两步分开吗？?
}

function press_right() {
  if (cf == 0) {
    // cf = 第一个
    cf = $(".pb-list").find(".each-pb").first();
    do_focus();
  } else {
    if (cf.is(":last-child")){
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
} 

function press_left() {
  if (cf == 0) {
    cf = $(".pb-list").find(".each-pb").first();
    do_focus();
  } else {
    if (cf.is(":first-child")){
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
}






function hotkeys(){
  KeyboardJS.on('1>2', function() {
    popover_show($("#bp-12"));
  });
  KeyboardJS.on('1', function() {
    cf = $("#pb-1");
    do_focus();
  });
  KeyboardJS.on('2', function() {
    cf = $("#pb-2");
    do_focus();
  });

  KeyboardJS.on('right', press_right);
  KeyboardJS.on('left', press_left);
}

$(function(){

  window.onload = function(){
    hotkeys();
  }
  $(".each-pb").mouseover(function(){
    cf = $(this);
    do_focus();
  });
  $(".each-pb").mouseout(function(){
    popover_hide($(this));
  });

});


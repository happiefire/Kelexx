var current_type = 0;


var add_pb_group_html = "<div class='pb-group current_pb_group'>"
	+"<h4>0</h4>"
    +"</div>";

var add_pb_html = "<li class='each-pb current_pb'>"
	+"<div class='pb-target'>"
    +"<table>"
    +"<tr>"
    +"<td class='pb-num'></td>"
    +"</tr>"
    +"<tr>"
    +"<td colspan='2' class='score-indicator'>"
	+"<span class='score_get'></span>"
	+"/<span class='full_score'></span>"
    +"</td>"
    +"</tr>"
    +"</table>"
    +"</div>"
    +"</li>";

var score_input_html = '<div class="score-input">'
    +'<input type="text">'
	+'</div>';

var all_problems;

function testFetchProblems() {
  var prefix = 'http://42.96.165.209:8192';
  var url = prefix+'/fetch/problems';
  $.ajax({
    url: url,
    type: 'POST',
    data: {project_name:'测试项目1-1', creator_id:'teacher0'},
    crossDomain: true,
    dataType: "json",
    success: function(result) {
      all_problems = result.problems;
      generate_standard();
    }
  });
}


function generate_standard(){
	$(".item_name").html("测试项目1-1");
	for(var i=0;i<all_problems.length;i++){
		if(all_problems[i].type == current_type){
			//他妈的为什么不是after！
			$(add_pb_html).appendTo($(".current_pb_group"));
			//添加id
			$(".current_pb").attr('id',all_problems[i].id);
			//添加pb_num文本
			$(".current_pb").find(".pb-num").html(all_problems[i].id);
			//添加15/15前面的15
			$(".current_pb").find(".score_get").html(all_problems[i].fullscore);
			//15/15后面的15
			$(".current_pb").find(".full_score").html(all_problems[i].fullscore);
			//添加score_input
			if(all_problems[i].has_part_score == true){
				$(".current_pb").addClass("has-score");
				$(score_input_html).appendTo($(".current_pb"));
			}
			else{};
			//添加class has_sub_pb
			if(all_problems[i].has_children == true){
				$(".current_pb").addClass("has-sub-pb");
			}
			else{};
			//添加class sub_pb
			if(all_problems[i].father_id != ""){
				$(".current_pb").addClass("sub-pb");
			}
			else{};
      if (all_problems[i].fullscore == null){
        $(".current_pb").find(".score-indicator").html("");
      }
      else{}

			//移除current_pb标记。将来又插入者，在插入的html里面已自带这个类
			$(".current_pb").removeClass("current_pb");
		}
		else{
			// 以下用来加pb_group
			$(".current_pb_group").removeClass("current_pb_group");
			$(add_pb_group_html).appendTo($("#placeholder"));
			current_type = all_problems[i].type;
			$(".current_pb_group h4").html(current_type);
			//以上用来加pb_group

			//添加html
			// $(".current_pb_group").before(add_pb_html);
			$(add_pb_html).appendTo($(".current_pb_group"));
			//添加id
			$(".current_pb").attr('id',all_problems[i].id);
			//添加pb_num文本
			$(".current_pb").find(".pb-num").html(all_problems[i].id);
			//添加15/15前面的15
			$(".current_pb").find(".score_get").html(all_problems[i].fullscore);
			//15/15后面的15
			$(".current_pb").find(".full_score").html(all_problems[i].fullscore);
			//添加score_input
			if(all_problems[i].has_part_score == true){
				$(".current_pb").addClass("has-score");
				$(score_input_html).appendTo($(".current_pb"));
			}
			else{};
			//添加class has_sub_pb
			if(all_problems[i].has_children == true){
				$(".current_pb").addClass("has-sub-pb");
			}
			else{};
			//添加class sub_pb
			if(all_problems[i].father_id != ""){
				$(".current_pb").addClass("sub-pb");
			}
			else{};
      if (all_problems[i].fullscore === null){
        $(".current_pb").find(".score-indicator").html("");
      }
      else{};

			//移除current_pb标记。将来又插入者，在插入的html里面已自带这个类
			$(".current_pb").removeClass("current_pb");
		}
	}
  load_function();
}

//函数与参数均到test.js里找
function load_function(){
  hotkeys();
  total_fullscore();

  //此函数用于处理score input打开时候的键盘行为监视
  $(".score-input input").keydown(function(event){
    if (event.keyCode == 13){
      score_input_hide($(this).parents(".each-pb"));//不放这儿，放在前面，enable会导致按键还没有弹起的时候，press enter被触发
      return false;
    }
    else{}
  });

  $("#score").keydown(function(event){
    if (event.keyCode == 13 || event.keyCode == 9){
      $(this).blur();
      return false;
    }
    else{}
  });

  //当某题输分输错的时候，提示问题。如果输入－n，按照扣分处理
  $(".score-input input").keyup(function(){
    if($(this).val() == "-"){
      //do nothing
    }
    else{
      if(legal_judge($(this))){
        //do nothing
      }
      else{
        $(this).val(prev_score_input);
        $(this).focus();
        if($(this).next().hasClass("input-hint")){}
        else{
          $(this).after("<p class='input-hint'>亲，只能输入整数哦～</p>");
        };
        $(this).on("blur",function(){
          $(this).next().remove();//blur时候hint消失
        });
      }
    }
    prev_score_input = $(this).val();
  });

  //当总分输分输错的时候，提示问题
  $("#score").keyup(function(){
    if(legal_judge($(this))){
      //do nothing
    }
    else{
      $(this).val(prev_all_score);
      $(this).focus();
      if($(this).next().hasClass("input-hint")){}
      else{
        $(this).after("<p class='input-hint'>亲，只能输入整数哦～</p>");
      };
      $(this).on("blur",function(){
        $(this).next().remove();//blur时候hint消失
      });
    }
    prev_all_score = $(this).val();
  });

  //blur的时候算作输分工作完成，进行相应的修改
  $(".score-input input").on("blur",function(){
    var this_full_score = "";
    var target_pb = $(this).parents(".each-pb");
    score_input_hide(target_pb);
    var score = Number($(this).val());
    //这是为了显示该题的得分没有被输入
    if($(this).val() == "" || $(this).val() == "-"){//这里若用score代替$(this).val()不行，因为0与""将等价
      score = "?";
      $(this).val("");
    }
    else{
      target_pb.find(".score_get").addClass("done");
      //以下用于判断输入合法性，并处理输入负数表示扣分的情形
      this_full_score = Number($(this).parents(".each-pb").find(".full_score").html());
      if(score < 0){
        if(score < -this_full_score){
          score = -this_full_score;
        }
        else{};
        score = this_full_score + score;
      }
      else{
        if(score > this_full_score){
          score = this_full_score;
        }
        else{};
      }
    };
    target_pb.find(".score_get").html(score);
  });

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

  $(".calculate").on("click",function(){
    calculate_score();
  });
}

$(function(){
  testFetchProblems();
});
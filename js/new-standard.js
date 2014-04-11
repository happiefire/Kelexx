var current_type = 0;
var testPostData = {
  project_name: "2014春季-期中考试",
  creator_id:'teacher0',
  class_list:['school0/class0', 'school0/class1'],
  problems: [
    {
      id: "1",
      type: "选择题",
      fullscore: 5,
      score: 0,
      has_part_score: false,
      has_children: false,
      father_id: "",
      correct: true,
    },
    {
      id: "2",
      type: "选择题",
      fullscore: 5,
      score: 0,
      has_part_score: false,
      has_children: false,
      father_id: "",
      correct: true,
    },
    {
      id: "3",
      type: "填空题",
      fullscore: 4,
      score: 0,
      has_part_score: false,
      has_children: true,
      father_id: "",
      correct: true,
    },
    {
      id: "3.1",
      type: "填空题",
      fullscore: 2,
      score: 0,
      has_part_score: false,
      has_children: false,
      father_id: "3",
      correct: true,
    },
    {
      id: "3.2",
      type: "填空题",
      fullscore: 2,
      score: 0,
      has_part_score: false,
      has_children: false,
      father_id: "3",
      correct: true,
    },
    {
      id: "4",
      type: "填空题",
      fullscore: 4,
      score: 0,
      has_part_score: false,
      has_children: false,
      father_id: "",
      correct: true,
    },
    {
      id: "5",
      type: "问答题",
      fullscore: 10,
      score: 0,
      has_part_score: true,
      has_children: true,
      father_id: "",
      correct: true,
    },
    {
      id: "5.1",
      type: "问答题",
      fullscore: null,
      score: 0,
      has_part_score: false,
      has_children: false,
      father_id: "5",
      correct: true,
    },
    {
      id: "5.2",
      type: "问答题",
      fullscore: null,
      score: 0,
      has_part_score: false,
      has_children: false,
      father_id: "5",
      correct: true,
    },
    {
      id: "6",
      type: "问答题",
      fullscore: 10,
      score: 0,
      has_part_score: true,
      has_children: false,
      father_id: "",
      correct: true,
    }
  ]
}

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

function generate_standard(){
	$(".item_name").html(testPostData.project_name);
	var all_problems = testPostData.problems;
	for(var i=0;i<all_problems.length;i++){
		if(all_problems[i].type === current_type){
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
			if(all_problems[i].has_part_score === true){
				$(".current_pb").addClass("has-score");
				$(score_input_html).appendTo($(".current_pb"));
			}
			else{};
			//添加class has_sub_pb
			if(all_problems[i].has_children === true){
				$(".current_pb").addClass("has-sub-pb");
			}
			else{};
			//添加class sub_pb
			if(all_problems[i].father_id != ""){
				$(".current_pb").addClass("sub-pb");
				$(".current_pb").find(".score-indicator").html("");
			}
			else{};

			//移除current_pb标记。将来又插入者，在插入的html里面已自带这个类
			$(".current_pb").removeClass("current_pb");
		}
		else{
			// 以下用来加pb_group
			$(".current_pb_group").removeClass("current_pb_group");
			$(add_pb_group_html).appendTo($(".pb-list"));
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
			if(all_problems[i].has_part_score === true){
				$(".current_pb").addClass("has-score");
				$(score_input_html).appendTo($(".current_pb"));
			}
			else{};
			//添加class has_sub_pb
			if(all_problems[i].has_children === true){
				$(".current_pb").addClass("has-sub-pb");
			}
			else{};
			//添加class sub_pb
			if(all_problems[i].father_id != ""){
				$(".current_pb").addClass("sub-pb");
				$(".current_pb").find(".score-indicator").html("");
			}
			else{};

			//移除current_pb标记。将来又插入者，在插入的html里面已自带这个类
			$(".current_pb").removeClass("current_pb");
		}
	}
}

$(function(){
	generate_standard();
	hotkeys();
});
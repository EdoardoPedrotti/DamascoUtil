/**
 * New node file
 */
$(document).ready(function() { 
	console.log('MAIN!!!! >:)');
	$(".addButton").click(function(){
		var id =  $(this).attr('id');
		var name = id.substring(0, id.length - 3);
		console.log(name);
		var $toAdd = $('#'+name+'List');
		
		var $destination = $('#'+name);
		$($destination).append('<fieldset name="'+name+'" class="sub">'+$toAdd.html()+'</fieldset>');
		console.log('click');
		console.log($(this).attr('id'));
	});
	
});


JSONTest = function() {

    var resultDiv = $("#resultDivContainer");
    
    var arguments = JSON.stringify(getArguments('.main'), null, 2);
//    var argumetns = getArguments('.main');
    console.log(JSON.stringify(arguments, null, 2));
    	
    $('#hiddenInput').val(arguments);
    
    $('#hiddenSend').click();
    
};


function getArguments(selector) {
	var toReturn = {};
	var nodes = $(selector);
	
	for(var i = 0, j= nodes.length; i<j; i++) {
		var name = $(nodes[i]).attr('id');
		var sub = $(nodes[i]).children('.sub') || null;
		if(sub.length > 0){
			var a = [];
			for(var z = 0, t= sub.length; z<t; z++) {
				
				var subName = $(sub[z]).attr('name');
				var input = $(sub[z]).find('input');
				
				if(input) {
					var fields = {}
					for(var x=0, y= input.length; x<y; x++) {
						var prop = $(input[x]).attr('id');
						fields[prop] = $(input[x]).val();
					}
					a.push(fields);
				}
			}
			toReturn[name]= a;
		} else {
			var input = $(nodes[i]).find('input');
			var obj = {};
			for (var z = 0, t = input.length; z < t; z++){
				
				var prop = $(input[z]).attr('id');
				obj[prop] = $(input[z]).val();
			
			}
			toReturn[name] = obj;
		}
	}
	
	return toReturn;
}

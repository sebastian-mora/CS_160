$(document).ready(function(){

  $('input:checkbox').change(
     function(){

       // If all are unchecked
       var all = $("div :checkbox").length;
           var checked = $("div :checkbox:checked").length;
           if (checked == 0){
                 $("#delete-btn").addClass("disabled");
           }

          else {

                 $("#delete-btn").removeClass("disabled");

          }
     });

});

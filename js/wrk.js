$(document).ready(function(){
    /* To disable  the second field that has OR label in UI */
    
    $("input#zipCode").keydown(function() {
        // If  the input has a (valid) value
        if ($(this).val()) {
           $('input#city').prop("disabled", 'disabled');
        }
        else{
           $('input#city').prop("disabled", false);
        }
    });
         $("input#city").keydown(function() {
        // If the input has a (valid) value
        if ($(this).val()) {
            //$(this).next('.step').attr('disabled', false);
            $('input#zipCode').prop("disabled", 'disabled');
        }
        else{
           $('input#city').prop("disabled", false);
        }
    });
        $("#imageUrl").on('keyup', function(){
        if($.trim($(this).val()).length == 0){
            $('#inputFileToLoad').attr("disabled",false);
         }else{
          $('#inputFileToLoad').attr('disabled','disabled');   
        }
        
    });
      $("input#inputFileToLoad").change(function(){
           if ($('input#inputFileToLoad').val()!== 0){
                $('input#imageUrl').attr('disabled','disabled');   
          }
          else if($('input#inputFileToLoad').val() === "No file chosen") {
             $('input#imageUrl').attr("disabled",false); 
          }
      });
});

/* Jquery datepicker */

  $( function() {
    $( "#expDate" ).datepicker();
   } );

 /*  Base 64 conversion of an image */

          function encodeImageFileAsURL() {
              var filesSelected = document.getElementById("inputFileToLoad").files;
              if (filesSelected.length > 0) {
                var fileToLoad = filesSelected[0];
                var fileReader = new FileReader();
                fileReader.onload = function(fileLoadedEvent) {
                  var srcData = fileLoadedEvent.target.result; // <--- data: base64
                  var b64 = JSON.stringify(srcData);
                  document.getElementById("base64ImageBytes").value=b64;
                }
                fileReader.readAsDataURL(fileToLoad);
              }
            }
                
/* converting form field to JSON format */

    $.fn.serializeObject = function()
    {
            var date = new Date();
            var tStamp = JSON.stringify(date);
            document.getElementById("timeStamp").value=tStamp;
            var expiry = document.getElementById("expDate").value;
            var epoch = new Date($("#expDate").datepicker( "getDate" ) ).getTime() + 24 * 60 * 60 * 1000;
            console.log(epoch);
             var exp = expiry.replace(/\//g,'');
              document.getElementById("expDate").value = epoch;                        
            var o = {};
            var a =  $('input[name!=categories][name!=keywords]', this).serializeArray();
            //var a = this.serializeArray();  
           console.log(a);
            a.push( {name:'categories', value:[$("input#categories").val()]},{name:'keywords', value:[$("input#keywords").val()]},{name:'description', value:$("textarea#description").val()});
            console.log(a);
            $.each(a, function() {
                if (o[this.name] !== undefined) {
                      if (!o[this.name].push)  {
                          o[this.name] = [o[this.name]];
                      }
                     o[this.name].push(this.value || '');
                } else {
                    o[this.name] = this.value || '';

                }
         
           });
            
          return o;
        
          };
/*** Posting data to elastic beanstalk ***/

 $(document).ready(function(){
         $("#item").change(function() {
            if ($(this).val() == "2") {
              $("#brnd").hide();
              $("#coup").show();
              $(function() { 
                  $('form').submit(function() {
                          var fData = JSON.stringify($('form').serializeObject());
                          console.log(fData);
                          fData += timeStamp + base64ImageBytes ;
                          $.ajax({
                           url :'http://db10-env.dvyphnsnse.us-east-2.elasticbeanstalk.com/dealbuddy/rest/coupons',
                           type: 'POST',
                           headers: { 'Content-Type': 'application/json','UserEmail': [$('#dealerRoleUserEmail').val()]},
                           dataType: 'json',
                           contentType : 'application/json',
                           data :fData
                           }).done(function(response){ 
                            $("#ajaxresponse").fadeIn('slow', function(){
                             $("#ajaxresponse").delay(2000).fadeOut(); 
                          });
                            var value1 = $("input#dealerRoleUserEmail").val();
                            $("#dealBuddy")[0].reset();
                            $("input#dealerRoleUserEmail").val( value1 );

                        });

                           return false;
                  });
                });
             } else {
                $("#brnd").show();
                $("#coup").hide();
                if($("#item").val() == "1"){
                  $(function() { 
                      $('form').submit(function() {  
                              var fData = JSON.stringify($('form').serializeObject());
                              console.log(fData);
                              fData += timeStamp + base64ImageBytes ;
                               console.log(fData);
                                $.ajax({
                                   url :'http://db10-env.dvyphnsnse.us-east-2.elasticbeanstalk.com/dealbuddy/rest/deals',
                                   type: 'POST',
                                   headers: { 'Content-Type': 'application/json','dealerRoleUserEmail': [$('#dealerRoleUserEmail').val()]},
                                   dataType: 'json',
                                   contentType : 'application/json',
                                   data :fData
                                   }).done(function(response){ 
                                    $("#ajaxresponse").fadeIn('slow', function(){
                                     $("#ajaxresponse").delay(2000).fadeOut(); 
                                  });
                                    var value1 = $("input#dealerRoleUserEmail").val();
                                    $("#dealBuddy")[0].reset();
                                    $("input#dealerRoleUserEmail").val( value1 );
                                    $('#inputFileToLoad').prop("disabled",false);
                                    $('#imageUrl').prop("disabled",false);
                                    $('#city').prop("disabled",false);
                                    $('#zipCode').prop("disabled",false);
                                });
                           
                          return false;
                      });
                   });
                }
              }
          }); 
      });
 


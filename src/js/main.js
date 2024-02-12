import '../scss/styles.scss';
import * as bootstrap from 'bootstrap';
import  $  from  "jquery";

$(function(){

   function LoadComponent(page){

      $.ajax({
         method:'get',
         url:page,
         success:(response)=>{
            $("main").html(response);
         }
      })
    
   }

   function LoadAppointment(uid){
      $("#Appointmentscontainer").html("");
      $.ajax({
         method:'get',
         url:`http://localhost:6060/appointments/${uid}`,
         success:(appointments)=>{
            $("#useridcontainer").html("");
             $("#useridcontainer").append(`<span>${localStorage.getItem("username")}</span>`);
               appointments.map(item=>{
                  $(`
                   <div class="alert alert-dismissible alert-success">
                   <h2>${item.Title}</h2>
                   <button value=${item.Id} id="btndelete" class="btn btn-close"></button>
                   <p>${item.Description}</p>
                   <div>
                    <span class="bi bi-clock"></span>
                    ${item.Date}
                   </div>
                   <div class="text-end">
                    <button value=${item.Id} id="btnEdit" class="btn btn-warning bi bi-pen">Edit</button>
                   </div>
                    
                   </div>
                  `).appendTo("#Appointmentscontainer");
               })
         }
      })
   }

   $("#btnhomelogin").click(()=>{
      LoadComponent('login.html')
   })

   $("#btnhomeregister").click(()=>{
      LoadComponent('register.html')
   })

    $(document).on("click","#btnnavlogin",()=>{
      LoadComponent('login.html')
    })

    $(document).on("click","#btnnavregister",()=>{
      LoadComponent('register.html')
    })

     //Login button Logic

    $(document).on("click","#btnlogin",()=>{
      $.ajax({
         method:'get',
         url:'http://localhost:6060/users',
         success:(users)=>{
            var user = users.find(item=> item.UserId===$("#UserId").val());
            if(user.Password===$("#Password").val()){
               localStorage.setItem("username",user.UserName);
               localStorage.setItem("userid",user.UserId);

               LoadComponent('appointments.html');
               LoadAppointment($("#UserId").val());
            }else{
               $("#lblerror").html('Invalid Credentials');
            }
         }

      })
    })
   $(document).on("click","#btnsignout",()=>{
      localStorage.removeItem("username");
      LoadComponent('login.html')
   })
  
   // Register Button Logic

   $(document).on("click","#RbtnRegister",()=>{
      var user = {
         UserId : $("#RUserId").val(),
         UserName : $("#RUserName").val(),
         Password : $("#RPassword").val(),
         Email : $("#REmail").val(),
         Mobile : $("#RMobile").val()
      };
      if (!user.UserId) {
         $("#Rid").html("User ID is required.");
         return; // Exit function if user ID is empty
     }
     if (!user.UserName){
      $("#Rname").html("User Name is required.");
      return;
     }
     if (!user.Password){
      $("#Rpass").html("User Name is required.");
      return;
     }
     if (!user.Email){
      $("#Rmail").html("User Name is required.");
      return;
     }
     if (!user.Mobile){
      $("#Rmob").html("User Name is required.");
      return;
     }
     
      $.ajax({
         method:'post',
         url:'http://127.0.0.1:6060/register-user',
         data:user
      })
      alert("Registered Successfully..");
      LoadComponent('login.html');
   })

   $(document).on("click","#btnnewappointment",()=>{
      LoadComponent('new-appointment.html');
   })


    //Adding New Appointment

    $(document).on("click","#btnaddnewtask",()=>{
      var appointment = {
         Id: $("#AId").val(),
         Title: $("#ATitle").val(),
         Description: $("#ADescription").val(),
         Date: $("#ADate").val(),
         UserId: localStorage.getItem("userid")
      }
      $.ajax({
         method:"post",
         url: 'http://127.0.0.1:6060/add-task',
         data: appointment
      })
      alert("Appointment Added Successfully..");
      LoadComponent('appointments.html');
      LoadAppointment(appointment.UserId);
    })

   //Delete Appointment Logic

   $(document).on("click","#btndelete",(e)=>{
      // alert(e.target.value);
      var flag = confirm('Are you sure\nWant to Delete?');
      if(flag==true){
         $.ajax({
            method:'delete',
            url:`http://127.0.0.1:6060/delete-task/${e.target.value}`
         })
         alert("Appointment Deleted Successfully..");
         LoadAppointment(localStorage.getItem("userid"));
      }
   })

   //Edit Appointment
   
   $(document).on("click","#btnEdit",(e)=>{
      LoadComponent("edit-appointment.html");
      $.ajax({
         method:'get',
         url: `http://127.0.0.1:6060/get-byid/${e.target.value}`,
         success: (appointments)=>{
            $("#EId").val(appointments[0].Id);
            $("#ETitle").val(appointments[0].Title);
            $("#EDescription").val(appointments[0].Description);
            $("#EDate").val(formatDate(appointments[0].Date));
            $("#EUserid").val(localStorage.getItem("userid"));
         }
      })
      function formatDate(dateString) {
         // Assuming dateString is in format "MM/dd/yyyy"
         var parts = dateString.split('/');
         if (parts.length === 3) {
             // parts[0] is the month, parts[1] is the day, and parts[2] is the year
             return `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`;
         } else {
             // Return the original string if it doesn't match the expected format
             return dateString;
         }
     }
   })

   

   $(document).on("click","#editsave",(e)=>{
      var editedappointment = {
          Id: $("#EId").val(),
          Title:  $("#ETitle").val(),
          Description: $("#EDescription").val(),
          Date: $("#EDate").val(),
          UserId: $("#EUserid").val()
      }
      $.ajax({
         method:'put',
         url:`http://127.0.0.1:6060/edit-task/${e.target.value}`,
         data: editedappointment
         
      })
      console.log(editedappointment);
      alert("Appointment Edited successfully...")
      LoadComponent('appointments.html');
      LoadAppointment(localStorage.getItem("userid"));
   })
 
  

})
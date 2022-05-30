//Get sport centers
function loadSportCenters() {
    const html_sport_centers = document.getElementById('output_sportCenters');

    fetch('../api/v1/sport_centers')
    .then((resp) => resp.json()) //trasfor data into JSON
    .then(function(data) {
        //console.log(data);
        for (var i = 0; i < data.length; i++){ //iterate overe recived data
            var sport_center = data[i];
            
            console.log(sport_center);

            let name = sport_center["name"];
            let address_city = sport_center["address"]["city"];
            let address_location = sport_center["address"]["location"];
            let description = sport_center["description"];
            let sport_center_id = sport_center["self"].substring(sport_center["self"].lastIndexOf('/') + 1);


            let div = document.createElement("div")
            let html_sport_center_title = document.createElement("h2");
            let html_sport_center_name = document.createElement("p");
            let html_sport_center_description = document.createElement("p");
            let html_sport_center_address_city = document.createElement("p");
            let html_sport_center_address_location = document.createElement("p");
            let html_sport_center_moreInfo = document.createElement("a");
            
            html_sport_center_title.innerHTML = "<div class='card-header'>"+name+"</div>";
            html_sport_center_name.innerHTML = "<div class='card-text p-2'><b>Name: </b>"+name+"</div>";
            html_sport_center_description.innerHTML = "<div class='card-text p-2'><b>Description: </b>"+description+"</div>";
            html_sport_center_address_city.innerHTML = "<div class='card-text p-2'><b>City: </b>"+address_city+"</div>";
            html_sport_center_address_location.innerHTML = "<div class='card-text p-2'><b>Location: </b>"+address_location+"</div>";
            html_sport_center_moreInfo.innerHTML = `<div class='card-text p-2'><a href="impiantonotauthenticated.html?sport_center_id=`+sport_center_id+`";' class="btn btn-info">Get more information</a></div>`;
            
            div.classList.add("card");
            //div.style.add("width:400px");
            div.appendChild(html_sport_center_title);
            div.appendChild(html_sport_center_name);
            div.appendChild(html_sport_center_description);
            div.appendChild(html_sport_center_address_city);
            div.appendChild(html_sport_center_address_location);
            div.appendChild(html_sport_center_moreInfo);

            html_sport_centers.appendChild(div);
            html_sport_centers.appendChild(document.createElement("hr"))
        }
    })
    .catch( error => console.error(error) ); //catch dell'errore
}

function loadFacilities(sport_center_id) {
    if(!sport_center_id){
        window.location.href = "errorPage.html";
        return;
    }

    const html_facilities = document.getElementById('output_facilities');

    fetch('../api/v1/sport_centers/'+sport_center_id+'/sport_facilities')
    .then((resp) => resp.json()) //trasfor data into JSON
    .then(function(data) {
        //console.log(data);
        if(data.length>0){
            html_facilities.innerHTML = "<p>Here is the list of the sport facilities: </p><br>";
        }else{
            html_facilities.innerHTML = "<p>There are no sport facilities registered yet</p><br>";
        }
        for (var i = 0; i < data.length; i++){ //iterate overe recived data
            var sport_facility = data[i];

            let name = sport_facility["name"];
            let description = sport_facility["description"];
            let self = sport_facility["self"];
            let self_id = self.substring(self.lastIndexOf('/') + 1);

            html_facilities.innerHTML += `
                <div class="card">
                <div class="card-text p-2"><p><b>Name: </b>`+name+`</p>
                <p><b>Description: </b>`+description+`</p></div>
                </div>
                <span id="calendar`+self_id+`">Ciao</span>
                <br>
                <hr>
            `;
            
        }
    })
    .catch( error => console.error(error) ); //catch dell'errore
}

//...

//Return an array with all the sport facilities of the specified sport center
//@param[sport_center_id]: sport center identifier
function getFacilities_array(sport_center_id){
    var sportFacilities = [];

    if(!sport_center_id){
        window.location.href = "errorPage.html";
        return;
    }

    fetch('../api/v1/sport_centers/'+sport_center_id+'/sport_facilities')
    .then((resp) => resp.json()) //trasfor data into JSON
    .then(function(data) {    
        for (var i = 0; i < data.length; i++){ //iterate overe recived data
            var sport_facility = data[i];
            sportFacilities.push(sport_facility);
        }
        //console.log(sportFacilities.length);
        return sportFacilities;
    })
    .catch( error => console.error(error) ); //catch dell'errore
}

//The administraror facility fetching is different
//Display edit and delete button
//@param[sport_center_id]: sport center identifier
function loadFacilities_administrator(sport_center_id){
    const html_facilities = document.getElementById('output_facilities');
    if(!sport_center_id){
        window.location.href = "errorPage.html";
        return;
    }

    fetch('../api/v1/sport_centers/'+sport_center_id+'/sport_facilities')
    .then((resp) => resp.json()) //trasfor data into JSON
    .then(function(data) {
        //console.log(data);
        if(data.length>0){
            html_facilities.innerHTML = "<p>Here is the list of the sport facilities that has been inserted: </p><br>";
        }
        
        for (var i = 0; i < data.length; i++){ //iterate overe recived data
            var sport_facility = data[i];
            //console.log(sport_facility);

            let name = sport_facility["name"];
            let description = sport_facility["description"];
            let self = sport_facility["self"];
            let self_id = self.substring(self.lastIndexOf('/') + 1);

            html_facilities.innerHTML += `
                <div class='card'>
                    <div class='card-text p-2'>
                        <p><b>Name:</b> `+name+`</p>
                        <p><b>Description:</b> `+description+`</p>
                        <button class="btn btn-warning" onclick="show_form('`+self_id+`')">Edit</button>
                        <button class="btn btn-danger" onclick="deleteSportFacility('`+self_id+`', '`+sport_center_id+`');">Delete</button>
                    </div>
                </div>
                <div hidden="true" class="container mt-3" id="editForm`+self_id+`">
                    <br>
                    <input type="text" class="form-control" id="newName`+self_id+`" name="name" value="`+name+`"><br>
                    <textarea name="description" class="form-control" id="newDescription`+self_id+`" rows="4" cols="50">`+description+`</textarea><br>
                    <input type="button" class="btn btn-success" name="confirm_edit" value="Confirm" onclick="updateSportFacility('`+self_id+`', '`+sport_center_id+`')">
                    <input type="button" class="btn btn-danger" name="close_form" value="Cancel" onclick="close_form('`+self_id+`')">
                    <br>
                </div>
                <hr>
            `;
        }
    })
    .catch( error => console.error(error) ); //catch dell'errore
}

//Load managers of a sport center
function loadManagers_administrator(sport_center_id){
    const html_facilities = document.getElementById('output_facilities');

    if(!sport_center_id){
        window.location.href = "errorPage.html";
        return;
    }

    fetch('../api/v2/sport_centers/'+sport_center_id+'/managers')
    .then((resp) => resp.json()) //trasfor data into JSON
    .then(function(data) {
        //console.log(data);
        if(data.length>0){
            html_facilities.innerHTML = "<p>Here is the list of the managers that works in your sport center: </p><br>";
        } else {
            html_facilities.innerHTML = "<p>There are no managers in your sport center!</p><br>";
        }
        
        for (var i = 0; i < data.length; i++){ //iterate overe recived data
            var manager = data[i];
            //console.log(sport_facility);

            let name = manager["name"];
            let surname = manager["surname"];
            let email = manager["email"];  
            let self = manager["self"];
            let self_id = self.substring(self.lastIndexOf('/') + 1);

            html_facilities.innerHTML += `
                <div class="card">
                    <div class="card-text p-2">
                        <p><b>Name: </b>`+name+`</p>
                        <p><b>Surname: </b>`+surname+`</p>
                        <p><b>Email: </b>`+email+`</p>
                        <br>
                        <button class="btn btn-warning" onclick="show_form_managers('`+self_id+`');">Edit</button>
                        <button class="btn btn-danger" onclick="delete_manager_request('`+self_id+`', '`+sport_center_id+`');">Delete</button>
                    </div>
                </div>
                <div hidden="true" class="container mt-3" id="editFormManagers`+self_id+`">
                    <br>
                    <input type="text" class="form-control" id="newName`+self_id+`" name="name" value="`+name+`"><br>
                    <input type="text" class="form-control" id="newSurname`+self_id+`" name="surname" value="`+surname+`"><br>
                    <input type="text" class="form-control" id="newEmail`+self_id+`" name="email" value="`+email+`"><br>
                    <input type="button" class="btn btn-success" name="confirm_edit" value="Confirm" onclick="updateManager('`+self_id+`', '`+sport_center_id+`');">
                    <input type="button" class="btn btn-danger" name="close_form" value="Cancel" onclick="close_form_managers('`+self_id+`');">
                    <br>
                </div>
                <hr>
            `;
        }
    })
    .catch( error => console.error(error) ); //catch dell'errore
}

//...

//Delete sport facility
//@param[id_sport_facility]: id of the sport facility that has to be deleted
//@param[sport_center_id]: id of the sport center where the sport facility is
function deleteSportFacility(id_sport_facility, sport_center_id){
    if(confirm("Are you sure to delete the selected resource?")){
        var token = "empty";
        var auth_level = "empty";
        token = getCookie("token");
        auth_level = getCookie("user_level");

        if(auth_level=="administrator"){
            fetch('../api/v1/sport_facilities/'+id_sport_facility, {
                method: 'DELETE',
                headers: { "x-access-token": token },
            })
            .then((resp) => {
                if(resp.status==403){
                    console.log("Authentication error");
                }else{
                    loadFacilities_administrator(sport_center_id);
                }
            })
        }else{
            console.log("Authentication error");
        }
    }
}
//...

//Update sport facility
//@param[id_sport_facility]: id of the sport facility that has to be updated
//@param[sport_center_id]: id of the sport center where the sport facility is
function updateSportFacility(id_sport_facility, sport_center_id){
    var new_name = document.getElementById("newName"+id_sport_facility).value;
    var new_description = document.getElementById("newDescription"+id_sport_facility).value;

    if(new_name=="" || new_description==""){
        return;
    }
    
    var token = "empty";
    var auth_level = "empty";
    token = getCookie("token");
    auth_level = getCookie("user_level");
    if(auth_level=="administrator"){
        fetch('../api/v1/sport_facilities/'+id_sport_facility, {
            method: 'PATCH',
            headers: { 'Content-type': 'application/json; charset=UTF-8', "x-access-token": token },
            body: JSON.stringify( { name: new_name, description: new_description } ),
        })
        .then((resp) => {
            console.log(resp);
            loadFacilities_administrator(sport_center_id);
        }).catch( error => console.error(error) ); //catch dell'errore
    }else{
        console.log("Authentication error");
    }
}
//...

//Insert new sport facility
function insertSportFacility(){

    //New facility name
    var f_name = document.getElementById("insertNewFacility_name").value;

    //New facility description
    var f_description = document.getElementById("insertNewFacility_description").value;

    //Sport center id
    var sport_center_id="";
    sport_center_id = getCookie("sport_center_id");

    //Athentication data
    var token = "";
    var auth_level = "";
    token = getCookie("token");
    auth_level = getCookie("user_level");

    //Check that all required fileds are not empty
    if(f_name=="" || f_description=="" || sport_center_id=="" || auth_level!="administrator"){
        return ;
    }

    fetch('../api/v1/sport_facilities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', "x-access-token": token},
        body: JSON.stringify( { name: f_name, description: f_description, id_s_c: sport_center_id } ),
    })
    .then((resp) => {
        close_insert_form();
        loadFacilities_administrator(sport_center_id);
    })
    .catch( error => console.error(error) ); // If there is any error you will catch them here
}

//Update manager
//@param[id_manager]: id of the manager that has to be updated
//@param[sport_center_id]: id of the sport center where the manager works
function updateManager(id_manager, sport_center_id){
    var new_name = document.getElementById("newName"+id_manager).value;
    var new_surname = document.getElementById("newSurname"+id_manager).value;
    var new_email = document.getElementById("newEmail"+id_manager).value;

    if(new_name=="" || new_surname=="" || new_email==""){
        return;
    }

    var token = "empty";
    var auth_level = "empty";
    token = getCookie("token");
    auth_level = getCookie("user_level");
    if(auth_level=="administrator"){
        fetch('../api/v2/managers/'+id_manager, {
            method: 'PATCH',
            headers: { 'Content-type': 'application/json; charset=UTF-8', "x-access-token": token },
            body: JSON.stringify( { name: new_name, surname: new_surname, email: new_email } ),
        })
        .then((resp) => {
            console.log(resp);
            loadManagers_administrator(sport_center_id);
        }).catch( error => console.error(error) ); //catch dell'errore
    }else{
        console.log("Authentication error");
    }
}

//Not authenticated user: load all courses of the sport center
//Display submit button
//@param[sport_center_id]: sport center identifier
function loadCourses(sport_center_id){
    const html_courses = document.getElementById('output_facilities');
    var courses_text="";
    if(!sport_center_id){
        window.location.href = "errorPage.html";
        return;
    }

    fetch('../api/v1/sport_centers/'+sport_center_id+'/courses')
    .then((resp) => resp.json()) //trasfor data into JSON
    .then(function(data) {
        //console.log(data);
        if(data.length>0){
            courses_text.innerHTML += "<p>Here is the list of the courses: </p><br>";
        }else{
            courses_text.innerHTML += "<p>There are no sport courses registered yet</p><br>";
        }
        
        for (var i = 0; i < data.length; i++){ //iterate overe recived data
            var course = data[i];
            //console.log(course);

            let name = course["name"];
            let description = course["description"];
            let creation_date = new Date(course["creation_date"]);
            let sport = course["sport"];
            let periodic = course["periodic"];
            let self = course["self"];
            let self_id = self.substring(self.lastIndexOf('/') + 1);

            let start_date = "";
            let end_date = "";
            
            let specific_date = "";
            let specific_start_time = "";
            let specific_end_time = "";

            courses_text += `
                <div class="card">
                <div class="card-text p-2"><p><b>Name: </b>`+name+`</p>
                <p><b>Sport: </b>`+sport+`</p>
                <p><b>Description: </b>`+description+`</p>
            `;

            if(periodic){   //the course is offered for example every monday
                start_date = new Date(course["start_date"]);
                end_date = new Date(course["end_date"]);
                
                //Each day is an array of start-end timestamps
                monday = course["time_schedules"]["monday"]["event"];
                tuesday = course["time_schedules"]["tuesday"]["event"];
                wednesday = course["time_schedules"]["wednesday"]["event"];
                thursday = course["time_schedules"]["thursday"]["event"];
                friday = course["time_schedules"]["friday"]["event"];
                saturday = course["time_schedules"]["saturday"]["event"];
                sunday = course["time_schedules"]["sunday"]["event"];

                week = [monday, tuesday, wednesday, thursday, friday, saturday, sunday];
                week_days = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];

                courses_text += `
                    <p><b>Start date: </b>`+date_format_1(start_date)+`</p>
                    <p><b>End date: </b>`+date_format_1(end_date)+`</p>
                `;

                for(var j=0; j<7; j++){
                    if(week[j].length>0){
                        courses_text += `
                            <p><b>`+week_days[j]+`: </b></p>
                        `;
                    }
                    for(time in week[j]){
                        time_interval = week[j][time];
                        courses_text += `
                            <li class='list-group-item'>from: `+time_interval["from"]+` to: `+time_interval["to"]+`</li>
                        `;
                    }
                }
                
            }else{  //the course is a only once event
                specific_date = new Date(course["specific_date"]);
                specific_start_time = course["specific_start_time"];
                specific_end_time = course["specific_end_time"];
                courses_text += `
                    <p><b>Date: </b>`+date_format_1(specific_date)+`</p>
                    <p><b>From: </b>`+specific_start_time+`<b> To: </b>`+specific_end_time+`</p>
                `;
            }

            courses_text += `
            <br>
                <button class="btn btn-secondary mx-1" onclick="getPartecipantsNumber('`+self_id+`');">Partecipants number</button>
                <button class="btn btn-info mx-1" onclick="getReviews('`+self_id+`');">Reviews</button>
                <button class="btn btn-primary mx-1" onclick="submit_request('`+self_id+`')">Submit</button>
                <span id="partecipants`+self_id+`"></span>
                <div id="user_message`+self_id+`"></div>
                <div id="login_form`+self_id+`"></div>
                </div></div>
                <hr>
            `;
        }
        html_courses.innerHTML=courses_text;
    })
    .catch( error => console.error(error) ); //catch dell'errore
}

//Context: the user is exploring the courses offered by the selected sport center
//Purpose: display the current number of partecipants
function getPartecipantsNumber(course_id){
    const output_html = document.getElementById("partecipants"+course_id);

    fetch('../api/v2/courses/'+course_id+'/participants_number', {
        method: 'GET',
        headers: {'Content-Type': 'application/json'},
    })
    .then((resp) => resp.json()) //trasfor data into JSON
    .then(function(data) {
        console.log(data);
        
        output_html.innerHTML = `
            <div class="mb-2 mt-3">
                <p><b>Number of partecipants: </b>`+data["partecipants"]+`</p>
            </div>
        `;
    })
    .catch( error => console.error(error) ); //catch dell'errore

}
//...

//Context: the user is exploring the courses offered by the selected sport center
//Purpose: display the latest reviews and valutation average
function getReviews(course_id){
    const output_html = document.getElementById("partecipants"+course_id);
    
    fetch('../api/v2/courses/'+course_id+'/reviews', {
        method: 'GET',
        headers: {'Content-Type': 'application/json'},
    })
    .then((resp) => resp.json()) //trasfor data into JSON
    .then(function(data) {
        console.log(data);

        var output_content = "";

        if(data["reviews"].length>0){

            //Review average
            output_content = `
            <div class="mb-2 mt-3">
                <p><b>Review average: </b> `+Math.round(data["average"]*10)/10+`/5</p>
            </div>
            `;

            //Display latest reviews
            output_content += `
                <div class="mb-2 mt-3">
                <p><b>Latest reviews:</b></p>
            `;

            for(r in data["reviews"]){
                output_content += ` 
                    <div class="card mb-2 mt-3" style="width: 18rem;">
                        <div class="card-header">
                            <span><b>Date:</b> `+date_format_1(new Date(data["reviews"][r]["date"]))+`</span>
                        </div>
                        <div class="mb-2 mt-2 mx-3">
                            <span><b>Vote:</b></span>
                `;

                //Color stars according to the vote
                var expressedVote = data["reviews"][r]["vote"];
                for(var n=1; n<=5; n++){
                    if(expressedVote>=n){
                        output_content += `<i class="fa fa-star rating-color"></i>`;
                    }else{
                        output_content += `<i class="fa fa-star"></i>`;
                    }
                }

                output_content += `
                        </div>
                    </div>
                `;
            }
            output_content += `</div>`;
        }else{
            output_content = `
                <div class="mb-2 mt-3 mx-3">
                <p>No review has been published yet</p>
                </div>
            `;
        }

        output_html.innerHTML = output_content;
    })
    .catch( error => console.error(error) ); //catch dell'errore
}
//...

//Administrator: load all courses of the sport center
//Display edit and delete button
//@param[sport_center_id]: sport center identifier
function loadCourses_administrator(sport_center_id){
    const html_courses = document.getElementById('output_facilities');
    var courses_text = "";
    if(!sport_center_id){
        window.location.href = "errorPage.html";
        return;
    }

    fetch('../api/v1/sport_centers/'+sport_center_id+'/courses')
    .then((resp) => resp.json()) //trasfor data into JSON
    .then(function(data) {
        //console.log(data);
        if(data.length>0){
            courses_text = "<p>Here is the list of the courses that has been inserted: </p><br>";
        }
        
        for (var i = 0; i < data.length; i++){ //iterate overe recived data
            var course = data[i];
            //console.log(course);

            let name = course["name"];
            let description = course["description"];
            let creation_date = new Date(course["creation_date"]);
            let sport = course["sport"];
            let periodic = course["periodic"];
            let self = course["self"];
            let self_id = self.substring(self.lastIndexOf('/') + 1);

            let start_date = "";
            let end_date = "";
            
            let specific_date = "";
            let specific_start_time = "";
            let specific_end_time = "";

            courses_text += `
                <div class='card'>
                    <div class='card-text p-2'>
                        <p><b>Name: </b>`+name+`</p>
                        <p><b>Sport: </b>`+sport+`</p>
                        <p><b>Description: </b>`+description+`</p>
            `;

            if(periodic){   //the course is offered for example every monday
                start_date = new Date(course["start_date"]);
                end_date = new Date(course["end_date"]);
                
                //Each day is an array of start-end timestamps
                monday = course["time_schedules"]["monday"]["event"];
                tuesday = course["time_schedules"]["tuesday"]["event"];
                wednesday = course["time_schedules"]["wednesday"]["event"];
                thursday = course["time_schedules"]["thursday"]["event"];
                friday = course["time_schedules"]["friday"]["event"];
                saturday = course["time_schedules"]["saturday"]["event"];
                sunday = course["time_schedules"]["sunday"]["event"];

                week = [monday, tuesday, wednesday, thursday, friday, saturday, sunday];
                week_days = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];

                courses_text += `
                    <p><b>Start date: </b>`+date_format_1(start_date)+`</p>
                    <p><b>End date: </b>`+date_format_1(end_date)+`</p>
                `;

                for(var j=0; j<7; j++){
                    if(week[j].length>0){
                        courses_text += `
                            <p><b>`+week_days[j]+`: </b></p>
                        `;
                    }
                    for(time in week[j]){
                        time_interval = week[j][time];
                        courses_text += `
                            <li class='list-group-item'>from: `+time_interval["from"]+` to: `+time_interval["to"]+`</li>
                        `;
                    }
                }
                
            }else{  //the course is a only once event
                specific_date = new Date(course["specific_date"]);
                specific_start_time = course["specific_start_time"];
                specific_end_time = course["specific_end_time"];
                courses_text += `
                    <p><b>Date: </b>`+date_format_1(specific_date)+`</p>
                    <p><b>From: </b>`+specific_start_time+`<b> To: </b>`+specific_end_time+`</p>
                `;
            }

            courses_text += `
                <p><b>Creation timestamp: </b>`+date_format(creation_date)+`</p>
                <button class="btn btn-info" onclick="loadCourseManagerHandling('`+self_id+`')">Course managers</button><br>
                <button class="btn btn-warning" onclick="loadEditCourse('`+self_id+`', '`+sport_center_id+`')">Edit</button>
                <button class="btn btn-danger" onclick="deleteCourse('`+self_id+`', '`+sport_center_id+`');">Delete</button>
                </div></div>
                <hr>
            `;
            
        }
        html_courses.innerHTML=courses_text;
    })
    .catch( error => console.error(error) ); //catch dell'errore
}


//Delete course administrator
//@param[id_course]: id of the course that has to be deleted
//@param[sport_center_id]: id of the sport center where the course is
function deleteCourse(id_course, sport_center_id){
    if(confirm("Are you sure to delete the selected resource?")){
        var token = "empty";
        var auth_level = "empty";
        token = getCookie("token");
        auth_level = getCookie("user_level");

        if(auth_level=="administrator"){
            fetch('../api/v1/courses/'+id_course, {
                method: 'DELETE',
                headers: { "x-access-token": token },
            })
            .then((resp) => {
                if(resp.status==403){
                    console.log("Authentication error");
                }else{
                    loadCourses_administrator(sport_center_id);
                }
            })
        }else{
            console.log("Authentication error");
        }
    }
}
//...

//Load page to edit a course, administrator
//Purpose: redirect the user to a web page 
//@param[id_course]: id of the course that has to be edited
function loadEditCourse(id_course){
    if(id_course!=""){
        window.location.href="editCourse.html?id_course="+id_course;
    }
}
//...

//Load page to read and add course managers
//Purpose: redirect the user to a web page 
//@param[id_course]: id of the course
function loadCourseManagerHandling(id_course){
    if(id_course!=""){
        window.location.href="admin_courseManagers.html?id_course="+id_course;
    }
}
//...

//Display a form to insert a new course
//@param[sport_center_id]: id of the sport center where the course is
function load_formNewCourse(sport_center_id){
    const html_form_new_course = document.getElementById('output_insertNewCourse');
    var output = "";

    var sportFacilities = [];

    if(!sport_center_id){
        window.location.href = "errorPage.html";
        return;
    }

    //Load sport facilies in order to select where to add the course
    fetch('../api/v1/sport_centers/'+sport_center_id+'/sport_facilities')
    .then((resp) => resp.json()) //trasfor data into JSON
    .then(function(data) {    
        for (var i = 0; i < data.length; i++){ //iterate overe recived data
            var sport_facility = data[i];
            sportFacilities.push(sport_facility);
        }
        
        //Name + Sport + Description
        output += `
            <br>
            <p>Fill the following gaps in order to registrer a new course in your sport center</p>
            <input type="text" class="form-control" id="insertNewCourse_name" name="name" placeholder="Insert name new course..."><br>
            <input type="text" class="form-control" id="insertNewCourse_sport" name="sport" placeholder="Specify a meaningful sport category..."><br>
            <textarea name="description" class="form-control" id="insertNewCourse_description" rows="4" cols="50" placeholder="Insert description..."></textarea><br>
        `

        //Prepare sport facilities options
        var sportFacilityOptions = "";

        for(sf in sportFacilities){
            let sf_name = sportFacilities[sf]["name"];
            let sf_ref = sportFacilities[sf]["self"];
            let sf_id = sf_ref.substring(sf_ref.lastIndexOf('/') + 1);
            sportFacilityOptions += `<option value="`+sf_id+`">`+sf_name+`</option>`;
        }
        output +=`
            Select sport facility:
            <select class="form-select" name="course_sport_facility" id="insertNewCourse_sportFacility">
                `+sportFacilityOptions+`
            </select>
            <br>
        `
        
        //Select perodicity
        output+=`
            <input name="periodic" class="form-check-input" id="insertNewCourse_periodic_true" type="radio" value="true" onclick="displayPeriodicSchedule()">
            <label for="insertNewCourse_periodic_true" class="form-check-label">Periodic course</label><br>
            <input name="periodic" class="form-check-input" id="insertNewCourse_periodic_false" type="radio" value="false" onclick="displayNotPeriodicSchedule()">
            <label for="insertNewCourse_periodic_false" class="form-check-label">Not periodic course</label><br>
            <br>
            <div id="timeSchedule" class="container mt-3">
            </div>
        `

        html_form_new_course.innerHTML=output;

    })
    .catch( error => console.error(error) ); //catch dell'errore
}

//Context: add new course
//When: the administrator is adding a course which is not periodic
//What to do: display the form in order to insert a new not periodic course
function displayNotPeriodicSchedule(){
    const html_form_schedule = document.getElementById('timeSchedule');

    var output = `
        <div id="form_not_periodic_course">
            <p>--> not periodic course registration form</p>
            <label class="form-label" for="insertNewCourse_specificDate">Date:</label>
            <input type="date" class="form-control" id="insertNewCourse_specificDate" name="specific_date"><br>
            <label class="form-label" for="insertNewCourse_specificStartTime">Start at:</label>
            <input type="time" class="form-control" id="insertNewCourse_specificStartTime" name="specific_fromTime"><br>
            <label class="form-label" for="insertNewCourse_specificEndTime">Finish at:</label>
            <input type="time" class="form-control" id="insertNewCourse_specificEndTime" name="specific_toTime"><br>
        </div>
        <input type="button" class="btn btn-success" name="confirm_insert" value="Confirm" onclick="insertCourse()">
        <input type="button" class="btn btn-danger" name="cancel_insert" value="Cancel" onclick="close_insert_course_form()">
        <br>
    `;

    html_form_schedule.innerHTML = output;
}
//...

//Context: add new course
//When: the administrator is adding a course which is periodic
//What to do: display the form in order to insert a new periodic course
function displayPeriodicSchedule(){
    const html_form_schedule = document.getElementById('timeSchedule');

    var output = `
        <div id="form_periodic_course">
            <p>--> periodic course registration form</p>
            <label class="form-label" for="insertNewCourse_startDate">Start date:</label>
            <input type="date" class="form-control" id="insertNewCourse_startDate" name="start_date"><br>
            <label class="form-label" for="insertNewCourse_endDate">End date:</label>
            <input type="date" class="form-control" id="insertNewCourse_endDate" name="end_date"><br>
            <p>Fill week schedule (FROM - TO)</p>
            <ul>
            <li>Mon</li>
            <div id="mon">
            <span name="interval">
            <div class="row">
                <div class="col">
                <input type="time" class="form-control">
                </div>
                <div class="col">
                <input type="time" class="form-control">
                </div>
            </div>
            </span>
            </div>
            <button id="monAddInterval" class="btn btn-secondary" onclick="addInterval('mon')">Add interval</button>
            <li>Tue</li>
            <div id="tue">
            <span name="interval">
            <div class="row">
                <div class="col">
                <input type="time" class="form-control">
                </div>
                <div class="col">
                <input type="time" class="form-control">
                </div>
            </div>
            </span>
            </div>
            <button id="tueAddInterval" class="btn btn-secondary" onclick="addInterval('tue')">Add interval</button>
            <li>Wed</li>
            <div id="wed">
            <span name="interval">
            <div class="row">
                <div class="col">
                <input type="time" class="form-control">
                </div>
                <div class="col">
                <input type="time" class="form-control">
                </div>
            </div>
            </span>
            </div>
            <button id="monAddInterval" class="btn btn-secondary" onclick="addInterval('wed')">Add interval</button>
            <li>Thu</li>
            <div id="thu">
            <span name="interval">
            <div class="row">
                <div class="col">
                <input type="time" class="form-control">
                </div>
                <div class="col">
                <input type="time" class="form-control">
                </div>
            </div>
            </span>
            </div>
            <button id="monAddInterval" class="btn btn-secondary" onclick="addInterval('thu')">Add interval</button>
            <li>Fri</li>
            <div id="fri">
            <span name="interval">
            <div class="row">
                <div class="col">
                <input type="time" class="form-control">
                </div>
                <div class="col">
                <input type="time" class="form-control">
                </div>
            </div>
            </span>
            </div>
            <button id="monAddInterval" class="btn btn-secondary" onclick="addInterval('fri')">Add interval</button>
            <li>Sat</li>
            <div id="sat">
            <span name="interval">
            <div class="row">
                <div class="col">
                <input type="time" class="form-control">
                </div>
                <div class="col">
                <input type="time" class="form-control">
                </div>
            </div>
            </span>
            </div>
            <button id="monAddInterval" class="btn btn-secondary" onclick="addInterval('sat')">Add interval</button>
            <li>Sun</li>
            <div id="sun">
            <span name="interval">
            <div class="row">
                <div class="col">
                <input type="time" class="form-control">
                </div>
                <div class="col">
                <input type="time" class="form-control">
                </div>
            </div>
            </span>
            </div>
            <button id="monAddInterval" class="btn btn-secondary" onclick="addInterval('sun')">Add interval</button>
            </ul>
        </div>
        <input type="button" class="btn btn-success" name="confirm_insert" value="Confirm" onclick="insertCourse()">
        <input type="button" class="btn btn-danger" name="cancel_insert" value="Cancel" onclick="close_insert_course_form()">
        <br>
    `;

    html_form_schedule.innerHTML = output;
}
//...

//Insert new course
function insertCourse(){
    //Check athentication data
    var token = "";
    var auth_level = "";
    token = getCookie("token");
    auth_level = getCookie("user_level");
    sport_center_id = getCookie("sport_center_id");

    if(token=="" || auth_level!="administrator" || sport_center_id==""){
        console.log("Authentication error");
        return;
    }

    //Course name
    //Course sport
    //Course description
    //Course sport facility
    var c_name = document.getElementById("insertNewCourse_name").value;
    var c_sport = document.getElementById("insertNewCourse_sport").value;
    var c_description = document.getElementById("insertNewCourse_description").value;
    var c_sport_facility = document.getElementById("insertNewCourse_sportFacility").value;

    //Read if the course is periodic or not
    var periodicity_true = document.getElementById("insertNewCourse_periodic_true").checked;
    var periodicity_false = document.getElementById("insertNewCourse_periodic_false").checked;


    console.log("name: "+c_name);
    console.log("sport: "+c_sport);
    console.log("description: "+c_description);
    console.log("c_sport_facility: "+c_sport_facility);
    console.log("pt: "+periodicity_true);
    console.log("pf: "+periodicity_false);
    if(periodicity_true){
        console.log("periodicity: true");

        //Get start date
        //Get end date
        var start_date = document.getElementById("insertNewCourse_startDate").value;
        var end_date = document.getElementById("insertNewCourse_endDate").value

        console.log("start date: "+start_date);
        console.log("end date: "+end_date);

        var dayNames = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];
        var dayIntervalArrays = [];

        for(d in dayNames){
            //Get day schedule
            var day_div = document.getElementById(dayNames[d]);
            var num_intervals = day_div.getElementsByTagName("span").length;
            var intervals = day_div.getElementsByTagName("span");
            var intervalsArray = [];

            for(var interval=0; interval<num_intervals; interval++){
                var from = intervals[interval].children[0].children[0].children[0].value;
                var to = intervals[interval].children[0].children[1].children[0].value;
                console.log("from: "+from);
                console.log("to: "+to);

                if(from!="" && to!=""){
                    var interval_JSON = {};
                    interval_JSON.from = from;
                    interval_JSON.to = to;
                    console.log("interval: "+interval_JSON);
                    intervalsArray.push(interval_JSON);
                }
            }
            dayIntervalArrays.push(intervalsArray);
        }
        
        //Control that all required data has been inserted
        if(c_name=="" || start_date=="" || end_date==""){
            console.log("Missing required information")
            return;
        }
        console.log("Array interval: "+JSON.stringify(dayIntervalArrays));
        //Insert new course with using POST API
        fetch('../api/v1/courses', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', "x-access-token": token},
            body: JSON.stringify(
            { name: c_name,
              sport: c_sport,
              description: c_description,
              sport_facility_id: c_sport_facility,
              periodic: 1,
              start_date: start_date,
              end_date: end_date,
              time_schedules_monday: {"event":dayIntervalArrays[0]},
              time_schedules_tuesday: {"event":dayIntervalArrays[1]},
              time_schedules_wednesday: {"event":dayIntervalArrays[2]},
              time_schedules_thursday: {"event":dayIntervalArrays[3]},
              time_schedules_friday: {"event":dayIntervalArrays[4]},
              time_schedules_saturday: {"event":dayIntervalArrays[5]},
              time_schedules_sunday: {"event":dayIntervalArrays[6]},
              sport_center_id: sport_center_id          
            } ),
        })
        .then((resp) => {
            close_insert_course_form();
            loadCourses_administrator(sport_center_id);
        })
        .catch( error => console.error(error) ); // If there is any error you will catch them here
        
    }else if(periodicity_false){
        console.log("periodicity: false");

        //Get date
        //Get start time
        //Get finish time
        var specific_date = document.getElementById("insertNewCourse_specificDate").value;
        var specific_start_time = document.getElementById("insertNewCourse_specificStartTime").value;
        var specific_end_time = document.getElementById("insertNewCourse_specificEndTime").value;

        console.log("specific_date: "+specific_date);
        console.log("specific_start_time: "+specific_start_time);
        console.log("specific_end_time: "+specific_end_time);

        //Control that all required data has been inserted
        if(c_name=="" || specific_date=="" || specific_start_time=="" || specific_end_time==""){
            console.log("Missing required information")
            return;
        }

        //Insert new course with using POST API
        fetch('../api/v1/courses', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', "x-access-token": token},
            body: JSON.stringify(
            { name: c_name,
              sport: c_sport,
              description: c_description,
              sport_facility_id: c_sport_facility,
              periodic: 0,
              specific_date: specific_date,
              specific_start_time: specific_start_time,
              specific_end_time: specific_end_time,
              sport_center_id: sport_center_id          
            } ),
        })
        .then((resp) => {
            close_insert_course_form();
            loadCourses_administrator(sport_center_id);
        })
        .catch( error => console.error(error) ); // If there is any error you will catch them here

    }
}
//...

//Modify an existing course
//@param[periodicity] : TRUE iff the course is periodic, FALSE otherwise
function PATCH_editCourse(course_id, periodicity){
    //Check athentication data
    var token = "";
    var auth_level = "";
    token = getCookie("token");
    auth_level = getCookie("user_level");
    sport_center_id = getCookie("sport_center_id");

    if(!token || auth_level!="administrator" || !sport_center_id){
        console.log("Authentication error");
        return;
    }

    //Course name
    //Course sport
    //Course description
    //Course sport facility
    var c_name = document.getElementById("courseName").value;
    var c_sport = document.getElementById("courseSport").value;
    var c_description = document.getElementById("courseDescription").value;
    var c_sport_facility = document.getElementById("courseSportfacility").value;

    console.log("name: "+c_name);
    console.log("sport: "+c_sport);
    console.log("description: "+c_description);
    console.log("c_sport_facility: "+c_sport_facility);
    console.log("periodicity: "+periodicity);

    
    if(periodicity=="true"){
        console.log("periodicity: true");

        //Get start date
        //Get end date
        var start_date = document.getElementById("courseStartDate").value;
        var end_date = document.getElementById("courseEndDate").value

        console.log("start date: "+start_date);
        console.log("end date: "+end_date);

        var dayNames = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];
        var dayIntervalArrays = [];

        for(d in dayNames){
            //Get day schedule
            var day_div = document.getElementById(dayNames[d]);
            var num_intervals = day_div.getElementsByTagName("span").length;
            var intervals = day_div.getElementsByTagName("span");
            var intervalsArray = [];

            console.log("Giorno: "+dayNames[d]);
            console.log("Intervalli: "+num_intervals);

            for(var interval=0; interval<num_intervals; interval++){
                var riga = intervals[interval].children[0];
                var colonna1 = riga.children[0];
                
                var colonna2 = riga.children[1];
                var from = colonna1.children[0].value;
                var to = colonna2.children[0].value;
                console.log("from: "+from);
                console.log("to: "+to);

                if(from!="" && to!=""){
                    var interval_JSON = {};
                    interval_JSON.from = from;
                    interval_JSON.to = to;
                    console.log("interval: "+interval_JSON);
                    intervalsArray.push(interval_JSON);
                }
            }
            dayIntervalArrays.push(intervalsArray);
        }
        
        //Control that all required data has been inserted
        if(c_name=="" || start_date=="" || end_date==""){
            console.log("Missing required information")
            return;
        }
        console.log("Array interval: "+JSON.stringify(dayIntervalArrays));

        //Edit course using PATCH API
        fetch('../api/v1/courses/'+course_id, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json', "x-access-token": token},
            body: JSON.stringify(
            { name: c_name,
              sport: c_sport,
              description: c_description,
              sport_facility_id: c_sport_facility,
              periodic: 1,
              start_date: start_date,
              end_date: end_date,
              time_schedules:{
                  monday: {"event":dayIntervalArrays[0]},
                  tuesday: {"event":dayIntervalArrays[1]},
                  wednesday: {"event":dayIntervalArrays[2]},
                  thursday: {"event":dayIntervalArrays[3]},
                  friday: {"event":dayIntervalArrays[4]},
                  saturday: {"event":dayIntervalArrays[5]},
                  sunday: {"event":dayIntervalArrays[6]}
              },
              sport_center_id: sport_center_id          
            } ),
        })
        .then((resp) => {
            alert("Success!");
        })
        .catch( error => console.error(error) ); // If there is any error you will catch them here
        
    }else{
        console.log("periodicity: false");

        //Get date
        //Get start time
        //Get finish time
        var specific_date = document.getElementById("courseSpecificDate").value;
        var specific_start_time = document.getElementById("courseStartTime").value;
        var specific_end_time = document.getElementById("courseEndTime").value;

        console.log("specific_date: "+specific_date);
        console.log("specific_start_time: "+specific_start_time);
        console.log("specific_end_time: "+specific_end_time);

        //Control that all required data has been inserted
        if(!c_name || !specific_date || !specific_start_time || !specific_end_time){
            console.log("Missing required information")
            return;
        }

        //Insert new course with using POST API
        fetch('../api/v1/courses/'+course_id, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json', "x-access-token": token},
            body: JSON.stringify(
            { name: c_name,
              sport: c_sport,
              description: c_description,
              sport_facility_id: c_sport_facility,
              periodic: 0,
              specific_date: specific_date,
              specific_start_time: specific_start_time,
              specific_end_time: specific_end_time,
              sport_center_id: sport_center_id          
            } ),
        })
        .then((resp) => {
            if(resp.status==200){
                alert("Success!");
            }
        })
        .catch( error => console.error(error) ); // If there is any error you will catch them here
    }
}
//...

//Display a form to insert a new manager
//@param[sport_center_id]: id of the sport center where the manager works
function load_formNewManager(sport_center_id){
    const html_form_new_course = document.getElementById('output_insertNewManager');
    var output = "";

    var managers = [];

    if(!sport_center_id){
        window.location.href = "errorPage.html";
        return;
    }

    //Load sport facilies in order to select where to add the course
    fetch('../api/v2/sport_centers/'+sport_center_id+'/managers')
    .then((resp) => resp.json()) //trasfor data into JSON
    .then(function(data) {    
        for (var i = 0; i < data.length; i++){ //iterate overe recived data
            var manager = data[i];
            managers.push(manager);
        }
        
        //Name + Surname + Email + Birth date + Society
        output += `
            <br>
            <p>Fill the following gaps in order to registrer a new manager in your sport center</p>
            <input type="text" class="form-control" id="insertNewManager_name" name="name" placeholder="Insert name new manager..."><br>
            <input type="text" class="form-control" id="insertNewManager_surname" name="surname" placeholder="Insert surname new manager..."><br>
            <input type="text" class="form-control" id="insertNewManager_email" name="email" placeholder="Insert email new manager..."><br>
            <input type="date" class="form-control" id="insertNewManager_birth_date" name="birth_date"><br>
            <input type="text" class="form-control" id="insertNewManager_society" name="society" placeholder="Insert society new manager..."><br>
            <input type="text" class="form-control" id="insertNewManager_username" name="username" placeholder="Insert username new manager..."><br>
            <input type="password" class="form-control" id="insertNewManager_password" name="password" placeholder="Insert password new manager..."><br>
            <input type="button" class="btn btn-success" name="confirm_insert" value="Confirm" onclick="insertManager()">
            <input type="button" class="btn btn-danger" name="cancel_insert" value="Cancel" onclick="close_insert_manager_form()">
            <br>
        `
        
        html_form_new_course.innerHTML=output;

    })
    .catch( error => console.error(error) ); //catch dell'errore
}


//Inser new Manager
function insertManager(){
    //Check athentication data
    var token = "";
    var auth_level = "";
    token = getCookie("token");
    auth_level = getCookie("user_level");
    sport_center_id = getCookie("sport_center_id");

    if(token=="" || auth_level!="administrator" || sport_center_id==""){
        console.log("Authentication error");
        return;
    }
    
    //Manager name
    //Manager surname
    //Manager email
    //Manager birth date
    //Manager society
    var m_name = document.getElementById("insertNewManager_name").value;
    var m_surname = document.getElementById("insertNewManager_surname").value;
    var m_email = document.getElementById("insertNewManager_email").value;
    var m_birth_date = document.getElementById("insertNewManager_birth_date").value;
    var m_society = document.getElementById("insertNewManager_society").value;
    var m_username = document.getElementById("insertNewManager_username").value;
    var m_password = document.getElementById("insertNewManager_password").value;

    console.log("name: "+m_name);
    console.log("surname: "+m_surname);
    console.log("email: "+m_email);
    console.log("birth_date: "+m_birth_date);
    console.log("society: "+m_society);
    console.log("username: "+m_username);
    console.log("password: "+m_password);

    //Insert new course with using POST API
    fetch('../api/v2/managers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', "x-access-token": token},
        body: JSON.stringify({
            name: m_name,
            surname: m_surname,
            email: m_email,
            birth_date: m_birth_date,
            username: m_username,
            password: m_password,
            society: m_society,
            courses: [],
            sport_center_id: sport_center_id
        }),
    })
    .then((resp) => {
        close_insert_manager_form();
        loadCourses_administrator(sport_center_id);
    })
    .catch( error => console.error(error) ); // If there is any error you will catch them here
}

//Display login form
//@param [login_type]: {A-->user admin login ; R-->course manager login ; U-->standard user login}
function display_loginForm(login_type){
    const output = document.getElementById("output_js");

    //Check if the user has already done the authentication procedure
    var token = "";
    var auth_level = "";
    token = getCookie("token");
    auth_level = getCookie("user_level");

    if(login_type=='A'){    //login administrator

        //If already authenticated --> no login
        if(token && auth_level=="administrator"){
            window.location.href="impiantiadmin.html";
            return;
        }

        output.innerHTML=
    `
        <hr>
        <div class="col-sm-4"></div>    
        <div class="col-sm-4">
            <h2>Login administrator: </h2>
            <form>
                <label for="username">Username: </label>
                <input type="text" name="username" id="loginUsername" required> <br>
                <label for="password">Password: </label>
                <input type="password" name="password" id="loginPassword" required> <br>
                <input type="button" class="btn btn-primary" value="Sign in" onclick="login('`+login_type+`')">
                <button onclick="location.href = 'registration.html';" class="btn btn-success" id="register">Registrati</button>
                <span id="wrongInput" style="color: red;"></span>
            </form>
        <div>
        <div class="col-sm-4"></div>
    `;
    
    }else if(login_type=='R'){

        //If already authenticated --> no login
        if(token && auth_level=="responsabile"){
            window.location.href="responsabilehome.html";
            return;
        }

        output.innerHTML=
    `
        <hr>
        <div class="col-sm-4"></div>
        <div class="col-sm-4">
            <h2>Login course manager: </h2>
            <form>
                <label for="username">Username: </label>
                <input type="text" name="username" id="loginUsername" required> <br>
                <label for="password">Password: </label>
                <input type="password" name="password" id="loginPassword" required> <br>
                <input type="button" class="btn btn-primary" value="Sign in" onclick="login('`+login_type+`')">
                <span id="wrongInput" style="color: red;"></span>
            </form>
        <div>
        <div class="col-sm-4"></div>
    `;

    }else if(login_type=='U'){

        //If already authenticated --> no login
        if(token && auth_level=="user"){
            window.location.href="autenticateduserhome.html";
            return;
        }

        output.innerHTML=
    `
        <hr>
        <div class="col-sm-4"></div>
        <div class="col-sm-4">
            <h2>Login user: </h2>
            <form>
                <label for="username">Username: </label>
                <input type="text" name="username" id="loginUsername" required> <br>
                <label for="password">Password: </label>
                <input type="password" name="password" id="loginPassword" required> <br>
                <input type="button" value="Sign in" class="btn btn-primary" onclick="login('`+login_type+`')">
                <button onclick="show_user_registration_form()" class="btn btn-secondary">Registrati</button>
                        <div id="insertNewUser" hidden="true">
                            <br>
                            <p>Fill the following gaps in order to registrer</p>
                            <input type="text" id="insertNewUser_name" name="name" class="form-control" placeholder="Name" required><br>
                            <input type="text" id="insertNewUser_surname" name="surname" class="form-control" placeholder="Surname" required><br>
                            <input type="text" id="insertNewUser_email" name="email" class="form-control" placeholder="Email@email.com" required><br>
                            <input type="date" id="insertNewUser_dob" class="form-control" name="dob" required><br>
                            <input type="text" id="insertNewUser_username" name="username" class="form-control" placeholder="Username " required><br>
                            <input type="password" id="insertNewUser_password" name="password" class="form-control" placeholder="Password" required><br>

                            <input type="button" name="confirm_insert" class="btn btn-success" value="Confirm" onclick="insertUser()">
                            <input type="button" name="cancel_insert" class="btn btn-danger" value="Cancel" onclick="close_user_registration_form()">
                            <br>
                        </div>
                <span id="wrongInput" style="color: red;"></span>
            </form>
        <div>
        <div class="col-sm-4"></div>
    `;
    }
}
//...

//Login
//@param [login_type]: {A-->user admin login ; R-->course manager login ; U-->standard user login}
function login(login_type){
    //get the form object
    var username = document.getElementById("loginUsername").value;
    var password = document.getElementById("loginPassword").value;

    var wrongInput = document.getElementById("wrongInput");

    if(login_type=='A'){
        fetch('/api/v1/authentications/admin', {
            method: 'POST',
            headers: {'Content-Type': 'application/json' },
            body: JSON.stringify( { username: username, password: password } ),
        })
        .then((resp) => resp.json()) // Transform the data into json
        .then(function(data) { // Here you get the data to modify as you please

            if(data.success==true){ //authentication success!
                let user_token = data.token;
                let user_username = data.username;
                let user_identifier = data.id;

                let user_level = data.user;
                let sport_center_name = data.sport_center.name;
                let sport_center_id = data.sport_center._id;
                
                //Add user info into browser cookie document
                setCookie("token", user_token, 1);
                setCookie("username", user_username, 1);
                setCookie("user_id", user_identifier, 1);
                setCookie("user_level", user_level, 1);
                setCookie("sport_center_name", sport_center_name, 1);
                setCookie("sport_center_id", sport_center_id, 1);

                setCookie("user_level", user_level, 1);
                setCookie("sport_center_name", sport_center_name, 1);
                setCookie("sport_center_id", sport_center_id, 1);

                window.location.href="impiantiadmin.html";
            }else if(data.username==false){ //wrong username
                wrongInput.innerHTML = "Bad username )-:";
            }else if(data.password==false){ //wrong password
                wrongInput.innerHTML = "Bad password )-:";
            }            
        })
        .catch( error => console.error(error) ); // If there is any error you will catch them here
    }else if(login_type=='R'){
        
        fetch('/api/v1/authentications/responsabile', {
            method: 'POST',
            headers: {'Content-Type': 'application/json' },
            body: JSON.stringify( { username: username, password: password } ),
        })
        .then((resp) => resp.json()) // Transform the data into json
        .then(function(data) { // Here you get the data to modify as you please

            if(data.success==true){ //authentication success!
                let user_token = data.token;
                let user_username = data.username;
                let user_identifier = data.id;
                let user_level = data.user;

                //Add user info into browser cookie document
                setCookie("token", user_token, 1);
                setCookie("username", user_username, 1);
                setCookie("user_id", user_identifier, 1);
                setCookie("user_level", user_level, 1);
                window.location.href="responsabilehome.html";
            }else if(data.username==false){ //wrong username
                wrongInput.innerHTML = "Bad username )-:";
            }else if(data.password==false){ //wrong password
                wrongInput.innerHTML = "Bad password )-:";
            }            
        })
        .catch( error => console.error(error) );
        
    }else if(login_type=='U'){
        
        fetch('/api/v1/authentications/user', {
            method: 'POST',
            headers: {'Content-Type': 'application/json' },
            body: JSON.stringify( { username: username, password: password } ),
        })
        .then((resp) => resp.json()) // Transform the data into json
        .then(function(data) { // Here you get the data to modify as you please

            if(data.success==true){ //authentication success!
                let user_token = data.token;
                let user_username = data.username;
                let user_identifier = data.id;
                let user_level = data.user;
                
                //Add user info into browser cookie document
                setCookie("token", user_token, 1);
                setCookie("username", user_username, 1);
                setCookie("user_id", user_identifier, 1);
                setCookie("user_level", user_level, 1);
                window.location.href="autenticateduserhome.html";
            }else if(data.username==false){ //wrong username
                wrongInput.classList.add("alert alert-danger");
                wrongInput.innerHTML = "Bad username )-:";
            }else if(data.password==false){ //wrong password
                wrongInput.classList.add("alert alert-danger");
                wrongInput.innerHTML = "Bad password )-:";
            }            
        })
        .catch( error => console.error(error) );
    }else{
        window.location.href = "errorPage.html";
    }
}
//...

//Logout
//Delete user info from cookies
function logout(){
    const cookies = document.cookie.split(";");
    for (const cookie of cookies) {
        const eqPos = cookie.indexOf("=");
        const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
        document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
    }
    
    //Redirect to homepage
    window.location.href = "index.html";

}
//...


//Course submission
//@param[course_id] id of the course
//OUTPUT: 1 --> not authenticated
//        0 --> OK
function submit_course(course_id){
    //i. Check authentication data
    var token = "";
    var auth_level = "";
    token = getCookie("token");
    auth_level = getCookie("user_level");

    if(!token || auth_level!="user"){
        console.log("Authentication required");
        return 1;
    }

}


/**===UTILS FUNCTIONS===*/

//Create new Cookie
function setCookie(cname, cvalue, exdays) {
    const d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    let expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires;
}
//...

//Get Cookie value
function getCookie(cname) {
    let name = cname + "=";
    let ca = document.cookie.split(';');
    for(let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
}
//...

//Date formatting
//DD-MM-YY-HH:MM:SS
function date_format(d){
    var day = d.getDate();
    var month = d.getMonth();
    var year = d.getFullYear();
    var second = d.getSeconds();
    var minute = d.getMinutes();
    var hour = d.getHours();

    return day+"-"+month+"-"+year+"-"+hour+":"+minute+":"+second;
}

//DD-MM-YYYY
function date_format_1(d){
    var day = d.getDate();
    var month = d.getMonth();
    var year = d.getFullYear();

    return day+"-"+month+"-"+year;
}

//HH:MM
function date_format_2(d){
    var minute = d.getMinutes();
    var hour = d.getHours();

    return hour+":"+minute;
}

//YYYY-MM-DD
function date_format_3(d){
    var day = d.getDate();
    var month = d.getMonth();
    var year = d.getFullYear();
    test = d.getFullYear() + '-' + ('0' + (d.getMonth()+1)).slice(-2) + '-' + ('0' + d.getDate()).slice(-2);
    console.log("date: "+test)
    return test;
}

//YYYY-MM-DD time: HH:MM
function date_format_4(d){
    var day = d.getDate();
    var month = d.getMonth();
    var year = d.getFullYear();
    var minute = d.getMinutes();
    var hour = d.getHours();
    test = d.getFullYear() + '-' + ('0' + (d.getMonth()+1)).slice(-2) + '-' + ('0' + d.getDate()).slice(-2);
    test+=" time: "+hour+":"+minute;
    return test;
}

//...

//Find get parameter
//INPUT: parameterName --> name of the parameter of which I want to know the value
//OUTPUT: value of get parameter [parameterName]
function findGetParameter(parameterName) {
    var result = null,
        tmp = [];
    location.search
        .substr(1)
        .split("&")
        .forEach(function (item) {
          tmp = item.split("=");
          if (tmp[0] === parameterName) result = decodeURIComponent(tmp[1]);
        });
    return result;
}

//Manager: load all his courses
//@param[user_id]: manager identifier
function loadCourses_manager(user_id){
    const html_courses = document.getElementById('output_courses');
    var courses_text = "";
    if(!user_id){
        window.location.href = "errorPage.html";
        return;
    }

    fetch('../api/v1/managers/'+user_id+'/courses')
    .then((resp) => resp.json()) //trasfor data into JSON
    .then(function(data) {
        //console.log(data);
        if(data.length>0){
            courses_text = "<p>Here is the list of your courses: </p><br>";
        } else {
            courses_text = "<p>There are no courses yet</p><br>";
        }
        courses_text += `<hr>`;
        for (var i = 0; i < data.length; i++){ //iterate overe recived data
            var course = data[i];
            //console.log(course);

            let name = course["name"];
            let description = course["description"];
            let sport = course["sport"];
            let periodic = course["periodic"];
            let self = course["self"];
            let self_id = self.substring(self.lastIndexOf('/') + 1);

            let start_date = "";
            let end_date = "";
            
            let specific_date = "";
            let specific_start_time = "";
            let specific_end_time = "";

            courses_text += `
                <div class='card'>
                    <div class='card-text p-2'>
                        <p><b>Name: </b>`+name+`</p>
                        <p><b>Sport: </b>`+sport+`</p>
                        <p><b>Description: </b>`+description+`</p>
            `;

            if(periodic){   //the course is offered for example every monday
                start_date = new Date(course["start_date"]);
                end_date = new Date(course["end_date"]);
                
                //Each day is an array of start-end timestamps
                monday = course["time_schedules"]["monday"]["event"];
                tuesday = course["time_schedules"]["tuesday"]["event"];
                wednesday = course["time_schedules"]["wednesday"]["event"];
                thursday = course["time_schedules"]["thursday"]["event"];
                friday = course["time_schedules"]["friday"]["event"];
                saturday = course["time_schedules"]["saturday"]["event"];
                sunday = course["time_schedules"]["sunday"]["event"];

                week = [monday, tuesday, wednesday, thursday, friday, saturday, sunday];
                week_days = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];

                courses_text += `
                    <p><b>Start date: </b>`+date_format_1(start_date)+`</p>
                    <p><b>End date: </b>`+date_format_1(end_date)+`</p>
                `;

                for(var j=0; j<7; j++){
                    if(week[j].length>0){
                        courses_text += `
                            <p><b>`+week_days[j]+`: </b></p>
                        `;
                    }
                    for(time in week[j]){
                        time_interval = week[j][time];
                        courses_text += `
                            <li class='list-group-item'>from: `+time_interval["from"]+` to: `+time_interval["to"]+`</li>
                        `;
                    }
                }
                
            }else{  //the course is a only once event
                specific_date = new Date(course["specific_date"]);
                specific_start_time = course["specific_start_time"];
                specific_end_time = course["specific_end_time"];
                courses_text += `
                    <p><b>Date: </b>`+date_format_1(specific_date)+`</p>
                    <p><b>From: </b>`+specific_start_time+`<b> To: </b>`+specific_end_time+`</p>
                `;
                
            }
            courses_text += `<br>
                            <button class="btn btn-info mx-2" onclick="show_partecipants('`+self_id+`')">Partecipants</button>
                            <button class="btn btn-warning mx-2" onclick="show_news_pubblication_form('`+self_id+`')">Public news</button>
                            <button class="btn btn-primary mx-2" onclick="show_reviews('`+self_id+`')">Reviews</button>
                            <br>
                            <div class="mx-3 my-3" id="partecipants`+self_id+`"></div>
                            </div></div>
                            <hr>`;
        }
        html_courses.innerHTML = courses_text;
    })
    .catch( error => console.error(error) ); //catch dell'errore
}

//Context: Course manager user wants to know the partecipants of his/her course
//Output: Print list of partecipants under the selected course
//Input: @param[course_id] id of the selected course
function show_partecipants(course_id){
    const output_html = document.getElementById("partecipants"+course_id);

    //Check authentication
    var token = "";
    var auth_level = "";

    token = getCookie("token");
    auth_level = getCookie("user_level");

    if(token=="" || auth_level!="responsabile"){
        console.log("Authentication required");
        return ;
    }

    fetch('../api/v1/courses/'+course_id+'/users', {
        method: 'GET',
        headers: {'Content-Type': 'application/json', "x-access-token": token},
    })
    .then((resp) => resp.json()) //trasfor data into JSON
    .then(function(data) {
        //console.log(data);

        output_html.innerHTML = `

        <p class="font-monospace"><b>TOT: </b>`+data.length+`</p>
        `;

        for(u in data){
            let name = data[u]["name"];
            let surname = data[u]["surname"];

            output_html.innerHTML += `
                <li class='list-group-item'>`+name+` `+surname+`</li>
            `;
        }

        output_html.innerHTML += `
            <button class="btn btn-secondary my-3" onclick="hide_partecipants('`+course_id+`');">Close list</button>
        `;
    })
    .catch( error => console.error(error) ); //catch dell'errore
}

function hide_partecipants(course_id){
    const output_html = document.getElementById("partecipants"+course_id);
    output_html.innerHTML="";
}
//...

//Context: Course manager user wants to public news about his/her course
//Output: Print news pubblication form
//Input: @param[course_id] id of the selected course
function show_news_pubblication_form(course_id){
    const output_html = document.getElementById("partecipants"+course_id);
    output_html.innerHTML = `

        <div class="container">
        <div class="mb-2 mt-3">
            <label for="newsText" class="form-label"><b>Insert here the news. After that click on Public in order to make the news visible to all course subscribers.</b></label>
            <textarea class="form-control" id="newsText" name="newsText" place_holder="News..."></textarea>
        </div>
        <div class="mb-3">
            <br><br>
            <button type="button" class="btn btn-success" onclick="public_news('`+course_id+`')">Public</button>  
            <button type="button" class="btn btn-danger" onclick="hide_partecipants('`+course_id+`')">Cancel</button>
        </div>
        </div>
    
    `;
}

//Context: Course manager user wants to read reviews about one of his courses
//Output: Print reviews
//Input: @param[course_id] id of the selected course
function show_reviews(course_id){
    const output_html = document.getElementById("partecipants"+course_id);
    
    fetch('../api/v2/courses/'+course_id+'/reviews', {
        method: 'GET',
        headers: {'Content-Type': 'application/json'},
    })
    .then((resp) => resp.json()) //trasfor data into JSON
    .then(function(data) {
        console.log(data);

        var output_content = "";

        if(data["reviews"].length>0){

            //Review average
            output_content = `
            <div class="mb-2 mt-3">
                <p><b>Review average: </b> `+Math.round(data["average"]*10)/10+`/5</p>
            </div>
            `;

            //Display latest reviews
            output_content += `
                <div class="mb-2 mt-3">
                <p><b>Latest reviews:</b></p>
            `;

            for(r in data["reviews"]){
                output_content += ` 
                    <div class="card mb-2 mt-3" style="width: 18rem;">
                        <div class="card-header">
                            <span><b>Date:</b> `+date_format_1(new Date(data["reviews"][r]["date"]))+`</span>
                        </div>
                        <div class="mb-2 mt-2 mx-3">
                            <span><b>Vote:</b></span>
                `;

                //Color stars according to the vote
                var expressedVote = data["reviews"][r]["vote"];
                for(var n=1; n<=5; n++){
                    if(expressedVote>=n){
                        output_content += `<i class="fa fa-star rating-color"></i>`;
                    }else{
                        output_content += `<i class="fa fa-star"></i>`;
                    }
                }

                output_content += `
                        </div>
                    </div>
                `;
            }
            output_content += `</div>`;
        }else{
            output_content = `
                <div class="mb-2 mt-3 mx-3">
                <p>No review has been published yet</p>
                </div>
            `;
        }

        output_content += `<button class="btn btn-secondary my-3" onclick="hide_partecipants('`+course_id+`');">Close</button>`

        output_html.innerHTML = output_content;
    })
    .catch( error => console.error(error) ); //catch dell'errore
}
//...

function public_news(course_id){
    //Check athentication data
    var token = "";
    var auth_level = "";
    token = getCookie("token");
    auth_level = getCookie("user_level");

    if(!token || auth_level!="responsabile"){
        console.log("Authentication error");
        return;
    }

    //News text
    var n_text = document.getElementById("newsText").value;

    //Check required parameters
    if(!n_text || !course_id){
        window.location.href = "errorPage.html";
        return ;
    }

    //Insert news using POST API
    fetch('../api/v2/news', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', "x-access-token": token},
        body: JSON.stringify(
        {   text: n_text,
            course_id: course_id
        } ),
    })
    .then((resp) => {
        display_pubblication_success(course_id);
    })
    .catch( error => console.error(error) ); // If there is any error you will catch them here
}

//User feedback to inform that the news has been successfully pubblicated
function display_pubblication_success(course_id){
    const output_html = document.getElementById("partecipants"+course_id);
    output_html.innerHTML = `
        <p class="mb-2 mt-3 text-success">The news has been successfully pubblicated!</p>
    `;
}

//...

//User: load all his courses
//@param[user_id]: user identifier
function loadCourses_user(user_id){
    const html_courses = document.getElementById('output_courses');
    var courses_text="";
    if(!user_id){
        window.location.href = "errorPage.html";
        return;
    }

    fetch('../api/v1/users/'+user_id+'/courses')
    .then((resp) => resp.json()) //trasfor data into JSON
    .then(function(data) {
        //console.log(data);
        if(data.length>0){
            courses_text = "<p>Here is the list of the courses you are registered to: </p><br>";
        } else {
            courses_text = "<p>You have no courses yet</p><br>";
        }
        courses_text += `<hr>`;
        for (var i = 0; i < data.length; i++){ //iterate overe recived data
            var course = data[i];
            //console.log(course);

            let name = course["name"];
            let description = course["description"];
            let sport = course["sport"];
            let periodic = course["periodic"];
            let self = course["self"];
            let self_id = self.substring(self.lastIndexOf('/') + 1); 

            let start_date = "";
            let end_date = "";
            
            let specific_date = "";
            let specific_start_time = "";
            let specific_end_time = "";

            courses_text += `
                <div class='card'><div class='card-text p-2'>
                <p><b>Name: </b>`+name+`</p>
                <p><b>Sport: </b>`+sport+`</p>
                <p><b>Description: </b>`+description+`</p>
            `;

            if(periodic){   //the course is offered for example every monday
                start_date = new Date(course["start_date"]);
                end_date = new Date(course["end_date"]);
                
                //Each day is an array of start-end timestamps
                monday = course["time_schedules"]["monday"]["event"];
                tuesday = course["time_schedules"]["tuesday"]["event"];
                wednesday = course["time_schedules"]["wednesday"]["event"];
                thursday = course["time_schedules"]["thursday"]["event"];
                friday = course["time_schedules"]["friday"]["event"];
                saturday = course["time_schedules"]["saturday"]["event"];
                sunday = course["time_schedules"]["sunday"]["event"];

                week = [monday, tuesday, wednesday, thursday, friday, saturday, sunday];
                week_days = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];

                courses_text += `
                    <p><b>Start date: </b>`+date_format_1(start_date)+`</p>
                    <p><b>End date: </b>`+date_format_1(end_date)+`</p>
                `;

                for(var j=0; j<7; j++){
                    if(week[j].length>0){
                        courses_text += `
                            <p><b>`+week_days[j]+`: </b></p>
                        `;
                    }
                    for(time in week[j]){
                        time_interval = week[j][time];
                        courses_text += `
                            <li class="list-group-item">from: `+time_interval["from"]+` to: `+time_interval["to"]+`</li>
                        `;
                    }
                }
                
            }else{  //the course is a only once event
                specific_date = new Date(course["specific_date"]);
                specific_start_time = course["specific_start_time"];
                specific_end_time = course["specific_end_time"];
                courses_text += `
                    <p><b>Date: </b>`+date_format_1(specific_date)+`</p>
                    <p><b>From: </b>`+specific_start_time+`<b> To: </b>`+specific_end_time+`</p>
                `;
                
            }

            //Add button to unsubscribe from the course
            courses_text += `<br>
                             <button class="btn btn-warning mx-2" onclick="check_news('`+self_id+`');">Check latest news</button>
                             <button class="btn btn-info mx-2" onclick="makeReview('`+self_id+`');">Send your review</button>
                             <button class="btn btn-danger" onclick="submit_request('`+self_id+`');">Unsubscribe</button>
                             <div id="user_message`+self_id+`"></div></div></div><br>`;

            courses_text += `<hr>`;
        }
        html_courses.innerHTML = courses_text;
    })
    .catch( error => console.error(error) ); //catch dell'errore
}
//...

//Show the user registration form
function show_user_registration_form(){
    document.getElementById("insertNewUser").hidden=false
}

//Close the user registration form
function close_user_registration_form(){
    //reset fields
    document.getElementById("insertNewUser_name").value="";
    document.getElementById("insertNewUser_surname").value="";
    document.getElementById("insertNewUser_email").value="";
    document.getElementById("insertNewUser_dob").value="";
    document.getElementById("insertNewUser_username").value="";
    document.getElementById("insertNewUser_password").value="";

    document.getElementById("insertNewUser").hidden=true;
}

function insertUser(){

    //New User data
    var u_name = document.getElementById("insertNewUser_name").value;
    var u_surname = document.getElementById("insertNewUser_surname").value;
    var u_email = document.getElementById("insertNewUser_email").value;
    var u_birth_date = document.getElementById("insertNewUser_dob").value;
    var u_username = document.getElementById("insertNewUser_username").value;
    var u_password = document.getElementById("insertNewUser_password").value;



    //Check that all required fileds are not empty
    if(!u_name || !u_surname ||!u_email ||!u_birth_date ||!u_username ||!u_password ){
        return ;
    }

    fetch('../api/v1/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json'},
        body: JSON.stringify( { name: u_name, surname: u_surname,email: u_email,birth_date: u_birth_date,username: u_username,password: u_password,} ),
    })
    .then((resp) => {
        alert("Utente creato con successo!");
        close_user_registration_form();
    })
    .catch( error => console.error(error) ); // If there is any error you will catch them here
}

//Show the admin registration form
function show_admin_registration_form(){
    document.getElementById("insertNewAdmin").hidden=false
}

//Close the admin registration form
function close_admin_registration_form(){
    //reset fields
    document.getElementById("insertNewAdmin_name").value="";
    document.getElementById("insertNewAdmin_surname").value="";
    document.getElementById("insertNewAdmin_email").value="";
    document.getElementById("insertNewAdmin_dob").value="";
    document.getElementById("insertNewAdmin_csname").value="";
    document.getElementById("insertNewAdmin_description").value="";
    document.getElementById("insertNewAdmin_city").value="";
    document.getElementById("insertNewAdmin_address").value="";
    

    document.getElementById("insertNewAdmin").hidden=true;
    window.location.href = "index.html";
}


/**==========================*/
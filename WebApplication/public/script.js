//Get sport centers
function loadSportCenters() {
    const html_sport_centers = document.getElementById('output_sportCenters');

    fetch('../api/v1/sport_centers')
    .then((resp) => resp.json()) //trasfor data into JSON
    .then(function(data) {
        //console.log(data);
        for (var i = 0; i < data.length; i++){ //iterate overe recived data
            var sport_center = data[i];

            let name = sport_center["name"];
            let address_city = sport_center["address"]["city"];
            let address_location = sport_center["address"]["location"];
            let description = sport_center["description"];

            let div = document.createElement("div")
            let html_sport_center_title = document.createElement("h2");
            let html_sport_center_name = document.createElement("p");
            let html_sport_center_description = document.createElement("p");
            let html_sport_center_address_city = document.createElement("p");
            let html_sport_center_address_location = document.createElement("p");
            let html_sport_center_moreInfo = document.createElement("a");
            
            html_sport_center_title.innerHTML = name;
            html_sport_center_name.innerHTML = "<b>Name: </b>"+name;
            html_sport_center_description.innerHTML = "<b>Description: </b>"+description;
            html_sport_center_address_city.innerHTML = "<b>City: </b>"+address_city;
            html_sport_center_address_location.innerHTML = "<b>Location: </b>"+address_location;
            html_sport_center_moreInfo.innerHTML = `<a href="`+sport_center["self"]+`">Get more information</a>`;

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

function loadFacilities() {
    const html_facilities = document.getElementById('output_facilities');

    fetch('../api/v1/sport_centers/:id/sport_facilities')
    .then((resp) => resp.json()) //trasfor data into JSON
    .then(function(data) {
        //console.log(data);
        for (var i = 0; i < data.length; i++){ //iterate overe recived data
            var sport_facility = data[i];

            let name = sport_facility["name"];
            let description = sport_facility["description"];
            let id_s_c = sport_facility["id_s_c"];

            let div = document.createElement("div")
            let html_sport_facility_title = document.createElement("h2");
            let html_sport_facility_name = document.createElement("p");
            let html_sport_facility_description = document.createElement("p");
            let html_sport_facility_id_s_c = document.createElement("p");
            let html_sport_facility_moreInfo = document.createElement("a");
            
            html_sport_facility_title.innerHTML = name;
            html_sport_facility_name.innerHTML = "<b>Name: </b>"+name;
            html_sport_facility_description.innerHTML = "<b>Description: </b>"+description;
            html_sport_facility_id_s_c.innerHTML= "<b>Centro sportivo: </b>"+id_s_c;
            html_sport_facility_moreInfo.innerHTML = `<a href="`+sport_facility["self"]+`">Get more information</a>`;

            div.appendChild(html_sport_facility_title);
            div.appendChild(html_sport_facility_name);
            div.appendChild(html_sport_facility_description);
            div.appendChild(html_sport_facility_id_s_c);
            div.appendChild(html_sport_facility_moreInfo);

            html_sport_facility.appendChild(div);
            html_sport_facility.appendChild(document.createElement("hr"))
        }
    })
    .catch( error => console.error(error) ); //catch dell'errore
}

//...

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
            html_facilities.innerHTML = "";
        }
        
        for (var i = 0; i < data.length; i++){ //iterate overe recived data
            var sport_facility = data[i];
            console.log(sport_facility);

            let name = sport_facility["name"];
            let description = sport_facility["description"];
            let self = sport_facility["self"];
            let self_id = self.substring(self.lastIndexOf('/') + 1);

            html_facilities.innerHTML += `
                <p>Here is the list of the sport facilities that has been inserted: </p><br>
                <p><b>Name:</b>`+name+`</p>
                <p><b>Description:</b>`+description+`</p>
                <button onclick="show_form('`+self_id+`')">Edit</button>
                <button onclick="deleteSportFacility('`+self_id+`', '`+sport_center_id+`');">Delete</button>
                <div hidden="true" id="editForm`+self_id+`">
                <br>
                <input type="text" id="newName`+self_id+`" name="name" value="`+name+`"><br>
                <textarea name="description" id="newDescription`+self_id+`" rows="4" cols="50">`+description+`</textarea><br>
                <input type="button" name="confirm_edit" value="Confirm" onclick="updateSportFacility('`+self_id+`', '`+sport_center_id+`')">
                <input type="button" name="close_form" value="Cancel" onclick="close_form('`+self_id+`')">
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

//Administrator: load all courses of the sport center
//Display edit and delete button
//@param[sport_center_id]: sport center identifier
function loadCourses_administrator(sport_center_id){
    const html_courses = document.getElementById('output_facilities');

    if(!sport_center_id){
        window.location.href = "errorPage.html";
        return;
    }

    fetch('../api/v1/sport_centers/'+sport_center_id+'/courses')
    .then((resp) => resp.json()) //trasfor data into JSON
    .then(function(data) {
        //console.log(data);
        if(data.length>0){
            html_courses.innerHTML = "<p>Here is the list of the courses that has been inserted: </p><br>";
        }
        
        for (var i = 0; i < data.length; i++){ //iterate overe recived data
            var course = data[i];
            console.log(course);

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

            html_courses.innerHTML += `
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

                html_courses.innerHTML += `
                    <p><b>Start date: </b>`+date_format_1(start_date)+`</p>
                    <p><b>End date: </b>`+date_format_1(end_date)+`</p>
                `;

                for(var j=0; j<7; j++){
                    if(week[j].length>0){
                        html_courses.innerHTML += `
                            <p><b>`+week_days[j]+`: </b></p>
                        `;
                    }
                    for(time in week[j]){
                        time_interval = week[j][time];
                        html_courses.innerHTML += `
                            <li>from: `+time_interval["from"]+` to: `+time_interval["to"]+`</li>
                        `;
                    }
                }
                
            }else{  //the course is a only once event
                specific_date = new Date(course["specific_date"]);
                specific_start_time = course["specific_start_time"];
                specific_end_time = course["specific_end_time"];
                html_courses.innerHTML += `
                    <p><b>Date: </b>`+date_format_1(specific_date)+`</p>
                    <p><b>From: </b>`+specific_start_time+`<b> To: </b>`+specific_end_time+`</p>
                `;
            }

            html_courses.innerHTML += `
                <p><b>Creation timestamp: </b>`+date_format(creation_date)+`</p>
                <button onclick="">Edit</button>
                <button onclick="">Delete</button>
                <hr>
            `;

        }
    })
    .catch( error => console.error(error) ); //catch dell'errore
}


//Display login form
//@param [login_type]: {A-->user admin login ; R-->course manager login ; U-->standard user login}
function display_loginForm(login_type){
    const output = document.getElementById("output_js");

    if(login_type=='A'){    //login administrator
        output.innerHTML=
    `
        <hr>
        <h2>Login administrator: </h2>
        <form>
            <label for="username">Username: </label>
            <input type="text" name="username" id="loginUsername" required> <br>
            <label for="password">Password: </label>
            <input type="password" name="password" id="loginPassword" required> <br>
            <input type="button" value="Sign in" onclick="login('`+login_type+`')">
            <span id="wrongInput" style="color: red;"></span>
        </form>
    `;
    //onsubmit="login('`+login_type+`')"
    }else if(login_type=='R'){
        output.innerHTML=
    `
        <hr>
        <h2>Login course manager: </h2>
        <form action="responsabilehome.html" method="post" >
            <label for="username">Username: </label>
            <input type="text" name="username" id="loginUsername" required> <br>
            <label for="password">Password: </label>
            <input type="password" name="password" id="loginPassword" required> <br>
            <input type="button" value="Sign in" onclick="login('`+login_type+`')">
            <span id="wrongInput" style="color: red;"></span>
        </form>
    `;

    }else if(login_type=='U'){
        output.innerHTML=
    `
        <hr>
        <h2>Login user: </h2>
        <form action="autenticateduserhome.html" method="post" >
            <label for="username">Username: </label>
            <input type="text" name="username" id="loginUsername" required> <br>
            <label for="password">Password: </label>
            <input type="password" name="password" id="loginPassword" required> <br>
            <input type="button" value="Sign in" onclick="login('`+login_type+`')">
            <span id="wrongInput" style="color: red;"></span>
        </form>
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
                
                //Add user info into browser cookie document
                setCookie("token", user_token, 1);
                setCookie("username", user_username, 1);
                setCookie("user_id", user_identifier, 1);
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
                
                //Add user info into browser cookie document
                setCookie("token", user_token, 1);
                setCookie("username", user_username, 1);
                setCookie("user_id", user_identifier, 1);
                window.location.href="autenticateduserhome.html";
            }else if(data.username==false){ //wrong username
                wrongInput.innerHTML = "Bad username )-:";
            }else if(data.password==false){ //wrong password
                wrongInput.innerHTML = "Bad password )-:";
            }            
        })
        .catch( error => console.error(error) );
    }else{
        window.location.href = "errorPage.html";
    }
}
//...

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

//DD-MM-YY
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
//...
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
        <form action="adminhome.html" method="post" >
            <label for="username">Username: </label>
            <input type="text" name="username" id="loginUsername" required> <br>
            <label for="password">Password: </label>
            <input type="password" name="password" id="loginPassword" required> <br>
            <input type="submit" value="Sign in">
        </form>
    `;

    }else if(login_type=='U'){
        output.innerHTML=
    `
        <hr>
        <h2>Login user: </h2>
        <form action="adminhome.html" method="post" >
            <label for="username">Username: </label>
            <input type="text" name="username" id="loginUsername" required> <br>
            <label for="password">Password: </label>
            <input type="password" name="password" id="loginPassword" required> <br>
            <input type="submit" value="Sign in">
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
                
                //Add user info into browser cookie document
                setCookie("token", user_token, 1);
                setCookie("username", user_username, 1);
                setCookie("user_id", user_identifier, 1);

                window.location.href="impiantiadmin.html";
            }else if(data.username==false){ //wrong username
                wrongInput.innerHTML = "Bad username )-:";
            }else if(data.password==false){ //wrong password
                wrongInput.innerHTML = "Bad password )-:";
            }            
        })
        .catch( error => console.error(error) ); // If there is any error you will catch them here
    }else if(login_type=='R'){
        console.log("login responsabile");
    }else if(login_type=='U'){
        console.log("login utente standard");
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
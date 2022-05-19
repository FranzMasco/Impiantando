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
        <form action="/api/v1/authentications/admin" method="post" >
            <label for="username">Username: </label>
            <input type="text" name="username"> <br>
            <label for="password">Password: </label>
            <input type="password" name="password"> <br>
            <input type="submit" value="Sign in">
        </form>
    `;
    }else if(login_type=='R'){
        output.innerHTML=
    `
        <hr>
        <h2>Login course manager: </h2>
        <form action="adminhome.html" method="post" >
            <label for="username">Username: </label>
            <input type="text" name="username"> <br>
            <label for="password">Password: </label>
            <input type="password" name="password"> <br>
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
            <input type="text" name="username"> <br>
            <label for="password">Password: </label>
            <input type="password" name="password"> <br>
            <input type="submit" value="Sign in">
        </form>
    `;
    }
}
//...
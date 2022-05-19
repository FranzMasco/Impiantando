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

            let div = document.createElement("div")
            let html_sport_facility_title = document.createElement("h2");
            let html_sport_facility_name = document.createElement("p");
            let html_sport_facility_description = document.createElement("p");
            let html_sport_facility_moreInfo = document.createElement("a");
            
            html_sport_facility_title.innerHTML = name;
            html_sport_facility_name.innerHTML = "<b>Name: </b>"+name;
            html_sport_facility_description.innerHTML = "<b>Description: </b>"+description;
            html_sport_facility_moreInfo.innerHTML = `<a href="`+sport_facility["self"]+`">Get more information</a>`;

            div.appendChild(html_sport_facility_title);
            div.appendChild(html_sport_facility_name);
            div.appendChild(html_sport_facility_description);
            div.appendChild(html_sport_facility_moreInfo);

            html_sport_facility.appendChild(div);
            html_sport_facility.appendChild(document.createElement("hr"))
        }
    })
    .catch( error => console.error(error) ); //catch dell'errore
}

//...
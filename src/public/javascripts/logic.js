// add inputs into register form if page is register and if user is 'admin' or 'staff'
if(window.location.pathname === "/register"){
    document.getElementById("role").addEventListener("change", () => {
        if(document.getElementById("role").value === "staff") addStaffInputs();
        else document.getElementById("role_inputs").innerHTML = "";
    });
}

// register options
function addStaffInputs(){
    let role_inputs = document.getElementById("role_inputs");
    // studies
    let div_studies = document.createElement("div");
    div_studies.className = "form-floating mb-3";

    let input_studies = document.createElement("input");
    input_studies.type = "text";
    input_studies.className = "form-control"
    input_studies.id = "position[studies]";
    input_studies.name = "position[studies]";
    input_studies.placeholder = "Estudios";
    input_studies.required = true;

    let label_studies = document.createElement("label");
    label_studies.for = "position[studies]";
    label_studies.textContent = "Estudios";

    div_studies.appendChild(input_studies);
    div_studies.appendChild(label_studies);
    role_inputs.appendChild(div_studies);

    // position (title, salary, reportsTo)
    // title
    let div_title = document.createElement("div");
    div_title.className = "form-floating mb-3";
    let input_titles = document.createElement("input");
    input_titles.type = "text";
    input_titles.className = "form-control"
    input_titles.id = "position[title]";
    input_titles.name = "position[title]";
    input_titles.placeholder = "Puesto de trabajo";
    input_titles.required = true;
    let label_titles = document.createElement("label");
    label_titles.for = "position[title]";
    label_titles.textContent = "Puesto de trabajo";
    div_title.appendChild(input_titles);
    div_title.appendChild(label_titles);
    // salary
    let div_salary = document.createElement("div");
    div_salary.className = "form-floating mb-3";
    let input_salary = document.createElement("input");
    input_salary.type = "number";
    input_salary.step = "any";
    input_salary.className = "form-control"
    input_salary.id = "position[salary]";
    input_salary.name = "position[salary]";
    input_salary.placeholder = "Salario a cobrar";
    input_salary.required = true;
    let label_salary = document.createElement("label");
    label_salary.for = "position[salary]";
    label_salary.textContent = "Salario a cobrar";
    div_salary.appendChild(input_salary);
    div_salary.appendChild(label_salary);
    // reports
    let div_reports = document.createElement("div");
    div_reports.className = "form-floating mb-3";
    let input_reports = document.createElement("input");
    input_reports.type = "text";
    input_reports.className = "form-control"
    input_reports.id = "position[reportsTo]";
    input_reports.name = "position[reportsTo]";
    input_reports.placeholder = "Puesto de trabajo";
    input_reports.required = true;
    let label_reports = document.createElement("label");
    label_reports.for = "position[reportsTo]";
    label_reports.textContent = "Encargado/a";
    div_reports.appendChild(input_reports);
    div_reports.appendChild(label_reports);
    
    role_inputs.appendChild(div_title);
    role_inputs.appendChild(div_salary);
    role_inputs.appendChild(div_reports);
}

// price
if(window.location.pathname === "/reservations/addReservation"){
    const room = document.getElementsByName("room[type]")[0];
    room.addEventListener("change", () => {
        const checkin = new Date(document.getElementsByName("checkin")[0].value);
        const checkout = new Date(document.getElementsByName("checkout")[0].value);
        // get the difference between the dates in miliseconds
        const difference = Math.abs(checkout - checkin);
        // change miliseconds into days
        const days = Math.ceil(difference / (1000 * 60 * 60 * 24));
        const price = document.getElementById("price");
        // variables for values
        const suite = 50;
        const pack_suite = 80;
        const deluxe_suite = 90;
        const deluxe_pack_suite = 150;
        let room_price;

        if(room.value === "suite"){
            room_price = suite;
        } else if(room.value === "pack suite"){
            room_price = pack_suite;
        } else if(room.value === "deluxe suite"){
            room_price = deluxe_suite;
        } else if(room.value === "deluxe pack suite"){
            room_price = deluxe_pack_suite;
        } else{
            if(room_price !== null && days > 0){
                price.getElementsByTagName("p")[0].textContent = "* "+room_price+" €/día x "+days+" días";
                price.getElementsByTagName("h3")[0].textContent = room_price*days + " € "
            } else{
                price.getElementsByTagName("p")[0].textContent = " ";
                price.getElementsByTagName("h3")[0].textContent = " ";
            }
        }
    })
    
}

// styles for menu items
window.onload = function() {
    const nav = document.getElementById("myNavbar");
    const a_elements = nav.getElementsByTagName("a");
    for (const a of a_elements) {
        if(("/"+a.href.split("/").reverse()[0]) === window.location.pathname) a.classList.add("active");
        else a.classList.remove("active");
    }
}
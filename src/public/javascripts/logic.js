/**@dandreavh */
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

// add and edit Reservation functionalities
if(window.location.pathname === "/reservations/addReservation" || window.location.pathname === "/reservations/editReservation"){
    document.addEventListener('DOMContentLoaded', function() {
        setPrice();
        setPolicies();
        setMinimumDate();
    });
}

// set price depending on the room type
function setPrice(){
    let room_type = document.getElementById("roomType");
    const price = document.getElementById("price");
    const price_info = document.getElementById("price_info");

    room_type.addEventListener('change', function() {
        const checkin = new Date(document.getElementsByName("checkin")[0].value);
        const checkout = new Date(document.getElementsByName("checkout")[0].value);
        // get the difference between the dates in miliseconds
        const difference = Math.abs(checkout - checkin);
        // change miliseconds into days
        const days = Math.ceil(difference / (1000 * 60 * 60 * 24));
        const selectedOption = room_type.value;
        // variables for values
        const suite = 50;
        const pack_suite = 80;
        const deluxe_suite = 90;
        const deluxe_pack_suite = 150;
        // set price depending on the selected option (room)
        switch (selectedOption) {
        case "suite":
            //precio.innerHTML = "100";
            price.value = suite*days;
            price_info.innerHTML = "* "+suite+" €/día x "+days+" días";
            break;
        case "pack suite":
            //precio.innerHTML = "150";
            price.value = pack_suite*days;
            price_info.innerHTML = "* "+pack_suite+" €/día x "+days+" días";
            break;
        case "deluxe suite":
            //precio.innerHTML = "200";
            price.value = deluxe_suite*days;
            price_info.innerHTML = "* "+deluxe_suite+" €/día x "+days+" días";
            break;
        case "deluxe pack suite":
            //precio.innerHTML = "200";
            price.value = deluxe_pack_suite*days;
            price_info.innerHTML = "* "+deluxe_pack_suite+" €/día x "+days+" días";
            break;
        };
    });
}

// verifies if policies are accepted
function setPolicies(){
    const policiesCheckbox = document.getElementById("policies");
    policiesCheckbox.addEventListener('change', function() {
        if (!policiesCheckbox.checked) {
            policiesCheckbox.setCustomValidity("Debe aceptar las políticas de privacidad para continuar");
        } else {
            policiesCheckbox.setCustomValidity("");
        }
    });
}

// disable possibility of choosing previous dates from current
function setMinimumDate() {
    const checkinInput = document.getElementById("checkin");
    checkinInput.addEventListener("click", () => {
        // checkin date
        checkinInput.min = new Date().toISOString().split('T')[0];

        // checkout date
        // disable possibility of choosing previous dates from checkin date
        checkinInput.addEventListener("input", () => {
            const checkoutInput = document.getElementById("checkout");
            const checkinDate = new Date(checkinInput.value);
            const checkoutDate = new Date(checkinDate);
            checkoutDate.setDate(checkinDate.getDate() + 1);
            checkoutInput.min = checkoutDate.toISOString().split("T")[0];
        });
    });
}

// validate birthday
if(window.location.pathname === "/register" || window.location.pathname === "/users/editUser"){
    document.addEventListener('DOMContentLoaded', function() {
        const birthdayInput = document.getElementById("birthday");
        birthdayInput.addEventListener("click", () => {
            const currentDate = new Date();
            birthdayInput.max = currentDate.toISOString().split("T")[0];
        })
    });
}

// set value of friendly
if(window.location.pathname === "/pets/addPet" || window.location.pathname === "/pets/editPet"){
    const friendly = document.getElementById("friendly");
    friendly.addEventListener("change", () => {
        friendly.checked ? friendly.value = true : friendly.value = false;
        console.log(friendly.value);
    })
}

// copy id
document.addEventListener('DOMContentLoaded', function() {
    const idSpans = document.getElementsByClassName("id_span");
    if (idSpans.length > 0){
        for (const span of idSpans) {
            span.addEventListener('click', () => {
                const reference = span.id.split('-')[1];
                navigator.clipboard.writeText(reference);
            });
        }
    }
});

// compare passwords
if(window.location.pathname === "/users/resetPassword"){
    const newPassword = document.getElementById("newPassword");
    const password = document.getElementById("password");
    const span = document.getElementById("error");
    password.addEventListener("input", () => {
        if(password.value !== newPassword.value){
            span.innerHTML = "Las contraseñas no coinciden";
        } else{
            span.innerHTML = "";
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
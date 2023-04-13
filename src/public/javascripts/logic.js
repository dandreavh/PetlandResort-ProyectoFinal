// role_inputs (div para añadir)
// id role
// comprobar si está en registerAdmin
if(window.location.pathname === "/register"){
    document.getElementById("role").addEventListener("change", () => {
        if(document.getElementById("role").value === "staff") addStaffInputs();
        else document.getElementById("role_inputs").innerHTML = "";
    });
}

function addStaffInputs(){
    let role_inputs = document.getElementById("role_inputs");
    // studies
    let div_studies = document.createElement("div");
    div_studies.className = "form-floating mb-3";

    let input_studies = document.createElement("input");
    input_studies.type = "text";
    input_studies.className = "form-control"
    input_studies.id = "studies";
    input_studies.name = "studies";
    input_studies.placeholder = "Estudios";
    input_studies.required = true;

    let label_studies = document.createElement("label");
    label_studies.for = "studies";
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
    input_titles.id = "title";
    input_titles.name = "title";
    input_titles.placeholder = "Puesto de trabajo";
    input_titles.required = true;
    let label_titles = document.createElement("label");
    label_titles.for = "title";
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
    input_salary.id = "salary";
    input_salary.name = "salary";
    input_salary.placeholder = "Salario a cobrar";
    input_salary.required = true;
    let label_salary = document.createElement("label");
    label_salary.for = "salary";
    label_salary.textContent = "Salario a cobrar";
    div_salary.appendChild(input_salary);
    div_salary.appendChild(label_salary);
    // reports
    let div_reports = document.createElement("div");
    div_reports.className = "form-floating mb-3";
    let input_reports = document.createElement("input");
    input_reports.type = "text";
    input_reports.className = "form-control"
    input_reports.id = "reportsTo";
    input_reports.name = "reportsTo";
    input_reports.placeholder = "Puesto de trabajo";
    input_reports.required = true;
    let label_reports = document.createElement("label");
    label_reports.for = "reportsTo";
    label_reports.textContent = "Encargado/a";
    div_reports.appendChild(input_reports);
    div_reports.appendChild(label_reports);
    
    role_inputs.appendChild(div_title);
    role_inputs.appendChild(div_salary);
    role_inputs.appendChild(div_reports);
}
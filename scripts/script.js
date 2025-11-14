const x = 5;

console.log(x)


// var i let

let y = 10;
y = "Dobar dan";
console.log(y);

console.log(z);

var z = 20;

/*
var z;
console.log(z)
z = 20;
*/

const form = document.getElementById("form-id");

console.log(form);
//kada uzimamo preko klase vraca se HTMLCollection
const table_body = document.getElementsByClassName("table-body")[0];


function load_table_data(){
    const raw = sessionStorage.getItem("table_data");

    if(!raw){
        return [];
    }

    try {
        return JSON.parse(raw);
    } catch (error) {
        console.error("Nevazeci JSON u session storageu, tacna greska je: ", error);
        return [];
    }
}

function save_table_data(data_array){
    sessionStorage.setItem("table_data", JSON.stringify(data_array));
}


//(row_object)=>{}
//==
// function ime_fje(row_object) {}

/*
{
    zelja: "zelim da se iteh zavrsi i da idem kuci milos smara",
    datum: "petak 14.11.25."

}

*/
function populate_table(table_data){
    table_body.innerHTML = "";

    table_data.forEach((row_object)=>{

        const table_row = document.createElement("tr");

        for (const key in row_object){
            const cell = document.createElement("td");

            cell.textContent = row_object[key];

            table_row.appendChild(cell);
        }
        table_body.appendChild(table_row);
    });
}

function clear_table(){
    sessionStorage.clear();
    populate_table([]);
}

form.addEventListener("submit", (e)=>{

    e.preventDefault();

    const form_data = new FormData(form);
    const new_row_object = {};

    for (const [key, value] of form_data.entries()){

        if(value.trim() === ""){
            alert("Morate popuniti sva polja forme!!!");
            return;
        }

        new_row_object[key] = value;
    }

    new_row_object["time_stamp"] = new Date().toLocaleString();

    const current_data = load_table_data();

    current_data.push(new_row_object);

    save_table_data(current_data);

    populate_table(current_data);

    form.reset();
});


document.addEventListener("DOMContentLoaded", ()=>{

    const data_from_storage = load_table_data();
    populate_table(data_from_storage);
});
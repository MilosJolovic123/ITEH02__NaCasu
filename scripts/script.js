// ————————————————————————————————————————————————————————————
// PRONALAŽENJE ELEMENATA U DOM-u
// ————————————————————————————————————————————————————————————

// Pronalazimo element forme po njenom ID-ju u DOM stablu.
// document.getElementById("form-id") vraća referencu na TAJ jedan element (ID treba da bude jedinstven).
// Savet za učenje/otklanjanje grešaka: privremeno ga odštampajte u konzolu (console.log(form))
// da biste videli koja svojstva/metode ima i da potvrdite da zaista postoji u trenutku izvršavanja.
const form = document.getElementById("form-id");

// Alternativni pristup — elementi po nazivu klase.
// getElementsByClassName("table-body") vraća „živ“ skup (HTMLCollection) potencijalno VIŠE elemenata.
// Kako ista klasa može postojati na više mesta, ovde uzimamo PRVI element iz te kolekcije (indeks 0).
// Napomena: HTMLCollection je „živa“ — ako se DOM promeni, kolekcija se automatski ažurira.
const table_body = document.getElementsByClassName("table-body")[0];


// ————————————————————————————————————————————————————————————
// UČITAVANJE PODATAKA IZ sessionStorage-A
// ————————————————————————————————————————————————————————————
function load_table_data() {
    // Web Storage API obezbeđuje dva osnovna mehanizma skladištenja:
    // 1) sessionStorage – traje dok je otvoren konkretan tab/prozor (gasi se zatvaranjem taba).
    // 2) localStorage   – podaci ostaju trajno dok ih eksplicitno ne obrišete.
    //
    // Oba skladišta čuvaju samo STRING vrednosti (par „ključ -> string“), zato kompleksne strukture (niz/objekat)
    // uvek moramo pretvarati u/iz JSON-a.
    const raw = sessionStorage.getItem("table_data");

    // Ako ključ ne postoji, getItem vraća null -> nemamo nikakve sačuvane podatke; vraćamo prazan niz.
    if (!raw) {
        return []; 
    }

    // JSON.parse može baciti izuzetak ako je string oštećen ili nije validan JSON.
    // Zbog toga parsiranje stavljamo u try/catch.
    try {
        // Očekujemo da je u skladištu niz objekata (svaki objekat = jedan red tabele).
        return JSON.parse(raw);
    } catch (err) {
        // Ako dođe do greške, zabeležimo je u konzoli radi dijagnostike i nastavimo sa praznim nizom (fail-safe).
        console.error("Nevažeći JSON u sessionStorage:", err);
        return [];
    }
}


// ————————————————————————————————————————————————————————————
// ČUVANJE PODATAKA U sessionStorage
// ————————————————————————————————————————————————————————————
function save_table_data(data_array) {
    // Pošto Web Storage prima isključivo tekst, niz/objekat serijalizujemo u string pomoću JSON.stringify.
    // Ključ "table_data" koristimo dosledno i ovde i u load_table_data (dobra praksa imenovanja).
    sessionStorage.setItem("table_data", JSON.stringify(data_array));
}


// ————————————————————————————————————————————————————————————
// ISPIS (RENDER) PODATAKA U TABELU
// ————————————————————————————————————————————————————————————
function populate_table(table_data) {
    // Pre svakog iscrtavanja brišemo sadržaj <tbody> da bismo izbegli dupliranje redova pri osvežavanju prikaza.
    // innerHTML = "" je jednostavno i dovoljno rešenje za male tabele.
    table_body.innerHTML = "";

    // Očekujemo da je table_data niz objekata; svaki objekat predstavlja jedan logički „red“ tabele.
    // forEach prolazi kroz iterabilne kolekcije poput Array, Set, NodeList i za svaki element poziva prosleđenu funkciju.
    // Napomena: forEach ne vraća vrednost (uvek je undefined).
    table_data.forEach((row_object) => {
        // Kreiramo <tr> – red u tabeli.
        const table_row = document.createElement("tr");

        // for...in prolazi kroz enumerabilne KLJUČEVE objekta (npr. "ime", "email", "telefon"...).
        // Svaki ključ tretiramo kao naziv kolone, a odgovarajuću vrednost unosimo u ćeliju.
        for (const key in row_object) {
            // Kreiramo <td> – ćeliju tabele. Koristimo const jer referencu ne re-dodeljujemo,
            // što ne sprečava modifikaciju njenih propertija (npr. textContent).
            const cell = document.createElement("td");

            // Bezbedno ubacujemo tekstualni sadržaj.
            // textContent NE interpretira HTML, zbog čega je pogodniji od innerHTML (smanjuje rizik od XSS).
            cell.textContent = row_object[key];

            // Dodajemo ćeliju u red.
            table_row.appendChild(cell);
        }

        // Kada završimo red, dodajemo ga u telo tabele (<tbody>).
        table_body.appendChild(table_row);
    });
}


// ————————————————————————————————————————————————————————————
// BRISANJE PODATAKA I PRAŽNJENJE TABELE
// ————————————————————————————————————————————————————————————
function clear_table(){
    // Brišemo SVE stavke iz sessionStorage-a za trenutni
    // Ako želite da obrišete samo podatke ove tabele, umesto clear() koristite:
    // sessionStorage.removeItem("table_data");
    sessionStorage.clear();

    // Ponovni render tabele, ovog puta sa praznim nizom:
    populate_table([]);
}


// ————————————————————————————————————————————————————————————
// [EVENT LISTENER OSNOVE — šta, kada i zašto]
// addEventListener(naziv_događaja, handler, options?)
// - "naziv_događaja": npr. "submit", "click", "input", "DOMContentLoaded"....
// - "handler": funkcija koja se poziva kada se događaj desi; prima objekat događaja (npr. "e").
// - "options" (opciono): { once: true, passive: true, capture: true } — napredna podešavanja.
//
// e.target (stvarni element gde je događaj nastao) vs e.currentTarget (element na kome je listener registrovan).
// e.preventDefault(): prekida podrazumevano ponašanje (npr. slanje forme i reload).
// e.stopPropagation(): zaustavlja dalje „penjanje” (bubbling) događaja ka roditeljima.
// { once: true } — handler se automatski uklanja posle prvog poziva. { passive: true } — obećava da nema preventDefault().
// ————————————————————————————————————————————————————————————


// ————————————————————————————————————————————————————————————
// INICIJALNO UČITAVANJE NAKON KONSTRUKCIJE DOM-A
// ————————————————————————————————————————————————————————————

// Inicijalizacija aplikacije čim je DOM konstruisan (nije potrebno čekati slike/CSS).
//
// Handler dobija objekat događaja (npr. "e"), koji ovde ne koristimo, pa ga i ne navodimo.
// Napomena: ako želite jednokratno pokretanje i automatsko uklanjanje handlera, možete dodati { once: true }.
document.addEventListener("DOMContentLoaded", () => {
    const data_from_storage = load_table_data();
    populate_table(data_from_storage);
});


// ————————————————————————————————————————————————————————————
// OBRADA SLANJA FORME (BEZ OSVEŽAVANJA STRANICE)
// ————————————————————————————————————————————————————————————

// Rukovanje slanjem forme bez osvežavanja stranice (SPA obrazac).
// Tačan tok u ovom handleru:
// 4) Kreiramo objekat reda, dodajemo "time_stamp" (korisnički čitljiv datum/vreme).
// 5) Pročitamo postojeći niz iz storage-a, dodamo novi red, snimimo nazad i odmah osvežimo tabelu.
// 6) form.reset() — vraća polja forme u početno stanje.
form.addEventListener("submit", (e) => {
//  e.preventDefault() — prekidamo podrazumevano ponašanje i "page reload".
    e.preventDefault();

// FormData(form) — uzimamo parove [name, value] iz polja sa atributom "name" (<input>, <select>, <textarea>).
    const form_data = new FormData(form);
    const new_row_obj = {};

    for (const [key, value] of form_data.entries()) {
        // Jednostavna validacija: svako polje mora imati neki sadržaj (nakon trim-a).
        // Ako ijedno polje ostane prazno, prekidamo unos i obaveštavamo korisnika.
        if (value.trim() === "") {
            alert("Morate popuniti sva polja");
            return; 
        }

        // Upisujemo vrednost pod odgovarajućim ključem u objekat koji predstavlja red tabele.
        new_row_obj[key] = value;
    }

    // Dodajemo vremensku oznaku radi konteksta kada je unos nastao.
    // toLocaleString() je čitljiv za korisnike (lokalizovan), dok je za dalju obradu dobar i ISO format (new Date().toISOString()).
    new_row_obj["time_stamp"] = new Date().toLocaleString();

    // Učitamo postojeći niz redova iz skladišta,
    const current_data = load_table_data();
    // dodamo novi red na kraj niza,
    current_data.push(new_row_obj);
    // snimimo ažurirani niz nazad u sessionStorage.
    save_table_data(current_data);

    // Osvežavamo prikaz tabele da bi se novi red odmah video.
    populate_table(current_data);

    // Resetujemo formu u početno stanje (prazna polja) — spremno za sledeći unos.
    form.reset();
});


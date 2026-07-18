let editIndex = -1;
let editId = null;



async function addNote() {

    let title = document.getElementById("titleInput").value;
    let content = document.getElementById("noteInput").value;


    if(title === "" || content === ""){
        alert("Please enter title and note");
        return;
    }


    if(editId){

        await fetch(
            `http://localhost:5000/api/notes/${editId}`,
            {
                method:"PUT",
                headers:{
                    "Content-Type":"application/json"
                },
                body:JSON.stringify({
                    title,
                    content
                })
            }
        );


        editId = null;

        document.getElementById("addBtn").innerText = "➕ Add Note";


    }else{


        const response = await fetch(
            "http://localhost:5000/api/notes/add",
            {
                method:"POST",
                headers:{
                    "Content-Type":"application/json"
                },
                body:JSON.stringify({
                    title,
                    content
                })
            }
        );


        const data = await response.json();

        console.log(data);

    }


    document.getElementById("titleInput").value = "";
    document.getElementById("noteInput").value = "";


    displayNotes();

}

async function displayNotes() {

    let notesContainer =
        document.getElementById("notesContainer");

    const response =
        await fetch("http://localhost:5000/api/notes");

    const notes = await response.json();

    notesContainer.innerHTML = "";

    notes.forEach((note) => {

        notesContainer.innerHTML += `
        <div class="note">

            <h3>${note.title}</h3>

            <p>${note.content}</p>

            <button onclick="editNote('${note._id}')">
                ✏ Edit
            </button>

            <button onclick="deleteNote('${note._id}')">
                🗑 Delete
            </button>

        </div>
        `;
    });
}
    

async function editNote(id) {

    const response =
        await fetch("http://localhost:5000/api/notes");

    const notes = await response.json();

    const note =
        notes.find(n => n._id === id);

    document.getElementById("titleInput").value =
        note.title;

    document.getElementById("noteInput").value =
        note.content;

    editId = id;

    document.getElementById("addBtn")
        .innerText = "Update Note";
}

async function deleteNote(id) {

    const response = await fetch(
        `http://localhost:5000/api/notes/${id}`,
        {
            method: "DELETE"
        }
    );

    const data = await response.json();

    console.log(data);

    displayNotes();
}

function searchNotes() {

    let search = document.getElementById("searchInput").value.toLowerCase();

    let notes = document.querySelectorAll(".note");

    notes.forEach(note => {

        let text = note.innerText.toLowerCase();

        if (text.includes(search)) {
            note.style.display = "block";
        } else {
            note.style.display = "none";
        }

    });
}
function toggleTheme() {

    document.body.classList.toggle("dark");

    let btn = document.getElementById("themeBtn");

    if(document.body.classList.contains("dark")){

        btn.innerHTML = "☀️ Light Mode";
        localStorage.setItem("theme","dark");

    }else{

        btn.innerHTML = "🌙 Dark Mode";
        localStorage.setItem("theme","light");
    }
}

window.onload = function(){

    displayNotes();

    if(localStorage.getItem("theme")=="dark"){

        document.body.classList.add("dark");

        document.getElementById("themeBtn").innerHTML="☀️ Light Mode";
    }
}
async function exportPDF() {

    const { jsPDF } = window.jspdf;

    const doc = new jsPDF();

    let notes = JSON.parse(localStorage.getItem("notes")) || [];

    doc.setFontSize(18);
    doc.text("My Digital Journal", 20, 20);

    let y = 35;

    notes.forEach((note, index) => {

        doc.setFontSize(12);

        doc.text((index + 1) + ". " + note.text, 20, y);

        y += 8;

        doc.text(note.date, 20, y);

        y += 12;

        if (y > 270) {
            doc.addPage();
            y = 20;
        }

    });

    doc.save("Digital_Journal_Notes.pdf");
}


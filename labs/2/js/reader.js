import { MESSAGES } from "../lang/messages/en/user.js";

const notesContainer = document.getElementById("notes-container");
const lastRetrieved = document.getElementById("last-retrieved");


function loadNotes() {
    notesContainer.innerHTML = "";  // 기존 화면 삭제

    const savedNotes = localStorage.getItem("notes");   // localStorage의 최신 데이터 가져오기

    if (savedNotes === null) {  
        return;     // 함수 실행 여기서 끝
                    // 처음 사용하는 사람이라 저장된게 없으면 그냥 아무 note도 만들지 않는것
    }

    const noteData = JSON.parse(savedNotes);

    noteData.forEach((data) => {
        const noteElement = document.createElement("p");    // reader는 수정할 필요가 없으니까 textarea를 만들 필요가 없어서 <p>로 만드는거임
        noteElement.textContent = data.text;

        notesContainer.appendChild(noteElement);
    });

    const now = new Date();
    lastRetrieved.textContent = `${MESSAGES.LAST_RETRIEVED} ${now.toLocaleTimeString()}`;
}

loadNotes();    // reader를 처음 열 때 한번만 실행됌

setInterval(loadNotes, 2000);   // 2초마다 실행됨
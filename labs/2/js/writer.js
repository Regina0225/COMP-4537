// Note들을 전체적으로 관리
// Add button 관리
// notes array 관리
// 전체 note 목록 담당


import { Note } from "./note.js";       // note.js에서 export한 Note class를 가져옴
                                        // new Note(); 를 사용할 수 있음
import { MESSAGES } from "../lang/messages/en/user.js";

const notesContainer = document.getElementById("notes-container");
const addButton = document.getElementById("add-button");
const lastSaved = document.getElementById("last-saved");

const notes = [];       // notes array 만들기

let hasChanged = false;     // const 가 아니라 let인 이유 : 값이 false(저장이후 안바뀜),true(저장해야할 변경사항 있음) 계속 바뀌어서


function saveNotes() {
    const noteData = notes.map((note) => {
        return { text: note.text };
    });

    const jsonData = JSON.stringify(noteData); // JSON으로 바꾸기

    localStorage.setItem("notes", jsonData);    // localStorage에 넣기

    const now = new Date(); // new Date() : 현재 날짜와 시간을 가져올수있음
    lastSaved.textContent = `${MESSAGES.LAST_SAVED} ${now.toLocaleTimeString()}`;
        // now.toLocaleTimeString() : 시간만 가져올수있음
        // ${ } : template literal , '을 사용하면 string 안에 jvanscript 값을 넣을 수 있음
}
    /*
    map(): array의 각 항목을 다른 형태로 바꿔서 새 array를 만들어주는것
            즉 복잡한 Note object에서 저장에 필요한 text만 뽑은 것
    예를들어
    notes
    [
        Note Object → text = "Apple",
        Note Object → text = "Milk"
    ] 에서
    noteData
    [
        { text: "Apple" },
        { text: "Milk" }
    ] 이 됌

    JSON 바꾸기
    현재 noteData는 Javascript Array/Object 임
    그런데 localStorage에는 string 형태로 저장해야함
    
    그래서 JSON.stringify(noteData);을 함
    stringify : string으로 만들어라
    결과적으로

    noteData (= JavaScript Array/Object)
    [
        { text: "Apple" },
        { text: "Milk" }
    ]

    을 JSON.stringify()한다면
    '[{"text":"Apple"},{"text":"Milk"}]'


    setItem() : 넣기, localStorage.setItem(key, value) 형태임
    근데 우리는
    localStorage.setItem("notes", jsonData) 형태니까
    key = notes     value = '[{"text":"Apple"},{"text":"Milk"}]'

     */


function loadNotes() {
    const savedNotes = localStorage.getItem("notes");

    if (savedNotes === null) {
        return;     // 함수 실행 여기서 끝
    }               // 처음 사용하는 사람이라 저장된게 없으면 그냥 아무 note도 만들지 않는것

    const noteData = JSON.parse(savedNotes);

    noteData.forEach((data) => {        // forEach(): array 안에 있는 것들을 하나씩 꺼내서 실행
        const note = new Note(data.text, removeNote, markAsChanged);    // 각각 new Note()하기

        notes.push(note);   // notes array에 넣어야함 , object만 만들면 안됌

        note.render(notesContainer);    // 화면에도 보여줘야함
    });
}
/*
getItem() : 꺼내기, 받는건 string
'[{"text":"Apple"},{"text":"Milk"}]'는 아직 array가 아님

우리가 원하는건
[
    { text: "Apple" },
    { text: "Milk" }
]

그래서 JSON.parse()가 필요함
JSON.parse() : JSON.stringify()의 반대
저장할 때: Array/Object -> JSON.stringify() -> JSON String
불러올 때: JSON String -> JSON.parse() -> Array/Object

그래서 JSON.parse(savedNotes);을 하면
    { text: "Apple" },
    { text: "Milk" }
 */



function markAsChanged() {
    hasChanged = true;
}



function removeNote(note) {
    const index = notes.indexOf(note);  // 이 note가 array 몇 번째 위치에 있는지
                                        // index = 1 이 됌
    if (index !== -1) {     // indexOf()는 못찾으면 -1을 되돌려줌. 그래서 note를 실제로 찾았다면 라는 의미
        notes.splice(index, 1); // index 위치부터 1개 삭제
        saveNotes();    // textarea와 localStorage내용도 즉시 제거됌 (2초 기다리지않음)
    }
}


addButton.addEventListener("click", () => {

    const note = new Note("", removeNote, markAsChanged);      // new Note() object가 처음 생길때 기본 text는 "" 임
                                                // removeNote는 삭제됐을때 실행할 함수
    notes.push(note);   // user가 새로운 note를 생성할 때마다 자동으로 object로 만들어짐
    /*
    push()는 array 끝에 값ㅇ르 추가함

    처음에는
    notes = []
    그 다음 add button을 눌렀을때
        notes = [
            Note Object
        ]

    또 add button을 눌렀을 때
        notes = [
            Note Object
            Note Object
        ]
    */

    note.render(notesContainer);

    hasChanged = true;

});

setInterval(() => {
    if (hasChanged) {
        saveNotes();
        hasChanged = false;
    }
}, 2000);

loadNotes();
    
// Note class 정의
// new Note()를 실행하면 메모 하나를 담당하는 Object가 생성됨
// note 하나마다 remove 버튼도 필요함
// note 자기 자신 담당
import { MESSAGES } from "../lang/messages/en/user.js";

export class Note {             // export : 다른 파일에서 가져다 쓸 수 있게
    constructor(text = "", onRemove, onChange) {
        this.text = text;
        this.onRemove = onRemove;   // onRemove는 내가 삭제됐을 때 실행할 함수
        this.onChange = onChange;

        this.textarea = document.createElement("textarea");
        /*
        const textarea = document.createElement("textarea");
        라고 만들면 constructor 안에서 사용하는 지역 변수
        우리는 textarea를 이 Note object의 property로 만들고 싶음
        그래서 this.textarea 라고 함
        예를들어
       
            const note1 = new Note();
            const note2 = new Note();
            라고 하면 각각
            
            note1 에 text, textarea
            note2 에 text, textarea
            라서 각각 서로 각자의 것을 가질수있음

        아직 element만 생성한거고 아직 DOM에 추가하지 않아서 textarea가 화면에 안보임
        */

        this.textarea.value = this.text;
        /* 
        지금 textarea가 만들어졌지만 비어있으니까 constructor에서 받은 text을 넣어줘야함
        예를 들어
        new Note("Buy milk");
        라고 하면
            Note Object
            │
            ├── text = "Buy milk"
            │
            └── textarea
                    │
                    └── value = "Buy milk"
        */

        this.textarea.addEventListener("input", () => {
            this.text = this.textarea.value;
            this.onChange();
        });
        /*
        textarea가 변경되면 this.text도 변경하기
        
        input event : uesr가 textarea 내용을 변경할때 발생하는 event
        필요한 이유: localStorage에 저장하 때 각 Note의 내용이 필요함
                    화면에서 user가 입력한 값을 object의 데이터오 옮겨주는 과정

         */


        // note 하나하나마다 remove button이 필요함
        this.removeButton = document.createElement("button");
        this.removeButton.textContent = MESSAGES.REMOVE;

        this.removeButton.addEventListener("click", () => {
            this.remove();
        });

        
    }

    // render(container) {     // render는 화면에 표시
    //     container.appendChild(this.textarea);   // container을 받아서 Note의 textarea를 container안에 넣음
    //     container.appendChild(this.removeButton);
    // }

    render(container) {
    this.noteElement = document.createElement("div");
    this.noteElement.className = "note";

    this.noteElement.appendChild(this.textarea);
    this.noteElement.appendChild(this.removeButton);

    container.appendChild(this.noteElement);
    }

    // remove(){
    //     this.textarea.remove();
    //     this.removeButton.remove();

    //     this.onRemove(this);    // this는 삭제되는 그 Note object 자신, remove될 때 callback 실행
    // }

    remove() {
    this.noteElement.remove();

    this.onRemove(this);
}
}
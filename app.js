const API_URL = "http://127.0.0.1:8000";


// ==========================================================
// USER ID
// ==========================================================

let userId = localStorage.getItem("axon_user_id");

if (!userId) {

    userId =
        "user_" +
        crypto.randomUUID();

    localStorage.setItem(
        "axon_user_id",
        userId
    );
}


// ==========================================================
// CONVERSATION
// ==========================================================

let conversationId =
    localStorage.getItem(
        "axon_conversation_id"
    );

if (!conversationId) {

    conversationId =
        crypto.randomUUID();

    localStorage.setItem(
        "axon_conversation_id",
        conversationId
    );
}


// ==========================================================
// ELEMENTS
// ==========================================================

const chat =
    document.getElementById("chat");

const welcome =
    document.getElementById("welcome");

const input =
    document.getElementById("messageInput");

const sendButton =
    document.getElementById("sendButton");

const newChatButton =
    document.getElementById("newChatButton");

const newChatTop =
    document.getElementById("newChatTop");

const memoryButton =
    document.getElementById("memoryButton");

const knowledgeButton =
    document.getElementById("knowledgeButton");

const clearMemoryButton =
    document.getElementById(
        "clearMemoryButton"
    );

const memoryModal =
    document.getElementById(
        "memoryModal"
    );

const knowledgeModal =
    document.getElementById(
        "knowledgeModal"
    );

const closeMemory =
    document.getElementById(
        "closeMemory"
    );

const closeKnowledge =
    document.getElementById(
        "closeKnowledge"
    );

const memoryList =
    document.getElementById(
        "memoryList"
    );

const deleteMemory =
    document.getElementById(
        "deleteMemory"
    );


// ==========================================================
// NEW CHAT
// ==========================================================

function newChat() {

    conversationId =
        crypto.randomUUID();

    localStorage.setItem(
        "axon_conversation_id",
        conversationId
    );

    chat.innerHTML = "";

    chat.appendChild(
        createWelcome()
    );

    input.focus();
}


function createWelcome() {

    const div =
        document.createElement("div");

    div.className = "welcome";

    div.innerHTML = `

        <div class="welcome-logo">
            A
        </div>

        <h1>
            Wie kann ich dir helfen?
        </h1>

        <p>
            Ich bin <strong>Axon</strong>,
            die KI von Axon AI Support.
        </p>

        <div class="suggestions">

            <button class="suggestion">
                Erklär mir, was du kannst
            </button>

            <button class="suggestion">
                Wie funktioniert dein Memory?
            </button>

            <button class="suggestion">
                Was weißt du über Axon?
            </button>

        </div>
    `;

    return div;
}


// ==========================================================
// MESSAGE
// ==========================================================

function addMessage(
    role,
    text
) {

    if (welcome) {
        welcome.remove();
    }


    const wrapper =
        document.createElement("div");

    wrapper.className =
        `message ${role}`;


    const avatar =
        document.createElement("div");

    avatar.className =
        "message-avatar";

    avatar.textContent =
        role === "user"
            ? "DU"
            : "A";


    const content =
        document.createElement("div");

    content.className =
        "message-content";

    content.textContent =
        text;


    wrapper.appendChild(
        avatar
    );

    wrapper.appendChild(
        content
    );


    chat.appendChild(
        wrapper
    );


    scrollToBottom();
}


// ==========================================================
// TYPING
// ==========================================================

function showTyping() {

    const wrapper =
        document.createElement("div");

    wrapper.id =
        "typingMessage";

    wrapper.className =
        "message assistant";


    const avatar =
        document.createElement("div");

    avatar.className =
        "message-avatar";

    avatar.textContent =
        "A";


    const content =
        document.createElement("div");

    content.className =
        "message-content";


    content.innerHTML = `

        <div class="typing">

            <span></span>
            <span></span>
            <span></span>

        </div>

    `;


    wrapper.appendChild(
        avatar
    );

    wrapper.appendChild(
        content
    );


    chat.appendChild(
        wrapper
    );


    scrollToBottom();
}


function removeTyping() {

    const typing =
        document.getElementById(
            "typingMessage"
        );

    if (typing) {
        typing.remove();
    }
}


// ==========================================================
// SEND MESSAGE
// ==========================================================

async function sendMessage() {

    const message =
        input.value.trim();


    if (!message) {
        return;
    }


    input.value = "";

    input.style.height =
        "auto";


    sendButton.disabled =
        true;


    addMessage(
        "user",
        message
    );


    showTyping();


    try {

        const response =
            await fetch(
                `${API_URL}/api/chat`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({

                        user_id:
                            userId,

                        conversation_id:
                            conversationId,

                        message:
                            message

                    })
                }
            );


        const data =
            await response.json();


        removeTyping();


        if (!response.ok) {

            throw new Error(
                data.detail ||
                "Axon konnte nicht antworten."
            );

        }


        addMessage(
            "assistant",
            data.answer
        );


    } catch (error) {

        removeTyping();


        addMessage(
            "assistant",
            "⚠️ Fehler: " +
            error.message
        );

        console.error(
            error
        );

    } finally {

        sendButton.disabled =
            false;

        input.focus();
    }
}


// ==========================================================
// SCROLL
// ==========================================================

function scrollToBottom() {

    chat.scrollTo({

        top:
            chat.scrollHeight,

        behavior:
            "smooth"

    });
}


// ==========================================================
// ENTER
// ==========================================================

input.addEventListener(
    "keydown",
    function(event) {

        if (
            event.key === "Enter" &&
            !event.shiftKey
        ) {

            event.preventDefault();

            sendMessage();

        }

    }
);


// ==========================================================
// AUTO RESIZE
// ==========================================================

input.addEventListener(
    "input",
    function() {

        this.style.height =
            "auto";

        this.style.height =
            Math.min(
                this.scrollHeight,
                160
            ) + "px";

    }
);


// ==========================================================
// BUTTONS
// ==========================================================

sendButton.addEventListener(
    "click",
    sendMessage
);


newChatButton.addEventListener(
    "click",
    newChat
);


newChatTop.addEventListener(
    "click",
    newChat
);


// ==========================================================
// SUGGESTIONS
// ==========================================================

document.addEventListener(
    "click",
    function(event) {

        if (
            event.target.classList.contains(
                "suggestion"
            )
        ) {

            input.value =
                event.target.textContent.trim();

            sendMessage();

        }

    }
);


// ==========================================================
// MEMORY MODAL
// ==========================================================

async function openMemory() {

    memoryModal.classList.remove(
        "hidden"
    );

    memoryList.innerHTML =
        `<div class="loading">
            Memory wird geladen...
        </div>`;


    try {

        const response =
            await fetch(
                `${API_URL}/api/memory/${userId}`
            );


        const data =
            await response.json();


        memoryList.innerHTML = "";


        if (
            !data.memories ||
            data.memories.length === 0
        ) {

            memoryList.innerHTML =
                `<div class="loading">
                    Axon hat noch keine Erinnerungen gespeichert.
                </div>`;

            return;
        }


        data.memories.forEach(
            memory => {

                const item =
                    document.createElement(
                        "div"
                    );

                item.className =
                    "memory-item";

                item.textContent =
                    memory;

                memoryList.appendChild(
                    item
                );

            }
        );


    } catch (error) {

        memoryList.innerHTML =
            `<div class="loading">
                Memory konnte nicht geladen werden.
            </div>`;

    }

}


memoryButton.addEventListener(
    "click",
    openMemory
);


closeMemory.addEventListener(
    "click",
    function() {

        memoryModal.classList.add(
            "hidden"
        );

    }
);


// ==========================================================
// DELETE MEMORY
// ==========================================================

async function deleteAllMemory() {

    const confirmed =
        confirm(
            "Möchtest du wirklich alle Axon-Memories löschen?"
        );


    if (!confirmed) {
        return;
    }


    try {

        await fetch(
            `${API_URL}/api/memory/${userId}`,
            {
                method: "DELETE"
            }
        );


        await openMemory();


    } catch (error) {

        alert(
            "Memory konnte nicht gelöscht werden."
        );

    }

}


deleteMemory.addEventListener(
    "click",
    deleteAllMemory
);


clearMemoryButton.addEventListener(
    "click",
    openMemory
);


// ==========================================================
// KNOWLEDGE
// ==========================================================

knowledgeButton.addEventListener(
    "click",
    function() {

        knowledgeModal.classList.remove(
            "hidden"
        );

    }
);


closeKnowledge.addEventListener(
    "click",
    function() {

        knowledgeModal.classList.add(
            "hidden"
        );

    }
);


// ==========================================================
// MODAL BACKGROUND
// ==========================================================

document.addEventListener(
    "click",
    function(event) {

        if (
            event.target.classList.contains(
                "modal-background"
            )
        ) {

            event.target
                .parentElement
                .classList
                .add("hidden");

        }

    }
);


// ==========================================================
// START
// ==========================================================

input.focus();

console.log(
    "Axon AI Frontend gestartet."
);

console.log(
    "User ID:",
    userId
);

console.log(
    "Conversation ID:",
    conversationId
);
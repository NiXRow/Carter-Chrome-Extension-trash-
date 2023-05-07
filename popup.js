const toggleApiBtn = document.getElementById("toggle-api-btn");
const chatContainer = document.getElementById("chat-container");
const apiContainer = document.getElementById("api-container");
const apiForm = document.getElementById("api-form");
const apiErrorMsg = document.getElementById("wrapper-main");
const apiErrorMsgClose = document.getElementById("btn-close-main");
const typingDynamic = document.getElementById("type-indicator");
const overlay = document.createElement('div');
overlay.classList.add('overlay');

let apiUrl = localStorage.getItem("apiUrl");
let agentUrl = localStorage.getItem("agentUrl");
let playerId = localStorage.getItem("playerId");

if (!apiUrl) {
  console.log("FIX API");
  apiErrorMsg.style.display = "block";
  overlay.style.pointerEvents = "auto";
  document.body.appendChild(overlay);
}

apiErrorMsgClose.addEventListener("click", function () {
  if (apiErrorMsg.style.display === "block") {
    apiErrorMsg.style.display = "none";
    overlay.style.pointerEvents = "none";
  } else {
    apiErrorMsg.style.display = "block";
    overlay.style.pointerEvents = "auto";
  }
});



toggleApiBtn.addEventListener("click", () => {
  if (chatContainer.style.display === "none") {
    chatContainer.style.display = "block";
    apiContainer.style.display = "none";
    toggleApiBtn.classList.add("btn-rotate");
  } else {
    chatContainer.style.display = "none";
    apiContainer.style.display = "block";
    toggleApiBtn.classList.remove("btn-rotate");
  }
});



apiForm.addEventListener("submit", (event) => {
  event.preventDefault();
  apiUrl = document.getElementById("api-input").value;
  localStorage.setItem("apiUrl", apiUrl);
  console.log(apiUrl);
  document.getElementById("api-input").value = apiUrl;

  agentUrl = document.getElementById("agent-input").value;
  localStorage.setItem("agentUrl", agentUrl);
  console.log(localStorage.getItem("agentUrl"));
  document.getElementById("agent-input").value = agentUrl;

  playerId = document.getElementById("playerId-input").value;
  localStorage.setItem("playerId", playerId);
  console.log(localStorage.getItem("playerId"));
  document.getElementById("playerId-input").value = playerId;
});


document.getElementById("api-input").value = apiUrl;
document.getElementById("agent-input").value = agentUrl;
document.getElementById("playerId-input").value = playerId;



const form = document.querySelector("form");
form.addEventListener("submit", (e) => {
  e.preventDefault();

  const message = document.getElementById("message-input").value;

  fetch("https://api.ipify.org/?format=json")
    .then((response) => response.json())
    .then((data) => {
      const typingIndicator = document.getElementById("typing");
      typingIndicator.style.display = "block";

      const dataToSend = {
        text: message,
        key: apiUrl,
        playerId: playerId,
        speak:  false,
      };

      fetch("https://api.carterlabs.ai/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSend),
      })
        .then((response) => response.json())
        .then((data) => {
          const outputDiv = document.getElementById("output");
          const responseDiv = document.createElement("div");
          responseDiv.classList.add("response");
          responseDiv.innerHTML = `<p>You: ${data.input}</p><p>${agentUrl}: ${data.output.text}</p>`;

          if (outputDiv.children.length >= 10) {
            outputDiv.removeChild(outputDiv.firstChild);
          }

          outputDiv.appendChild(responseDiv);

          data.forced_behaviours.forEach((fb) => {
            console.log("Forced Behaviour:", fb.name);
          });

          document.getElementById("message-input").value = "";

          typingIndicator.style.display = "none";
        })
        .catch((error) => {
          console.error(error);
        });
    })
    .catch((error) => console.error(error));
});




javascript
function showFeatures() {
    document.getElementById("startScreen").style.display = "none";
    document.getElementById("featureScreen").style.display = "flex";
}

function openTranslator() {
    document.getElementById("featureScreen").style.display = "none";
    document.getElementById("mainApp").style.display = "block";
}
function goBack() {
    document.getElementById("mainApp").style.display = "none";
    document.getElementById("featureScreen").style.display = "flex";
}

// ================= TRANSLATION =================

async function translateText() {

    let text = document.getElementById("inputText").value.trim();

    if (!text) {
        alert("Please enter text");
        return;
    }

    let from = document.getElementById("fromLang").value;
    let to = document.getElementById("toLang").value;

    document.getElementById("outputText").value =
        "Translating...";

    try {

        let url =
            `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${from}|${to}`;

        let res = await fetch(url);
        let data = await res.json();

        document.getElementById("outputText").value =
            data.responseData.translatedText;

    } catch (error) {

        document.getElementById("outputText").value =
            "Translation Failed";

    }
}

// ================= SWAP =================

function swapLanguages() {

    let from =
        document.getElementById("fromLang");

    let to =
        document.getElementById("toLang");

    let temp = from.value;

    from.value = to.value;
    to.value = temp;
}

// ================= EMOJI =================

function emojiToText() {

    let text =
        document.getElementById("inputText").value;

    if (!text) {
        alert("Enter emoji in text box first");
        openTranslator();
        return;
    }

    let result =
        text
        .replace(/😀/g, "happy")
        .replace(/😁/g, "smile")
        .replace(/😂/g, "laugh")
        .replace(/🤣/g, "very funny")
        .replace(/😍/g, "love")
        .replace(/❤️/g, "heart")
        .replace(/👍/g, "good")
        .replace(/🙏/g, "thanks")
        .replace(/😭/g, "crying")
        .replace(/🔥/g, "fire");

    openTranslator();

    document.getElementById("outputText").value =
        result;
}

// ================= OCR =================

function openOCR() {

    let input =
        document.createElement("input");

    input.type = "file";
    input.accept = "image/*";

    input.onchange = async function (e) {

        let file = e.target.files[0];

        if (!file) return;

        let reader = new FileReader();

        reader.onload = async function () {

            openTranslator();

            document.getElementById("outputText").value =
                "Scanning Image...";

            try {

                const {
                    data: {
                        text
                    }
                } =
                await Tesseract.recognize(
                    reader.result,
                    "eng"
                );

                document.getElementById("outputText").value =
                    text;

            } catch {

                document.getElementById("outputText").value =
                    "OCR Failed";

            }

        };

        reader.readAsDataURL(file);
    };

    input.click();
}

// ================= VOICE =================

function startVoice() {

    const SpeechRecognition =
        window.SpeechRecognition ||
        window.webkitSpeechRecognition;

    if (!SpeechRecognition) {

        alert(
            "Voice recognition not supported in this browser"
        );

        return;
    }

    const recognition =
        new SpeechRecognition();

    recognition.lang = "en-US";

    recognition.start();

    recognition.onresult =
        function (event) {

            document.getElementById(
                "inputText"
            ).value =
            event.results[0][0].transcript;
        };
}

// ================= SPEAK =================

function speakText() {

    let text =
        document.getElementById(
            "outputText"
        ).value;

    if (!text) return;

    let speech =
        new SpeechSynthesisUtterance(text);

    speechSynthesis.speak(speech);
}

// ================= COPY =================

async function copyText() {

    let text =
        document.getElementById(
            "outputText"
        ).value;

    if (!text) return;

    await navigator.clipboard.writeText(text);

    alert("Copied Successfully");
}

// ================= CLEAR =================

function clearAll() {

    document.getElementById(
        "inputText"
    ).value = "";

    document.getElementById(
        "outputText"
    ).value = "";
}

// ================= DOWNLOAD =================

function downloadText() {

    let text =
        document.getElementById(
            "outputText"
        ).value;

    if (!text) return;

    let blob =
        new Blob([text], {
            type: "text/plain"
        });

    let a =
        document.createElement("a");

    a.href =
        URL.createObjectURL(blob);

    a.download =
        "translation.txt";

    a.click();
    chatbox.innerHTML +=
        `<div><b>You:</b> ${input}</div>`;

    chatbox.innerHTML +=
        `<div><b>Bot:</b> ${getBestMatch(input)}</div><hr>`;

    document.getElementById(
        "userInput"
    ).value = "";

    chatbox.scrollTop =
        chatbox.scrollHeight;
}

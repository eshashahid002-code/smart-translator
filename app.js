// ========================
// HISTORY (LOCAL STORAGE)
// ========================
let historyList = JSON.parse(localStorage.getItem("history")) || [];

renderHistory();


// ========================
// TRANSLATION
// ========================
async function translateText(){

    let text = document.getElementById("inputText").value;
    let from = document.getElementById("fromLang").value;
    let to = document.getElementById("toLang").value;

    if(text.trim()===""){
        alert("Enter some text");
        return;
    }

    let url =
    `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${from}|${to}`;

    try{

        let response = await fetch(url);
        let data = await response.json();

        let result = data.responseData.translatedText;

        document.getElementById("outputText").value = result;

        // SAVE HISTORY
        historyList.push(text + " → " + result);
        localStorage.setItem("history", JSON.stringify(historyList));

        renderHistory();

    } catch(error){
        alert("Translation Error");
    }
}


// ========================
// RENDER HISTORY
// ========================
function renderHistory(){

    document.getElementById("history").innerHTML =
    historyList.map(item => `<li>${item}</li>`).join("");
}


// ========================
// SWAP
// ========================
function swapLanguages(){

    let from = document.getElementById("fromLang");
    let to = document.getElementById("toLang");

    let temp = from.value;
    from.value = to.value;
    to.value = temp;
}


// ========================
// EMOJI TO TEXT
// ========================
function emojiToText(){

    let text = document.getElementById("inputText").value;

    let result = text
        .replace(/😀/g,"grinning face")
        .replace(/😂/g,"laughing face")
        .replace(/❤️/g,"heart")
        .replace(/👍/g,"thumbs up");

    document.getElementById("outputText").value = result;
}


// ========================
// OCR
// ========================
function openOCR(){

    let input = document.createElement("input");
    input.type="file";
    input.accept="image/*";

    input.onchange = async function(e){

        let file = e.target.files[0];
        let reader = new FileReader();

        reader.onload = async function(){

            document.getElementById("outputText").value = "Processing...";

            const { data:{text} } =
            await Tesseract.recognize(reader.result,"eng");

            document.getElementById("inputText").value = text;
            document.getElementById("outputText").value = text;
        };

        reader.readAsDataURL(file);
    };

    input.click();
}


// ========================
// SPEAK
// ========================
function speakText(){

    let text = document.getElementById("outputText").value;

    let speech = new SpeechSynthesisUtterance(text);
    speech.lang="en-US";

    speechSynthesis.speak(speech);
}


// ========================
// COPY
// ========================
function copyText(){

    let text = document.getElementById("outputText").value;
    navigator.clipboard.writeText(text);

    alert("Copied!");
}


// ========================
// CLEAR
// ========================
function clearAll(){

    document.getElementById("inputText").value="";
    document.getElementById("outputText").value="";
}


// ========================
// VOICE INPUT
// ========================
function startVoice(){

    const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;

    if(!SpeechRecognition){
        alert("Not supported");
        return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.start();

    recognition.onresult = function(event){

        document.getElementById("inputText").value =
        event.results[0][0].transcript;
    };
}


// ========================
// DARK MODE
// ========================
function toggleDarkMode(){

    document.body.classList.toggle("dark-mode");
}


// ========================
// DOWNLOAD TRANSLATION
// ========================
function downloadText(){

    let text = document.getElementById("outputText").value;

    let blob = new Blob([text], {type:"text/plain"});
    let link = document.createElement("a");

    link.href = URL.createObjectURL(blob);
    link.download = "translation.txt";

    link.click();
}
// ========================
// FAQ DATASET (COLLECT FAQs)
// ========================
const faqs = [
    {
        question: "What is this project?",
        answer: "This is a Smart Translator with OCR, Voice and Emoji support."
    },
    {
        question: "How does OCR work?",
        answer: "It extracts text from images using Tesseract.js."
    },
    {
        question: "Is voice input available?",
        answer: "Yes, using Web Speech API."
    },
    {
        question: "Is internet required?",
        answer: "Yes, translation API requires internet."
    }
];


// ========================
// TEXT PREPROCESSING (BASIC NLP)
// ========================
function cleanText(text){
    return text.toLowerCase()
        .replace(/[^\w\s]/gi,'')
        .trim();
}


// ========================
// COSINE SIMILARITY (SIMPLE VERSION)
// ========================
function similarity(str1, str2){

    let words1 = cleanText(str1).split(" ");
    let words2 = cleanText(str2).split(" ");

    let common = words1.filter(word => words2.includes(word));

    return common.length / (Math.sqrt(words1.length * words2.length));
}


// ========================
// GET BEST MATCH
// ========================
function getBestMatch(userQuestion){

    let bestScore = 0;
    let bestAnswer = "Sorry, I don't understand.";

    faqs.forEach(faq => {

        let score = similarity(userQuestion, faq.question);

        if(score > bestScore){
            bestScore = score;
            bestAnswer = faq.answer;
        }

    });

    return bestAnswer;
}
function sendMessage(){

    let input = document.getElementById("userInput").value;
    let chatbox = document.getElementById("chatbox");

    if(input.trim() === "") return;

    chatbox.innerHTML += `<div><b>You:</b> ${input}</div>`;

    let response = getBestMatch(input);

    chatbox.innerHTML += `<div><b>Bot:</b> ${response}</div><hr>`;

    document.getElementById("userInput").value = "";

    chatbox.scrollTop = chatbox.scrollHeight;
}
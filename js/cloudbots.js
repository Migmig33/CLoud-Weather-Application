// -- para sa variable ni CLoudBot --//
function generateSummary(data){
    const AIsummary = document.getElementById('AIsummary');
    const condition = data.current.condition.text.toLowerCase();
    const chanceofrain = data.forecast.forecastday[0].day.daily_chance_of_rain;
    const windspeed = data.current.wind_kph;

let summary = "";

if(condition.includes("rain")){
    summary = `It's rainy day here in ${data.location.name}, ${data.location.country}. There is a ${chanceofrain}% chance of rain, expect a rain in various parts of the area and don't forget to bring your umbrella.`;

} else if(condition.includes("overcast") || condition.includes("cloud")){
    summary = `It's cloudy here in ${data.location.name}, ${data.location.country}. There is a ${chanceofrain}% chance of rain, but expect the ${chanceofrain}% chance of rain later in various part of the area.`;
} else if(condition.includes("sunny") || condition.includes("sun") || condition.includes("clear")){
    summary = `Perfect weather here in ${data.location.name}, ${data.location.country}. Perfect for going out with your family.`;
} else if(condition.includes("storm") || condition.includes("thunder")){
    summary = `Stormy weather here in ${data.location.name}, ${data.location.country}. There is a ${chanceofrain}% chance of rain, expect a storm and thunder in the particular area, keep safe everyone!.`;
} else if(condition.includes("snow") || condition.includes("snowy")){
    summary = `Snowy weather here in ${data.location.name}, ${data.location.country}. Heat up yourself everyone and enjoy the cold ❄️.`;
} else if(condition.includes("blizzard")){
    summary = `Watch out for the snow storm there in ${data.location.name}, ${data.location.country}. Expect a wind that reach ${windspeed}km/h stay inside and get yourself hot.`
} else if(condition.includes("fog") || condition.includes("mist")){
    summary = `Blind weather here in ${data.location.name}, ${data.location.country}, With the wind of ${windspeed}km/h and a ${chanceofrain}% chance of rain.`
}
AIsummary.textContent = summary;

function typeText(element, text, speed= 15){
    element.textContent = "";
    let i = 0;
    function type(){
         if( i < text.length){
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);

         }
         



    }
    type();
}
typeText(AIsummary, summary);

}

//cloudbot
const openCLoudBot = document.getElementById("openCLoudBot");
const CLoudBot = document.getElementById("CLoudBot");
const closeCLoudBot =  document.getElementById("closeCLoudBot");

openCLoudBot.addEventListener("click", () => {
    CLoudBot.classList.add("active")
});

closeCLoudBot.addEventListener("click", () => {
    CLoudBot.classList.remove("active")
});

//chatcloudbot
const chatLog = document.getElementById("chatlog")
const sendbtn = document.getElementById("send-btn");
const userinput = document.getElementById("user_input");

//CLOUDBOT
function appendBotMessage(message){
    const botDiv = document.createElement("div");
    botDiv.classList.add('CLoudBotresponses');

    botDiv.innerHTML = `<i class="fa-solid fa-robot"></i>
                        <p>${message}</p>
    `;
    chatLog.appendChild(botDiv);
    chatLog.scrollTop = chatLog.scrollHeight;

                    
}
//USER
function appendUserMessage(message){
    const userDiv = document.createElement("div");
    userDiv.classList.add('userMessage');

    userDiv.innerHTML = `
                         <p>${message}</p>
                         <i class="fa-solid fa-user"></i>
    `;

    chatLog.appendChild(userDiv);
    chatLog.scrollTop = chatLog.scrollHeight;

}


//response
function responseMessage(userMessage){
    const response = {
        "What is the weather today?" : "NIGGA MAULAN",
        "What are the chances of rain?" : "bagyo mamaya sah"
    };
    return response[userMessage] || "WALA AYAW GUMANA";
}

//send-btn
function sendMessage(){
    const userMessage = userinput.value;
    if (!userMessage) return;
    appendUserMessage(userMessage);
    userinput.value = "";

    setTimeout(() =>{
        const reply = responseMessage(userMessage);
        appendBotMessage(reply);
    }, 600);

}

sendbtn.addEventListener('click', sendMessage);

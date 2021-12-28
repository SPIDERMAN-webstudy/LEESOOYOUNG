const quotes = [
    {
        quote: "노력하지 않고 무언가를 잘 해낼 수 있는 사람이 천재라고 한다면, 저는 절대 천재가 아닙니다. 하지만 피나는 노력 끝에 뭔가를 이루는 사람이 천재라고 한다면, 저는 천재가 맞습니다.",
        author: "스즈키 이치로",
    },
    {
        quote: "특전사 출신인 나에게 종북이라는 사람들이 진짜 종북이다",
        author: "문재인",
    },
    {
        quote: "(기후 변화와 같이 이런 커다란… 커다란 규모의 문제는) Fun하고, Cool하고. Sexy하게 대처해야 하죠",
        author: "고이즈미 신지로",
    },
    {
        quote: "강한 자가 이기는 것이 아니라, 이기는 자가 강한 것이다.",
        author: "프란츠 베켄바워",
    },
    {
        quote: "아름다운 것은 항상 고독 속에 있으며, 군중은 그것을 이해하지 못한다.",
        author: "오귀스트 로뎅",
    },
    {
        quote: "이대 여자애들 싫어한다. 꼴같지 않은 게 대든다.",
        author: "홍준표",
    },
    {
        quote: "불편해? 그럼 자세를 고쳐앉아. 보는 자세가 잘못된거 아니에요! 편하게들 보세요.",
        author: "김찬호",
    },
]

const quote = document.querySelector("#quote span:first-child");
const author = document.querySelector("#quote span:last-child");

const todaysQuotes = quotes[Math.floor(Math.random() * quotes.length)];

quote.innerText=todaysQuotes.quote;
author.innerText=todaysQuotes.author;

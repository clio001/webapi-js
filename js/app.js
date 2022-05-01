async function getData() {
  let response = await fetch(
    'https://api.nytimes.com/svc/search/v2/articlesearch.json?q=Antarctica&fq=news_desk:("Foreign")&api-key=jbIYjBeDQwCAfrWak0psVqCGshuSaU2y'
  );
  let myData = await response.json();
  printResult(myData);
  console.log(myData);
}

function printResult(myData) {
  document.querySelector("#api-title").textContent =
    myData.response.docs[0].headline.main;

  document.querySelector("#api-byline").textContent =
    myData.response.docs[0].byline.original;

  document.querySelector("#api-abstract").textContent =
    myData.response.docs[0].abstract;

  let pubdate = new Date(myData.response.docs[0].pub_date);
  articlePubdate = pubdate.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  document.querySelector("#api-date").textContent = articlePubdate;

  document.querySelector("#api-section").textContent =
    myData.response.docs[0].news_desk;

  let urlImg =
    "https://static01.nyt.com/" + myData.response.docs[0].multimedia[0].url;
  document.querySelector("#api-img").setAttribute("src", urlImg);
}

/* DISABLE REGION DROPDOWN WHEN ANTARCTICA SELECTED

let antarcticaRadio = document.querySelector("#inputRadioAntarctica");
antarcticaRadio.addEventListener("click", () => {
  if (antarcticaRadio.checked) {
    document.querySelector("#inputRegion").disabled = true;
  }
}); */

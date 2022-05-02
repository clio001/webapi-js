// TODO: BUILD API URL

// * FETCH API DATA

async function getData() {
  let response = await fetch(
    'https://api.nytimes.com/svc/search/v2/articlesearch.json?q=Arctic&fq=news_desk:("Foreign")&api-key=jbIYjBeDQwCAfrWak0psVqCGshuSaU2y'
  );
  let myData = await response.json();
  printResult(myData);
  console.log(myData);
}

// * CREATE TABLE

function createTable(rows, cols) {
  let resultContainerTag = document.querySelector("#result-container");

  let tableTag = document.createElement("table");
  resultContainerTag.appendChild(tableTag);

  let tbodyTag = document.createElement("tbody");
  tableTag.appendChild(tbodyTag);

  for (let i = 0; i < rows; i++) {
    let trTag = document.createElement("tr");
    tbodyTag.appendChild(trTag);
  }

  const allTrTags = document.querySelectorAll("tr");
  console.log(allTrTags.length);

  let idCounter = 0;

  for (let i = 0; i < allTrTags.length; i++) {
    for (let x = 0; x < cols; x++) {
      let tdTag = document.createElement("td");
      tdTag.setAttribute("id", `td-${idCounter}`);
      allTrTags[i].appendChild(tdTag);
      idCounter++;
    }
  }
}

createTable(5, 3);

// * PRODUCE RESULT OF API QUERY

function printResult(myData) {
  // ? Creating and appending card HTML:

  let resultContainerTag = document.querySelector("#result-container");

  let divCard = document.createElement("div");
  divCard.setAttribute("class", "card");
  divCard.setAttribute("style", "width: 18rem");
  resultContainerTag.appendChild(divCard);

  let imgTag = document.createElement("img");
  imgTag.setAttribute("class", "card-img-top");
  imgTag.setAttribute("id", "api-img");
  divCard.appendChild(imgTag);

  let divCardBody = document.createElement("div");
  divCardBody.setAttribute("class", "card-body");
  divCard.appendChild(divCardBody);

  let titleTag = document.createElement("h5");
  titleTag.setAttribute("class", "card-title");
  titleTag.setAttribute("id", "api-title");
  divCardBody.appendChild(titleTag);

  let textTag = document.createElement("p");
  textTag.setAttribute("class", "card-text");
  divCardBody.appendChild(textTag);

  let bylineTag = document.createElement("span");
  bylineTag.setAttribute("id", "api-byline");
  textTag.appendChild(bylineTag);

  let lineBreakTag = document.createElement("br");
  textTag.appendChild(lineBreakTag);

  let dateTag = document.createElement("span");
  dateTag.setAttribute("id", "api-date");
  textTag.appendChild(dateTag);

  let sectionTag = document.createElement("span");
  sectionTag.setAttribute("id", "api-section");
  textTag.appendChild(sectionTag);

  let abstractTag = document.createElement("p");
  abstractTag.setAttribute("id", "api-abstract");
  textTag.appendChild(abstractTag);

  // ? Filling out card:

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

// TODO: DISABLE REGION DROPDOWN WHEN ANTARCTICA SELECTED

/* let antarcticaRadio = document.querySelector("#inputRadioAntarctica");
antarcticaRadio.addEventListener("click", () => {
  if (antarcticaRadio.checked) {
    document.querySelector("#inputRegion").disabled = true;
  }
}); */

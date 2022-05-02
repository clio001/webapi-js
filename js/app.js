// TODO: BUILD API URL

// * FETCH API DATA

async function getData() {
  const base_URL = "https://api.nytimes.com/svc/search/v2/articlesearch.json?";

  const userQuery = `q=${
    document.querySelector("#input-search-explore").value
  }`;

  const queryNewsDesk = '&fq=news_desk:("Foreign")';

  const apiKey = "&api-key=jbIYjBeDQwCAfrWak0psVqCGshuSaU2y";

  let fullURL = base_URL + userQuery + queryNewsDesk + apiKey;
  console.log(fullURL);

  let response = await fetch(fullURL);
  let myData = await response.json();
  printResult(myData);
  console.log(myData);
}

// * PRODUCE RESULT OF API QUERY

function printResult(myData) {
  // ? Clearing results page

  // ? Creating the table:

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

  createTable(3, 4);

  // ? Creating and appending card HTML:

  for (let i = 0; i < myData.response.docs.length; i++) {
    let resultContainerTag = document.querySelector(`#td-${i}`);

    let divCard = document.createElement("div");
    divCard.setAttribute("class", "card");
    divCard.setAttribute("style", "width: 15rem");
    resultContainerTag.appendChild(divCard);

    let imgTag = document.createElement("img");
    imgTag.setAttribute("class", "card-img-top");
    imgTag.setAttribute("id", `api-img-${i}`);
    divCard.appendChild(imgTag);

    let divCardBody = document.createElement("div");
    divCardBody.setAttribute("class", "card-body");
    divCard.appendChild(divCardBody);

    let titleTag = document.createElement("h5");
    titleTag.setAttribute("class", "card-title");
    titleTag.setAttribute("id", `api-title-${i}`);
    divCardBody.appendChild(titleTag);

    let textTag = document.createElement("p");
    textTag.setAttribute("class", "card-text");
    divCardBody.appendChild(textTag);

    let bylineTag = document.createElement("span");
    bylineTag.setAttribute("id", `api-byline-${i}`);
    textTag.appendChild(bylineTag);

    let lineBreakTag = document.createElement("br");
    textTag.appendChild(lineBreakTag);

    let dateTag = document.createElement("span");
    dateTag.setAttribute("id", `api-date-${i}`);
    textTag.appendChild(dateTag);

    let sectionTag = document.createElement("span");
    sectionTag.setAttribute("id", `api-section-${i}`);
    textTag.appendChild(sectionTag);

    let abstractTag = document.createElement("p");
    abstractTag.setAttribute("id", `api-abstract-${i}`);
    textTag.appendChild(abstractTag);

    // ? Filling out the card:

    document.querySelector(`#api-title-${i}`).textContent =
      myData.response.docs[i].headline.main;

    document.querySelector(`#api-byline-${i}`).textContent =
      myData.response.docs[i].byline.original;

    document.querySelector(`#api-abstract-${i}`).textContent =
      myData.response.docs[i].abstract;

    let pubdate = new Date(myData.response.docs[i].pub_date);
    articlePubdate = pubdate.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    document.querySelector(`#api-date-${i}`).textContent = articlePubdate;

    document.querySelector(`#api-section-${i}`).textContent =
      myData.response.docs[i].news_desk;

    // TODO: error handling for undefined json values
    if (myData.response.docs[i].multimedia[i].url == undefined) {
      let urlImg =
        "https://images.unsplash.com/photo-1600170885301-7a7fc8ffb5a3?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80";
      document.querySelector(`#api-img-${i}`).setAttribute("src", urlImg);
    } else {
      let urlImg =
        "https://static01.nyt.com/" + myData.response.docs[i].multimedia[i].url;
      document.querySelector(`#api-img-${i}`).setAttribute("src", urlImg);
    }
  }
}

// TODO: DISABLE REGION DROPDOWN WHEN ANTARCTICA SELECTED

/* let antarcticaRadio = document.querySelector("#inputRadioAntarctica");
antarcticaRadio.addEventListener("click", () => {
  if (antarcticaRadio.checked) {
    document.querySelector("#inputRegion").disabled = true;
  }
}); */

// #region FETCH API DATA

const getData = async () => {
  const base_URL = "https://api.nytimes.com/svc/search/v2/articlesearch.json?";

  const userQuery = ` AND ${
    document.querySelector("#input-search-explore").value
  }`;

  let userPolarFocus = "";
  if (document.querySelector("#inputRadioArctic").checked) {
    userPolarFocus = document.querySelector("#inputRadioArctic").value;
  } else {
    userPolarFocus = document.querySelector("#inputRadioAntarctica").value;
  }

  const polarFocus = `q=${userPolarFocus}`;

  const userInputYear = document.querySelector("#input-year").value;
  const userYear = `&fq=pub_year:("${userInputYear}")`;

  const apiKey = "&api-key=jbIYjBeDQwCAfrWak0psVqCGshuSaU2y";

  let fullURL = `${base_URL}${polarFocus}${userQuery}${userYear}${apiKey}`;

  console.log("API request", fullURL);

  let response = await fetch(fullURL);
  let myData = await response.json();
  printResult(myData);
  ErrorNoResults(myData);
  populateDropdown(myData);
};

// #endregion

// #region PRODUCE RESULT OF API QUERY

const printResult = (myData) => {
  clearDOM();
  createBSTable(myData);

  // ? Creating and appending card HTML:

  for (let i = 0; i < myData.response.docs.length; i++) {
    let resultContainerTag = document.querySelector(`#col-${i}`);

    let aTag = document.createElement("a");
    aTag.setAttribute("id", `api-link-${i}`);
    aTag.setAttribute("class", "text-decoration-none text-reset");
    aTag.setAttribute("target", "_blank");
    resultContainerTag.appendChild(aTag);

    let divCard = document.createElement("div");
    divCard.setAttribute("class", "card");
    divCard.setAttribute("style", "width: 17rem");
    aTag.appendChild(divCard);

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
    dateTag.setAttribute("class", "font-grey");
    textTag.appendChild(dateTag);

    let sectionTag = document.createElement("span");
    sectionTag.setAttribute("id", `api-section-${i}`);
    sectionTag.setAttribute("class", "font-grey");
    textTag.appendChild(sectionTag);

    let abstractTag = document.createElement("p");
    abstractTag.setAttribute("id", `api-abstract-${i}`);
    abstractTag.setAttribute("class", "abstract-margin-top");
    textTag.appendChild(abstractTag);

    // ? Filling in the card:

    document
      .querySelector(`#api-link-${i}`)
      .setAttribute("href", myData.response.docs[i].web_url);

    document.querySelector(`#api-title-${i}`).textContent =
      myData.response.docs[i].headline.main;

    document.querySelector(`#api-byline-${i}`).textContent =
      myData.response.docs[i].byline.original;

    document.querySelector(`#api-abstract-${i}`).textContent =
      myData.response.docs[i].abstract;

    articlePubdate = new Date(
      myData.response.docs[i].pub_date
    ).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    document.querySelector(`#api-date-${i}`).textContent = articlePubdate;

    document.querySelector(
      `#api-section-${i}`
    ).textContent = `, ${myData.response.docs[i].section_name}`;

    // ? Error handling for empty multimedia json arrays

    if (myData.response.docs[i].multimedia.length === 0) {
      document
        .querySelector(`#api-img-${i}`)
        .setAttribute(
          "src",
          "https://images.unsplash.com/photo-1600170885301-7a7fc8ffb5a3?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80"
        );
    } else {
      document
        .querySelector(`#api-img-${i}`)
        .setAttribute(
          "src",
          `https://static01.nyt.com/${myData.response.docs[i].multimedia[0].url}`
        );
    }
  }
};

// #endregion

// #region CREATE BOOTSTRAP TABLE

const createBSTable = (myData) => {
  let resultContainerTag = document.querySelector("#result-container");

  let rowTag = document.createElement("div");
  rowTag.setAttribute("class", "row");
  resultContainerTag.appendChild(rowTag);

  for (let i = 0; i < myData.response.docs.length; i++) {
    let colTag = document.createElement("div");
    colTag.setAttribute("class", "col mb-3");
    colTag.setAttribute("id", `col-${i}`);
    rowTag.appendChild(colTag);
  }
};

// #endregion

// #region CONTROLLER FUNCTION // ! Result is undefined

async function controller() {
  const result = await getData();
  console.log("Controller result", result);
}
// #endregion

// #region DROPDOWN POPULATION

const populateDropdown = (myData) => {
  // ? Populating dropdown options for NYT sections

  let dropdownSection = document.querySelector("#inputSection");
  let sections = [];
  for (let i = 0; i < myData.response.docs.length; i++) {
    sections.push(myData.response.docs[i].section_name);
  }
  const unique_sections = [...new Set(sections)];
  console.log(unique_sections);

  for (let i = 0; i < unique_sections.length; i++) {
    let option = document.createElement("option");
    option.textContent = unique_sections[i];
    dropdownSection.appendChild(option);
  }

  // ? Populating dropdown options for NYT authors

  let authors = [];
  for (let i = 0; i < myData.response.docs.length; i++) {
    authors.push(myData.response.docs[i].byline.original);
  }
  const unique_authors = [...new Set(authors)];

  let dropdownByline = document.querySelector("#inputByline");
  for (let i = 0; i < unique_authors.length; i++) {
    let option = document.createElement("option");
    option.textContent = unique_authors[i];
    dropdownByline.appendChild(option);
  }
};
// #endregion

// #region GET DATE // ? Not used so far

const pullDate = (myData) => {
  // ? Getting user input

  let userDate = document.querySelector("#user-date").value;
  console.log("user date", userDate);
  console.log("array length", myData.response.docs.length);

  // ? Getting dates of data already displayed
  let articlePubdate = "";

  for (let i = 0; i < myData.response.docs.length; i++) {
    let articlePubdate = new Date(myData.response.docs[i].pub_date)
      .toISOString()
      .slice(0, 10);
    console.log("Artikeldatum", articlePubdate);
  }
  return articlePubdate;
};
// #endregion

// #region CLEAR DOM

const clearDOM = () => {
  document.querySelector("#result-container").innerHTML = "";
  document.querySelector("#inputSection").innerHTML = "";
  document.querySelector("#inputByline").innerHTML = "";
};

// #endregion

// #region ERROR HANDLING NO RESULTS

const ErrorNoResults = (myData) => {
  if (myData.response.docs.length === 0) {
    let resultContainerTag = document.querySelector("#result-container");

    let errorTag = document.createElement("p");
    errorTag.setAttribute("class", "alert alert-warning");
    errorTag.textContent = "No results found. Please try again!";
    resultContainerTag.appendChild(errorTag);
  } else {
    let resultContainerTag = document.querySelector("#result-container");

    let errorTag = document.createElement("div");
    errorTag.setAttribute("class", "alert alert-success");
    errorTag.textContent = `${myData.response.docs.length} results found.`;
    resultContainerTag.appendChild(errorTag);
  }
};

// #endregion

// #region SET EVENT LISTENERS

const setEventListeners = () => {
  document
    .querySelector("#explore-search-btn")
    .addEventListener("click", () => {
      getData();
    });

  document.querySelector("#input-year").addEventListener("keyup", (event) => {
    if (event.code == "Enter") {
      getData();
    } else return;
  });

  document
    .querySelector("#input-search-explore")
    .addEventListener("keyup", (event) => {
      if (event.code == "Enter") {
        getData();
      } else return;
    });

  document
    .querySelector("#inputRadioAntarctica")
    .addEventListener("click", () => {
      if (document.querySelector("#inputRadioAntarctica").checked) {
        document.querySelector("#inputRegion").disabled = true;
      }
    });

  document.querySelector("#inputRadioArctic").addEventListener("click", () => {
    if (document.querySelector("#inputRadioArctic").checked) {
      document.querySelector("#inputRegion").disabled = false;
    }
  });
};
// #endregion

getData();
setEventListeners();
/* controller(); */

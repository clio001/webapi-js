// #region // * FETCH API DATA

const getData = async () => {
  const base_URL = "https://api.nytimes.com/svc/search/v2/articlesearch.json?";
  const apiKey = "&api-key=jbIYjBeDQwCAfrWak0psVqCGshuSaU2y";

  const userQuery = ` AND ${
    document.querySelector("#input-search-explore").value
  }`;

  let userPolarFocus = "";
  // ! here you can use this syntax (or very similar one, check your colleagues code because I remember at least one using
  // ! it): document.querySelector("input[radio]:checked").value
  // ! this way you directly select the value of the radio that is checked
  if (document.querySelector("#inputRadioArctic").checked) {
    userPolarFocus = document.querySelector("#inputRadioArctic").value;
  } else {
    userPolarFocus = document.querySelector("#inputRadioAntarctica").value;
  }

  const polarFocus = `q=${userPolarFocus}`;
  const userInputYear = document.querySelector("#input-year").value;
  const userYear = `&fq=pub_year:("${userInputYear}")`;

  let fullURL = `${base_URL}${polarFocus}${userQuery}${userYear}${apiKey}`;
  console.log("API request", fullURL);
  // ! try and catch block are missing
  let response = await fetch(fullURL);
  let myData = await response.json();
  // ! you could "clean" my data already here (send to the functions myData.response.docs)
  printResult(myData);
  populateDropdown(myData);
  triggerSectionFilter(myData);
  triggerAuthorsFilter(myData);
};

// #endregion

// #region // * PRODUCE RESULT OF API QUERY

const printResult = (myData) => {
  clearDOM();

  // ! it would be better to check here the length of your results and call ErrorNoResults() to create the error message
  // ! and an other function to displat the number of results found (if you do both in the ErrorNoResults() it's very
  // ! confusing, if you don't want to create 2 functions at least rename that one)
  ErrorNoResults(myData);

  // ! creating the bootstrap grid, injecting it in the html and then selecting the singular cells means at least 3 DOM
  // ! operations. creating the grid, selecting the container and then injecting it, it is only 2 DOM operations
  // ! which is a lot faster. it seems over complicated to first inject the grid, then select it and then fill it.
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
    // ! nice!
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

// #region // * CREATE BOOTSTRAP TABLE

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

// #region // * CONTROLLER FUNCTION // ! Result is undefined

async function controller() {
  const result = await getData();
  console.log("Controller result", result);
}
// #endregion

// #region // * DROPDOWN POPULATION

const populateDropdown = (myData) => {
  // ? Populating dropdown options for NYT sections

  let sections = [];
  for (let i = 0; i < myData.response.docs.length; i++) {
    sections.push(myData.response.docs[i].section_name);
  }
  unique_sections = [...new Set(sections)];

  let dropdownSection = document.querySelector("#inputSection");
  for (let i = 0; i < unique_sections.length; i++) {
    let option = document.createElement("option");
    option.textContent = unique_sections[i];
    dropdownSection.appendChild(option);
  }
  // ! to avoid 2 loops you could check if section_name is not present in sections array, and if it is not, push it
  // ! and directly create the option
  // ? Populating dropdown options for NYT authors

  let authors = [];
  for (let i = 0; i < myData.response.docs.length; i++) {
    authors.push(myData.response.docs[i].byline.original);
  }
  unique_authors = [...new Set(authors)];

  let dropdownByline = document.querySelector("#inputByline");
  for (let i = 0; i < unique_authors.length; i++) {
    let option = document.createElement("option");
    option.textContent = unique_authors[i];
    dropdownByline.appendChild(option);
  }
};
// #endregion

// #region // * FILTER NYT SECTION RESULTS
// ! FILTERING WORKS ONCE, BUT WHEN NEW SEARCH REQUEST MADE WITHOUT REFRESHING THE WEBSITE IT SEEMS TO RUN THE FUNCTION TWICE AND TO RETURN OBJECT WITH AN EMPTY DOCS ARRAY.
// ! check cleanDOM() function to know why ;)
const filterSectionResults = (myData) => {
  let userSection = document.querySelector("#inputSection").value;
  let filteredArticles = { response: { docs: [] } };
  for (let i = 0; i < myData.response.docs.length; i++) {
    if (userSection === myData.response.docs[i].section_name) {
      filteredArticles.response.docs.push(myData.response.docs[i]);
    }
  }
  printResult(filteredArticles);
  console.log("Filtered articles: ", filteredArticles);
};

const triggerSectionFilter = (myData) => {
  document.querySelector("#apply-btn").addEventListener("click", () => {
    filterSectionResults(myData);
  });
};

// #endregion

// #region // * FILTER NYT AUTHORS RESULTS
// ! FILTERING WORKS ONCE, BUT WHEN NEW SEARCH REQUEST MADE WITHOUT REFRESHING THE WEBSITE IT SEEMS TO RUN THE FUNCTION TWICE AND TO RETURN OBJECT WITH AN EMPTY DOCS ARRAY.
// ! check cleanDOM() function to know why ;)
const filterAuthorsResults = (myData) => {
  let userAuthors = document.querySelector("#inputByline").value;
  let filteredAuthors = { response: { docs: [] } };
  for (let i = 0; i < myData.response.docs.length; i++) {
    if (userAuthors === myData.response.docs[i].byline.original) {
      filteredAuthors.response.docs.push(myData.response.docs[i]);
    }
  }
  printResult(filteredAuthors);
  console.log("Filtered Authors: ", filteredAuthors);
};

const triggerAuthorsFilter = (myData) => {
  document.querySelector("#inputByline").addEventListener("change", () => {
    filterAuthorsResults(myData);
  });
};

// #endregion

// #region // * GET DATE // ? Not used so far

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

// #region // * CLEAR DOM

const clearDOM = () => {
  document.querySelector("#result-container").innerHTML = "";
  // ! cleaning also the select is the reason why your filtering system don't work properly
  // document.querySelector("#inputSection").innerHTML = "";
  // document.querySelector("#inputByline").innerHTML = "";
};

// #endregion

// #region // * ERROR HANDLING NO RESULTS

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

// #region // * SET EVENT LISTENERS

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
  // ! nice, but you could do something like that below:

  // ! document.querySelector("input[radio]:checked").value === "Arctic" ?
  // ! document.querySelector("#inputRegion").disabled = false :
  // ! document.querySelector("#inputRegion").disabled = true
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

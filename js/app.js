async function getData() {
  let response = await fetch(
    'https://api.nytimes.com/svc/search/v2/articlesearch.json?q=("arctic")&fq=news_desk:("Business")&api-key=jbIYjBeDQwCAfrWak0psVqCGshuSaU2y'
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

  let urlImg =
    "https://static01.nyt.com/" + myData.response.docs[0].multimedia[0].url;
  document.querySelector("#api-img").setAttribute("src", urlImg);
}

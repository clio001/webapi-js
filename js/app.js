async function getData() {
  let response = await fetch(
    'https://api.nytimes.com/svc/search/v2/articlesearch.json?q=("Bennhold")&fq=news_desk:("Foreign")&api-key=jbIYjBeDQwCAfrWak0psVqCGshuSaU2y'
  );
  let myData = response.json;
  printResult(myData);
}

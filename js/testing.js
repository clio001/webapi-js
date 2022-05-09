const url =
  "https://api.nytimes.com/svc/search/v2/articlesearch.json?&api-key=jbIYjBeDQwCAfrWak0psVqCGshuSaU2y";

const getData = () => {
  fetch(url).then((response) =>
    response.json().then((myData) => {
      console.log(myData);
      useFunction(myData);
      return myData;
    })
  );
};

const useFunction = (myData) => {
  console.log("Article headline: ", myData.response.docs[0].headline.main);
};

const useReturn = (myData) => {
  console.log("Article headline: ", myData.response.docs[0].headline.main);
};

const grabMyData = async (url) => {
  let result = await getData(url);
  console.log(result);
};

getData();
grabMyData(url);
// manipulateData(myData)

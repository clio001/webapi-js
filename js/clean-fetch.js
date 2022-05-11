const url =
  "https://api.nytimes.com/svc/search/v2/articlesearch.json?&api-key=jbIYjBeDQwCAfrWak0psVqCGshuSaU2y";


const getData = () => {
  fetch(url)
  .then((response) => response.json())
  .then(myData => {
    console.log(myData);
    helperFunction(myData);
  })
};

const helperFunction = (myData) => {
  anyOtherFunction(myData)
}

const anyOtherFunction = (myData) => {
  console.log("anyOtherFunction: ", myData.response.docs[0].headline.main);
};

getData(url);

/* const grabMyData = async (url) => {
  let result = await getData(url);
  console.log("grabMyData: ", result.response.docs[0].headline.main)

} */

// const asyncFunction = async () => {
//   return 2
// }

// const getData = async () => {
//   const res = await fetch(url)
//   return res.json()
// };



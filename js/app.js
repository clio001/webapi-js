async function getData() {
  let response = await fetch();
  let myData = response.json;
  printResult(myData);
}

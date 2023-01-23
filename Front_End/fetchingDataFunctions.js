async function fetchAllData() {
  let res = await fetch("/books");
  let resJson = await res.json();
  return resJson;
}
async function fetchNewData(newBook) {
  let res = await fetch("/books", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newBook),
  });
  let resJson = await res.json();
  return resJson;
}

async function fetchUpdateData(updateBook) {
  let res = await fetch("/books", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updateBook),
  });
  let resJson = await res.json();
  return resJson;
}

async function deleteBookData(deleteBook) {
  let res = await fetch("/books", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(deleteBook),
  });
  let resJson = await res.json();
  return resJson;
}

const express = require("express");
const fs = require("node:fs");
const app = express();
const { MongoClient } = require("mongodb");
let settings = {
  counterId: 20,
};
let books;
app.use(express.static("Front_end"));
app.use(express.json());
// Connection URL
const url = "mongodb://localhost:27017";
const client = new MongoClient(url);
// Database Name
const dbName = "library";
async function main() {
  await client.connect();
  console.log("Connected successfully to server");
  const db = client.db(dbName);
  const collection = db.collection("books");
  // SHOW ALL BOOKS ROUTE
  app.get("/books", (req, res) => {
    let fbooks = books;
    if (req.query.q) {
      fbooks = fbooks.filter((item) => item.title.indexOf(req.query.q) > -1);
    }
    let responseBody = {
      success: true,
      error: "",
      data: fbooks,
    };
    res.send(responseBody);
  });
  // SHOW BOOK ROUTE
  app.get("/books/:id", (req, res) => {
    let book = books.find((item) => item._id == req.params.id);
    let responseBody = {
      success: true,
      error: "",
      data: book,
    };
    if (!book) {
      responseBody.success = false;
      responseBody.error = "BOOK ISN'T FOUND ,TRY AGAIN!!";
      responseBody.data = `_id=${req.params.id}`;
    }
    res.send(responseBody);
  });
  // ADD NEW BOOK ROUTE
  app.post("/books", (req, res) => {
    let responseBody = {
      success: true,
      error: "",
      data: req.body,
    };
    let validatedData = validateData(responseBody);
    if (validatedData) {
      req.body._id = settings.counterId++;
      books.push(req.body);
      saveBooksData();
      res.send(responseBody);
    } else {
      res.send(responseBody);
    }
  });
  // UPDATE BOOK ROUTE
  app.put("/books", (req, res) => {
    let book = books.find((item) => item._id == req.body._id);
    let responseBody = {
      success: true,
      error: "",
      data: req.body,
    };
    if (!book) {
      responseBody.success = false;
      responseBody.error = "BOOK ISN'T FOUND ,TRY AGAIN!!";
      responseBody.data = `_id=${req.body._id}`;
    }
    book.title = req.body.title;
    book.authors = req.body.authors;
    book.categories = req.body.categories;
    book.shortDescription = req.body.shortDescription;
    book.thumbnailUrl = req.body.thumbnailUrl;
    saveBooksData();
    res.send(responseBody);
  });

  //   DELETE BOOK ROUTE
  app.delete("/books", (req, res) => {
    let updatedBookIndex = books.findIndex((item) => item._id == req.body._id);
    let responseBody = {
      success: true,
      error: "",
      data: req.body._id,
    };
    if (updatedBookIndex === -1) {
      responseBody.success = false;
      responseBody.error = "BOOK ISN'T FOUND ,TRY AGAIN!!";
    }
    books.splice(updatedBookIndex, 1);
    saveBooksData();
    res.send(responseBody);
  });

  // Validation Function
  function validateData(responseBody) {
    if (!responseBody.data.title || responseBody.data.title.length <= 2) {
      responseBody.success = false;
      responseBody.error =
        "Book's Title should be added and it's length should be equal or bigger than 3 characters";
      responseBody.data = "";
    } else if (
      !responseBody.data.authors ||
      responseBody.data.authors.length <= 2
    ) {
      responseBody.success = false;
      responseBody.error =
        "Book's Author should be added and it's length should be equal or bigger than 3 characters";
      responseBody.data = "";
    } else if (books.some((book) => book.title === responseBody.data.title)) {
      responseBody.success = false;
      responseBody.error = "Book's Title is already exists";
      responseBody.data = "";
    } else {
      return true;
    }
  }

  // save Data
  function saveBooksData() {
    let data = JSON.stringify(books);
    fs.writeFile("books.json", data, (err) => {
      if (err) throw err;
      console.log("The file has been saved!");
    });
    fs.writeFile("settings.json", data, (err) => {
      if (err) throw err;
      console.log("The file has been saved2!");
    });
  }

  function readBooksData() {
    fs.readFile("books.json", (err, data) => {
      if (err) throw err;
      books = JSON.parse(data);
      console.log("The file has been Read!");
    });
    fs.readFile("settings.json", (err, data) => {
      if (err) throw err;
      books = JSON.parse(data);
      console.log("The file has been Read!");
    });
  }

  readBooksData();

  return "done.";
}

main()
  .then(console.log)
  .catch(console.error)
  .finally(() => client.close());

app.listen("8080", () => {
  console.log("hello");
});

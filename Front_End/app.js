let books = [];
// DISPLAY ALL FETCHED DATA
if (window.location.pathname.includes("/index.html")) {
  // DISPLAY ALL DATA FUNCTION
  async function displayAllData() {
    let res = await fetchAllData();
    books = res.data;
    let html = books
      .map(
        (book) => `<tr>
          <td><a href="https://www.google.com/search?tbm=bks&q=${
            book.title
          }"><img
                      src="${book.thumbnailUrl}"></a></td>
          <td id="bookTitle">
          ${book.title}
          </td>
          <td id="bookAuthors">
          ${book.authors}
          </td>
          <td id="bookShortDescription">
          ${!book.shortDescription || {} ? book.shortDescription : "----------"}
          </td>
          <td id="bookCategories">
              ${book.categories ? book.categories : "----------"}
          </td>
  
          <td><a href="update.html?${
            book._id
          }" class="btn btn-danger d-inline me-2" id="sumbit_updated_data">Edit</a><a href="index.html?${
          book._id
        }" class="btn btn-danger d-inline" id="delete_data">Delete</a></td>
        </tr>`
      )
      .join("\n");
    document.getElementById("table_body").innerHTML = html;
  }
  displayAllData();
  // DELETE ALL DATA FUNCTION
  async function deleteSelectedBook(id) {
    let res = await fetchAllData();
    books = res.data;
    let deleteBook = await books.find((element) => element._id == id);
    if (deleteBook) {
      await deleteBookData(deleteBook);
    }
  }
  document
    .getElementById("table_body")
    .addEventListener("click", async function (e) {
      e.stopPropagation();
      let id = parseInt(window.location.search.replace("?", ""));
      if (e.target.href.split("?")[1] == id && e.target.id == "delete_data") {
        await deleteSelectedBook(id);
      }
    });
}

// ADD NEW BOOK DATA
if (window.location.pathname == "/new.html") {
  async function displayNewBookData() {
    let res = await fetchAllData();
    books = res.data;
    let book = {};
    book.thumbnailUrl = document.getElementById("thumbnailUrl").value;
    book.title = document.getElementById("title").value;
    book.authors = document.getElementById("authors").value;
    book.categories = document.getElementById("categories").value;
    book.shortDescription = document.getElementById("shortDescription").value;
    if (!book.title || book.title.length <= 2) {
      alert(
        "Book's Title should be added and it's length should be equal or bigger than 3 characters"
      );
    } else if (!book.authors || book.authors.length <= 2) {
      alert(
        "Book's Author should be added and it's length should be equal or bigger than 3 characters"
      );
    } else if (!book.thumbnailUrl) {
      alert("Book's Thumbnail image should be added");
    } else if (books.some((item) => item.title == book.title)) {
      alert("Book's Title is already exists");
    } else {
      return book;
    }
  }
  document
    .getElementById("sumbit_new_data")
    .addEventListener("click", async function (e) {
      e.preventDefault();
      let book = await displayNewBookData();
      await fetchNewData(book);
      if (book) {
        alert("Book is added successfully");
        window.location.href = "http://localhost:8080/index.html";
      }
    });
}

// UPDATE BOOK DATA
if (window.location.pathname.includes("update.html")) {
  async function displayUpdatedBookData(id) {
    let res = await fetchAllData();
    books = res.data;
    let updateBook = await books.find((element) => element._id == id);
    if (updateBook) {
      let book = await fetchUpdateData(updateBook);
      document.getElementById("updateThumbnailUrl").value =
        book.data.thumbnailUrl;
      document.getElementById("updateTitle").value = book.data.title;
      document.getElementById("updateAuthors").value = book.data.authors;
      document.getElementById("updateCategories").value = book.data.categories;
      document.getElementById("updateShortDescription").value =
        book.data.shortDescription;
      document
        .getElementById("update_btn")
        .addEventListener("click", async function (e) {
          e.preventDefault();
          updateBook.thumbnailUrl =
            document.getElementById("updateThumbnailUrl").value;
          updateBook.title = document.getElementById("updateTitle").value;
          updateBook.authors = document.getElementById("updateAuthors").value;
          updateBook.categories =
            document.getElementById("updateCategories").value;
          updateBook.shortDescription = document.getElementById(
            "updateShortDescription"
          ).value;
          if (!document.getElementById("updateThumbnailUrl").value) {
            alert("Thumbnail image is missed!!!");
          } else if (
            !document.getElementById("updateTitle").value ||
            books.filter((book) => updateBook.title == book.title).length > 1
          ) {
            alert("Title is already exists or not added!!!");
          } else if (!document.getElementById("updateAuthors").value) {
            alert("Author's name is missed!!!");
          } else {
            await fetchUpdateData(updateBook);
            window.location.href = "http://localhost:8080/index.html";
          }
        });
    } else {
      alert("Book cannot be found");
      window.location.href = "http://localhost:8080/index.html";
    }
  }
  displayUpdatedBookData(parseInt(window.location.search.replace("?", "")));
}

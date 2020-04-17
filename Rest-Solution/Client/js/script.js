// http://localhost:64265/home/index
// http://localhost:64265/api/books

$(function () {

        const URL = 'http://localhost:64265/api/books';
        const URLreaders = 'http://localhost:64265/api/readers';
        const URLlends = 'http://localhost:64265/api/lend';
        const booksTableBodyElement = $('#books-table-body');
        const readersTableBodyElement = $('#readers-table-body');
        const lendsTableBodyElement = $('#lends-table-body');
        const bookFormElement = $('#book-form');
        const readerFormElement = $('#reader-form');
        const inputAuthorElement = $('#book-author-input');
        const inputTitleElement = $('#book-title-input');
        const inputNameElement = $('#reader-name-input');
        const inputAgeElement = $('#reader-age-input');
        const buttonAddNew = $('#new-book-button');
        const buttonAddNewReader = $('#new-reader-button');
        const buttonEdit = $('#confirm-edit-button');
        const buttonEditReader = $('#confirm-edit-reader-button');
        const buttonCancel = $('#cancel-edit-button');
        const buttonCancelReader = $('#cancel-edit-reader-button');
        const author = $('.navbar-text');
        const message = $(`#message-box`);

        function changeAuthor() {
            author.text("Autor: Seweryn Nowicki");
        }

        function changeOfMessage() {
            message.text("Everything works properly");
        }

        function standardErrorHandler(xhr, err, status) {
            console.error(xhr, err, status);
            //alert(`We have serious problem: ${status}`);
            message.text(`We have serious problem: ${status}`);
        }

        function setCommunicate(text, status) {
            message.text(`${text}`);
        }

        // Book
        function createBookRow(book) {
            return $(`<tr data-id="${book.ID}">
            <td>${book.Title}</td>
            <td>${book.Author}</td>               
            <td>
                <div class="button-group">
                    <button class="btn btn-primary btn-sm" id="edit">Edytuj</button>
                    <button class="btn btn-danger btn-sm" id="delete">Usuń</button>
                    <button class="btn btn-info btn-sm" id="select">Wypożycz</button>
                </div>
            </td>
        </tr>`);
        }

        // GET
        function loadBooksToTable() {
            //$.getJSON(URL) // szybsze niż ajax
            $.ajax(URL, {
                type: 'GET'
            }).done((books) => {
                books.forEach(book => {
                    booksTableBodyElement.append(createBookRow(book));
                })
            }).fail(standardErrorHandler)
        }

        function getRowFromButton(button) {
            return $(button).closest('[data-id]')
        }

        // DELETE
        function activateDeleteButtons() {
            booksTableBodyElement.on('click', 'button.btn-danger#delete',
                function () {
                    const row = getRowFromButton(this);
                    const id = row.data('id');
                    $.ajax(URL + '/' + id, {
                        type: 'DELETE'
                    }).done(() => {
                        row.remove();
                        setCommunicate('Delete book');
                    }).fail(standardErrorHandler)
                });
        }


        function getDataFromForm() {
            return {
                Author: inputAuthorElement.val(),
                Title: inputTitleElement.val()
            };
        }

        function dataUrlString(book) {
            return '?author='
                + encodeURIComponent(book.Author)
                + '&title='
                + encodeURIComponent(book.Title);
        }

        // POST
        function activatePostForm() {
            buttonAddNew.on('click', function () {
                const bookData = getDataFromForm();
                //$.post(URL + dataUrlString(bookData))
                $.ajax(URL + dataUrlString(bookData), {
                    type: 'POST'
                }).done((bookId) => {
                    console.log(bookId);
                    bookData.ID = bookId;
                    booksTableBodyElement.append(createBookRow(bookData));
                    clearForm();
                    setCommunicate('Add book');
                }).fail(standardErrorHandler);
                return false;
            })
        }

        // PUT
        function activatePutForm() {
            buttonEdit.on('click', function () {
                const bookData = getDataFromForm();
                const bookId = bookFormElement.data('id');
                $.ajax(URL + '/' + bookId + dataUrlString(bookData),
                    {
                        type: "PUT"
                    }).done(() => {
                    const existingRow = $(`#books-table-body > tr[data-id=${bookId}]`);
                    existingRow.replaceWith(createBookRow({
                        ID: bookId,
                        ...bookData
                    }));
                    clearForm();
                    setCommunicate("Editing succeeded");
                }).fail(standardErrorHandler);
                return false;

            });
        }

        function clearForm() {
            bookFormElement.removeData('id');
            inputAuthorElement.val('');
            inputTitleElement.val('');

            buttonAddNew.removeClass('d-none');
            buttonEdit.addClass('d-none');
            buttonCancel.addClass('d-none');

            return false;
        }

        function activateEditButtons() {
            booksTableBodyElement.on('click', 'button.btn-primary#edit',
                function () {
                    const row = getRowFromButton(this);
                    const book = getBookObjectFromRow(row);
                    setEditModeFor(book);
                });
            buttonCancel.on('click', clearForm);
        }


        function getBookObjectFromRow(row) {
            return {
                ID: row.data('id'),
                Title: row.children('td').eq(0).text(),
                Author: row.children('td').eq(1).text(),
            }
        }


        function setEditModeFor(book) {
            bookFormElement.data('id', book.ID);
            inputAuthorElement.val(book.Author);
            inputTitleElement.val(book.Title);

            buttonAddNew.addClass('d-none');
            buttonEdit.removeClass('d-none');
            buttonCancel.removeClass('d-none');
        }

        loadBooksToTable();
        activateDeleteButtons();
        activateEditButtons();
        activatePostForm();
        activatePutForm();

        changeAuthor();
        changeOfMessage();

        // Reader
        function createReadersRow(reader) {
            return $(`<tr data-id="${reader.ID}">
            <td>${reader.Name}</td>
            <td>${reader.Age}</td>               
            <td>
                <div class="button-group">
                    <button class="btn btn-primary btn-sm" id="edit1">Edytuj</button>
                    <button class="btn btn-danger btn-sm" id="delete1">Usuń</button>
                    <button class="btn btn-info btn-sm" id="select1">Wybierz</button>
                </div>
            </td>
        </tr>`);
        }

        // GET
        function loadReadersToTable() {
            //$.getJSON(URL) // szybsze niż ajax
            $.ajax(URLreaders, {
                type: 'GET'
            }).done((readers) => {
                readers.forEach(reader => {
                    readersTableBodyElement.append(createReadersRow(reader));
                })
            }).fail(standardErrorHandler)
        }

        // DELETE
        function activateDeleteButtonsReader() {
            readersTableBodyElement.on('click', 'button.btn-danger#delete1',
                function () {
                    console.log("klik");
                    const row = getRowFromButton(this);
                    const id = row.data('id');
                    $.ajax(URLreaders + '/' + id, {
                        type: 'DELETE'
                    }).done(() => {
                        row.remove();
                        setCommunicate('Delete reader');
                    }).fail(standardErrorHandler)
                });
        }

        function getDataFromFormReaders() {
            return {
                Name: inputNameElement.val(),
                Age: inputAgeElement.val()
            };
        }

        function dataUrlStringReader(reader) {
            return '?name='
                + encodeURIComponent(reader.Name)
                + '&age='
                + encodeURIComponent(reader.Age);
        }

        // POST
        function activatePostFormReader() {
            buttonAddNewReader.on('click', function () {
                const readerData = getDataFromFormReaders();
                //$.post(URL + dataUrlString(bookData))
                $.ajax(URLreaders + dataUrlStringReader(readerData), {
                    type: 'POST'
                }).done((readerId) => {
                    console.log(readerId);
                    readerData.ID = readerId;
                    readersTableBodyElement.append(createReadersRow(readerData));
                    clearFormReader();
                    setCommunicate('Add book');
                }).fail(standardErrorHandler);
                return false;
            })
        }

        // PUT
        function activatePutFormReader() {
            buttonEditReader.on('click', function () {
                const readerData = getDataFromFormReaders();
                const readerId = readerFormElement.data('id');
                $.ajax(URLreaders + '/' + readerId + dataUrlStringReader(readerData),
                    {
                        type: "PUT"
                    }).done(() => {
                    const existingRow = $(`#readers-table-body > tr[data-id=${readerId}]`);
                    existingRow.replaceWith(createReadersRow({
                        ID: readerId,
                        ...readerData
                    }));
                    clearFormReader();
                    setCommunicate("Editing succeeded");
                }).fail(standardErrorHandler);
                return false;

            });
        }

        function clearFormReader() {
            readerFormElement.removeData('id');
            inputNameElement.val('');
            inputAgeElement.val('');

            buttonAddNewReader.removeClass('d-none');
            buttonEditReader.addClass('d-none');
            buttonCancelReader.addClass('d-none');

            return false;
        }

        function activateEditButtonsReader() {
            readersTableBodyElement.on('click', 'button.btn-primary#edit1',
                function () {
                    const row = getRowFromButton(this);
                    const reader = getBookObjectFromRowReaders(row);
                    setEditModeForReader(reader);
                });
            buttonCancelReader.on('click', clearFormReader);
        }

        function getBookObjectFromRowReaders(row) {
            return {
                ID: row.data('id'),
                Name: row.children('td').eq(0).text(),
                Age: row.children('td').eq(1).text(),
            }
        }

        function setEditModeForReader(reader) {
            readerFormElement.data('id', reader.ID);
            inputNameElement.val(reader.Name);
            inputAgeElement.val(reader.Age);

            buttonAddNewReader.addClass('d-none');
            buttonEditReader.removeClass('d-none');
            buttonCancelReader.removeClass('d-none');
        }

        loadReadersToTable();
        activateDeleteButtonsReader();
        activatePostFormReader();
        activatePutFormReader();
        activateEditButtonsReader();


        // LEND
        function createLendsRow(lend) {
            return $(`<tr data-id="${lend.ID}" data-bookid="${lend.BookID}" data-readerid="${lend.ReaderID}" ">             
            <td>${lend.Title}</td>               
            <td>${lend.Name}</td>               
            <td>${lend.LendDate}</td>                      
            <td>
                <div class="button-group">
                    <button class="btn btn-primary btn-sm" id="delete2">Zwróć</button>
                </div>
            </td>
        </tr>`);
        }

        // GET
        function loadLendToTable() {
            //$.getJSON(URL)
            $.ajax(URLlends, {
                type: 'GET'
            }).done((lends) => {
                lends.forEach(lend => {
                    lendsTableBodyElement.append(createLendsRow(lend));
                })
            }).fail(standardErrorHandler)
        }

        function activateSelect() {
            booksTableBodyElement.on('click', 'button.btn-info#select', function () {
                console.log("wybrano książkę");
                const rowBook = getRowFromButton(this);
                const bookid = rowBook.data('id');
                const book = getBookObjectFromRow(rowBook);
                setCommunicate('Choose reader...');
                //const lenddate = (new Date()).toJSON();
                readersTableBodyElement.on('click', 'button.btn-info#select1', function () {
                    console.log("wybrano autora");
                    const rowReader = getRowFromButton(this);
                    const readerid = rowReader.data('id');
                    const reader = getBookObjectFromRowReaders(rowReader);
                    const today = new Date();
                    const dd = String(today.getDate()).padStart(2, '0');
                    const MM = String(today.getMonth() + 1).padStart(2, '0'); //January is 0
                    const yyyy = today.getFullYear();
                    const HH = today.getHours();
                    const mm = today.getMinutes();
                    const ss = today.getSeconds();
                    const lenddate = yyyy + "-" + MM + "-" + dd + " " + HH + ":" + mm + ":" + mm;
                    activatePostFormLend(bookid, readerid, lenddate);
                })
            })
        }

        // POST
        function activatePostFormLend(bookid, readerid, lenddate) {
            $.ajax(URLlends + '?' + "bookid=" + bookid + '&' + "readerid=" + readerid + '&' + "lenddate=" + lenddate, {
                type: 'POST'
            }).done(() => {
                const lend = getDataFromAllRow(bookid, readerid, lenddate);
                lendsTableBodyElement.append(createLendsRow(lend)); //
                setCommunicate('Well done!!');
            }).fail(standardErrorHandler);
        }

        function getDataFromAllRow(bookid, readerid, lenddate) {
            const existingBooksRow = $(`#books-table-body > tr[data-id=${bookid}]`);
            const existingReadersRow = $(`#readers-table-body > tr[data-id=${readerid}]`);
            return {
                BookID: existingBooksRow.data('id'),
                ReaderID: existingReadersRow.data('id'),
                Title: existingBooksRow.children('td').eq(0).text(),
                Name: existingReadersRow.children('td').eq(0).text(),
                LendDate: lenddate
            }
        }

        // DELETE
        function activateDeleteButtonsLend() {
            lendsTableBodyElement.on('click', 'button.btn-primary#delete2',
                function () {
                    console.log("TEST USUNIĘCIA")
                    const row = getRowFromButton(this);
                    const id = row.data('id');
                    $.ajax(URLlends + '/' + id, {
                        type: 'DELETE'
                    }).done(() => {
                        console.log(id);
                        row.remove();
                        setCommunicate('Book returned');
                    }).fail(standardErrorHandler)
                });
        }

        loadLendToTable();
        activateSelect();
        activateDeleteButtonsLend();
    }
);
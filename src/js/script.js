{
  ('use strict');

  const select = {
    templateOf: {
      bookTemplate: '#template-book'
    },
    containerOf: {
      bookList: '.books-list',
      images: '.books-list .book__image',
      filters: '.filters',
    },
  };

  const templates = {
    bookTemplate: Handlebars.compile(document.querySelector(select.templateOf.bookTemplate).innerHTML),
  };

  class BooksList {
    constructor() {
      const thisBook = this;

      thisBook.initData();
      thisBook.getElements();
      thisBook.render();
      thisBook.initActions();
      thisBook.filterBooks();
      thisBook.determineRatingBgc();
    }

    initData(){
      this.data = dataSource.books;
    }

    getElements(){
      const thisBook = this;

      thisBook.bookContainer = document.querySelector(select.containerOf.bookList);
      thisBook.booksFilter = document.querySelector(select.containerOf.filters);
    }

    render (){
      const thisBook = this;
    
      for (let book of this.data) {
        book.ratingBgc = thisBook.determineRatingBgc(book.rating);
        book.ratingWidth = book.rating * 10;

        const generatedHTML = templates.bookTemplate(book);
        const generatedDOM = utils.createDOMFromHTML(generatedHTML);
      
        thisBook.bookContainer.appendChild(generatedDOM);
      }
    }
  
    initActions() {
      const thisBook = this;

      const favoriteBooks = [];
      thisBook.filters = [];
      const booksImages = document.querySelectorAll(select.containerOf.images);

      for (let image of booksImages) {
        image.addEventListener('dblclick', function(event){
          event.preventDefault();
          if(!event.target.offsetParent.classList.contains('favorite')){
            event.target.offsetParent.classList.add('favorite');
            const bookId = image.getAttribute('data-id');
            favoriteBooks.push(bookId);
          } else {
            event.target.offsetParent.classList.remove('favorite');
            const bookId = image.getAttribute('data-id');
            const indexOfBook = favoriteBooks.indexOf(bookId);
            favoriteBooks.splice(indexOfBook, 1);
          }
    
        });
      }

      thisBook.booksFilter.addEventListener('click', function(event) {
        if(event.target.tagName === 'INPUT' && event.target.type == 'checkbox' &&  event.target.name == 'filter'){
          console.log(event.target.value);

          if(event.target.checked){
            thisBook.filters.push(event.target.value);
          } else {
            const indexOfFilteredBook = thisBook.filters.indexOf(event.target.value);
            thisBook.filters.splice(indexOfFilteredBook, 1);
          }
        }
        thisBook.filterBooks();
      });

    }

    filterBooks(){
      const thisBook = this;

      for (let book of dataSource.books) {
        let shouldBeHidden = false;
        for (const filter of thisBook.filters) {
          if(!book.details[filter]){
            shouldBeHidden = true;
            break;
          }
        }

        const idOfHiddenBook = document.querySelector(select.containerOf.images + '[data-id="' + book.id +'"]');

        if(shouldBeHidden === true){
          idOfHiddenBook.classList.add('hidden');
        } else {
          idOfHiddenBook.classList.remove('hidden');
        }
      }
    }

    determineRatingBgc(rating){
    
      if(rating < 6){
        return 'linear-gradient(to bottom,  #fefcea 0%, #f1da36 100%)';
      } else if(rating > 6 && rating <= 8){
        return 'linear-gradient(to bottom, #b4df5b 0%,#b4df5b 100%)';
      }else if(rating > 8 && rating <= 9){
        return 'linear-gradient(to bottom, #299a0b 0%, #299a0b 100%)';
      } else if(rating > 9){
        return 'linear-gradient(to bottom, #ff0084 0%,#ff0084 100%)';
      }
    }
  }

  new BooksList();}
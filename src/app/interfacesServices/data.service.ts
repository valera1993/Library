import { Injectable } from '@angular/core';
import { dataAuthors } from './dataAuthors';
import { dataArtworks } from './artworksData';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  constructor() {}
  authorSurname: string | undefined;
  dataBook: dataArtworks[] | undefined;
  max: number = 0;

  saveToLocalStorage(key: string, data: any) {
    localStorage.setItem(key, JSON.stringify(data));
  }

  getFromLocalStorage(key: string): any {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  }

  removeFromLocalStorage(key: string): void {
    localStorage.removeItem(key);
  }

  getAuthorSurname(surname: string) {
    this.authorSurname = surname;
    this.saveToLocalStorage('lastSername', this.authorSurname);
  }

  updateMax() {
    this.booksArray.forEach((elem) => {
      if (elem.id > this.max) {
        this.max = elem.id + 1;
      }
    });
    this.saveToLocalStorage('max', this.max);
    return this.max;
  }

  booksBySelectedAuthor() {
    let dataBookDuplicate;
    if (this.booksArray && this.authorSurname) {
      this.dataBook = this.booksArray.filter((elem: any) => {
        return this.authorSurname == elem.author;
      });
      dataBookDuplicate = [...this.dataBook];
    }

    if (this.authorSurname) {
      this.saveToLocalStorage(this.authorSurname, dataBookDuplicate);
      return this.getFromLocalStorage(this.authorSurname);
    }
  }

  updateBooksArray(booksArray: dataArtworks[]) {
    this.booksArray = booksArray;
  }

  updateDataBook(dataBook: dataArtworks[]) {
    this.dataBook = dataBook;
  }

  updateAuthorsArray(authorsArray: dataAuthors[]) {
    this.authorsArray = authorsArray;
    this.saveToLocalStorage('authorsArray', this.authorsArray);
  }

  authorsArray: dataAuthors[] = [
    {
      author: {
        surname: 'Тургенев',
        name: 'Иван',
        fathername: 'Сергеевич',
        birthday: new Date(1818, 10, 9),
        booklist: 0,
      },
      redact: 'Редактировать',
      delete: 'Удалить',
      description: 'Произведения',
    },
    {
      author: {
        surname: 'Шевченко',
        name: 'Тарас',
        fathername: 'Григорьевич',
        birthday: new Date(1814, 2, 9),
        booklist: 0,
      },
      redact: 'Редактировать',
      delete: 'Удалить',
      description: 'Произведения',
    },
    {
      author: {
        surname: 'Пушкин',
        name: 'Александр',
        fathername: 'Сергеевич',
        birthday: new Date(1799, 5, 6),
        booklist: 0,
      },
      redact: 'Редактировать',
      delete: 'Удалить',
      description: 'Произведения',
    },
  ];
  booksArray: dataArtworks[] = [
    {
      author: 'Пушкин',
      artworksName: 'Евгений Онегин',
      genre: 'Роман',
      pages: 206,
      redact: 'Редактировать',
      delete: 'Удалить',
      id: 1,
    },
    {
      author: 'Пушкин',
      artworksName: 'Сказка о царе Салтане',
      genre: 'Сказка',
      pages: 40,
      redact: 'Редактировать',
      delete: 'Удалить',
      id: 2,
    },
    {
      author: 'Пушкин',
      artworksName: 'Руслан и Людмила',
      genre: 'Поэма',
      pages: 264,
      redact: 'Редактировать',
      delete: 'Удалить',
      id: 3,
    },
    {
      author: 'Пушкин',
      artworksName: 'Барышня-крестьянка',
      genre: 'Повесть',
      pages: 96,
      redact: 'Редактировать',
      delete: 'Удалить',
      id: 4,
    },
    {
      author: 'Пушкин',
      artworksName: 'Капитанская дочка',
      genre: 'Роман',
      pages: 130,
      redact: 'Редактировать',
      delete: 'Удалить',
      id: 5,
    },
    {
      author: 'Тургенев',
      artworksName: 'Муму',
      genre: 'Рассказ',
      pages: 44,
      redact: 'Редактировать',
      delete: 'Удалить',
      id: 6,
    },
    {
      author: 'Тургенев',
      artworksName: 'Ася',
      genre: 'Повесть',
      pages: 64,
      redact: 'Редактировать',
      delete: 'Удалить',
      id: 7,
    },
    {
      author: 'Тургенев',
      artworksName: 'Отцы и дети',
      genre: 'Роман',
      pages: 288,
      redact: 'Редактировать',
      delete: 'Удалить',
      id: 8,
    },
    {
      author: 'Шевченко',
      artworksName: 'Тарасова ніч',
      genre: 'Поэма',
      pages: 342,
      redact: 'Редактировать',
      delete: 'Удалить',
      id: 9,
    },
    {
      author: 'Шевченко',
      artworksName: 'Катерина',
      genre: 'Поэма',
      pages: 40,
      redact: 'Редактировать',
      delete: 'Удалить',
      id: 10,
    },
    {
      author: 'Шевченко',
      artworksName: 'Наймичка',
      genre: 'Повесть',
      pages: 64,
      redact: 'Редактировать',
      delete: 'Удалить',
      id: 11,
    },
  ];

  genres: string[] = ['Роман', 'Сказка', 'Поэма', 'Повесть', 'Рассказ'];

  getBooks(booksArray: dataArtworks[]) {
    const current: any = {};
    for (const elem of booksArray) {
      const author = elem.author;
      current[author] = current[author] ? current[author] + 1 : 1;
    }
    return current;
  }

  addBooks(arr: dataAuthors[], obj: any) {
    arr.filter((elem: any) => {
      for (const author in obj) {
        if (elem.author.surname == author) {
          elem.author.booklist = obj[author];
          this.saveToLocalStorage(elem.author.surname, obj[author]);
          elem.author.booklist = Number(
            this.getFromLocalStorage(elem.author.surname)
          );
        }
      }
    });
    return arr;
  }
}

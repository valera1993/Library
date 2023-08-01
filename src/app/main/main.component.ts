import { Component, OnInit } from '@angular/core';
import { DataService } from '../interfacesServices/data.service';
import { dataAuthors } from '../interfacesServices/dataAuthors';
import { dataArtworks } from '../interfacesServices/artworksData';
import { redactAuthors } from '../interfacesServices/redactAuthors';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css'],
})
export class MainComponent implements OnInit {
  constructor(private dataServ: DataService) {}

  authors: dataAuthors[] = [];
  newAuthor: dataAuthors | undefined;
  authorsDuplicate: dataAuthors[] | undefined;
  booksArray: dataArtworks[] | undefined;
  newBookItem: dataArtworks | undefined;
  flag: boolean = false;
  newAuthorFlag: boolean = false;
  form: redactAuthors[] | undefined;
  lastSurname: string | undefined;
  maxDate: string | undefined;
  newBirthday: string | undefined;
  result: any;

  getCurrentDate(): string {
    const currentDate = new Date();
    const day = this.formatNumber(currentDate.getDate());
    const month = this.formatNumber(currentDate.getMonth() + 1);
    const year = currentDate.getFullYear();
    return `${year}-${month}-${day}`;
  }

  private formatNumber(num: number): string {
    return num < 10 ? '0' + num : num.toString();
  }

  getAuthorSurname(surname: dataAuthors) {
    this.dataServ.getAuthorSurname(surname.author.surname);
  }

  createNewAuthor(surname: any, name: any, fathername: any) {
    if (this.newBirthday) {
      let date = new Date(this.newBirthday);
      this.newAuthor = {
        author: {
          surname: surname,
          name: name,
          fathername: fathername,
          birthday: date,
          booklist: 0,
        },
        redact: 'Редактировать',
        delete: 'Удалить',
        description: 'Произведения',
      };
      this.authors?.push(this.newAuthor);

      this.authorsDuplicate?.push(this.newAuthor);
      this.newAuthorFlag = false;
      this.dataServ.updateAuthorsArray(this.authorsDuplicate!);
      this.dataServ.saveToLocalStorage('authors', this.authors);
      this.dataServ.saveToLocalStorage('booksArray', this.booksArray);
    }
  }

  closeForm() {
    this.flag = false;
    this.newAuthorFlag = false;
  }

  addAuthor() {
    this.newAuthorFlag = true;
    this.flag = false;
  }

  sortByName(key: string) {
    if (this.authorsDuplicate) {
      this.authorsDuplicate.sort((a, b) =>
        a.author[key] > b.author[key] ? 1 : -1
      );
    }
  }

  sortByBooks(key: string) {
    if (this.authorsDuplicate) {
      this.authorsDuplicate.sort((a, b) =>
        a.author[key] < b.author[key] ? 1 : -1
      );
    }
  }

  redactAuthor(author: dataAuthors) {
    this.flag = true;
    this.newAuthorFlag = false;
    let date = new Date(author.author.birthday).toLocaleDateString();
    this.lastSurname = author.author.surname;
    this.form = [
      {
        name: author.author.name,
        surname: author.author.surname,
        fathername: author.author.fathername,
        birthday: date,
        object: author,
      },
    ];
  }

  getNewbirthday(birthday: string) {
    this.newBirthday = birthday;
  }

  onFormSubmit(elem: any) {
    if (this.newBirthday) {
      let date = new Date(this.newBirthday);
      if (this.form) {
        const author = this.form[0].object.author;
        author.name = elem.name;
        author.surname = elem.surname;
        author.fathername = elem.fathername;
        author.birthday = date;
        this.flag = false;
      }
      this.booksArray?.forEach((item: any) => {
        if (item.author == this.lastSurname) item.author = elem.surname;
      });
      this.dataServ.updateAuthorsArray(this.authorsDuplicate!);
    }
  }

  deleteAuthor(author: dataAuthors) {
    if (this.flag || this.newAuthorFlag) {
      alert('Сейчас выполняется другое действие.');
      return;
    }
    let conf = confirm('Все данные об авторе будут удалены.');
    if (conf) {
      if (this.authorsDuplicate) {
        const index = this.authorsDuplicate.indexOf(author);
        if (index !== -1) {
          this.authorsDuplicate.splice(index, 1);
        }
        this.dataServ.updateAuthorsArray(this.authorsDuplicate);
      }
    }
    if (this.booksArray) {
      this.booksArray = this.booksArray.filter((elem: any) => {
        return author.author.surname !== elem.author;
      });
      this.dataServ.updateBooksArray(this.booksArray);
    }
  }

  ngOnInit(): void {
    this.booksArray = this.dataServ.booksArray;
    if (localStorage.getItem('booksArray')) {
      this.booksArray = this.dataServ.getFromLocalStorage('booksArray');
      this.dataServ.updateBooksArray(this.booksArray!);
    }
    this.result = this.dataServ.getBooks(this.booksArray!);
    this.dataServ.addBooks(this.authors, this.result);
    this.authors = this.dataServ.authorsArray;
    this.dataServ.saveToLocalStorage('authors', this.authors);
    if (localStorage.getItem('authors')) {
      this.authors = this.dataServ.getFromLocalStorage('authors');
      this.dataServ.addBooks(this.authors, this.result);
    }

    this.maxDate = this.getCurrentDate();
    this.authorsDuplicate = [...this.authors];
    if (localStorage.getItem('authorsArray')) {
      this.authorsDuplicate = this.dataServ.getFromLocalStorage('authorsArray');
    }
    this.dataServ.removeFromLocalStorage('dataBook');

    this.authorsDuplicate?.forEach((elem: any) => {
      for (let item in this.result) {
        if (elem.author.surname == item)
          elem.author.booklist = this.result[item];
      }
    });
  }
}

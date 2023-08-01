import { Component, OnInit } from '@angular/core';
import { DataService } from '../interfacesServices/data.service';
import { dataArtworks } from '../interfacesServices/artworksData';
import { artWorks } from '../interfacesServices/redactArtworks';

@Component({
  selector: 'app-creation',
  templateUrl: './creation.component.html',
  styleUrls: ['./creation.component.css'],
})
export class CreationComponent implements OnInit {
  constructor(private dataServ: DataService) {}
  dataBook: dataArtworks[] | undefined;
  newCreation: dataArtworks | undefined;
  booksArray: dataArtworks[] | undefined;
  genres: string[] = [];
  redactForm: artWorks[] | undefined;
  flag: boolean = false;
  redactFormFlag: boolean = false;
  addCreationFlag: boolean = false;
  max: number = 0;
  surname: string = '';

  checkGenreValidity(genreValue: string) {
    if (this.genres && !this.genres.includes(genreValue)) {
      alert(
        'Указанного Вами жанра нет в списке. Измените жанр или перейдите во вкладку "Все произведения", чтобы добавить жанр.'
      );
    }
    return this.genres?.includes(genreValue);
  }

  redactCreation(creation: dataArtworks) {
    this.redactFormFlag = true;
    this.addCreationFlag = false;
    this.redactForm = [
      {
        artworksName: creation.artworksName,
        pages: creation.pages,
        genre: creation.genre,
        id: creation.id,
      },
    ];
  }

  onFormSubmit(elem: any) {
    if (this.dataBook) {
      this.dataBook.forEach((item: dataArtworks) => {
        if (item.id == elem.id) {
          item.artworksName = elem.artworksName;
          item.genre = elem.genre;
          item.pages = elem.pages;
        }
        this.dataServ.saveToLocalStorage(this.surname, this.dataBook);
      });
      if (this.booksArray) {
        this.booksArray.forEach((bookElem: any) => {
          if (elem.id == bookElem.id) {
            bookElem.artworksName = elem.artworksName;
            bookElem.genre = elem.genre;
            bookElem.pages = elem.pages;
          }
          this.dataServ.saveToLocalStorage('booksArray', this.booksArray);
        });
      }

      this.dataServ.updateDataBook(this.dataBook);
    }
    this.redactFormFlag = false;
  }

  sortByName(key: string) {
    if (this.dataBook) {
      this.dataBook.sort((a, b) => (a[key] > b[key] ? 1 : -1));
    }
  }

  sortByGenre(key: string) {
    if (this.dataBook) {
      this.dataBook.sort((a, b) => (a[key] > b[key] ? 1 : -1));
    }
  }

  deleteCreation(creation: dataArtworks) {
    if (this.addCreationFlag || this.redactFormFlag) {
      alert('Сейчас выполняется другое действие.');
      return;
    }
    let conf = confirm('Вы хотите удалить произведение?');
    if (conf) {
      if (this.dataBook) {
        const index = this.dataBook.indexOf(creation);

        if (index !== -1) {
          this.dataBook.splice(index, 1);
        }
      }
      if (this.booksArray) {
        this.booksArray.forEach((elem: any, index: number) => {
          if (creation.id == elem.id) {
            this.booksArray!.splice(index, 1);
          }
        });
      }

      this.dataServ.saveToLocalStorage('booksArray', this.booksArray);
      this.dataServ.saveToLocalStorage(this.surname, this.dataBook);
    }
  }

  openCreationForm() {
    this.addCreationFlag = true;
    this.redactFormFlag = false;
  }

  addCreation(artworksName: string, genre: string, pages: any) {
    if (this.genres?.indexOf(genre) == -1) {
      alert(
        'Указанного Вами жанра нет в списке. Измените жанр или перейдите во вкладку "Все произведения", чтобы добавить жанр.'
      );
      return;
    }

    if (this.dataBook && this.booksArray) {
      this.max += 1;
      this.newCreation = {
        author: this.surname,
        artworksName: artworksName,
        genre: genre,
        pages: pages,
        redact: 'Редактировать',
        delete: 'Удалить',
        id: this.max,
      };

      this.booksArray.push(this.newCreation);
      this.dataBook.push(this.newCreation);

      this.dataServ.saveToLocalStorage('booksArray', this.booksArray);
      this.dataServ.saveToLocalStorage(this.surname, this.dataBook);
    }
    this.addCreationFlag = false;
    this.flag = false;

    this.dataBook = this.dataServ.getFromLocalStorage(this.surname);
  }

  closeForm() {
    this.redactFormFlag = false;
    this.addCreationFlag = false;
  }

  ngOnInit(): void {
    this.max = this.dataServ.updateMax();
    this.genres = this.dataServ.genres;
    if (localStorage.getItem('genres')) {
      this.genres = this.dataServ.getFromLocalStorage('genres');
    }
    this.booksArray = this.dataServ.booksArray;
    if (localStorage.getItem('booksArray')) {
      this.dataServ.updateBooksArray(this.booksArray);
      this.booksArray = this.dataServ.getFromLocalStorage('booksArray');
    }

    this.dataBook = this.dataServ.booksBySelectedAuthor();
    if (this.dataBook?.length == 0) {
      this.flag = true;
    }

    this.surname = this.dataServ.getFromLocalStorage('lastSername');

    if (this.surname) {
      this.dataBook = this.dataServ.getFromLocalStorage(this.surname);
    } else if (this.dataBook) {
      this.dataServ.saveToLocalStorage(this.surname, this.dataBook);
    }
  }
}

import { Component, OnInit } from '@angular/core';
import { DataService } from '../interfacesServices/data.service';
import { dataArtworks } from '../interfacesServices/artworksData';
import { artWorks } from '../interfacesServices/redactArtworks';

@Component({
  selector: 'app-genres',
  templateUrl: './genres.component.html',
  styleUrls: ['./genres.component.css'],
})
export class GenresComponent implements OnInit {
  constructor(private dataServ: DataService) {}

  booksArray: dataArtworks[] = [];
  booksArrayDuplicate: dataArtworks[] = [];
  redactForm: artWorks[] | undefined;
  flag: boolean = false;
  redactFormFlag: boolean = false;
  addCreationFlag: boolean = false;
  genres: string[] = [];
  genreInput: string = '';

  checkGenreValidity(genreValue: string) {
    if (this.genres && !this.genres.includes(genreValue)) {
      let conf = confirm(
        'Указанного Вами жанра нет в списке. Хотите добавить?'
      );
      if (conf) {
        this.genres.push(genreValue);
      }
    }
    return this.genres?.includes(genreValue);
  }

  addNewGenre(genre: string) {
    if (this.genres) {
      if (genre.length === 0 || this.genres?.indexOf(genre) !== -1) return;
      this.genres.push(genre);
      alert('Жанр "' + genre + '" успешно добавлен.');
      this.genreInput = '';
      this.dataServ.saveToLocalStorage('genres', this.genres);
    }
  }

  redactCreation(creation: dataArtworks) {
    this.redactFormFlag = true;
    this.addCreationFlag = false;
    this.redactForm = [
      {
        author: creation.author,
        artworksName: creation.artworksName,
        pages: creation.pages,
        genre: creation.genre,
        id: creation.id,
      },
    ];
  }

  onFormSubmit(elem: any) {
    if (this.genres?.indexOf(elem.genre) == -1) {
      let conf = confirm(
        'Указанного Вами жанра нет в списке. Хотите добавить?'
      );
      if (conf) {
        this.genres.push(elem.genre);
      }
    }
    if (this.booksArrayDuplicate) {
      this.booksArrayDuplicate.forEach((item: any) => {
        if (item.id == elem.id) {
          item.artworksName = elem.artworksName;
          item.genre = elem.genre;
          item.pages = elem.pages;
        }
      });
    }
    this.dataServ.saveToLocalStorage('booksArray', this.booksArrayDuplicate);
    this.redactFormFlag = false;
  }

  deleteBook(genre: dataArtworks) {
    if (this.redactFormFlag) {
      alert('Сейчас выполняется другое действие.');
      return;
    }

    let conf = confirm('Вы хотите удалить произведение?');
    if (conf) {
      if (this.booksArrayDuplicate) {
        const index = this.booksArrayDuplicate.indexOf(genre);
        if (index !== -1) {
          this.booksArrayDuplicate.splice(index, 1);
        }
      }
      if (this.booksArray) {
        const index = this.booksArray.indexOf(genre);

        if (index !== -1) {
          this.booksArray.splice(index, 1);
        }
        this.dataServ.saveToLocalStorage(
          'booksArray',
          this.booksArrayDuplicate
        );
      }
    }
  }

  lookingArtwork(search: string) {
    this.booksArrayDuplicate = [];
    this.booksArray.forEach((elem: any) => {
      let author = elem.author.slice(0, search.length);
      let artworksName = elem.artworksName.slice(0, search.length);
      let genre = elem.genre.slice(0, search.length);
      if (author == search || artworksName == search || genre == search) {
        this.booksArrayDuplicate.push(elem);
      }
    });

    if (search.length == 0) {
      this.booksArrayDuplicate = [...this.booksArray];
    }
  }

  sortByName(key: string) {
    if (this.booksArrayDuplicate) {
      this.booksArrayDuplicate.sort((a, b) => (a[key] >= b[key] ? 1 : -1));
    }
  }

  sortByAuthor(key: string) {
    if (this.booksArrayDuplicate) {
      this.booksArrayDuplicate.sort((a, b) => (a[key] >= b[key] ? 1 : -1));
    }
  }

  closeForm() {
    this.redactFormFlag = false;
    this.addCreationFlag = false;
  }

  ngOnInit(): void {
    this.genres = this.dataServ.genres;
    if (localStorage.getItem('genres')) {
      this.genres = this.dataServ.getFromLocalStorage('genres');
    }
    this.booksArray = this.dataServ.booksArray;
    if (localStorage.getItem('booksArray')) {
      this.booksArray = this.dataServ.getFromLocalStorage('booksArray');
    }
    this.booksArrayDuplicate = [...this.booksArray];
  }
}

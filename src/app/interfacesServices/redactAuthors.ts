export interface redactAuthors {
  name: string;
  surname: string;
  fathername: string;
  birthday?: any;
  object: {
    author: {
      name: string;
      surname: string;
      fathername: string;
      birthday: Date;
      booklist?: number;
      [key: string]: any;
    };
  };
}

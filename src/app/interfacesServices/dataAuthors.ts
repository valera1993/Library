export interface dataAuthors {
  key?: string;
  author: {
    name: string;
    surname: string;
    fathername: string;
    birthday: Date;
    booklist?: number;
    [key: string]: any;
  };
  redact: string;
  delete: string;
  description: string;
}

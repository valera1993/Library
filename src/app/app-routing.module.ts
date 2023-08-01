import { NgModule, createComponent } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainComponent } from './main/main.component';
import { GenresComponent } from './genres/genres.component';
import { CreationComponent } from './creation/creation.component';

const routes: Routes = [
  { path: '', component: MainComponent },
  { path: 'genres', component: GenresComponent },
  { path: 'creation', component: CreationComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}

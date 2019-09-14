import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NewHomeComponent } from './new-home.component';

const routes: Routes = [{
  path: '',
  component: NewHomeComponent,
  data : {text : 'الرئيسيه', breadcrumbs: true }
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NewHomeRoutingModule { }

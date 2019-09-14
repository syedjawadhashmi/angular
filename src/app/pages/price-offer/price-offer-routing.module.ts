import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CreatOfferComponent } from './creat-offer/creat-offer.component';
import { ShowOffersComponent } from './show-offers/show-offers.component';
import { ShowReplaysComponent } from './show-replays/show-replays.component';
import { UserGuardService } from '../../core/shared/guard/user-guard.service';

const routes: Routes = [
  { path: 'create', component: CreatOfferComponent },
  { path: 'show', component: ShowOffersComponent },
  { path: 'replays', component: ShowReplaysComponent, canActivate: [UserGuardService] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PriceOfferRoutingModule { }

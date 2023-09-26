import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HrloginPage } from './hrlogin.page';

const routes: Routes = [
  {
    path: '',
    component: HrloginPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HrloginPageRoutingModule {}

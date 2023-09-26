import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HrloginPageRoutingModule } from './hrlogin-routing.module';

import { HrloginPage } from './hrlogin.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HrloginPageRoutingModule
  ],
  declarations: [HrloginPage]
})
export class HrloginPageModule {}

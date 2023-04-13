import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { KonvajsRoutingModule } from './konvajs-routing.module';
import { MainComponent } from './pages/main/main.component';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';


@NgModule({
  declarations: [
    MainComponent,
  ],
  imports: [
    KonvajsRoutingModule,
    CommonModule,
    FormsModule,
    MatIconModule
  ]
})
export class KonvajsModule { }

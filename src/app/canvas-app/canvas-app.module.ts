import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CanvasAppRoutingModule } from './canvas-app-routing.module';
import { CanvasComponent } from './pages/canvas/canvas.component';
import { DrawComponent } from './components/draw/draw.component';


@NgModule({
  declarations: [
    CanvasComponent,
    DrawComponent
  ],
  imports: [
    CommonModule,
    CanvasAppRoutingModule,
  ]
})
export class CanvasAppModule { }

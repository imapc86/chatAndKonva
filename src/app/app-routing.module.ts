import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


const routes: Routes = [
  { 
    path: '', 
    loadChildren: () => import('./home/home.module').then(m => m.HomeModule),
    pathMatch: 'full'
  },
  { 
    path: 'konvajs-app',
    loadChildren: () => import('./konvajs/konvajs.module').then(m => m.KonvajsModule)
  },
  { 
    path: 'chat-app', 
    loadChildren: () => import('./chat/chat.module').then(m => m.ChatModule)
  },
  {
    path: 'canvas-app',
    loadChildren: () => import('./canvas-app/canvas-app.module').then(m => m.CanvasAppModule)
  },
  {
    path: '**',
    redirectTo: ''
  }
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }

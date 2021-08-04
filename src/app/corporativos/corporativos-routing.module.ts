import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListaComponent } from './lista/lista.component';
import { DetalleComponent } from './detalle/detalle.component';

const routes: Routes = [
  {
    path: '',
    component: ListaComponent,
    data: {
      title: 'Corporativos'
    }
  },
  {
    path: 'detalle/:id',
    component: DetalleComponent,
    data: {
      title: 'Detalle Corporativos'
    }
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CorporativosRoutingModule { }

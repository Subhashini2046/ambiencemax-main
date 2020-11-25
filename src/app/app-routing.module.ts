import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddDialogComponent } from './add-dialog/add-dialog.component';
import { ViewReqComponent } from './view-req/view-req.component';
import { RequestFormComponent } from './request-form/request-form.component';
import { ViewcommComponent } from './viewcomm/viewcomm.component';


const routes: Routes = [{
  path: 'dialogg/:id', component: AddDialogComponent,

},
{path: 'viewcomm' , component: ViewcommComponent},
{path: 'reqform/:id',component:RequestFormComponent}
];


@NgModule({
  imports: [RouterModule.forRoot(routes , {onSameUrlNavigation: 'reload' } ) ],
  exports: [RouterModule]
})
export class AppRoutingModule { }

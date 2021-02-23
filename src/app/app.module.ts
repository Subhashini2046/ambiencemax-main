import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginFormComponent } from './login-form/login-form.component';
import { SignupFormComponent } from './signup-form/signup-form.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { RequestFormComponent } from './request-form/request-form.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatFormFieldModule, MatSelectModule, MatTableModule, MatChipsModule ,
  MatMenuModule, MatCardModule, MatButtonModule, MatSidenavModule, MatToolbarModule, MatIconModule,
  MatListModule, MatSnackBarModule, MatPaginatorModule} from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SubmittedComponent } from './submitted/submitted.component';
import { UserDataService } from './Services/UserDataService';
import { ViewReqComponent } from './view-req/view-req.component';
import { ViewStatusComponent } from './view-status/view-status.component';
import { DoughnutChartComponent } from './doughnut-chart/doughnut-chart.component';
import { ChartsModule } from 'ng2-charts';
import { BarChartComponentComponent } from './bar-chart-component/bar-chart-component.component';
import { HttpClientModule } from '@angular/common/http';
import { AdminPanelComponent } from './admin-panel/admin-panel.component';
import { ChartRepresentComponent } from './chart-represent/chart-represent.component';
import { AddDialogComponent } from './add-dialog/add-dialog.component';
import { ViewcommComponent } from './viewcomm/viewcomm.component';
import { MatDialogModule } from '@angular/material/dialog';
import { OpenComponent } from './open/open.component';
import { CloseComponent } from './close/close.component';
import { PendingComponent } from './pending/pending.component';
import { AllRequestComponent } from './all-request/all-request.component';
import {FileUploadModule} from 'ng2-file-upload';
import { UpdateRequestFormComponent } from './update-request-form/update-request-form.component';
import {FlexLayoutModule} from '@angular/flex-layout';
import { LayoutModule } from '@angular/cdk/layout';
import { NavigationHomeComponent } from './navigation-home/navigation-home.component';
import { ApproveRequestComponent } from './approve-request/approve-request.component';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatRadioModule} from '@angular/material';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatNativeDateModule,MatInputModule} from '@angular/material';
import { MatMomentDateModule } from "@angular/material-moment-adapter";
import { CompleteComponent } from './complete/complete.component';
const appRoutes = [
  {path: 'main' ,component: DashboardComponent,
  children: [
    {path: 'dialogg/:id', component: AddDialogComponent,},
    {path: 'viewcomm/:id/:reqId' , component: ViewcommComponent},
    {path: 'reqform/:id',component:RequestFormComponent},
    {path: 'status/:id' , component: ViewStatusComponent},
    {path: 'view/:id' , component: ViewReqComponent},
    {path: 'dashboard' , component: NavigationHomeComponent},
    {path: 'request-form' , component: RequestFormComponent},
    {path: 'request-form/:id/:pnc' , component: RequestFormComponent},
    {path: 'close' , component: CloseComponent },
    {path: 'open' , component: OpenComponent},
    {path: 'update/:id' , component:  UpdateRequestFormComponent},
    {path: 'pending' , component: PendingComponent},
    {path: 'allRequest' , component: AllRequestComponent},
    {path: 'admin' , component: AdminPanelComponent},
    {path: 'approveRequest/:id' , component: ApproveRequestComponent},
    {path: 'complete' , component: CompleteComponent},
  ]
},
  {path: 'submitted' , component: SubmittedComponent},
  {path: '' , component: HomeComponent},
  {path: 'admin' , component: AdminPanelComponent},

];
@NgModule({
  declarations: [
    AppComponent,
    LoginFormComponent,
    SignupFormComponent,
    DashboardComponent,
    HomeComponent,
    RequestFormComponent,
    SubmittedComponent,
    ViewReqComponent,
    ViewStatusComponent,
    DoughnutChartComponent,
    BarChartComponentComponent,
    AdminPanelComponent,
    ChartRepresentComponent,
    AddDialogComponent,
    ViewcommComponent,
    OpenComponent,
    CloseComponent,
    PendingComponent,
    AllRequestComponent,
    UpdateRequestFormComponent,
    NavigationHomeComponent,
    ApproveRequestComponent,
    CompleteComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    RouterModule.forRoot(appRoutes , {onSameUrlNavigation: 'reload'}),
    BrowserAnimationsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatTableModule,
    MatChipsModule,
    FormsModule,
    MatMenuModule,
    MatCardModule,
    MatButtonModule,
    MatSidenavModule,
    MatToolbarModule,
    MatIconModule,
    MatListModule,
    ChartsModule,
    MatSnackBarModule,
    MatPaginatorModule,
    HttpClientModule,
    ReactiveFormsModule,
    MatDialogModule,
    FileUploadModule,
    FlexLayoutModule,
    LayoutModule,
    MatCheckboxModule,
    MatRadioModule,
    MatDatepickerModule,
    MatNativeDateModule, 
    MatMomentDateModule,
    MatInputModule
  ],
  providers: [ UserDataService],
  bootstrap: [AppComponent]
})
export class AppModule { }

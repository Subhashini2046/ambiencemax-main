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
import { RequestTableComponent } from './request-table/request-table.component';
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

const appRoutes = [
  {path: 'dashboard' , component: DashboardComponent},
  {path: 'submitted' , component: SubmittedComponent},
  {path: '' , component: HomeComponent},
  {path: 'dashboard/request-form' , component: RequestFormComponent},
  {path: 'dashboard/view' , component: ViewReqComponent},
  {path: 'dashboard/status' , component: ViewStatusComponent},
  {path: 'admin' , component: AdminPanelComponent},

  {path: 'dashboard/pending' , component: PendingComponent},
  {path: 'dashboard/pending/status' , component: ViewStatusComponent},
  {path: 'dashboard/pending/view' , component: ViewReqComponent},

  {path: 'dashboard/open' , component: OpenComponent},
  {path: 'dashboard/open/status' , component: ViewStatusComponent},
  {path: 'dashboard/open/view' , component: ViewReqComponent},

  {path: 'dashboard/close' , component: CloseComponent},
  {path: 'dashboard/close/status' , component: ViewStatusComponent},
  {path: 'dashboard/close/view' , component: ViewReqComponent},

  {path: 'dashboard/all' , component: AllRequestComponent},
  {path: 'dashboard/all/status' , component:  AllRequestComponent},
  {path: 'dashboard/all/view' , component:  AllRequestComponent}
];
@NgModule({
  declarations: [
    AppComponent,
    LoginFormComponent,
    SignupFormComponent,
    DashboardComponent,
    HomeComponent,
    RequestFormComponent,
    RequestTableComponent,
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
    MatDialogModule
  ],
  providers: [ UserDataService],
  bootstrap: [AppComponent]
})
export class AppModule { }

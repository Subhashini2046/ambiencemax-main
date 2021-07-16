import { BrowserModule } from '@angular/platform-browser';
import { NgModule} from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginFormComponent } from './login-form/login-form.component';
import { SignupFormComponent } from './signup-form/signup-form.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { RouterModule} from '@angular/router';
import { HomeComponent } from './home/home.component';
import { RequestFormComponent } from './request-form/request-form.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatFormFieldModule, MatSelectModule, MatTableModule, MatChipsModule ,
  MatMenuModule, MatCardModule, MatButtonModule, MatSidenavModule, MatToolbarModule, MatIconModule,
  MatListModule, MatSnackBarModule, MatPaginatorModule,MatRadioModule,MatNativeDateModule,MatInputModule,MatSortModule} from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {MatTabsModule} from '@angular/material/tabs';
import { UserDataService } from './Services/UserDataService';
import{AuthGuardService} from './Services/AuthGuardService';
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
import { OpenComponent } from './open/open.component';
import { CloseComponent } from './close/close.component';
import { PendingComponent } from './pending/pending.component';
import { AllRequestComponent } from './all-request/all-request.component';
import {FileUploadModule} from 'ng2-file-upload';
import {FlexLayoutModule} from '@angular/flex-layout';
import { LayoutModule } from '@angular/cdk/layout';
import { NavigationHomeComponent } from './navigation-home/navigation-home.component';
import { ApproveRequestComponent } from './approve-request/approve-request.component';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { MatMomentDateModule } from "@angular/material-moment-adapter";
import { CompleteComponent } from './complete/complete.component';
import {MatBadgeModule} from '@angular/material/badge';
import  { MatDialogModule } from '@angular/material/dialog'; 
import { WorkflowDialogComponent } from './workflow-dialog/workflow-dialog.component';
import { AddWorkflowDialogComponent } from './add-workflow-dialog/add-workflow-dialog.component';
import { environment } from 'src/environments/environment';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import {AuthenticationGuard} from './authentication.guard';
import { RaiseRequestComponent } from './raise-request/raise-request.component';
import { DraftRequestComponent } from './draft-request/draft-request.component';
import { SpoceDetailsComponent } from './spoce-details/spoce-details.component';
import { CancelReqComponent } from './cancel-req/cancel-req.component';
import { RequestTabComponent } from './request-tab/request-tab.component';
import { ViewRequestTabComponent } from './view-request-tab/view-request-tab.component';
const appRoutes = [
  {path: 'AmbienceMax' ,component: DashboardComponent,canActivate:[AuthenticationGuard],
  children: [
    {path: 'dialogg/:id/:pnc/:space/:roleId', component: AddDialogComponent,},
    {path: 'viewcomm/:id/:reqId/:pnc/:space/:roleId' , component: ViewcommComponent},
    {path: 'reqform/:id',component:RequestFormComponent},
    {path: 'status/:id' , component: ViewStatusComponent},
    {path: 'view/:id' , component: ViewReqComponent},
    {path: 'dashboard' , component: NavigationHomeComponent},
    {path: 'request-form' , component: RequestFormComponent},
    {path: 'raiseRequest' , component: RaiseRequestComponent},
    {path: 'request-form/:id/:pnc' , component: RequestFormComponent},
    {path: 'close' , component: CloseComponent },
    {path: 'open' , component: OpenComponent},
    {path: 'pending' , component: PendingComponent},
    {path: 'allRequest' , component: AllRequestComponent},
    {path: 'admin/:userId' , component: AdminPanelComponent},
    {path: 'approveRequest/:id/:space/:roleId' , component: ApproveRequestComponent},
    {path: 'complete' , component: CompleteComponent},
    {path:'draftRequest',component:DraftRequestComponent},
    {path: 'raiseRequest/:id' , component: RaiseRequestComponent},
    {path: 'requestDetail/:id/:pnc/:space/:roleId' , component: RequestTabComponent},
    {path: 'viewRequest/:id' , component: ViewRequestTabComponent}
  ]
},
{ path: '', redirectTo: "/login", pathMatch: 'full' },  
  {path:'login',component: HomeComponent},
];
@NgModule(
  {
  declarations: [
    AppComponent,
    LoginFormComponent,
    SignupFormComponent,
    DashboardComponent,
    HomeComponent,
    RequestFormComponent,
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
    NavigationHomeComponent,
    ApproveRequestComponent,
    CompleteComponent,
    WorkflowDialogComponent,
    AddWorkflowDialogComponent,
    RaiseRequestComponent,
    DraftRequestComponent,
    SpoceDetailsComponent,
    CancelReqComponent,
    RequestTabComponent,
    ViewRequestTabComponent,
  ],
  entryComponents: [CancelReqComponent,WorkflowDialogComponent,AddWorkflowDialogComponent,SpoceDetailsComponent],
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
    MatInputModule,
    MatBadgeModule,
    NgxMatSelectSearchModule,
    MatSortModule,
    MatTabsModule,
  ],
  providers: [ UserDataService,AuthGuardService,
  {provide:'AMBI_API_URL',useValue:environment.url}],
  bootstrap: [AppComponent]
})
export class AppModule { }

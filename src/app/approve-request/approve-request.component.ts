import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatTableDataSource } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { UserDataService } from '../Services/UserDataService';
import { ActivatedRoute, Router } from '@angular/router';
export interface vendor {
  asvendorId: number;
  vendorName: string;
  taggedCount: number;
  alloccatedCount: number;

}
@Component({
  selector: 'app-approve-request',
  templateUrl: './approve-request.component.html',
  styleUrls: ['./approve-request.component.css']
})
export class ApproveRequestComponent implements OnInit {
  // public vendorCategory:vendorcategories;
  public vendorCategory: any[] = [];
  constructor(private route: Router, private actrouter: ActivatedRoute, private http: HttpClient, public userDataService: UserDataService) { }
  vendCategoryId: number;
  displayedColumns: string[] = ['select', 'position', 'name', 'weight'];
  dataSource = new MatTableDataSource<vendor>();
  selection = new SelectionModel<vendor>(true, []);
  requestComment = "";
  vendorList: any[] = [];
  req_id: number;
  role_id;
  user_id;
  admin_access_id;
  user_name;
  me_type;
  ngOnInit() {
    this.actrouter.params.subscribe(params => {
      this.req_id = +params['id'];
    });
    this.role_id = JSON.parse(localStorage.getItem('role_id'));
    this.user_id = JSON.parse(localStorage.getItem('userId'));
    this.user_name = JSON.parse(localStorage.getItem('user_name'));
    this.admin_access_id = JSON.parse(localStorage.getItem('admin_access_id'));
    this.http.get<any>('http://localhost:3000/vendorcategories').subscribe((res) => {
      this.vendorCategory = res;
      console.log("ddd", this.vendorCategory);

    });
  }
  ngAfterContentInit() {
    // console.log(this.selectedValue);
    console.log(this.selection.selected);
  }
  onChanged(event: any) {
    console.log(event, this.vendCategoryId);
    this.selection.clear();
    this.userDataService.getVendorDetails(this.vendCategoryId).subscribe((res) => {
      console.log("ddd", res);
      this.dataSource.data = res;
    });
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }
  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.selection.selected.length = 3;
    this.dataSource.data.forEach(row => this.selection.select(row));
    //console.log("mg",this.selection.selected.keys);
  }
  call() {
    console.log(this.selection.selected);
  }

  onSubmit() {


    if (this.role_id == 5) {
      for (let i = 0; i < this.selection.selected.length; i++) {
        this.vendorList[i] = (this.selection.selected[i]["vendorId"]);
      }
      this.userDataService.addVendors(this.vendorList, this.req_id, this.requestComment, this.admin_access_id, this.user_name).subscribe((ResData) => {
        console.log(ResData);
      })
      console.log("......", this.vendorList);
    } else
      this.userDataService.approveRequest(this.requestComment, this.req_id, this.user_id, this.admin_access_id, this.user_name).subscribe((ResData) => {
        console.log("Successfully Inserted");
      });

    this.route.navigate(['/AmbienceMax/open']);
  }
}

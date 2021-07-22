import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatTableDataSource } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { UserDataService } from '../Services/UserDataService';
import { ActivatedRoute, Router } from '@angular/router';
export interface Vendor {
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
  public vendorCategory: any[] = [];
  constructor(private route: Router, private actrouter: ActivatedRoute, private http: HttpClient, public userDataService: UserDataService) { }
  vendCategoryId: number;
  displayedColumns: string[] = ['select', 'position', 'name', 'weight'];
  dataSource = new MatTableDataSource<Vendor>();
  selection = new SelectionModel<Vendor>(true, []);
  requestComment = "";
  vendorList: any[] = [];
  req_id: number;
  role_id;
  user_id;
  admin_access_id;
  user_name;
  me_type;
  isLoading = false;
  space;
  ngOnInit() {
    this.actrouter.params.subscribe(params => {
      this.req_id = +params['id'];
      this.space=params['space'];
      this.role_id=params['roleId'];
    });
   // this.role_id = JSON.parse(localStorage.getItem('role_id'));
    this.user_id = JSON.parse(localStorage.getItem('userId'));
    this.user_name = JSON.parse(localStorage.getItem('user_name'));
   // this.admin_access_id = JSON.parse(localStorage.getItem('admin_access_id'));

    //get vendor Category
    if (this.role_id == 5) {
      this.getVendorCategory();
    }
  }
  getVendorCategory() {
    this.http.get<any>(this.userDataService.URL + 'vendorcategories').subscribe((res) => {
      this.vendorCategory = res;
    });
  }
  vendorID = []
  ngAfterContentInit() {
    //get request comment
    if (this.role_id == 5) {

      //get vendorId
      this.userDataService.getVendor(this.req_id).subscribe((res) => {
        for (let i = 0; i < res.vendorsId.length; i++) {
          this.vendorID.push(res.vendorsId[i].vendorId);
        }
        this.vendCategoryId = res.result[0].pickRumpVendorCategoriesPK;
        if (this.vendCategoryId != null) {

          this.userDataService.getVendorDetails(this.vendCategoryId).subscribe((resData) => {
            this.dataSource.data = resData;
            this.dataSource.data.forEach(data => {
              this.vendorID.forEach(id => {
                if (id == data['vendorId']) {
                  this.selection.toggle(data);
                }
              })
            })
          });
        }
      });
    }
  }

  //get vendor details when click on vendor Category
  onChanged(event: any) {

    this.selection.clear();
    this.userDataService.getVendorDetails(this.vendCategoryId).subscribe((res) => {
      this.dataSource.data = res;
    });
  }

  onSubmit() {
    this.isLoading = true;
    if (this.role_id == 5) {

      console.log("fff");
      for (let i = 0; i < this.selection.selected.length; i++) {
        this.vendorList[i] = (this.selection.selected[i]["vendorId"]);
      }
      this.userDataService.addVendors(this.vendorList, this.req_id, this.requestComment, this.space,this.role_id, this.user_name).subscribe((ResData) => {
        this.route.navigate(['/AmbienceMax/open']);
      })

    } else
      this.userDataService.approveRequest(this.requestComment, this.req_id, this.user_id,this.space,this.role_id, this.user_name).subscribe((ResData) => {
        this.route.navigate(['/AmbienceMax/open']);
        console.log("Successfully Inserted");
      });
  }

}

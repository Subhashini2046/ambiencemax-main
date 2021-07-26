
import { Component, OnInit, ViewChild } from '@angular/core';
import { UserDataService } from '../Services/UserDataService';
import { Location } from '@angular/common';
import { MatTableDataSource, MatSort } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer, SafeUrl } from "@angular/platform-browser";
import * as moment from 'moment';
@Component({

  selector: 'app-view-status',
  templateUrl: './view-status.component.html',
  styleUrls: ['./view-status.component.css']
})


export class ViewStatusComponent implements OnInit {
  req_id: any;
  view_id = null;
  view_name = null;
  view_status = null;
  public viewStatus: Views;
  public viewStatus1: Views[] = [];
  displayedColumns: string[] = ['imageUrl', 'aaction_taken_by', 'req_action', 'req_date', 'req_time', 'processingTime'];
  displayedColumns1: string[] = ['progress', 'name'];
  dataSource = new MatTableDataSource();
  dataSource1 = new MatTableDataSource();
  members;
  public userId;
  w_flow: any[] = [];
  role: any[] = [];
  req_level;
  reqStatus;
  initiator;
  is_pnc;
  public image_url = null;
  isImageLoading: boolean;
  imageToShow: any;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(private sanitizer: DomSanitizer, private actrouter: ActivatedRoute, public UsrDataService: UserDataService, private _location: Location) {
  }

  backClicked() {
    this._location.back();
  }
  space
  imgurl = "../assets/Logo.svg";
  index = 0;
  imgdata: any;
  ngOnInit() {

    this.actrouter.params.subscribe(params => {
      this.req_id = +params['id'];
      this.is_pnc = params['pnc'];
    });
    //get reuqest log and request status
    this.UsrDataService.getViewRequestStatus(this.req_id, this.is_pnc).subscribe((res => {
      this.dataSource.data = res.reqLog;

      for (let i = 0; i < this.dataSource.data.length; i++) {
        if (i == 0) {
          this.dataSource.data[0]['RUMPRequestProcessingTime'] = "Started";
        } else {
          this.dataSource.data[i]['RUMPRequestProcessingTime'] = this.getProceesingTime(this.dataSource.data[i - 1]['RequestActionDate'], this.dataSource.data[i]['RequestActionDate']);
        }
      }
      this.dataSource1.data = res.approval_status;
      for (let i = 0; i < res.reqLog.length; i++) {
        this.UsrDataService.getImage(this.dataSource.data[i]['admPhotoURL']).subscribe(data => {
          let reader = new FileReader();
          reader.addEventListener("load", () => {
            this.imageToShow = reader.result;
            this.dataSource.data[i]['admPhotoURL'] = this.imageToShow;
          }, false);
          if (data) {
            reader.readAsDataURL(data);
          }
        });
      }
    }));
  }

  getProceesingTime(previousActionTime, currTime) {
    let diffInDays = Math.abs(moment(previousActionTime, "YYYY-MM-DD HH:mm:ss").diff(moment(currTime, "YYYY-MM-DD HH:mm:ss"), 'days'));
    var d = moment.duration(moment(previousActionTime, "YYYY-MM-DD HH:mm:ss").diff(moment(currTime, "YYYY-MM-DD HH:mm:ss")));
    var proTime = diffInDays + ' days ' + Math.abs(d.hours()) + ' hours ' + Math.abs(d.minutes()) + ' minutes ' + Math.abs(d.seconds()) + ' seconds';
    return proTime;
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }
  createImageFromBlob(image: Blob) {
    let reader = new FileReader();
    reader.addEventListener("load", () => {
      this.imageToShow = reader.result;
      this.dataSource.data[this.index]['admPhotoURL'] = this.imageToShow;
    }, false);
    if (image) {
      reader.readAsDataURL(image);
    }
  }

  getImageFromService(imageUrl) {
    this.isImageLoading = true;
    this.UsrDataService.getImage(imageUrl).subscribe(data => {
      this.createImageFromBlob(data);
      this.isImageLoading = false;
    }, error => {
      this.isImageLoading = false;
    });
  }
}
export interface Views {
  id: number;
  name: string;
  status: string;
}

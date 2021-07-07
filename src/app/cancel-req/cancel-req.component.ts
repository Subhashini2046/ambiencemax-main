import { Component, OnInit,Inject } from '@angular/core';
import { UserDataService } from '../Services/UserDataService';
import { MatTableDataSource, MatPaginator, MatSort,MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-cancel-req',
  templateUrl: './cancel-req.component.html',
  styleUrls: ['./cancel-req.component.css']
})
export class CancelReqComponent implements OnInit {
  title: string;
  message: string;
  constructor(public userService: UserDataService,public dialogRef: MatDialogRef<CancelReqComponent>) { 
    }

  ngOnInit() {
  }

}

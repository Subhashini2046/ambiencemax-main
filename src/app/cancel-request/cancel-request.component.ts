import { Component, OnInit,Inject } from '@angular/core';
import { UserDataService } from '../Services/UserDataService';
import { MatDialogRef, MAT_DIALOG_DATA,MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import {CancelRequestService} from './Cancel-request.service';
@Component({
  selector: 'app-cancel-request',
  templateUrl: './cancel-request.component.html',
  styleUrls: ['./cancel-request.component.css']
})
export class CancelRequestComponent implements OnInit {
  message: any;
  constructor( public cancelRequestService:CancelRequestService,public userService: UserDataService,public dialogRef: MatDialogRef<CancelRequestComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { 
    }

  ngOnInit() {
    this.cancelRequestService.getMessage().subscribe(message => {  
      this.message = message;  
  });  
}  
  }

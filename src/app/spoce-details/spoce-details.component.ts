import { Component, Inject,ViewChild} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA,MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
@Component({
  selector: 'app-spoce-details',
  templateUrl: './spoce-details.component.html',
  styleUrls: ['./spoce-details.component.css']
})
export class SpoceDetailsComponent {
  displayedColumns: string[] = ['name', 'details'];
  dataSource = new MatTableDataSource();
  spoceData:any=[];
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  constructor(public dialogRef: MatDialogRef<SpoceDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { 
      this.spoceData.push({'data':'Name:','details':data.venSpoc});
      this.spoceData.push({'data':'Email:','details':data.venSpocEmail});
      this.spoceData.push({'data':'Phone:','details':data.venSpocPhone});
      this.spoceData.push({'data':'Mobile:','details':data.venSpocMobile});
      this.spoceData.push({'data':'Address:','details':data.venSpocAddress});
      this.dataSource.data=this.spoceData;
    }


  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
}

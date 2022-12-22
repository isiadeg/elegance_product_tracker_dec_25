import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-producttables',
  templateUrl: './producttables.component.html',
  styleUrls: ['./producttables.component.css']
})
export class ProducttablesComponent implements OnInit {
pdata!:any[];
columnss!:string[];
  constructor(private route:ActivatedRoute) {}

  ngOnInit(): void {
    this.route.parent?.parent?.data.subscribe(e=>{
      this.route?.parent?.paramMap.subscribe(j=>{
        console.log(j.get('date'));
      console.log(e['getall'][0]);
      this.pdata = e['getall'][0];
      this.pdata = this.pdata.filter((e:any)=>{
        if(e?.dateBrought === j.get('date') ){
          return true;
        }else{
          return false;
        }
      })
      this.columnss = [...Object.keys(e['getall'][0][0])]
      console.log(this.columnss);
    })
    })
  }

}

import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { BehaviorSubject, map, Observable, startWith } from 'rxjs';
import * as DecoupledEditor from '../../build/ckeditor';
import { ChangeEvent } from '@ckeditor/ckeditor5-angular/ckeditor.component';
import { MyUploadAdapter } from '../uploader';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-sales',
  templateUrl: './sales.component.html',
  styleUrls: ['./sales.component.css']
})
export class SalesComponent implements OnInit {
  salesform!: FormGroup;
  productTagArray: any[] = [
    'OD1', 'OD2', 'OD3', 'OD4','OD5', 'OD6', 'OD7', 'OD8', 'OD9',
    'OD10', 'OL1', 'OL2', 'OL3', 'OHF1',
    'OHF2', 'OHF3'
  ]
  productTagObs!: Observable<any>;
  public Editor = DecoupledEditor;

  public onReady( editor:any ) {
      editor.ui.getEditableElement().parentElement.insertBefore(
          editor.ui.view.toolbar.element,
          editor.ui.getEditableElement()
      );
      editor.plugins.get( 'FileRepository' ).createUploadAdapter = ( loader:any ) => {
        return new MyUploadAdapter( loader );
    };
  }
  

  constructor(private fb: FormBuilder,
              private http: HttpClient,
              private route: ActivatedRoute,
              private snack: MatSnackBar) { }

  ngOnInit(): void {
    let returnedLaptops = this.route.snapshot.data['getall'][0];
    console.log(returnedLaptops);
    let toUseObject:any= {};
    for(let eachReturnedLaptopsWrapper of returnedLaptops){
      for (let eachReturnedLaptops in eachReturnedLaptopsWrapper){
        if(Object.keys(toUseObject).includes(eachReturnedLaptops)){
          if(toUseObject[eachReturnedLaptops].includes(eachReturnedLaptopsWrapper[eachReturnedLaptops])){

          }else{
          toUseObject[eachReturnedLaptops].push(eachReturnedLaptopsWrapper[eachReturnedLaptops]);
          }
        }else{
          toUseObject[eachReturnedLaptops] = [eachReturnedLaptopsWrapper[eachReturnedLaptops]]
        }
      }
    }
    console.log(toUseObject);
    for(let title in toUseObject){

      if(title === "tag"){
        toUseObject.tag.forEach((element:any) => {
          if(this.productTagArray.includes(element)){
  
          }else{
            this.productTagArray.push(element);
          }
        });
       console.log(this.productTagArray);
      }}
    this.salesform = this.fb.group({
      date: ['', [Validators.required]],
      productTag: ['', [Validators.required]],
      buyer:'',
      location: '',
      extraInfo: ''
    })
    this.salesform?.get('productTag')?.valueChanges.pipe(
      startWith(''),
      map(e=>{
        return this.filteri(e, this.productTagArray);
      })
    ).subscribe(r=>{
      let toemit = new BehaviorSubject<any>(0);
      this.productTagObs = toemit.asObservable();
      toemit.next(r);
    })

  }

  filteri(e:any, array:any[]):any[]{
    return array.filter(f=>{
      if(f.trim().toLowerCase().includes(e.trim().toLowerCase())){
        return true;
      }else{
        return false;
      }
    })

  }

  save(){
    this.http.post('http://localhost/elegance/api.php', 
    JSON.stringify({...this.salesform.value, 
                    mode: "createsales"}))
    .subscribe({
     next: (e:any)=>{ console.log(e);
    this.snack.open(e.message, 'close', {
      panelClass : ['bg-success', 'text-white'],
      verticalPosition: 'top',
      duration: 7000
    });
    },
     error:(error:any)=>{
      this.snack.open("An error occured", 'close', {
        panelClass : ['bg-danger', 'text-white'],
        verticalPosition: 'top',
        duration: 7000
      });


     }
    })
  }


  onChange( { editor }: ChangeEvent ) {
    const data = editor.getData();
  this.salesform?.get('extraInfo')?.setValue(data)
  }
}

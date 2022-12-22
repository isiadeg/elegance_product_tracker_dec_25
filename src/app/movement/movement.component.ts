import { ThisReceiver } from '@angular/compiler';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, TitleStrategy } from '@angular/router';
import { BehaviorSubject, map, Observable, startWith } from 'rxjs';
import * as DecoupledEditor from '../../build/ckeditor';
import { ChangeEvent } from '@ckeditor/ckeditor5-angular/ckeditor.component';
import { MyUploadAdapter } from '../uploader';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { MatSnackBar, MatSnackBarHorizontalPosition,
MatSnackBarVerticalPosition } from '@angular/material/snack-bar';

import { initializeApp } from "firebase/app";

import {ref, get, set, getDatabase,} from "firebase/database"; 
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBfYPu-SuEYKz6YVe6gcA9O_Ku2185nDVE",
  authDomain: "elegance-gadget-partner.firebaseapp.com",
  projectId: "elegance-gadget-partner",
  storageBucket: "elegance-gadget-partner.appspot.com",
  messagingSenderId: "431024818502",
  appId: "1:431024818502:web:ac770e0f0cca562e493d47"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase();


@Component({
  selector: 'app-movement',
  templateUrl: './movement.component.html',
  styleUrls: ['./movement.component.css']
})
export class MovementComponent implements OnInit {
  disablesave:boolean =  false;
  returnedmessage:any = "";
  pMovement!: FormGroup
  typeArray: any[]= ['Collect', 'Returned', 'Brought'];
  typeArrayObs?:Observable<any>;
  productType: any[] = ['Laptop', 'Charger']
  productTypeObs?: Observable<any>
  
  personName: any[] = ['Abu Uwaiz', 'Abu Faridat', 
'Engineer Ismail', 'Abu Fauziyat',
'Ola Smooth'];
personNameObs?:Observable<any>;
productTagArray:any[] =[
  'OD1', 'OD2', 'OD3', 'OD4','OD5', 'OD6', 'OD7', 'OD8', 'OD9',
  'OD10', 'OL1', 'OL2', 'OL3', 'OHF1',
  'OHF2', 'OHF3'
]
productTagArrayObs?:Observable<any>

purpose: any[] = ['Marketing', 'Repair']
purposeObs?: Observable<any>;
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
  previousPeople:any;
  
  constructor(private fb: FormBuilder,
              private http:HttpClient, 
              private mat: MatSnackBar,
              private route:ActivatedRoute,
              private dialog: MatDialog) { }

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
    this.previousPeople = this.route.snapshot.data['previousPeople'];
    console.log(this.previousPeople);
    this.previousPeople = this.previousPeople.filter((e:any)=>{
        if(!(this.personName.includes(e))){
          return true;
        }else{
          return false;
        }
    })
    this.personName = [...this.personName, ...this.previousPeople]
    this.pMovement = this.fb.group({
      movementType: '',
      date: '',
      productTag: '',
      productType: '',
      personName: '',
      purpose: '',
      extraInfo: ''
    }) 
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

    this.pMovement.get('movementType')?.valueChanges.pipe(
      startWith(''),
      map(e=>{
        return this.typeArray.filter(f=>{
          if(f.toLowerCase().trim().includes(e.toLowerCase().trim())){
            return true
          }else{return false}
        })
      })
    ).subscribe(e=>{
      let toemit = new BehaviorSubject<any>(0);
    this.typeArrayObs= toemit.asObservable()
    toemit.next(e); 
    })


    
  this.pMovement.get('productTag')?.valueChanges.pipe(
    startWith(''),
    map(e=>{
      return this.productTagArray.filter(f=>{
        if(f.toLowerCase().trim().includes(e.toLowerCase().trim())){
          return true;
        }else{
          return false;
        }})
      })
    ).subscribe(e=>{
      let toemit = new BehaviorSubject<any>(0);
      this.productTagArrayObs = toemit.asObservable();
      toemit.next(e);
    })


    this.pMovement.get('productType')?.valueChanges.pipe(
      startWith(''),
      map(e=>{
        return this.productType.filter(f=>{
          if(f.toLowerCase().trim().includes(e.toLowerCase().trim())){
            return true;
          }else{
            return false;
          }})
        })
      ).subscribe(e=>{
        let toemit = new BehaviorSubject<any>(0);
        this.productTypeObs = toemit.asObservable();
        toemit.next(e);
      })


      
    this.pMovement.get('personName')?.valueChanges.pipe(
      startWith(''),
      map(e=>{
        return this.personName.filter(f=>{
          if(f.toLowerCase().trim().includes(e.toLowerCase().trim())){
            return true;
          }else{
            return false;
          }})
        })
      ).subscribe(e=>{
        let toemit = new BehaviorSubject<any>(0);
        this.personNameObs = toemit.asObservable();
        toemit.next(e);
      })

      this.pMovement.get('purpose')?.valueChanges.pipe(
        startWith(''),
        map(e=>{
          return this.purpose.filter(f=>{
            if(f.toLowerCase().trim().includes(e.toLowerCase().trim())){
              return true;
            }else{
              return false;
            }})
          })
        ).subscribe(e=>{
          let toemit = new BehaviorSubject<any>(0);
          this.purposeObs = toemit.asObservable();
          toemit.next(e);
        })
  
  }


  save(){
    this.disablesave=true;
    console.log(this.pMovement.value);
    this.http.post('http://localhost/elegance/api.php', JSON.stringify({
      ...this.pMovement.value,
      ...{mode: 'createMovement'}
    }), /*{
      headers: new HttpHeaders({
        'Content-Type': "application/json"
      })
    }*/).subscribe({next:(e:any)=>{
      this.disablesave=false;
      this.returnedmessage = e.message;
     // console.log(e)
     this.mat.open(this.returnedmessage, 'close', {
      horizontalPosition: 'center',
      verticalPosition: 'top'

     }
      )
    },
    error:(err)=>{
      console.log(err);
      if(err.error.message === "The person who collected the laptop is not the one returning it"){
        this.dialog.open(Confirm, {
          data: {...this.pMovement.value, ...{mode: 'createMovement'}}
        })}
        else{
          this.mat.open(err?.error?.message, 'close', {
            panelClass: ["error-class"]
            
          })
        }
    }}
    )
    
  }

  closeMessage(){
    this.returnedmessage = !this.returnedmessage;
  }

  
onChange( { editor }: ChangeEvent ) {
  const data = editor.getData();
this.pMovement?.get('extraInfo')?.setValue(encodeURIComponent(data))
}
sendOnline(){
  this.disablesave=true;
  let timestamp = new Date().getTime()
  set(ref(db, "movement"+timestamp),{
  ...this.pMovement.value,
  ...{mode: 'createMovement'}
}).then((e:any)=>{
  this.mat.open(e, 'close', {
    horizontalPosition: 'center',
    verticalPosition: 'top'

   });
   this.disablesave=true;
}).catch((e:any)=>{
  this.mat.open(e, 'close', {
    horizontalPosition: 'center',
    verticalPosition: 'top',
    panelClass: ["error-class"]

   });
   this.disablesave=true;
})
}
}

@Component({
  template: `
  <mat-card>
    <mat-card-header class="d-flex align-items-center">
       <mat-card-title class="d-flex align-items-center">
        Confirm This
       </mat-card-title> 
  
    <mat-icon mat-card-sm-image class="d-flex align-items-center">key</mat-icon>
</mat-card-header>
<mat-card-content>
    <div class="m-3">
            <p>
            The person that Collected this laptop is not the one returning it
            </p>
            <p>
                Do you wish to Continue?
            </p>
    </div>

</mat-card-content>
<mat-card-actions>
    <button mat-raised-button class="bg-primary me-3 mb-3 text-light"
    (click)="continuemovement();">
        Yes, Continue
    </button>
    <button mat-raised-button class="bg-danger mb-3 text-light"
    (click)="cancelmovement()">
        No, Cancel
    </button>
</mat-card-actions>
</mat-card>

  `,
  styles: []
})
export class Confirm{
  
constructor(public thisdialog:MatDialogRef<Confirm>,
            @Inject(MAT_DIALOG_DATA) public data:any,
            private mat: MatSnackBar,
            private http: HttpClient){


}
cancelmovement(){
  console.log('cancel')
  this.thisdialog.close();
}
continuemovement(){
console.log(this.data);
this.http.post('http://localhost/elegance/api.php', JSON.stringify({
      ...this.data,
      ...{confirmed: "yes"}
    }), /*{
      headers: new HttpHeaders({
        'Content-Type': "application/json"
      })
    }*/).subscribe({next:(e:any)=>{
    
      let returnedmessage = e.message;
     // console.log(e)
     this.mat.open(returnedmessage, 'close', {
      horizontalPosition: 'center',
      verticalPosition: 'top'

     }
      );
      this.thisdialog.close()
},
error:(e:any)=>{
this.mat.open("An error occured", 'close', {
  panelClass: ["error-class"]
});
this.thisdialog.close()
}
}

)
}



}

import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { GetdataService } from '../getdata.service';
import { ActivatedRoute } from '@angular/router';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, map, Observable, of, startWith } from 'rxjs';
import{FormGroup, FormBuilder, FormArray} from "@angular/forms" ;
import { laptop } from './laptopinterface';
import { MatToolbar } from '@angular/material/toolbar';
import { MatFormField } from '@angular/material/form-field';
import { ThemePalette } from '@angular/material/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css']
})
export class IndexComponent implements OnInit {

  color:ThemePalette ="accent"
  submitting: boolean = false;
  brand?:any;
  trybs?:Observable<any[]>
  trybsNormal: any[] = []
  models?:Observable<any[]>
  modelArray?:any;
  modelsNormal:any[] = [];
  intelCores?: Observable<any>;
  coreArray?:any;
  intelCoresNormal:any[]=[];
  intelGenerations?: Observable<any>;
  generationArray?:any;
  intelGenerationsNormal:any[]=[];
  storageCapacities?: Observable<any>;
  storageArray?:any;
  storageCapacitiesNormal:any[]=[];
  rAMProcessors?: Observable<any>;
  ramArray?:any;
  ramNormal:any[]=[];
  
  @ViewChild('duplicateby') duplicateby!:ElementRef

  constructor(private getdata: GetdataService, private actroute:ActivatedRoute,
              private fb:FormBuilder,
              private http:HttpClient,
              private snack:MatSnackBar,
              private route:ActivatedRoute) { }
              laptopForm!:FormGroup;

              get collection(): FormArray{
                return this.laptopForm.get('collection') as FormArray
              }
              allformGroup!:FormGroup

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
    this.brand = [
      'Hp',
      'Dell',
      'Lenovo'
    ]
    
    this.modelArray=[
      'Lenovo Thinkpad T450s',
      'HP EliteBook Folio 9470m',
      'Dell Latitude 3340'
    ]
    this.coreArray= [
      'Core i2',
      'Core i3',
      'Core i5',
      
      'Core i7',
      'Core i9'
    ]
    this.generationArray = [
      '2nd Generation',
      '3rd Generation',
      '4th Generation',
      '5th Generation',
      '6th Generation',
      '7th Generation',
      '8th Generation',
      '9th Generation',
      '10th Generation'
    ]
    this.storageArray = [
      '128GB',
      '256GB',
      '512GB',
      '250GB',
      '320GB',
      '500GB',
      '720GB',
      '1TB'
    ]
    this.ramArray = [
      '2GB',
      '4GB',
      '6GB',
      '8GB',
      '12GB',
      '16GB',
      '20GB'
    ]
    for(let title in toUseObject){
      if(title === "brand"){
        toUseObject.brand.forEach((element:any) => {
          if(this.brand.includes(element)){

          }else{
            this.brand.push(element);
          }
        });
        //console.log(this.brand);
      }else if(title === "model"){
        toUseObject.model.forEach((element:any) => {
          if(this.modelArray.includes(element)){

          }else{
            this.modelArray.push(element);
          }
        });
       // console.log(this.modelArray);
      }else if(title === "intelCore"){
        toUseObject.intelCore.forEach((element:any) => {
          if(this.coreArray.includes(element)){

          }else{
            this.coreArray.push(element);
          }
        });
        //console.log(this.coreArray);
      }else if(title === "intelGeneration"){
        toUseObject.intelGeneration.forEach((element:any) => {
          if(this.generationArray.includes(element)){

          }else{
            this.generationArray.push(element);
          }
        });
        //console.log(this.generationArray);
      }if(title === "rAMProcessor"){
        toUseObject.rAMProcessor.forEach((element:any) => {
          if(this.ramArray.includes(element)){

          }else{
            this.ramArray.push(element);
          }
        });
        //console.log(this.ramArray);
      }else if(title === "storageCapacity"){
        toUseObject.storageCapacity.forEach((element:any) => {
          if(this.storageArray.includes(element)){

          }else{
            this.storageArray.push(element);
          }
        });
        console.log(this.storageArray);
      }

    }
   /* this.getdata.getdata().subscribe(e=>{
     console.log(e)
    },
    err=>console.log(err),
    ()=>console.log(`completed`))*/
/*this.actroute.data.subscribe(e=>{
  console.log( e instanceof HttpErrorResponse)
  if(e['resdata']['error']){
    alert(e['resdata']['statusText']);
  }else{
  console.log(e);}
}) 

*/

  this.laptopForm = this.fb.group({
    collection: this.fb.array([this.firstarray()])
  })

  this.collection.controls.forEach((e)=>{
    e?.get('brand')?.valueChanges.pipe(
        startWith(''),
        map(e=>this.filteri(e, this.brand, this.trybsNormal))
    ).subscribe(e=>{
      
      let ne = new BehaviorSubject<any>(0);
      console.log(this.trybs)
       this.trybs= ne.asObservable()
       console.log(this.trybs)
       ne.next(e);
       console.log(this.trybs)
    })


    e?.get('model')?.valueChanges.pipe(
      startWith(''),
      map(e=>this.filteri(e, this.modelArray, this.modelsNormal))
  ).subscribe(e=>{
    
    let ne = new BehaviorSubject<any>(0);
    //console.log(this.trybs)
     this.models= ne.asObservable()
     //console.log(this.trybs)
     ne.next(e);
     console.log(this.models)
  })


  e?.get('intelCore')?.valueChanges.pipe(
    startWith(''),
    map(e=>this.filteri(e, this.coreArray, this.intelCoresNormal))
).subscribe(e=>{
  
  let ne = new BehaviorSubject<any>(0);
  //console.log(this.trybs)
   this.intelCores= ne.asObservable()
   //console.log(this.trybs)
   ne.next(e);
   console.log(this.intelCores)
})



e?.get('intelGeneration')?.valueChanges.pipe(
  startWith(''),
  map(e=>this.filteri(e, this.generationArray, this.intelGenerationsNormal))
).subscribe(e=>{

let ne = new BehaviorSubject<any>(0);
//console.log(this.trybs)
 this.intelGenerations= ne.asObservable()
 //console.log(this.trybs)
 ne.next(e);
 console.log(this.intelGenerations)
})

e?.get('rAMProcessor')?.valueChanges.pipe(
  startWith(''),
  map(e=>this.filteri(e, this.ramArray, this.ramNormal))
).subscribe(e=>{

let ne = new BehaviorSubject<any>(0);
//console.log(this.trybs)
 this.rAMProcessors= ne.asObservable()
 //console.log(this.trybs)
 ne.next(e);
 
})

e?.get('storageCapacity')?.valueChanges.pipe(
  startWith(''),
  map(e=>this.filteri(e, this.storageArray, this.storageCapacitiesNormal))
).subscribe(e=>{

let ne = new BehaviorSubject<any>(0);
//console.log(this.trybs)
 this.storageCapacities= ne.asObservable()
 //console.log(this.trybs)
 ne.next(e);
 
})

  })

  

  }

  filteri(value:any, toFilter:any[], monitor:any[]){

    let you = toFilter.filter((ff:any)=>{
      console.log(ff.toLowerCase())
      
      return ff.toLowerCase().includes(value.toLowerCase())
    })
    console.log(you);
    monitor.splice(0, monitor.length);

    you.forEach(e=>{
      monitor.push(e);
    })
    console.log(monitor.length)
    console.log(monitor)
    return you
  
  }

  firstarray():FormGroup{
    return this.fb.group({
      dateBrought: '',
 tag:'',
serialNumber:'',
brand:'',
model:'',
intelCore:'',
intelGeneration:'',
storageType:'',
storageCapacity:'',	
rAMProcessor:'',
speed:'',
touchScreen:false,
keypadLight: true,
revolvable:false,
averageBattery:'',
batteryBackup:''

    })
  }

  addCollection(){
    this.collection.push(this.firstarray());
    console.log(this.collection.controls)
    this.collection.controls.forEach((e)=>{
      e?.get('brand')?.valueChanges.pipe(
          startWith(''),
          map(e=>this.filteri(e, this.brand, this.trybsNormal))
      ).subscribe(e=>{
        
        let ne = new BehaviorSubject<any>(0);
        console.log(this.trybs)
         this.trybs= ne.asObservable()
         console.log(this.trybs)
         ne.next(e);
         console.log(this.trybs)
      })
  
  
      e?.get('model')?.valueChanges.pipe(
        startWith(''),
        map(e=>this.filteri(e, this.modelArray, this.modelsNormal))
    ).subscribe(e=>{
      
      let ne = new BehaviorSubject<any>(0);
      //console.log(this.trybs)
       this.models= ne.asObservable()
       //console.log(this.trybs)
       ne.next(e);
       console.log(this.models)
    })
  
  
    e?.get('intelCore')?.valueChanges.pipe(
      startWith(''),
      map(e=>this.filteri(e, this.coreArray, this.intelCoresNormal))
  ).subscribe(e=>{
    
    let ne = new BehaviorSubject<any>(0);
    //console.log(this.trybs)
     this.intelCores= ne.asObservable()
     //console.log(this.trybs)
     ne.next(e);
     console.log(this.intelCores)
  })
  
  
  
  e?.get('intelGeneration')?.valueChanges.pipe(
    startWith(''),
    map(e=>this.filteri(e, this.generationArray, this.intelGenerationsNormal))
  ).subscribe(e=>{
  
  let ne = new BehaviorSubject<any>(0);
  //console.log(this.trybs)
   this.intelGenerations= ne.asObservable()
   //console.log(this.trybs)
   ne.next(e);
   console.log(this.intelGenerations)
  })
  
  e?.get('rAMProcessor')?.valueChanges.pipe(
    startWith(''),
    map(e=>this.filteri(e, this.ramArray, this.ramNormal))
  ).subscribe(e=>{
  
  let ne = new BehaviorSubject<any>(0);
  //console.log(this.trybs)
   this.rAMProcessors= ne.asObservable()
   //console.log(this.trybs)
   ne.next(e);
   
  })
  
  e?.get('storageCapacity')?.valueChanges.pipe(
    startWith(''),
    map(e=>this.filteri(e, this.storageArray, this.storageCapacitiesNormal))
  ).subscribe(e=>{
  
  let ne = new BehaviorSubject<any>(0);
  //console.log(this.trybs)
   this.storageCapacities= ne.asObservable()
   //console.log(this.trybs)
   ne.next(e);
   
  })
  
    })
  }

  removeCollection(index:any){
    this.collection.removeAt(index);
    console.log(this.laptopForm.value)
  }
save(){
  this.submitting = true;
  console.log(this.laptopForm.value);
  this.http.post('http://localhost/elegance/api.php', JSON.stringify({...this.laptopForm.value, mode:'create'}) /*, {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    } )
  }*/).subscribe({next:(e:any) =>{
    this.submitting = false;
    console.log(e)
    this.snack.open(e.message, 'close', {
      panelClass: [ 'bg-success', 'text-white'],
      duration: 5000,
      verticalPosition: 'top'

    })
  
  
  }, 
error: (error)=>{
  this.submitting = false;
  console.log(error)
  this.snack.open(error.message, 'close', {
    panelClass: ['bg-danger', 'text-white'],
    duration: 5000,
    verticalPosition: 'top'
  })
}})
}

duplicate(){
 if(this.duplicateby.nativeElement.value &&
  this.duplicateby.nativeElement.value !== 0){
    console.log(this.collection.controls)
    let nums = this.duplicateby.nativeElement.value
    let lastFilled = this.collection.controls.length - 1;
    let lastValues = this.collection.controls[lastFilled].value;
   console.log(lastValues); 
   const { dateBrought,

  brand,
  model,
  intelCore,
  intelGeneration,
  storageType,
  storageCapacity,	
  rAMProcessor,
  speed,
  touchScreen,
  keypadLight,
  revolvable,
  averageBattery} = lastValues
   for(let i =0; i<nums; i++){
    this.addCollection();
    this.collection.controls[lastFilled+i+1].patchValue({ dateBrought,

      brand,
      model,
      intelCore,
      intelGeneration,
      storageType,
      storageCapacity,	
      rAMProcessor,
      speed,
      touchScreen,
      keypadLight,
      revolvable,
      averageBattery})
   
   }
  }
}
}

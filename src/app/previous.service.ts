import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PreviousService implements Resolve<any>{

  constructor(private http:HttpClient) { }
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
      return this.http.get('http://localhost/elegance/api.php?mode=get_previous_people').pipe(
        map((e:any)=>{
          return e.message.map((f:any)=>{
            return f.personName;
          })
        })
      );
  }
}

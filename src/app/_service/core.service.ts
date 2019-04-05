import { Injectable } from '@angular/core';
import {HttpClient,HttpResponse} from '@angular/common/http';
import { Observable, of ,throwError} from 'rxjs';
import { ObserversModule } from '@angular/cdk/observers';

@Injectable({
  providedIn: 'root'
})
export class CoreService {

  constructor(private http:HttpClient) { }

  private bikeListUrl: string = "http://bike-rental-hmc.herokuapp.com/getBikes";

  customerObj = {name:'testUser',sheridanId:'991417298',sheridanEmail:'testing@gmail.com',personalEmail:'personal@gmail.com',phone:'123456789'}

  
  idQuery(id):Observable<any>{
    if(id != this.customerObj['sheridanId']){
      return of(new HttpResponse({ body: {message:"newUser"}, status: 200 }));
    }
    else{
      return of(new HttpResponse({ body: this.customerObj, status: 200 }));
    }
  }


  test():Observable<any>{
     return  of(new HttpResponse({ body: {text:"it work!"}, status: 200 }));
  }


  getBikeList(){
    return this.http.get(this.bikeListUrl,{responseType:'text'});
  }
  
}

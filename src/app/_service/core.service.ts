import { Injectable } from '@angular/core';
import {HttpClient,HttpResponse} from '@angular/common/http';
import { Observable, of ,throwError} from 'rxjs';
import { ObserversModule } from '@angular/cdk/observers';

@Injectable({
  providedIn: 'root'
})
export class CoreService {

  constructor() { }

  userObj = {name:'testUser',sheridanId:'991417298',sheridanEmail:'testing@gmail.com',personalEmail:'personal@gmail.com',phone:'123456789'}

  bikeObj = [{bikeId:1,bikeType:"Mountain",avaliable:true,imagePath:"1.jpg"},{bikeId:2,bikeType:"City",avaliable:true,imagePath:"2.jpg"},{bikeId:3,bikeType:"Touring",avaliable:false,imagePath:"1.jpg"}
,{bikeId:4,bikeType:"Road",avaliable:true,imagePath:"2.jpg"},{bikeId:5,bikeType:"Mountain",avaliable:true,imagePath:"1.jpg"},{bikeId:6,bikeType:"Mountain",avaliable:false,imagePath:"2.jpg"}];

  idQuery(id):Observable<any>{
    if(id != this.userObj['sheridanId']){
      return of(new HttpResponse({ body: {message:"newUser"}, status: 200 }));
    }
    else{
      return of(new HttpResponse({ body: this.userObj, status: 200 }));
    }
  }


  test():Observable<any>{
     return  of(new HttpResponse({ body: {text:"it work!"}, status: 200 }));
  }

  testBike():Observable<any>{
    return of(new HttpResponse({body:{bikes:this.bikeObj},status:200}))
  }
}

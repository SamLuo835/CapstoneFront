import { Injectable } from '@angular/core';
import {HttpClient,HttpResponse} from '@angular/common/http';
import { Observable, of ,throwError} from 'rxjs';
import { ObserversModule } from '@angular/cdk/observers';

@Injectable({
  providedIn: 'root'
})
export class CoreService {

  constructor() { }


  test():Observable<any>{
     return  of(new HttpResponse({ body: {text:"it work!"}, status: 200 }));
  }
}

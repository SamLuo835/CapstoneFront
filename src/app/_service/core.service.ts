import { Injectable } from '@angular/core';
import {HttpClient,HttpResponse,HttpErrorResponse} from '@angular/common/http';
import { Observable, of ,throwError} from 'rxjs';
import { ObserversModule } from '@angular/cdk/observers';
import { catchError,retry} from 'rxjs/operators';


const ACTIVE_TABLE_DATA: Object[] = [
  {id: 1, signoutdate: '2019-02-28', duedate: '2019-03-13', status: 'active',comment:'abc',bikeId:1,sheridanId:'991417298'},
  {id: 2, signoutdate: '2019-03-11', duedate: '2019-03-13', status: 'active',comment:'abc',bikeId:1,sheridanId:'991417298'},
  {id: 3, signoutdate: '2019-03-11', duedate: '2019-03-13', status: 'active',comment:'abc',bikeId:1,sheridanId:'991417298'},
  {id: 4, signoutdate: '2019-03-11', duedate: '2019-03-13', status: 'active',comment:'abc',bikeId:1,sheridanId:'991417298'},
  {id: 5, signoutdate: '2019-03-11', duedate: '2019-03-13', status: 'active',comment:'abc',bikeId:1,sheridanId:'991417298'},
  {id: 6, signoutdate: '2019-03-11', duedate: '2019-03-13', status: 'active',comment:'abc',bikeId:1,sheridanId:'991417298'},
  {id: 7, signoutdate: '2019-03-11', duedate: '2019-03-12', status: 'late',comment:'abc',bikeId:1,sheridanId:'991417298'},
  {id: 8, signoutdate: '2019-03-11', duedate: '2019-03-12', status: 'late',comment:'',bikeId:1,sheridanId:'991417298'},
  {id: 9, signoutdate: '2019-03-11', duedate: '2019-03-13', status: 'active',comment:'',bikeId:1,sheridanId:'991417298'},
  {id: 10, signoutdate: '2019-03-11', duedate: '2019-03-13', status: 'active',comment:'',bikeId:1,sheridanId:'991417298'},
  {id: 11, signoutdate: '2019-03-11', duedate: '2019-03-13', status: 'active',comment:'',bikeId:1,sheridanId:'991417298'},
  {id: 12, signoutdate: '2019-03-11', duedate: '2019-03-13', status: 'active',comment:'',bikeId:1,sheridanId:'991417298'},
  {id: 13, signoutdate: '2019-03-11', duedate: '2019-03-13', status: 'active',comment:'',bikeId:1,sheridanId:'991417298'},
  {id: 14, signoutdate: '2019-03-11', duedate: '2019-03-13', status: 'active',comment:'',bikeId:1,sheridanId:'991417298'},
  {id: 15, signoutdate: '2019-03-11', duedate: '2019-03-13', status: 'active',comment:'',bikeId:1,sheridanId:'991417298'},
  {id: 16, signoutdate: '2019-03-11', duedate: '2019-03-13', status: 'late',comment:'',bikeId:1,sheridanId:'991417298'},
  {id: 17, signoutdate: '2019-03-11', duedate: '2019-03-13', status: 'late',comment:'',bikeId:1,sheridanId:'991417298'},
  {id: 18, signoutdate: '2019-03-11', duedate: '2019-03-13', status: 'active',comment:'',bikeId:1,sheridanId:'991417298'},
  {id: 19, signoutdate: '2019-03-11', duedate: '2019-03-13', status: 'active',comment:'',bikeId:1,sheridanId:'991417298'},
  {id: 20, signoutdate: '2019-03-11', duedate: '2019-03-13', status: 'active',comment:'',bikeId:1,sheridanId:'991417298'},
  {id: 21, signoutdate: '2019-03-11', duedate: '2019-03-13', status: 'active',comment:'',bikeId:1,sheridanId:'991417298'},
  {id: 22, signoutdate: '2019-03-11', duedate: '2019-03-13', status: 'active',comment:'',bikeId:1,sheridanId:'991417298'},
];

const ACTIVE_TABLE_DETAIL_DATA: Object= {
  name:'testUser',sheridanEmail:'testing@gmail.com',personalEmail:'personal@gmail.com',phone:'123456789',
  
}



@Injectable({
  providedIn: 'root'
})
export class CoreService {

  constructor(private http:HttpClient) { }

  private bikeListUrl: string = "http://bike-rental-hmc.herokuapp.com/getBikes";
  private activeRentalsUrl: string = "http://bike-rental-hmc.herokuapp.com/getActiveRentals";
  private activeRentalDetailUrl: string = "http://bike-rental-hmc.herokuapp.com/getActiveRental/";
  
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

  activeRentalDataCall():Observable<any> {
    return this.http.get(this.activeRentalsUrl).pipe(
      catchError(this.handleError));
  }

  activeRentalDetailDataCall(id):Observable<any> {
    return this.http.get(this.activeRentalDetailUrl + id).pipe(
      catchError(this.handleError));
  }

  tableDataCall():Observable<any>{
    return  of(new HttpResponse({ body: {table:ACTIVE_TABLE_DATA}, status: 200 }));
  }

  tableDetailCall():Observable<any>{
    return  of(new HttpResponse({ body: ACTIVE_TABLE_DETAIL_DATA, status: 200 }));

  }


  getBikeList(){
    return this.http.get(this.bikeListUrl,{responseType:'text'});
  }
  
  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(
        `Backend returned code ${error.status}, `
        );
    }
    // return an observable with a user-facing error message
    return throwError(
      'Something bad happened; please try again later.');
  };
}

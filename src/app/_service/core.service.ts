import { Injectable } from '@angular/core';
import {HttpClient,HttpResponse,HttpErrorResponse} from '@angular/common/http';
import { Observable, of ,throwError} from 'rxjs';
import { ObserversModule } from '@angular/cdk/observers';
import { catchError,retry} from 'rxjs/operators';


const ACTIVE_TABLE_DATA: Object[] = [
  {rentalId: 1, signOutDate: '2019-02-28', dueDate: '2019-03-13', status: 'Active',comment:'abc',bikeId:1,sheridanId:'991417298',customerName:'testUser',sheridanEmail:'testing@gmail.com',personalEmail:'personal@gmail.com',phone:'123456789'},
  {rentalId: 2, signOutDate: '2019-03-11', dueDate: '2019-03-13', status: 'Active',comment:'abc',bikeId:1,sheridanId:'991417298',customerName:'testUser',sheridanEmail:'testing@gmail.com',personalEmail:'personal@gmail.com',phone:'123456789'},
  {rentalId: 3, signOutDate: '2019-03-11', dueDate: '2019-03-13', status: 'Active',comment:'abc',bikeId:1,sheridanId:'991417298',customerName:'testUser',sheridanEmail:'testing@gmail.com',personalEmail:'personal@gmail.com',phone:'123456789'},
  {rentalId: 4, signOutDate: '2019-03-11', dueDate: '2019-03-13', status: 'Active',comment:'abc',bikeId:1,sheridanId:'991417298',customerName:'testUser',sheridanEmail:'testing@gmail.com',personalEmail:'personal@gmail.com',phone:'123456789'},
  {rentalId: 5, signOutDate: '2019-03-11', dueDate: '2019-03-13', status: 'Active',comment:'abc',bikeId:1,sheridanId:'991417298',customerName:'testUser',sheridanEmail:'testing@gmail.com',personalEmail:'personal@gmail.com',phone:'123456789'},
  {rentalId: 6, signOutDate: '2019-03-11', dueDate: '2019-03-13', status: 'Active',comment:'abc',bikeId:1,sheridanId:'991417298',customerName:'testUser',sheridanEmail:'testing@gmail.com',personalEmail:'personal@gmail.com',phone:'123456789'},
  {rentalId: 7, signOutDate: '2019-03-11', dueDate: '2019-03-12', status: 'Late',comment:'abc',bikeId:1,sheridanId:'991417298',customerName:'testUser',sheridanEmail:'testing@gmail.com',personalEmail:'personal@gmail.com',phone:'123456789'},
  {rentalId: 8, signOutDate: '2019-03-11', dueDate: '2019-03-12', status: 'Late',comment:'',bikeId:1,sheridanId:'991417298',customerName:'testUser',sheridanEmail:'testing@gmail.com',personalEmail:'personal@gmail.com',phone:'123456789'},
  {rentalId: 9, signOutDate: '2019-03-11', dueDate: '2019-03-13', status: 'Active',comment:'',bikeId:1,sheridanId:'991417298',customerName:'testUser',sheridanEmail:'testing@gmail.com',personalEmail:'personal@gmail.com',phone:'123456789'},
  {rentalId: 10, signOutDate: '2019-03-11', dueDate: '2019-03-13', status: 'Active',comment:'',bikeId:1,sheridanId:'991417298',customerName:'testUser',sheridanEmail:'testing@gmail.com',personalEmail:'personal@gmail.com',phone:'123456789'},
  {rentalId: 11, signOutDate: '2019-03-11', dueDate: '2019-03-13', status: 'Active',comment:'',bikeId:1,sheridanId:'991417298',customerName:'testUser',sheridanEmail:'testing@gmail.com',personalEmail:'personal@gmail.com',phone:'123456789'},
  {rentalId: 12, signOutDate: '2019-03-11', dueDate: '2019-03-13', status: 'Active',comment:'',bikeId:1,sheridanId:'991417298',customerName:'testUser',sheridanEmail:'testing@gmail.com',personalEmail:'personal@gmail.com',phone:'123456789'},
  {rentalId: 13, signOutDate: '2019-03-11', dueDate: '2019-03-13', status: 'Active',comment:'',bikeId:1,sheridanId:'991417298',customerName:'testUser',sheridanEmail:'testing@gmail.com',personalEmail:'personal@gmail.com',phone:'123456789'},
  {rentalId: 14, signOutDate: '2019-03-11', dueDate: '2019-03-13', status: 'Active',comment:'',bikeId:1,sheridanId:'991417298',customerName:'testUser',sheridanEmail:'testing@gmail.com',personalEmail:'personal@gmail.com',phone:'123456789'},
  {rentalId: 15, signOutDate: '2019-03-11', dueDate: '2019-03-13', status: 'Active',comment:'',bikeId:1,sheridanId:'991417298',customerName:'testUser',sheridanEmail:'testing@gmail.com',personalEmail:'personal@gmail.com',phone:'123456789'},
  {rentalId: 16, signOutDate: '2019-03-11', dueDate: '2019-03-13', status: 'Late',comment:'',bikeId:1,sheridanId:'991417298',customerName:'testUser',sheridanEmail:'testing@gmail.com',personalEmail:'personal@gmail.com',phone:'123456789'},
  {rentalId: 17, signOutDate: '2019-03-11', dueDate: '2019-03-13', status: 'Late',comment:'',bikeId:1,sheridanId:'991417298',customerName:'testUser',sheridanEmail:'testing@gmail.com',personalEmail:'personal@gmail.com',phone:'123456789'},
  {rentalId: 18, signOutDate: '2019-03-11', dueDate: '2019-03-13', status: 'Active',comment:'',bikeId:1,sheridanId:'991417298',customerName:'testUser',sheridanEmail:'testing@gmail.com',personalEmail:'personal@gmail.com',phone:'123456789'},
  {rentalId: 19, signOutDate: '2019-03-11', dueDate: '2019-03-13', status: 'Active',comment:'',bikeId:1,sheridanId:'991417298',customerName:'testUser',sheridanEmail:'testing@gmail.com',personalEmail:'personal@gmail.com',phone:'123456789'},
  {rentalId: 20, signOutDate: '2019-03-11', dueDate: '2019-03-13', status: 'Active',comment:'',bikeId:1,sheridanId:'991417298',customerName:'testUser',sheridanEmail:'testing@gmail.com',personalEmail:'personal@gmail.com',phone:'123456789'},
  {rentalId: 21, signOutDate: '2019-03-11', dueDate: '2019-03-13', status: 'Active',comment:'',bikeId:1,sheridanId:'991417298',customerName:'testUser',sheridanEmail:'testing@gmail.com',personalEmail:'personal@gmail.com',phone:'123456789'},
  {rentalId: 22, signOutDate: '2019-03-11', dueDate: '2019-03-13', status: 'Active',comment:'',bikeId:1,sheridanId:'991417298',customerName:'testUser',sheridanEmail:'testing@gmail.com',personalEmail:'personal@gmail.com',phone:'123456789'},
];




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

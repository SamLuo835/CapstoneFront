import { Injectable } from '@angular/core';
import {HttpClient,HttpResponse,HttpErrorResponse,HttpHeaders} from '@angular/common/http';
import { Observable, of ,throwError} from 'rxjs';
import { catchError} from 'rxjs/operators';


const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json',
  })
};


@Injectable({
  providedIn: 'root'
})
export class CoreService {

  constructor(private http:HttpClient) { }

  private bikeListUrl: string = "http://bike-rental-hmc.herokuapp.com/getBikes";
  private activeRentalsUrl: string = "http://bike-rental-hmc.herokuapp.com/getActiveRentals";
  private activeRentalDetailUrl: string = "http://bike-rental-hmc.herokuapp.com/getActiveRental/";
  private customersUrl: string = "http://bike-rental-hmc.herokuapp.com/getCustomers/";
  private archivedRentalsUrl: string = "http://bike-rental-hmc.herokuapp.com/getArchivedRentals";
  
  //TODO 
  private returnBikeUrl:string = "";
  private editRentalUrl:string = "";
  private queryCustomerUrl:string = "";
  private newCustomerUrl:string = "";
  private newRentalUrl:string = "";

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
    return  of(new HttpResponse({ body: {text:"it works!"}, status: 200 }));
 }


  returnBike():Observable<any>{
    return this.http.patch(this.returnBikeUrl,{},httpOptions).pipe(catchError(this.handleError));
  }

  editRental():Observable<any>{
    return this.http.patch(this.editRentalUrl,{},httpOptions).pipe(catchError(this.handleError));
  }

  getCustomerById(id):Observable<any>{
      //@PATHVARIABLE in spring
    return this.http.get(this.queryCustomerUrl+"/"+id).pipe(catchError(this.handleError));
  }

  newCustomer():Observable<any>{
    return this.http.post(this.newCustomerUrl,{},httpOptions).pipe(catchError(this.handleError));
  }

  newRental():Observable<any>{
    return this.http.post(this.newRentalUrl,{},httpOptions).pipe(catchError(this.handleError));
  }


  activeRentalsDataCall():Observable<any> {
    return this.http.get(this.activeRentalsUrl).pipe(
      catchError(this.handleError));
  }

  activeRentalDetailDataCall(id):Observable<any> {
    return this.http.get(this.activeRentalDetailUrl + id).pipe(
      catchError(this.handleError));
  }
  
  customersDataCall():Observable<any> {
    return this.http.get(this.customersUrl).pipe(
      catchError(this.handleError));
  }

  archivedRentalsDataCall():Observable<any> {
    return this.http.get(this.archivedRentalsUrl).pipe(
      catchError(this.handleError));
  }

  getBikeList(){
    return this.http.get(this.bikeListUrl,{responseType:'text'}).pipe(
      catchError(this.handleError));;
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

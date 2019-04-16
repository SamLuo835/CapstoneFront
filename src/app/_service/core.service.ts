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
  private returnBikeUrl:string = "https://bike-rental-hmc.herokuapp.com/returnRental";
  private editRentalUrl:string = "https://bike-rental-hmc.herokuapp.com/editRental";
  private queryCustomerUrl:string = "https://bike-rental-hmc.herokuapp.com/getCustomer";
  private newCustomerUrl:string = "https://bike-rental-hmc.herokuapp.com/newCustomer";
  private newRentalUrl:string = "https://bike-rental-hmc.herokuapp.com/newRental";

  test():Observable<any>{
    return  of(new HttpResponse({ body: {text:"it works!"}, status: 200 }));
 }


  returnBike(id,comment):Observable<any>{
    let requestBody = {"id":id,"comment":comment};
    return this.http.patch(this.returnBikeUrl,requestBody,httpOptions).pipe(catchError(this.handleError));
  }

  editRental(id,comment,dueDate):Observable<any>{
    let requestBody = {"id":id,"comment":comment,"dueDate":dueDate};
    return this.http.patch(this.editRentalUrl,requestBody,httpOptions);
  }

  getCustomerById(id):Observable<any>{
      //@PATHVARIABLE in spring
    return this.http.get(this.queryCustomerUrl+"/"+id,{ observe: 'response' }).pipe(catchError(this.handleError));
  }

  newCustomer(newCustomer):Observable<any>{
    return this.http.post(this.newCustomerUrl,newCustomer,httpOptions).pipe(catchError(this.handleError));
  }

  newRental(newRental):Observable<any>{
    return this.http.post(this.newRentalUrl,newRental,httpOptions);
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

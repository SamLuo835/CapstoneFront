import { Injectable } from '@angular/core';
import {HttpClient,HttpResponse,HttpErrorResponse,HttpHeaders} from '@angular/common/http';
import { Observable, of ,throwError} from 'rxjs';
import { catchError} from 'rxjs/operators';
import { NotifierService } from 'angular-notifier';


const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json',
  })
};


@Injectable({
  providedIn: 'root'
})
export class CoreService {

  constructor(private http:HttpClient,private notification :NotifierService) { }

  // private baseServerAddress: string = "http://localhost:8082";
  private baseServerAddress: string = "http://bike-rental-hmc.herokuapp.com";

  private bikeListUrl: string = this.baseServerAddress + "/getBikes";
  private activeRentalsUrl: string = this.baseServerAddress + "/getActiveRentals";
  private activeRentalDetailUrl: string = this.baseServerAddress + "/getActiveRental/";
  private customersUrl: string = this.baseServerAddress + "/getCustomers/";
  private archivedRentalsUrl: string = this.baseServerAddress + "/getArchivedRentals";
  
  //TODO 
  private returnBikeUrl:string = this.baseServerAddress + "/returnRental";
  private editRentalUrl:string = this.baseServerAddress + "/editRental";
  private queryCustomerUrl:string = this.baseServerAddress + "/getCustomer";
  private newCustomerUrl:string = this.baseServerAddress + "/newCustomer";
  private newRentalUrl:string = this.baseServerAddress + "/newRental";

  test():Observable<any>{
    return  of(new HttpResponse({ body: {text:"it works!"}, status: 200 }));
 }

 testReport():Observable<any>{
  return  of(new HttpResponse({ body: {total:100,user:120,late:20,average:4.5}, status: 200 }));
}


  returnBike(id,comment):Observable<any>{
    let requestBody = {"id":id,"comment":comment};
    return this.http.patch(this.returnBikeUrl,requestBody,httpOptions).pipe(catchError(()=>{
      this.notification.notify( 'error', 'Something bad happened, please try again later.' );
      return throwError(
      'Something bad happened; please try again later.');}));
  }

  editRental(id,comment,dueDate):Observable<any>{
    let requestBody = {"id":id,"comment":comment,"dueDate":dueDate};
    return this.http.patch(this.editRentalUrl,requestBody,httpOptions).pipe(catchError(()=>{
      this.notification.notify( 'error', 'Something bad happened, please try again later.' );
      return throwError(
      'Something bad happened; please try again later.');}));
  }

  getCustomerById(id):Observable<any>{
      //@PATHVARIABLE in spring
    return this.http.get(this.queryCustomerUrl+"/"+id,{ observe: 'response' }).pipe(catchError((httpError)=>{
      // if there is an error message, display it. Otherwise display default message
      let errorMessage = (httpError.error) ? httpError.error : 'Something bad happened, please try again later.';
      this.notification.notify( 'error', errorMessage );
      return throwError(errorMessage);
    }));
  }

  newCustomer(newCustomer):Observable<any>{
    return this.http.post(this.newCustomerUrl,newCustomer,httpOptions).pipe(catchError(()=>{
      this.notification.notify( 'error', 'Something bad happened, please try again later.' );
      return throwError(
      'Something bad happened; please try again later.');}));
  }

  newRental(newRental):Observable<any>{
    return this.http.post(this.newRentalUrl,newRental,httpOptions).pipe(catchError(()=>{
      this.notification.notify( 'error', 'Something bad happened, please try again later.' );
      return throwError(
      'Something bad happened; please try again later.');}));
  }


  activeRentalsDataCall():Observable<any> {
    return this.http.get(this.activeRentalsUrl).pipe(
      catchError(()=>{
        this.notification.notify( 'error', 'Something bad happened, please try again later.' );
        return throwError(
        'Something bad happened; please try again later.');}));
  }

  activeRentalDetailDataCall(id):Observable<any> {
    return this.http.get(this.activeRentalDetailUrl + id).pipe(
      catchError(()=>{
        this.notification.notify( 'error', 'Something bad happened, please try again later.' );
        return throwError(
        'Something bad happened; please try again later.');}));
  }
  
  customersDataCall():Observable<any> {
    return this.http.get(this.customersUrl).pipe(
      catchError(()=>{
        this.notification.notify( 'error', 'Something bad happened, please try again later.' );
        return throwError(
        'Something bad happened; please try again later.');}));
  }

  archivedRentalsDataCall():Observable<any> {
    return this.http.get(this.archivedRentalsUrl).pipe(
      catchError(()=>{
        this.notification.notify( 'error', 'Something bad happened, please try again later.' );
        return throwError(
        'Something bad happened; please try again later.');}));
  }

  getBikeList(){
    return this.http.get(this.bikeListUrl,{responseType:'text'}).pipe(
      catchError(()=>{
        this.notification.notify( 'error', 'Something bad happened, please try again later.' );
        return throwError(
        'Something bad happened; please try again later.');}));
  }
  
  
}

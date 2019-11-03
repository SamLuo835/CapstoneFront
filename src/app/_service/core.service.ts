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
  
   //bikes 
  private bikeListUrl: string = this.baseServerAddress + "/getBikes";
  private newBikeUrl: string = this.baseServerAddress + "/newBike";
  private editBikeUrl:string = this.baseServerAddress + "/editBike";

  //active rental
  private activeRentalsUrl: string = this.baseServerAddress + "/getActiveRentals";
  private activeRentalDetailUrl: string = this.baseServerAddress + "/getActiveRental/";
  private payableListUrl:string = this.baseServerAddress + "/getPayablesByRentalId";
  private returnBikeUrl:string = this.baseServerAddress + "/returnRental";
  private editRentalUrl:string = this.baseServerAddress + "/editRental";
  private newRentalUrl:string = this.baseServerAddress + "/newRental";

  //payables
  private updateCategoryUrl:string = this.baseServerAddress + "/updatePayables";
  private payablesByCustomerUrl:string = this.baseServerAddress + "/getPayablesByCustID";

  //archivedRental
  private archivedRentalsUrl: string = this.baseServerAddress + "/getArchivedRentals";
  private archivedRentalSearchByDateUrl: string = this.baseServerAddress + "/getArchivedRentalByDate";
  private archivedRentalSearchByCustId: string = this.baseServerAddress  + "/getArchivedRentalsByCustID"
  //customer
  private customersUrl: string = this.baseServerAddress + "/getCustomers/";
  private queryCustomerUrl:string = this.baseServerAddress + "/getCustomer";
  private newCustomerUrl:string = this.baseServerAddress + "/newCustomer";
  private signWaiver:string = this.baseServerAddress + "/customerSignedWaiver"
  private editCustomerUrl:string = this.baseServerAddress + "/editCustomer";

  //search
  private searchCustomerUrl:string = this.baseServerAddress + "/searchCustomers";

  //Locks
  private lockListUrl:string = this.baseServerAddress + "/getLocks";
  private editLockUrl:string = this.baseServerAddress + "/editLock";
  private newLockUrl:string = this.baseServerAddress + "/newLock";

  //report
  private reportData:string = this.baseServerAddress + "/getReportGeneralData";
  private reportHistoricalData:string = this.baseServerAddress + "/getReportHistoricalData";

  test():Observable<any>{
    return  of(new HttpResponse({ body: {text:"it works!"}, status: 200 }));
 }

  getReportData(fromDate, toDate): Observable<any> {
    return this.http.get(this.reportData + "/from=" + this.formatDate(fromDate) + "&to=" + this.formatDate(toDate)).pipe(
      catchError((httpError)=>{
        let errorMessage = this.handleError(httpError);
        return throwError(errorMessage);
      }));
  }

  getReportHistoricalData(): Observable<any> {
    return this.http.get(this.reportHistoricalData).pipe(
      catchError((httpError)=>{
        let errorMessage = this.handleError(httpError);
        return throwError(errorMessage);
      }));
  }

  searchCustomer(keyWord):Observable<any>{
    return this.http.get(this.searchCustomerUrl+"/"+keyWord,httpOptions).pipe(
      catchError((httpError) => {
        let errorMessage = this.handleError(httpError);
        return throwError(errorMessage);
      })
    );
  }

  searchArchivedByDate(type,start,end):Observable<any>{
    return this.http.get(this.archivedRentalSearchByDateUrl+"/"+type+"/"+start+"/"+end,httpOptions).pipe(
      catchError((httpError) => {
        let errorMessage = this.handleError(httpError);
        return throwError(errorMessage);
      })
    );
  }

  searchArchivedByCustId(id):Observable<any>{
    return this.http.get(this.archivedRentalSearchByCustId+"/"+id,httpOptions).pipe(
      catchError((httpError) => {
        let errorMessage = this.handleError(httpError);
        return throwError(errorMessage);
      })
    );
  }

  waiverSign(id):Observable<any>{
    return this.http.patch(this.signWaiver+"/"+id,httpOptions).pipe(
      catchError((httpError) => {
        let errorMessage = this.handleError(httpError);
        return throwError(errorMessage);
      })
    );
  }

  editCustomer(customer):Observable<any>{
    return this.http.patch(this.editCustomerUrl,customer,httpOptions).pipe(
      catchError((httpError) => {
        let errorMessage = this.handleError(httpError);
        return throwError(errorMessage);
      })
    );
  }

  returnBike(id,comment):Observable<any>{
    let requestBody = {"id":id,"comment":comment};
    return this.http.patch(this.returnBikeUrl,requestBody,httpOptions).pipe(
      catchError((httpError) => {
        let errorMessage = this.handleError(httpError);
        return throwError(errorMessage);
      })
    );
  }

  getPayablesById(id):Observable<any>{
    return this.http.get(this.payableListUrl+"/"+id,httpOptions).pipe(
      catchError((httpError) => {
        let errorMessage = this.handleError(httpError);
        return throwError(errorMessage);
      })
    );
  }

  getPayablesByCustomerId(id):Observable<any>{
    return this.http.get(this.payablesByCustomerUrl+"/"+id,httpOptions).pipe(
      catchError((httpError) => {
        let errorMessage = this.handleError(httpError);
        return throwError(errorMessage);
      })
    );
  }

  updatePayables(categoryList):Observable<any>{
    return this.http.patch(this.updateCategoryUrl,categoryList,httpOptions).pipe(
      catchError((httpError) => {
        let errorMessage = this.handleError(httpError);
        return throwError(errorMessage);
      })
    );
  }

  editRental(id,comment,dueDate):Observable<any>{
    let requestBody = {"id":id,"comment":comment,"dueDate":dueDate};
    return this.http.patch(this.editRentalUrl,requestBody,httpOptions).pipe(
      catchError((httpError) => {
        let errorMessage = this.handleError(httpError);
        return throwError(errorMessage);
      })
    );
  }

  getCustomerById(id):Observable<any>{
    return this.http.get(this.queryCustomerUrl+"/"+id,{ observe: 'response' }).pipe(
      catchError((httpError)=>{
        let errorMessage = this.handleError(httpError);
        return throwError(errorMessage);
      })
    );
  }

  newCustomer(newCustomer):Observable<any>{
    return this.http.post(this.newCustomerUrl,newCustomer,httpOptions).pipe(
      catchError((httpError) => {
        let errorMessage = this.handleError(httpError);
        return throwError(errorMessage);
      })
    );
  }

  newRental(newRental):Observable<any>{
    return this.http.post(this.newRentalUrl,newRental,httpOptions).pipe(
      catchError((httpError) => {
        let errorMessage = this.handleError(httpError);
        return throwError(errorMessage);
      })
    );
  }

  activeRentalsDataCall():Observable<any> {
    return this.http.get(this.activeRentalsUrl).pipe(
      catchError((httpError) => {
        let errorMessage = this.handleError(httpError);
        return throwError(errorMessage);
      })
    );
  }

  activeRentalDetailDataCall(id):Observable<any> {
    return this.http.get(this.activeRentalDetailUrl + id).pipe(
      catchError((httpError) => {
        let errorMessage = this.handleError(httpError);
        return throwError(errorMessage);
      })
    );
  }
  
  customersDataCall():Observable<any> {
    return this.http.get(this.customersUrl).pipe(
      catchError((httpError) => {
        let errorMessage = this.handleError(httpError);
        return throwError(errorMessage);
      })
    );
  }

  archivedRentalsDataCall():Observable<any> {
    return this.http.get(this.archivedRentalsUrl).pipe(
      catchError((httpError) => {
        let errorMessage = this.handleError(httpError);
        return throwError(errorMessage);
      })
    );
  }

  getBikeList(){
    return this.http.get(this.bikeListUrl,{responseType:'text'}).pipe(
      catchError((httpError) => {
        let errorMessage = this.handleError(httpError);
        return throwError(errorMessage);
      })
    );
  }
  
  editBike(editedBikeInfo):Observable<any>{
    editedBikeInfo['@type']='Bike';
    return this.http.patch(this.editBikeUrl, editedBikeInfo, httpOptions).pipe(
      catchError((httpError) => {
        let errorMessage = this.handleError(httpError);
        return throwError(errorMessage);
      })
    );
  }

  newBike(newBike):Observable<any>{
    newBike['@type'] = 'Bike';
    return this.http.post(this.newBikeUrl, newBike, httpOptions).pipe(
      catchError((httpError) => {
        let errorMessage = this.handleError(httpError);
        return throwError(errorMessage);
      })
    );
  }

  //Locks list
  getLockList(){
    return this.http.get(this.lockListUrl,{responseType:'text'}).pipe(
      catchError((httpError) => {
        let errorMessage = this.handleError(httpError);
        return throwError(errorMessage);
      })
    );
  }
  
  editLock(editedLockInfo):Observable<any>{
    editedLockInfo['@type'] = 'LockItem';
    return this.http.patch(this.editLockUrl, editedLockInfo, httpOptions).pipe(
      catchError((httpError) => {
        let errorMessage = this.handleError(httpError);
        return throwError(errorMessage);
      })
    );
  }

  newLock(newLock):Observable<any>{
    newLock['@type'] = 'LockItem';
    return this.http.post(this.newLockUrl, newLock, httpOptions).pipe(
      catchError((httpError) => {
        let errorMessage = this.handleError(httpError);
        return throwError(errorMessage);
      })
    );
  }

  handleError(httpError) {
    let errorMessage = (httpError.error && typeof httpError.error !== 'object') ? httpError.error : 'Something bad happened, please try again later.';
    this.notification.notify( 'error', errorMessage );
    return errorMessage;
  }

  // format date to yyyy-mm-dd
  formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) 
        month = '0' + month;
    if (day.length < 2) 
        day = '0' + day;

    return [year, month, day].join('-');
  }
}

import { Injectable  } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { API_BASE } from '../api.config';

@Injectable({
  providedIn: 'root'
})
export class AddEventService {
  private APIUrl: string;

  private apiurl:string = API_BASE

  constructor(private http:HttpClient) { }



  
async GetAll(): Promise<any> {
  this.APIUrl = this.apiurl+'GetEvents';
  let res = await this.http.get(this.APIUrl).toPromise()
  return res
}
async GetById(id:any): Promise<any> {
this.APIUrl = this.apiurl+'EventsGetById?EventNo='+id;
let res = await this.http.get(this.APIUrl).toPromise()
return res
}

async CRUD(entity:any): Promise<any> {
if (entity.OpsType == "S") {
  this.APIUrl = this.apiurl+'AddEvents';
}
else if (entity.OpsType == "U") {
  this.APIUrl = this.apiurl+'UpdateEvent';

}
else if (entity.OpsType == "V") {
  // this.APIUrl = 'http://localhost:3000/api/AddEvents/Delete';
  this.APIUrl = this.apiurl+'UpdateEvent';


}
let headers = new HttpHeaders({
  'content-Type': 'application/json',
  Accept: 'application/json',
});
let options = {
  headers: headers,
};
let res = await this.http.post(this.APIUrl, entity, options).toPromise()
return res;
}





async GetFolder(): Promise<any> {
  this.APIUrl = this.apiurl+'GetFolder';
  let res = await this.http.get(this.APIUrl).toPromise()
  return res
}


async CREATEFOLDER (entity:any): Promise<any> {

    this.APIUrl = this.apiurl+'AddFolder';
  
  

  let headers = new HttpHeaders({
    'content-Type': 'application/json',
    Accept: 'application/json',
  });
  let options = {
    headers: headers,
  };
  let res = await this.http.post(this.APIUrl, entity, options).toPromise()
  return res;
  }



async GetYearEvents(yearName:string): Promise<any> {
  this.APIUrl = this.apiurl+'GetYearEvents?YearName='+encodeURIComponent(yearName);
  let res = await this.http.get(this.APIUrl).toPromise()
  return res
}

async AddYearEvent(entity:any): Promise<any> {
  this.APIUrl = this.apiurl+'AddYearEvent';
  let res = await this.http.post(this.APIUrl, entity).toPromise()
  return res;
}

async VoidYearEvent(id:string): Promise<any> {
  this.APIUrl = this.apiurl+'VoidYearEvent';
  let res = await this.http.post(this.APIUrl, {id}).toPromise()
  return res;
}

}

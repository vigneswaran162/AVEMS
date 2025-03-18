import { Injectable  } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AddEventService {
  private APIUrl: string;

  private apiurl:string = 'https://backendvercel-brown.vercel.app/'

  constructor(private http:HttpClient) { }



  
async GetAll(): Promise<any> {
  this.APIUrl = this.apiurl+'GetEvents';
  let res = await this.http.get(this.APIUrl).toPromise()
  return res
}
async GetById(id:any): Promise<any> {
this.APIUrl = this.apiurl+'EventsGetById?EventNo='+id;
// this.APIUrl = 'http://localhost:8000/EventsGetById?EventNo='+id;
let res = await this.http.get(this.APIUrl).toPromise()
return res
}

async CRUD(entity:any): Promise<any> {
if (entity.OpsType == "S") {
  this.APIUrl = this.apiurl+'AddEvents';
}
else if (entity.OpsType == "U") {
  this.APIUrl = this.apiurl+'UpdateEvent';

  // this.APIUrl = 'http://localhost:8000/UpdateEvent';
}
else if (entity.OpsType == "V") {
  // this.APIUrl = 'http://localhost:3000/api/AddEvents/Delete';
  this.APIUrl = this.apiurl+'UpdateEvent';

  // this.APIUrl = 'http://localhost:8000/UpdateEvent';

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
  
    // this.APIUrl = 'http://localhost:8000/AddFolder';
  

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


}

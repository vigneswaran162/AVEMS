import { Injectable  } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class RegisterationEventService {

  private APIUrl: string;

  private apiurl:string = 'https://backendvercel-brown.vercel.app/'



  constructor(private http:HttpClient) { }

  async GetRegisterationALL(): Promise<any> {
    this.APIUrl = 'http://localhost:3000/api/RegisterationEvent/GetAll';
    let res = await this.http.get(this.APIUrl).toPromise()
    return res
  }

  async GetRegisterationID(EventTitle:any): Promise<any> {
    this.APIUrl = 'http://localhost:3000/api/RegisterationEvent/GetRegisterationID?EventTitle='+EventTitle;
    let res = await this.http.get(this.APIUrl).toPromise()
    return res
  }

  
  async CRUD(entity:any): Promise<any> {
  if (entity.OpsType == "S") {
    this.APIUrl = this.apiurl+'RegisterEvent';
  }
  else if (entity.OpsType == "U") {
    this.APIUrl = 'http://localhost:3000/api/RegisterationEvent/Update';
  }
  else if (entity.OpsType == "V") {
    this.APIUrl = 'http://localhost:3000/api/RegisterationEvent/Delete';
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
}
import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable, interval, Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {


  currentDate: string;
  currentTime: string;
  apiSubscription: Subscription;
  apiDateTime: any;
  constructor(private httpClient: HttpClient) { }

  ngOnInit(): void {
    this.initializeClockMode();
  }

  initializeClockMode() {
    const source = interval(1000);
    this.apiSubscription = source.subscribe(val => this.refreshDateTimeStamp());
  }

  refreshDateTimeStamp() {
    return this.httpClient.get<any>(`${environment.apiEndPoint}DateTime/now`).subscribe(res => {
      console.log(res);
      this.apiDateTime = res.CurrentDateTime;
      this.currentDate = new Date(res.CurrentDateTime).toLocaleDateString('en-US');
      this.currentTime = new Date(res.CurrentDateTime).toLocaleTimeString('en-US');

    });
  }

  // todo: create a clock-data service and a appHttpClient abstracting default httpClient.
  requestDateFromApi(): Observable<any> {
    let headers = new HttpHeaders();
    headers = headers.append('Content-Type', 'application/json');
    const apiEndPoint = `${environment.apiEndPoint}DateTime/now`;
    return this.httpClient.get<any>(apiEndPoint);
  }

  ngOnDestroy(): void {
    this.apiSubscription.unsubscribe();
  }

}

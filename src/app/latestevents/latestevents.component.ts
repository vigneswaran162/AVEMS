import { Component, AfterViewInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

declare var lightGallery: any; 

@Component({
  selector: 'app-latestevents',
  templateUrl: './latestevents.component.html',
  styleUrl: './latestevents.component.scss'
})
export class LatesteventsComponent implements AfterViewInit {
  param:any
  constructor(private route:ActivatedRoute){}

  ngAfterViewInit() {
    this.param = this.route.snapshot.paramMap.get('id');
    lightGallery(document.getElementById('lightgallery'), {
      mode: 'lg-fade',
      download: false,
      thumbnail: true
    });
  }
}

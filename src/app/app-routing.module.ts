import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddEventComponent } from './Admin/add-event/add-event.component';
import { EventCardComponent } from './Content/event-card/event-card.component';
import { HomeComponent } from './Content/home/home.component';
import { EventDetailsComponent } from './Content/event-details/event-details.component';
import { AboutusComponent } from './Content/aboutus/aboutus.component';
import { ContactusComponent } from './Content/contactus/contactus.component';
import { LatesteventsComponent } from './latestevents/latestevents.component';
import { AddEventListComponent } from './Admin/add-event-list/add-event-list.component';
import { RegisterstiondataComponent } from './Admin/registeration-list/registerstiondata/registerstiondata.component';
import { RegisterationListComponent } from './Admin/Registeration/registeration-list/registeration-list.component';
import { EventUploadComponent } from './Admin/event-upload/event-upload.component';
import { AnnouncementComponent } from './Admin/announcement/announcement.component';
import { AdminLoginComponent } from './Admin/admin-login/admin-login.component';
import { adminGuard } from './Services/auth.guard';

const routes: Routes = [{
  path:'AddEvent/:id',
  component:AddEventComponent,
  canActivate:[adminGuard]
},{
  path:'Events',
  component:EventCardComponent
},
{
  path:'',
  component:HomeComponent
},
{
  path:'EventDetail/:id',
  component:EventDetailsComponent
},{
  path:'aboutus',
  component:AboutusComponent
},{
  path:'contactus',
  component:ContactusComponent
},
{
  path:'latest/:id',
  component:LatesteventsComponent
},
{
  path:'EventList',
  component:AddEventListComponent,
  canActivate:[adminGuard]
},
{
  path:'Registeration',
  component:RegisterationListComponent,
  canActivate:[adminGuard]
},
{
  path:'RegisterationList/:id',
  component:RegisterstiondataComponent,
  canActivate:[adminGuard]
},
{
  path:'EventUpload',
  component:EventUploadComponent,
  canActivate:[adminGuard]
},
{
  path:'Announcement',
  component:AnnouncementComponent,
  canActivate:[adminGuard]
},
{
  path:'AdminLogin',
  component:AdminLoginComponent
}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddEventComponent } from './Admin/add-event/add-event.component';
import { EventCardComponent } from './Content/event-card/event-card.component';
import { HomeComponent } from './Content/home/home.component';
import { EventDetailsComponent } from './Content/event-details/event-details.component';
import { RegisterationListComponent } from './Admin/Registeration/registeration-list/registeration-list.component';
import { AboutusComponent } from './Content/aboutus/aboutus.component';
import { ContactusComponent } from './Content/contactus/contactus.component';
import { LatesteventsComponent } from './latestevents/latestevents.component';
import { AddEventListComponent } from './Admin/add-event-list/add-event-list.component';

const routes: Routes = [{
  path:'AddEvent/:id',
  component:AddEventComponent,
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
  component:AddEventListComponent
},
{
  path:'Regiseration/:id',
  component:RegisterationListComponent
}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

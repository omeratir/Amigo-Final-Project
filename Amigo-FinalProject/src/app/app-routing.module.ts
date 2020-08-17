import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PostListComponent } from './posts/post-list/post-list.component';
import { PostCreateComponent } from './posts/post-create/post-create.component';
import { AuthGuard } from './auth/auth.guard';
import { MapComponent } from './map/map.component';
import { HomeComponent } from './home/home.component';
import { PlaceCreateComponent } from './places/place-create/place-create.component';
import { PlaceListComponent } from './places/place-list/place-list.component';
import { RouteCreateComponent } from './routes/route-create/route-create.component';
import { RouteListComponent } from './routes/route-list/route-list.component';
import { PlaceFindComponent } from './places/place-find/placefind.component';
import { PlacestoptenComponent } from './places/places-topten/places-topten.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'placelist', component: PlaceListComponent },
  { path: 'top10', component: PlacestoptenComponent },
  { path: 'routelist', component: RouteListComponent },
  // { path: 'postcreate', component: PostCreateComponent, canActivate: [AuthGuard] },
  { path: 'placecreate', component: PlaceCreateComponent, canActivate: [AuthGuard] },
  { path: 'findmeplace', component: PlaceFindComponent, canActivate: [AuthGuard] },
  { path: 'routecreate', component: RouteCreateComponent, canActivate: [AuthGuard] },
  // { path: 'edit/:postId', component: PostCreateComponent, canActivate: [AuthGuard] },
  { path: 'placeedit/:placeId', component: PlaceCreateComponent, canActivate: [AuthGuard] },
  { path: 'auth', loadChildren: './auth/auth.module#AuthModule'},
  { path: 'map', component: MapComponent},
  { path: 'top10places', component: PlacestoptenComponent}
  // { path: 'home', component: HomeComponent}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class AppRoutingModule {}

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { TranslateModule } from '@ngx-translate/core';

import { TreeModule } from '@circlon/angular-tree-component';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { ButtonComponent } from './button/button.component';
import { IconComponent } from './icon/icon.component';
import { RibbonComponent } from './ribbon/ribbon.component';
import { SettingsComponent } from './settings/settings.component';
import { SvgDefinitionsComponent } from './icon/svg-definitions.component';

import { FiletypePipe } from './pipes/filetype.pipe';
import { SavePipe } from './pipes/save.pipe';
import { SearchPipe } from './pipes/search.pipe';
import { SortPipe } from './pipes/sort.pipe';
import { SubfolderPipe } from './pipes/subfolder.pipe';

@NgModule({
  declarations: [
    AppComponent,
    FiletypePipe,
    HomeComponent,
    ButtonComponent,
    IconComponent,
    RibbonComponent,
    SavePipe,
    SearchPipe,
    SettingsComponent,
    SortPipe,
    SubfolderPipe,
    SvgDefinitionsComponent
  ],
  imports: [
    AppRoutingModule,
    BrowserModule,
    CommonModule,
    FormsModule,
    HttpClientModule,
    TranslateModule.forRoot(),
    TreeModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}

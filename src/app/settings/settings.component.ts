import { Component, Input, Output, EventEmitter } from '@angular/core';
import { SettingsMetaGroup, SettingsMetaGroupLabels, SettingsButtonsType } from '../home/settings-buttons';
import { SupportedLanguage } from '../languages';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: [
    '../buttons.scss',
    '../settings.scss',
    // '../search-input.scss',
    './settings.component.scss'
  ]
})
export class SettingsComponent {

  @Output() changeLanguage = new EventEmitter<SupportedLanguage>();
  @Output() toggleButton = new EventEmitter<string>();

  @Input() settingTabToShow: number = 2;
  @Input() settingsButtons: SettingsButtonsType;

  settingsMetaGroup = SettingsMetaGroup;
  settingsMetaGroupLabels = SettingsMetaGroupLabels;

  appState: any = {
    language: 'de',
  };


  constructor() {}

  @Output() decreaseZoomLevel = new EventEmitter<any>();
  @Output() increaseZoomLevel = new EventEmitter<any>();
  @Output() resetZoomLevel = new EventEmitter<any>();
  @Output() toggleHideButton = new EventEmitter<any>();

  /**
   * Emit language change to parent component
   * @param lang
   */
  switchLanguage(lang: string): void {
    this.changeLanguage.emit(lang as SupportedLanguage);
  }

}

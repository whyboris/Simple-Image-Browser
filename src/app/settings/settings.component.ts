import { Component, Output, EventEmitter, ChangeDetectionStrategy, input } from '@angular/core';
import { SettingsMetaGroup, SettingsMetaGroupLabels, SettingsButtonsType } from '../home/settings-buttons';
import { SupportedLanguage } from '../languages';
import { IconComponent } from '../icon/icon.component';
import { ButtonComponent } from '../button/button.component';

@Component({
    selector: 'app-settings',
    templateUrl: './settings.component.html',
    imports: [ IconComponent, ButtonComponent ],
    styleUrls: [
        '../buttons.scss',
        '../settings.scss',
        // '../search-input.scss',
        './settings.component.scss'
    ],
    changeDetection: ChangeDetectionStrategy.Eager
})
export class SettingsComponent {

  @Output() changeLanguage = new EventEmitter<SupportedLanguage>();
  @Output() toggleButton = new EventEmitter<string>();

  readonly settingTabToShow = input<number>(2);
  readonly settingsButtons = input<SettingsButtonsType>();

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

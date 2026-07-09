import { Component, EventEmitter, Output, ChangeDetectionStrategy, input } from '@angular/core';
// import { buttonAnimation } from '../../common/animations';
import { SettingsButtonsType } from '../home/settings-buttons';
import { IconComponent } from '../icon/icon.component';

@Component({
    selector: 'app-ribbon',
    templateUrl: './ribbon.component.html',
    imports: [ IconComponent ],
    styleUrls: [
        '../buttons.scss',
        './ribbon.component.scss'
    ],
    changeDetection: ChangeDetectionStrategy.Eager
})
export class RibbonComponent {

  @Output() toggleButton = new EventEmitter<string>();

  readonly appState = input(undefined);
  readonly settingsButtons = input<SettingsButtonsType>();
  readonly settingsButtonsGroups = input(undefined);

  constructor() { }

}

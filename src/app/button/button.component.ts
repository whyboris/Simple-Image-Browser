import { Component, EventEmitter, Output, ChangeDetectionStrategy, input } from "@angular/core";

import { SettingsButtonKey, SettingsButtonsType } from "../home/settings-buttons";
import { IconComponent } from "../icon/icon.component";

@Component({
    selector: 'app-button',
    templateUrl: './button.component.html',
    imports: [ IconComponent ],
    styleUrls: [
        '../buttons.scss',
        './button.component.scss'
    ],
    changeDetection: ChangeDetectionStrategy.Eager
})
export class ButtonComponent {

  readonly button = input<SettingsButtonKey | string>(); // `| string` is temp

  readonly settingsButtons = input<SettingsButtonsType>();

  readonly neverDarkMode = input<boolean>();

  @Output() toggleButton = new EventEmitter<string>();

  constructor() { }
}

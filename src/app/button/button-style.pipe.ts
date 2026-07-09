import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'buttonStylePipe'
})
export class ButtonStylePipe implements PipeTransform {

  /**
   * Return object { styleName: boolean }
   * to be used with `[class]
   * @param toggled   - whether the button is toggled on/off
   * @param darkMode  - whether app is in dark mode
   * @param flatIcons - whether app uses flat icons
   */
  transform(toggled: boolean, darkMode: boolean, flatIcons: boolean): Object {

    return {
      flatSettingsButton:                flatIcons,
      flatSettingsButtonToggled:         flatIcons             && toggled,

      defaultSettingsButton:            !flatIcons,
      defaultSettingsButtonToggled:     !flatIcons             && toggled,

      defaultSettingsButtonDark:        !flatIcons && darkMode,
      defaultSettingsButtonDarkToggled: !flatIcons && darkMode && toggled
    }

  }

}

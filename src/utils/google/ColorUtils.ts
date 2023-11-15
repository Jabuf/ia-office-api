import { sheets_v4 } from 'googleapis'
import Schema$Color = sheets_v4.Schema$Color

export default abstract class ColorUtils {
  static getColorFromHex(hex: string): Schema$Color {
    return {
      red: parseInt(hex.slice(1, 3), 16) / 255.0,
      green: parseInt(hex.slice(3, 5), 16) / 255.0,
      blue: parseInt(hex.slice(5, 7), 16) / 255.0,
    }
  }

  static getRandomColorTheme(): ColorTheme {
    return colorsTheme[Math.round(Math.random() * (colorsTheme.length - 1))]
  }
}

export const colors = {
  white: ColorUtils.getColorFromHex('#ffffff'),
  black: ColorUtils.getColorFromHex('#000000'),
  redDark: ColorUtils.getColorFromHex('#CC4125'),
  redLight: ColorUtils.getColorFromHex('#E6B8AF'),
  greyDark: ColorUtils.getColorFromHex('#636676'),
  greyLight: ColorUtils.getColorFromHex('#C3C6D5'),
  blueDark: ColorUtils.getColorFromHex('#6D9EEB'),
  blueLight: ColorUtils.getColorFromHex('#C9DAF8'),
  violetDark: ColorUtils.getColorFromHex('#A48AD4'),
  violetLight: ColorUtils.getColorFromHex('#D9D2E9'),
  yellowDark: ColorUtils.getColorFromHex('#F1C232'),
  yellowLight: ColorUtils.getColorFromHex('#FFE599'),
  orangeDark: ColorUtils.getColorFromHex('#E69138'),
  orangeLight: ColorUtils.getColorFromHex('#F9CB9C'),
  greenDark: ColorUtils.getColorFromHex('#6AA84F'),
  greenLight: ColorUtils.getColorFromHex('#B6D7A8'),
  rubyDark: ColorUtils.getColorFromHex('#A64D79'),
  rubyLight: ColorUtils.getColorFromHex('#D5A6BD'),
  turquoiseDark: ColorUtils.getColorFromHex('#45818E'),
  turquoiseLight: ColorUtils.getColorFromHex('#D0E0E3'),
}

type ColorTheme = {
  backgroundColorHeader: Schema$Color
  foregroundColorHeader: Schema$Color
  backgroundColorRows: Schema$Color
  foregroundColorRows: Schema$Color
}

export const colorsTheme: ColorTheme[] = [
  {
    backgroundColorHeader: colors.redDark,
    foregroundColorHeader: colors.white,
    backgroundColorRows: colors.redLight,
    foregroundColorRows: colors.black,
  },
  {
    backgroundColorHeader: colors.greyDark,
    foregroundColorHeader: colors.white,
    backgroundColorRows: colors.greyLight,
    foregroundColorRows: colors.black,
  },
  {
    backgroundColorHeader: colors.blueDark,
    foregroundColorHeader: colors.white,
    backgroundColorRows: colors.blueLight,
    foregroundColorRows: colors.black,
  },
  {
    backgroundColorHeader: colors.violetDark,
    foregroundColorHeader: colors.white,
    backgroundColorRows: colors.violetLight,
    foregroundColorRows: colors.black,
  },
  {
    backgroundColorHeader: colors.yellowDark,
    foregroundColorHeader: colors.white,
    backgroundColorRows: colors.yellowLight,
    foregroundColorRows: colors.black,
  },
  {
    backgroundColorHeader: colors.orangeDark,
    foregroundColorHeader: colors.white,
    backgroundColorRows: colors.orangeLight,
    foregroundColorRows: colors.black,
  },
  {
    backgroundColorHeader: colors.greenDark,
    foregroundColorHeader: colors.white,
    backgroundColorRows: colors.greenLight,
    foregroundColorRows: colors.black,
  },
  {
    backgroundColorHeader: colors.rubyDark,
    foregroundColorHeader: colors.white,
    backgroundColorRows: colors.rubyLight,
    foregroundColorRows: colors.black,
  },
  {
    backgroundColorHeader: colors.turquoiseDark,
    foregroundColorHeader: colors.white,
    backgroundColorRows: colors.turquoiseLight,
    foregroundColorRows: colors.black,
  },
]

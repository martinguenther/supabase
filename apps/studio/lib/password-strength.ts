import { DEFAULT_MINIMUM_PASSWORD_STRENGTH, PASSWORD_STRENGTH } from 'lib/constants'

// [Alaister]: Lazy load zxcvbn to avoid bundling it with the main app (it's pretty chunky)
const zxcvbnImport = import('zxcvbn').then((module) => module.default)

export async function passwordStrength(value: string) {
  const zxcvbn = await zxcvbnImport

  let message: string = ''
  let warning: string = ''
  let strength: number = 0

  if (value && value !== '') {
    if (value.length > 99) {
      message = `${PASSWORD_STRENGTH[0]} Maximum length of password exceeded`
      warning = `Password should be less than 100 characters`
    } else {
      const result = zxcvbn(value)
      const resultScore = result?.score ?? 0

      const score = (PASSWORD_STRENGTH as any)[resultScore]
      const suggestions = result.feedback?.suggestions ? result.feedback.suggestions.join(' ') : ''

      message = `${score} ${suggestions}`
      strength = resultScore

      // warning message for anything below 4 strength :string
      if (resultScore < DEFAULT_MINIMUM_PASSWORD_STRENGTH) {
        warning = `${
          result?.feedback?.warning ? result?.feedback?.warning + '.' : ''
        } You need a stronger password.`
      }
    }
  }

  return {
    message,
    warning,
    strength,
  }
}

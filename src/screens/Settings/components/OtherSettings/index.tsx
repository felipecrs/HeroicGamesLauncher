import React, { ChangeEvent, useCallback, useContext } from 'react'

import { useTranslation } from 'react-i18next'
import ContextProvider from 'src/state/ContextProvider'
import {
  InfoBox,
  ToggleSwitch,
  SelectField,
  TextInputField,
  TextInputWithIconField
} from 'src/components/UI'
import CreateNewFolder from '@mui/icons-material/CreateNewFolder'
import { EnviromentVariable, Path } from 'src/types'
import Backspace from '@mui/icons-material/Backspace'
import { getGameInfo } from 'src/helpers'

import { ipcRenderer } from 'src/helpers'
import { TableInput } from 'src/components/UI/TableInput'

interface Props {
  audioFix: boolean
  isDefault: boolean
  isMacNative: boolean
  isLinuxNative: boolean
  languageCode: string
  launcherArgs: string
  canRunOffline: boolean
  offlineMode: boolean
  enviromentOptions: EnviromentVariable[]
  wrapperOptions: string
  primeRun: boolean
  addDesktopShortcuts: boolean
  addGamesToStartMenu: boolean
  discordRPC: boolean
  setLanguageCode: (value: string) => void
  setLauncherArgs: (value: string) => void
  setEnviromentOptions: (value: EnviromentVariable[]) => void
  setWrapperOptions: (value: string) => void
  setMaxRecentGames: (value: number) => void
  setTargetExe: (value: string) => void
  showFps: boolean
  showMangohud: boolean
  maxRecentGames: number
  toggleAudioFix: () => void
  toggleFps: () => void
  toggleMangoHud: () => void
  toggleOffline: () => void
  togglePrimeRun: () => void
  toggleUseGameMode: () => void
  toggleAddDesktopShortcuts: () => void
  toggleAddGamesToStartMenu: () => void
  toggleDiscordRPC: () => void
  targetExe: string
  useGameMode: boolean
  useSteamRuntime: boolean
  toggleUseSteamRuntime: () => void
  isProton: boolean
  appName: string
}

export default function OtherSettings({
  enviromentOptions,
  setEnviromentOptions,
  wrapperOptions,
  setWrapperOptions,
  useGameMode,
  toggleUseGameMode,
  showFps,
  toggleFps,
  canRunOffline,
  offlineMode,
  toggleOffline,
  languageCode,
  setLanguageCode,
  launcherArgs,
  setLauncherArgs,
  audioFix,
  toggleAudioFix,
  showMangohud,
  toggleMangoHud,
  isDefault,
  primeRun,
  togglePrimeRun,
  setMaxRecentGames,
  addDesktopShortcuts,
  addGamesToStartMenu,
  toggleAddDesktopShortcuts,
  toggleAddGamesToStartMenu,
  discordRPC,
  toggleDiscordRPC,
  maxRecentGames,
  setTargetExe,
  targetExe,
  isMacNative,
  isLinuxNative,
  toggleUseSteamRuntime,
  useSteamRuntime,
  isProton,
  appName
}: Props) {
  const handleWrapperOptions = (event: ChangeEvent<HTMLInputElement>) =>
    setWrapperOptions(event.currentTarget.value)
  const handleLauncherArgs = (event: ChangeEvent<HTMLInputElement>) =>
    setLauncherArgs(event.currentTarget.value)
  const handleLanguageCode = (event: ChangeEvent<HTMLInputElement>) =>
    setLanguageCode(event.currentTarget.value)
  const { t } = useTranslation()
  const { platform } = useContext(ContextProvider)
  const isWin = platform === 'win32'
  const isLinux = platform === 'linux'
  const supportsShortcuts = isWin || isLinux
  const shouldRenderFpsOption = !isMacNative && !isWin && !isLinuxNative
  const showSteamRuntime = isLinuxNative || isProton

  const info = (
    <InfoBox text="infobox.help">
      {t('help.other.part1')}
      <strong>{`${t('help.other.part2')} `}</strong>
      {t('help.other.part3')}
      <br />
      {!isDefault && (
        <span>
          {t('help.other.part4')}
          <strong>{t('help.other.part5')}</strong>
          {t('help.other.part6')}
          <strong>{` -nolauncher `}</strong>
          {t('help.other.part7')}
        </span>
      )}
    </InfoBox>
  )

  const languageInfo = (
    <InfoBox text="infobox.help">
      {t(
        'help.game_language.fallback',
        "Leave blank to use Heroic's language."
      )}
      <br />
      {t(
        'help.game_language.in_game_config',
        'Not all games support this configuration, some have in-game language setting.'
      )}
      <br />
      {t(
        'help.game_language.valid_codes',
        'Valid language codes are game-dependant.'
      )}
    </InfoBox>
  )

  const handleTargetExe = useCallback(async () => {
    if (!targetExe.length) {
      const gameinfo = await getGameInfo(appName)

      ipcRenderer
        .invoke('openDialog', {
          buttonLabel: t('box.select.button', 'Select'),
          properties: ['openFile'],
          title: t('box.select.exe', 'Select EXE'),
          defaultPath: gameinfo.install.install_path
        })
        .then(({ path }: Path) => setTargetExe(path || targetExe))
    }
    setTargetExe('')
  }, [targetExe])

  return (
    <>
      <h3 className="settingSubheader">{t('settings.navbar.other')}</h3>
      {!isDefault && (
        <TextInputWithIconField
          label={t(
            'setting.change-target-exe',
            'Select an alternative EXE to run'
          )}
          htmlId="setinstallpath"
          value={targetExe.replaceAll("'", '')}
          placeholder={targetExe || t('box.select.exe', 'Select EXE...')}
          onChange={(event) => setTargetExe(event.target.value)}
          icon={
            !targetExe.length ? (
              <CreateNewFolder data-testid="setinstallpathbutton" />
            ) : (
              <Backspace data-testid="setEpicSyncPathBackspace" />
            )
          }
          onIconClick={handleTargetExe}
        />
      )}

      {shouldRenderFpsOption && (
        <ToggleSwitch
          htmlId="showFPS"
          value={showFps}
          handleChange={toggleFps}
          title={t('setting.showfps')}
        />
      )}
      {isLinux && (
        <>
          <ToggleSwitch
            htmlId="gamemode"
            value={useGameMode}
            handleChange={toggleUseGameMode}
            title={t('setting.gamemode')}
          />
          <ToggleSwitch
            htmlId="primerun"
            value={primeRun}
            handleChange={togglePrimeRun}
            title={t('setting.primerun', 'Use Dedicated Graphics Card')}
          />
          <ToggleSwitch
            htmlId="audiofix"
            value={audioFix}
            handleChange={toggleAudioFix}
            title={t('setting.audiofix')}
          />
          <ToggleSwitch
            htmlId="mongohud"
            value={showMangohud}
            handleChange={toggleMangoHud}
            title={t('setting.mangohud')}
          />
          {showSteamRuntime && (
            <ToggleSwitch
              htmlId="steamruntime"
              value={useSteamRuntime}
              handleChange={toggleUseSteamRuntime}
              title={t('setting.steamruntime', 'Use Steam Runtime')}
            />
          )}
        </>
      )}
      {!isDefault && canRunOffline && (
        <ToggleSwitch
          htmlId="offlinemode"
          value={offlineMode}
          handleChange={toggleOffline}
          title={t('setting.offlinemode')}
        />
      )}
      {supportsShortcuts && isDefault && (
        <>
          <ToggleSwitch
            htmlId="shortcutsToDesktop"
            value={addDesktopShortcuts}
            handleChange={toggleAddDesktopShortcuts}
            title={t(
              'setting.adddesktopshortcuts',
              'Add desktop shortcuts automatically'
            )}
          />
          <ToggleSwitch
            htmlId="shortcutsToMenu"
            value={addGamesToStartMenu}
            handleChange={toggleAddGamesToStartMenu}
            title={t(
              'setting.addgamestostartmenu',
              'Add games to start menu automatically'
            )}
          />
        </>
      )}
      {isDefault && (
        <ToggleSwitch
          htmlId="discordRPC"
          value={discordRPC}
          handleChange={toggleDiscordRPC}
          title={t('setting.discordRPC', 'Enable Discord Rich Presence')}
        />
      )}
      {isDefault && (
        <SelectField
          label={t('setting.maxRecentGames', 'Recent Games to Show')}
          htmlId="setMaxRecentGames"
          extraClass="smaller"
          onChange={(event) => setMaxRecentGames(Number(event.target.value))}
          value={maxRecentGames.toString()}
        >
          {Array.from(Array(10).keys()).map((n) => (
            <option key={n + 1}>{n + 1}</option>
          ))}
        </SelectField>
      )}
      {!isWin && (
        <TableInput
          label={t('options.advanced.title')}
          htmlId={'enviromentOptions'}
          header={
            {
              key: t('options.advanced.key', 'Key'),
              value: t('options.advanced.vale', 'Value')
            } as EnviromentVariable
          }
          rows={enviromentOptions}
          onChange={(envs: EnviromentVariable[]) => {
            setEnviromentOptions([...envs])
          }}
          inputPlaceHolder={
            {
              key: t('options.advanced.placeHolderKey', 'ENVIORMENT'),
              value: t(
                'options.advanced.placeHolderKey',
                'E.g.: Path/To/ExtraFiles'
              )
            } as EnviromentVariable
          }
          afterInput={info}
        />
      )}
      {!isWin && (
        <TextInputField
          label={t('options.wrapper.title', 'Wrapper additional arguments')}
          htmlId="wrapperOptions"
          placeholder={t('options.wrapper.placeholder')}
          value={wrapperOptions}
          onChange={handleWrapperOptions}
          //afterInput={info} // Todo
        />
      )}
      {!isDefault && (
        <TextInputField
          label={t('options.gameargs.title')}
          htmlId="launcherArgs"
          placeholder={t('options.gameargs.placeholder')}
          value={launcherArgs}
          onChange={handleLauncherArgs}
          afterInput={info}
        />
      )}
      {!isDefault && (
        <TextInputField
          label={t(
            'setting.prefered_language',
            'Prefered Language (Language Code)'
          )}
          htmlId="prefered-language"
          placeholder={t(
            'placeholder.prefered_language',
            '2-char code (i.e.: "en" or "fr")'
          )}
          value={languageCode}
          onChange={handleLanguageCode}
          afterInput={languageInfo}
        />
      )}
    </>
  )
}

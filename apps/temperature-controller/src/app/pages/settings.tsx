import React, { useCallback, useEffect, useState } from 'react';
import { ConfigurationResult } from '@temperature-controller/api-interfaces';
import Temperature from '../temperature';
import TemperatureInput from '../temperature-input';
import SecondInput from '../second-input';

async function getSettings() {
  return await fetch(`/api/settings`);
}

async function saveSettings(settings: ConfigurationResult) {
  return await fetch(`/api/settings`, {
    method: 'POST',
    body: JSON.stringify(settings),
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  });
}

export const Settings = () => {
  const [settings, setSettings] = useState<ConfigurationResult>();
  useEffect(() => {
    (async function () {
      setSettings(await (await getSettings()).json());
    })();
  }, []);
  const setSettingsProperty = useCallback(
    function <T extends keyof ConfigurationResult>(
      key: T,
      value: ConfigurationResult[T]
    ) {
      setSettings({
        ...settings,
        [key]: value,
      });
    },
    [settings, setSettings]
  );
  return (
    <>
      <Temperature />
      <TemperatureInput
        temperature={settings?.hysteresis}
        setTemperature={(value: number) =>
          setSettingsProperty('hysteresis', value)
        }
        title="Hys"
      />
      <TemperatureInput
        temperature={settings?.level1Temperature}
        setTemperature={(value: number) =>
          setSettingsProperty('level1Temperature', value)
        }
        title="1. szint"
      />
      <TemperatureInput
        temperature={settings?.level2Temperature}
        setTemperature={(value: number) =>
          setSettingsProperty('level2Temperature', value)
        }
        title="2. szint"
      />
      <SecondInput
        second={settings?.minimumOnTime}
        setSecond={(value: number) =>
          setSettingsProperty('minimumOnTime', value)
        }
        title="min Be"
      />
      <SecondInput
        second={settings?.minimumOffTime}
        setSecond={(value: number) =>
          setSettingsProperty('minimumOffTime', value)
        }
        title="min Ki"
      />
      <button onClick={() => saveSettings(settings)} className="primary">
        Mentés
      </button>
    </>
  );
};

export default Settings;

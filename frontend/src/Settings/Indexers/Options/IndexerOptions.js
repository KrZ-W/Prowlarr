import PropTypes from 'prop-types';
import React from 'react';
import FieldSet from 'Components/FieldSet';
import FormGroup from 'Components/Form/FormGroup';
import FormInputGroup from 'Components/Form/FormInputGroup';
import FormLabel from 'Components/Form/FormLabel';
import { inputTypes } from 'Helpers/Props';
import translate from 'Utilities/String/translate';

function IndexerOptions(props) {
  const {
    advancedSettings,
    settings,
    onInputChange
  } = props;

  const {
    indexerCooldownPeriods
  } = settings;

  if (!advancedSettings) {
    return null;
  }

  return (
    <FieldSet legend={translate('Options')}>
      <FormGroup
        advancedSettings={advancedSettings}
        isAdvanced={true}
      >
        <FormLabel>{translate('IndexerCooldownPeriods')}</FormLabel>

        <FormInputGroup
          type={inputTypes.TEXT}
          name="indexerCooldownPeriods"
          placeholder="0,1,5,15,30,60,180,360,720,1440"
          helpText={translate('IndexerCooldownPeriodsHelpText')}
          onChange={onInputChange}
          {...indexerCooldownPeriods}
        />
      </FormGroup>
    </FieldSet>
  );
}

IndexerOptions.propTypes = {
  advancedSettings: PropTypes.bool.isRequired,
  settings: PropTypes.object.isRequired,
  onInputChange: PropTypes.func.isRequired
};

export default IndexerOptions;

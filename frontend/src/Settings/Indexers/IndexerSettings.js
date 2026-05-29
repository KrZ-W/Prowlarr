import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import Alert from 'Components/Alert';
import Form from 'Components/Form/Form';
import LoadingIndicator from 'Components/Loading/LoadingIndicator';
import PageContent from 'Components/Page/PageContent';
import PageContentBody from 'Components/Page/PageContentBody';
import { kinds } from 'Helpers/Props';
import SettingsToolbarConnector from 'Settings/SettingsToolbarConnector';
import { clearPendingChanges } from 'Store/Actions/baseActions';
import { fetchIndexerOptions, saveIndexerOptions, setIndexerOptionsValue } from 'Store/Actions/settingsActions';
import createSettingsSectionSelector from 'Store/Selectors/createSettingsSectionSelector';
import translate from 'Utilities/String/translate';
import IndexerProxiesConnector from './IndexerProxies/IndexerProxiesConnector';
import IndexerOptions from './Options/IndexerOptions';

const SECTION = 'indexerOptions';

class IndexerSettings extends Component {

  //
  // Lifecycle

  componentDidMount() {
    this.props.fetchIndexerOptions();
  }

  componentWillUnmount() {
    this.props.clearPendingChanges({ section: `settings.${SECTION}` });
  }

  //
  // Listeners

  onInputChange = ({ name, value }) => {
    this.props.setIndexerOptionsValue({ name, value });
  };

  onSavePress = () => {
    this.props.saveIndexerOptions();
  };

  //
  // Render

  render() {
    const {
      advancedSettings,
      isFetching,
      isPopulated,
      error,
      settings,
      hasSettings,
      ...otherProps
    } = this.props;

    return (
      <PageContent title={translate('Indexers')}>
        <SettingsToolbarConnector
          {...otherProps}
          onSavePress={this.onSavePress}
        />

        <PageContentBody>
          {
            isFetching && !isPopulated &&
              <LoadingIndicator />
          }

          {
            !isFetching && error &&
              <Alert kind={kinds.DANGER}>
                {translate('UnableToLoadIndexerOptions')}
              </Alert>
          }

          {
            hasSettings && isPopulated && !error &&
              <Form
                id="indexerOptions"
                {...otherProps}
              >
                <IndexerOptions
                  advancedSettings={advancedSettings}
                  settings={settings}
                  onInputChange={this.onInputChange}
                />
              </Form>
          }

          <IndexerProxiesConnector />
        </PageContentBody>
      </PageContent>
    );
  }
}

IndexerSettings.propTypes = {
  advancedSettings: PropTypes.bool.isRequired,
  isFetching: PropTypes.bool.isRequired,
  isPopulated: PropTypes.bool.isRequired,
  error: PropTypes.object,
  settings: PropTypes.object.isRequired,
  hasSettings: PropTypes.bool.isRequired,
  fetchIndexerOptions: PropTypes.func.isRequired,
  saveIndexerOptions: PropTypes.func.isRequired,
  setIndexerOptionsValue: PropTypes.func.isRequired,
  clearPendingChanges: PropTypes.func.isRequired
};

function createMapStateToProps() {
  return createSelector(
    (state) => state.settings.advancedSettings,
    createSettingsSectionSelector(SECTION),
    (advancedSettings, sectionSettings) => {
      return {
        advancedSettings,
        ...sectionSettings
      };
    }
  );
}

const mapDispatchToProps = {
  fetchIndexerOptions,
  saveIndexerOptions,
  setIndexerOptionsValue,
  clearPendingChanges
};

export default connect(createMapStateToProps, mapDispatchToProps)(IndexerSettings);

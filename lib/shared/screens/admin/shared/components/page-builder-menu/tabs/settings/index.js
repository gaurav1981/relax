import * as pageBuilderActions from 'actions/page-builder';

import bind from 'decorators/bind';
import Component from 'components/component';
import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import Settings from './settings';

@connect(
  (state) => ({
    selectedId: state.pageBuilder.selectedId,
    selectedElement: state.pageBuilder.selectedElement,
    type: state.pageBuilder.type,
    elements: state.pageBuilder.elements,
    display: state.display,
    contentElementId: state.pageBuilder.data && state.pageBuilder.data.content
  }),
  (dispatch) => ({
    pageBuilderActions: bindActionCreators(pageBuilderActions, dispatch)
  })
)
export default class SettingsTabContainer extends Component {
  static propTypes = {
    pageBuilderActions: PropTypes.object.isRequired,
    selectedId: PropTypes.string
  };

  @bind
  duplicate () {
    const {selectedId} = this.props;
    const {duplicateElement} = this.props.pageBuilderActions;
    duplicateElement(selectedId);
  }

  @bind
  remove () {
    const {removeElement} = this.props.pageBuilderActions;
    const {selectedId} = this.props;
    removeElement(selectedId);
  }

  render () {
    return (
      <Settings
        {...this.props}
        duplicate={this.duplicate}
        remove={this.remove}
      />
    );
  }
}

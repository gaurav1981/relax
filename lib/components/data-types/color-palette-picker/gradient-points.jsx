import cx from 'classnames';
import React, {PropTypes} from 'react';
import {Component} from 'relax-framework';

import utils from '../../../utils';
import {applyBackground, getColorString} from '../../../helpers/colors';

export default class GradientPoints extends Component {

  static propTypes = {
    editingPoint: PropTypes.number.isRequired,
    value: PropTypes.object.isRequired,
    colors: PropTypes.array.isRequired,
    changeEditingPoint: PropTypes.func.isRequired,
    pointPercChange: PropTypes.func.isRequired,
    addPoint: PropTypes.func.isRequired,
    removePoint: PropTypes.func.isRequired
  }

  constructor (props, children) {
    super(props, children);
    this.onMouseUpListener = this.onMouseUp.bind(this);
    this.onMouseMoveListener = this.onMouseMove.bind(this);
  }

  componentWillUnmount () {
    document.removeEventListener('mouseup', this.onMouseUpListener);
    document.removeEventListener('mousemove', this.onMouseMoveListener);
  }

  onMouseDown (index, event) {
    event.preventDefault();
    event.stopPropagation();

    this.activePoint = index;

    document.addEventListener('mouseup', this.onMouseUpListener);
    document.addEventListener('mousemove', this.onMouseMoveListener);
  }

  onMouseMove (event) {
    event.preventDefault();

    const bounds = utils.getOffsetRect(this.refs.bar);
    const perc = utils.limitNumber((event.pageX - bounds.left) / bounds.width, 0, 1);

    if (this.props.value.points.length > 2) {
      const verticalOffset = Math.abs(event.pageY - bounds.top);

      if (verticalOffset > 50) {
        this.activePointDelete = true;
      } else {
        this.activePointDelete = false;
      }
    }

    this.props.pointPercChange(this.activePoint, Math.round(perc * 100));
  }

  onMouseUp (event) {
    event.preventDefault();
    event.stopPropagation();
    this.componentWillUnmount();
    if (this.activePointDelete) {
      this.activePointDelete = false;
      this.props.removePoint(this.activePoint);
    }
  }

  markerClicked (number, event) {
    event.preventDefault();
    event.stopPropagation();
    this.props.changeEditingPoint(number);
  }

  addPoint (event) {
    const bounds = utils.getOffsetRect(this.refs.bar);
    const perc = utils.limitNumber((event.pageX - bounds.left) / bounds.width, 0, 1);

    this.props.addPoint(Math.round(perc * 100));
  }

  render () {
    const gradStyle = {};
    applyBackground(gradStyle, Object.assign({}, this.props.value, {angle: 0}), this.props.colors);

    return (
      <div className='gradient-points-wraper'>
        <div className='gradient-points' ref='bar' onClick={::this.addPoint}>
          <div className='color-grad' style={gradStyle} />
          {this.props.value.points.map(this.renderPoint, this)}
        </div>
      </div>
    );
  }

  renderPoint (colorObj, index) {
    const markerStyle = {
      left: colorObj.perc + '%',
      transform: `translate(${-colorObj.perc}%, -50%)`
    };
    const selected = this.props.editingPoint === index;
    if (selected) {
      markerStyle.backgroundColor = getColorString(colorObj, this.props.colors);
    }
    if (this.activePoint === index && this.activePointDelete) {
      markerStyle.visibility = 'hidden';
    }

    return (
      <span className={cx('marker', selected && 'selected')} style={markerStyle} key={index} onClick={this.markerClicked.bind(this, index)} onMouseDown={this.onMouseDown.bind(this, index)} />
    );
  }
}

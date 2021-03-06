import classic from 'ember-classic-decorator';
import { classNames } from '@ember-decorators/component';
import { action, computed } from '@ember/object';
import Component from '@ember/component';
import { forOwn } from 'lodash-es';
import moment from 'moment';
import { pascalCase } from 'open-event-frontend/utils/string';

@classic
@classNames('column')
export default class EventCard extends Component {
  @computed('event.type', 'event.topic', 'event.subTopic')
  get tags() {
    // Unfortunately, due to the extremely dynamic and stringy nature
    // of ember, the next line crashes on using object destructuring
    // and we don't have time and resources to chase down issues originating
    // from ember core, hence disabling the lint
    const tagsOriginal = this.getProperties('event.topic.name', 'event.type.name', 'event.subTopic.name');  // eslint-disable-line ember/no-get
    const tags = [];
    forOwn(tagsOriginal, value => {
      if (value && value.trim() !== '') {
        tags.push(`#${pascalCase(value)}`);
      }
    });
    return tags;
  }

  @computed
  get eventClass() {
    return this.isWide ? 'thirteen wide computer ten wide tablet sixteen wide mobile column ' + (!this.device.isMobile && 'rounded-l-none') : 'event fluid';
  }

  @action
  selectCategory(category, subCategory) {
    this.set('category', (category === this.category && !subCategory) ? null : category);
    this.set('subCategory', (!subCategory || subCategory === this.subCategory) ? null : subCategory);
  }

  @action
  selectEventType(eventType) {
    this.set('eventType', eventType === this.eventType ? null : eventType);
  }

  @computed('event.startsAt', 'event.endsAt')
  get isSingleDay() {
    return moment(this.event.startsAt).isSame(this.event.endsAt, 'day');
  }
}

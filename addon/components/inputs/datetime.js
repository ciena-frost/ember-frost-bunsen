import AbstractInput from './abstract-input'
import layout from 'ember-frost-bunsen/templates/components/frost-bunsen-input-datetime'
import Ember from 'ember'
import { Format, setTime, validateTime } from 'ember-frost-date-picker'
import moment from 'moment'

export default AbstractInput.extend({

    // == Component Properties ===================================================

    classNameBindings: ['value:frost-bunsen-has-value'],

    classNames: [
        'frost-bunsen-input-datetime',
        'frost-field'
    ],

    layout,

    dateTimeValue: moment().subtract(1, 'day').subtract(1, 'hour').format(Format.dateTime),
    dateTimeValueInvalid: false,

    // == Actions ===============================================================

    actions: {

        onDateTimeChange(dateTimeValue) {

            const momentDateTimeValue = moment(dateTimeValue)
            if (!momentDateTimeValue.isValid()) {
                this.set('dateTimeValueInvalid', true)
                return 
            }

            //Comment this  else statment out if using with validation. 
            else {
                this.send('handleChange', dateTimeValue)
            }

            // Example just to show validation - any date after 2015-01-01T10:00:00-00:00 is valid. Uncomment to use.
            // const dateTimeValueInvalid = momentDateTimeValue.isBefore(moment('2015-01-01T10:00:00-00:00'))
            // this.setProperties({
            //     dateTimeValue,
            //     dateTimeValueInvalid
            // })
            // if (!dateTimeValueInvalid) {
            //     this.send('handleChange', dateTimeValue)
            // }
        },

    }

})



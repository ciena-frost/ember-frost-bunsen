import AbstractInput from './abstract-input'
import layout from 'ember-frost-bunsen/templates/components/frost-bunsen-input-datetime'
import Ember from 'ember'
import computed, {readOnly} from 'ember-computed-decorators'
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

    // == Computed Properties ====================================================

    /**
    * Handles change in value. If there is a value set by the form it will take that value, else it will display a sample date. 
    */
    @computed('value')
    dateTimeValue(value){
        if(value!=undefined){
            return moment(value).format(Format.dateTime)
        }
        return moment().subtract(1, 'day').subtract(1, 'hour').format(Format.dateTime)  
    },

     @computed('value')
     dateTimeValueInvalid () {
        return false
     },

    // == Actions ===============================================================

    actions: {

        onDateTimeChange(dateTimeValue) {
            const momentDateTimeValue = moment(dateTimeValue)
            if (!momentDateTimeValue.isValid()) {
                this.set('dateTimeValueInvalid', true)
                return 
            }
            this.send('handleChange', dateTimeValue)
        },
    }

})



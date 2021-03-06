/*
 * Copyright (C) eZ Systems AS. All rights reserved.
 * For full copyright and license information view LICENSE file distributed with this source code.
 */
YUI.add('ez-time-editview', function (Y) {
    "use strict";
    /**
     * Provides the field edit view for the time fields
     *
     * @module ez-time-editview
     */

    Y.namespace('eZ');

    var FIELDTYPE_IDENTIFIER = 'eztime';

    /**
     * Time edit view
     *
     * @namespace eZ
     * @class timeEditView
     * @constructor
     * @extends eZ.FieldEditView
     */
    Y.eZ.TimeEditView = Y.Base.create('timeEditView', Y.eZ.FieldEditView, [], {
        events: {
            '.ez-time-input-ui input': {
                'blur': 'validate',
                'valuechange': 'validate',
            }
        },

        /**
         * Validates the current input of time field
         *
         * @method validate
         */
        validate: function () {
            var validity = this._getInputValidity();

            if ( validity.valueMissing ) {
                this.set('errorStatus', 'This field is required');
            } else if ( validity.badInput ) {
                this.set('errorStatus', 'This is not a valid input');
            } else {
                this.set('errorStatus', false);
            }
        },

        /**
         * Defines the variables to import in the field edit template for time
         *
         * @protected
         * @method _variables
         * @return {Object} {Object} holding the variables for the template
         */
        _variables: function () {
            var def = this.get('fieldDefinition'),
                field = this.get('field'),
                time = '';

            if ( field && field.fieldValue ) {
                time =  Y.Date.format(new Date(field.fieldValue * 1000), {format:"%T"});
            }

            return {
                "isRequired": def.isRequired,
                "html5InputTime": time,
                "useSeconds": def.fieldSettings.useSeconds
            };
        },

        /**
         * Returns the time input node of the time template
         *
         *
         * @protected
         * @method _getInputNode
         * @return {Y.Node}
         */
        _getInputNode: function () {
            return this.get('container').one('.ez-time-input-ui input');
        },

        /**
         * Returns the input validity state object for the input generated by
         * the time template
         *
         * See https://developer.mozilla.org/en-US/docs/Web/API/ValidityState
         *
         * @protected
         * @method _getInputValidity
         * @return {ValidityState}
         */
        _getInputValidity: function () {
            return this._getInputNode().get('validity');
        },

        /**
         * Returns the currently filled time value
         *
         * @protected
         * @method _getFieldValue
         * @return {Number}
         */
        _getFieldValue: function () {
            var valueOfInput = this._getInputNode().get('valueAsNumber');

            if (valueOfInput) {
                return valueOfInput/1000;
            }
            return null;
        },
    });

    Y.eZ.FieldEditView.registerFieldEditView(FIELDTYPE_IDENTIFIER, Y.eZ.TimeEditView);
});

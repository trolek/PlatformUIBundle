YUI.add('ez-fieldeditview-tests', function (Y) {
    var container = Y.one('.container'),
        content, contentType,
        jsonContent = {}, jsonContentType = {},
        fieldDefinition = {},
        field = {},
        viewTest, customViewTest, registryTest;

    content = new Y.Mock();
    contentType = new Y.Mock();
    Y.Mock.expect(content, {
        method: 'toJSON',
        returns: jsonContent
    });
    Y.Mock.expect(contentType, {
        method: 'toJSON',
        returns: jsonContentType
    });

    viewTest = new Y.Test.Case({
        name: "eZ Field Edit View test",

        setUp: function () {
            this.view = new Y.eZ.FieldEditView({
                container: container,
                fieldDefinition: fieldDefinition,
                field: field,
                content: content,
                contentType: contentType
            });
        },

        tearDown: function () {
            this.view.destroy();
        },

        "Test render": function () {
            var templateCalled = false,
                origTpl;

            origTpl = this.view.template;
            this.view.template = function () {
                templateCalled = true;
                return origTpl.apply(this, arguments);
            };
            this.view.render();
            Y.Assert.isTrue(templateCalled, "The template has not been used");
            Y.Mock.verify(content);
            Y.Mock.verify(contentType);
        },

        "Test available variable in template": function () {
            this.view.template = function (variables) {
                Y.Assert.isObject(variables, "The template should receive some variables");
                Y.Assert.areEqual(4, Y.Object.keys(variables).length, "The template should receive 4 variables");

                Y.Assert.areSame(
                     jsonContent, variables.content,
                    "The content should be available in the field edit view template"
                );
                Y.Assert.areSame(
                    jsonContentType, variables.contentType,
                    "The contentType should be available in the field edit view template"
                );
                Y.Assert.areSame(
                    fieldDefinition, variables.fieldDefinition,
                    "The fieldDefinition should be available in the field edit view template"
                );
                Y.Assert.areSame(
                    field, variables.field,
                    "The field should be available in the field edit view template"
                );
                return '';
            };
            this.view.render();
        },

        "Test error handling": function () {
            var defaultContent = 'default content';

            this.view.render();
            this.view.set('errorStatus', true);

            Y.Assert.isTrue(
                container.hasClass('is-error'),
                "Should set the is-error class on the container when there's an error"
            );
            Y.Assert.areEqual(
                defaultContent,
                container.one('.ez-editfield-error-message').getContent(),
                "Should keep the error placeholder content"
            );

            this.view.set('errorStatus', false);
            Y.Assert.isFalse(
                container.hasClass('is-error'),
                "Should unset the is-error class on the container when there's no error"
            );
            Y.Assert.areEqual(
                defaultContent,
                container.one('.ez-editfield-error-message').getContent(),
                "Should keep the error placeholder content when getting back to the normal state"
            );

        },


        "Test error message handling": function () {
            var msg = 'Error message',
                defaultContent = 'default content';

            this.view.render();
            this.view.set('errorStatus', msg);

            Y.Assert.isTrue(
                container.hasClass('is-error'),
                "Should set the is-error class on the container when there's an error"
            );
            Y.Assert.areEqual(
                msg,
                container.one('.ez-editfield-error-message').getContent(),
                "Should set the error message in .ez-editfield-error-message element"
            );

            this.view.set('errorStatus', false);
            Y.Assert.isFalse(
                container.hasClass('is-error'),
                "Should unset the is-error class on the container when there's no error"
            );
            Y.Assert.areEqual(
                defaultContent,
                container.one('.ez-editfield-error-message').getContent(),
                "Should restore the error placeholder content"
            );

        },

        "Test isValid": function () {
            this.view.set('errorStatus', false);
            Y.Assert.isTrue(this.view.isValid(), "No error, isValid should return true");

            this.view.set('errorStatus', true);
            Y.Assert.isFalse(this.view.isValid(), "isValid should return false");

            this.view.set('errorStatus', "Error message");
            Y.Assert.isFalse(this.view.isValid(), "isValid should return false");
        },

    });

    customViewTest = new Y.Test.Case({
        name: "Custom eZ Field Edit View test",

        setUp: function () {
            var CustomView = Y.Base.create('customView', Y.eZ.FieldEditView, [], {
                _variables: function () {
                    return {
                        'foo': 'bar',
                        'ez': 'publish'
                    };
                }
            });
            this.view = new CustomView({
                container: container,
                fieldDefinition: fieldDefinition,
                field: field,
                content: content,
                contentType: contentType
            });
        },

        tearDown: function () {
            this.view.destroy();
        },

        "Test available variable in template": function () {
            this.view.template = function (variables) {
                Y.Assert.isObject(variables, "The template should receive some variables");
                Y.Assert.areEqual(6, Y.Object.keys(variables).length, "The template should receive 6 variables");

                Y.Assert.areSame(
                     jsonContent, variables.content,
                    "The content should be available in the field edit view template"
                );
                Y.Assert.areSame(
                    jsonContentType, variables.contentType,
                    "The contentType should be available in the field edit view template"
                );
                Y.Assert.areSame(
                    fieldDefinition, variables.fieldDefinition,
                    "The fieldDefinition should be available in the field edit view template"
                );
                Y.Assert.areSame(
                    field, variables.field,
                    "The field should be available in the field edit view template"
                );

                Y.Assert.areEqual(
                    'bar', variables.foo,
                    "The bar variable should be available"
                );
                Y.Assert.areEqual(
                    'publish', variables.ez,
                    "The ez variable should be available"
                );
                return '';
            };
            this.view.render();
        },
    });

    registryTest = new Y.Test.Case({
        name: "eZ Field Edit View registry test",

        "Test register and get": function () {
            var editView = function () { },
                identifier = 'ez-foo-bar-edit-view',
                err = false;

            Y.eZ.FieldEditView.registerFieldEditView(identifier, editView);
            try {
                Y.Assert.areSame(
                    editView, 
                    Y.eZ.FieldEditView.getFieldEditView(identifier),
                    "Should return the constructor function of the edit view"
                );
            } catch(e) {
                err = true;
            }

            Y.Assert.isFalse(err, "No error should have been thrown");
        },

        "Test inexistant field edit view": function () {
            var err = false, exception = false;

            try {
                Y.eZ.FieldEditView.getFieldEditView('ez-does-not-exist');
            } catch(e) {
                exception = e;
                err = true;
            }

            Y.Assert.isTrue(err, "An error should have been thrown");
            Y.Assert.isInstanceOf(TypeError, exception, "Shoud throw a TypeError");
        },

        "Test register wrong type": function () {
            var err = false, exception = false;

            Y.eZ.FieldEditView.registerFieldEditView('ez-wrong-type', 'wrongtype');
            try {
                Y.eZ.FieldEditView.getFieldEditView('ez-wrong-type');
            } catch(e) {
                exception = e;
                err = true;
            }

            Y.Assert.isTrue(err, "An error should have been thrown");
            Y.Assert.isInstanceOf(TypeError, exception, "Shoud throw a TypeError");
        }
    });

    Y.Test.Runner.setName("eZ Field Edit View tests");
    Y.Test.Runner.add(viewTest);
    Y.Test.Runner.add(customViewTest);
    Y.Test.Runner.add(registryTest);

}, '0.0.1', {requires: ['test', 'ez-fieldeditview']});
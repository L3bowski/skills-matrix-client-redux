(function() {
    var htmlNodes = {
        loader : $('#loader'),
        elementId : $('#model-id'),
        readOnly : $('#read-only'),
        pageTitle : $('#page-title'),
        elementName : $('#model-name'),
        employeesList : $('#employees-list'),
        addEmployeesKeywords : $('#add-employees-keywords'),
        addEmployeesLoader : $('#add-employees-loader'),
        addEmployeesList : $('#add-employees-list'),
        editButton : $('#edit-button'),
        deleteButton : $('#delete-button'),
        saveButton : $('#save-button'),
        cancelButton : $('#cancel-button')
    };

    var updaters = {
        readOnly: function(state) {
            htmlNodes.addEmployeesKeywords.hide();
            htmlNodes.addEmployeesList.hide();
            htmlNodes.editButton.hide();
            htmlNodes.editButton.attr('href', '#');
            htmlNodes.deleteButton.hide();
            htmlNodes.pageTitle.text('Skill not found');            
            htmlNodes.saveButton.hide();
            htmlNodes.cancelButton.hide();
            htmlNodes.cancelButton.attr('href', '#');

            if (state.readOnly) {
                htmlNodes.elementName.attr('disabled', 'disabled');
                if (state.skill.Id > 0) {
                    htmlNodes.pageTitle.text(state.skill.Name);
                    htmlNodes.editButton.attr('href', '/skills/edit?id=' + state.skill.Id);
                    htmlNodes.editButton.show();
                    htmlNodes.deleteButton.show();
                }
            }
            else {
                htmlNodes.elementName.removeAttr('disabled');                
                if (state.skill.Id >= 0) {
                    htmlNodes.pageTitle.text('New skill');
                    htmlNodes.addEmployeesKeywords.show();
                    htmlNodes.addEmployeesList.show();
                    htmlNodes.saveButton.show();
                    htmlNodes.cancelButton.show();
                    htmlNodes.cancelButton.attr('href', '/skills/');

                    if (state.skill.Id > 0) {
                        htmlNodes.pageTitle.text(state.skill.Name);
                        htmlNodes.cancelButton.attr('href', '/skills/details?id=' + state.skill.Id);
                    }
                }
            }

            updaters.skillEmployees(state);
        },
        skillName: function(state) {
            htmlNodes.elementName.val(state.skill.Name);
        },
        skillEmployees: function(state) {
            htmlNodes.employeesList.empty();
            if (state.skill.Employees.length === 0) {
                htmlNodes.employeesList.append('<i>No employees assigned yet</i>');
            }
            for (var key in state.skill.Employees) {
                var employee = state.skill.Employees[key];
                var html = '<li class="list-group-item"><a class="reset" href="/employees/details?id=' + employee.Id + '">' + employee.Name + '</a></li>';
                if (!state.readOnly) {
                    html = '<li class="list-group-item remove-employee" data-employee-id="' + employee.Id + '"><i class="fa fa-times text-danger"></i> '
                    + employee.Name + '</li>';
                }
                htmlNodes.employeesList.append(html);
            }
        }
    };

    function updateAll(state) {
        for (var key in updaters) {
            var updater = updaters[key];
            updater(state);
        }
    }

    window.application = window.application || {};
    window.application.skill = window.application.skill || {};
    window.application.skill.htmlNodes = htmlNodes;
    window.application.skill.updaters = updaters;
    window.application.skill.updateAll = updateAll;
})();

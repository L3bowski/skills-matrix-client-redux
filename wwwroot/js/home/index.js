(function(js, ajax, paginatedList) {

    var state = {
        employees: paginatedList.getState(),
        skills: paginatedList.getState()
    };

    var htmlNodes = {
        employeesList:  paginatedList.getHtmlNodes('employees'),
        skillsList:  paginatedList.getHtmlNodes('skills')
    };

    function render() {
        // State would be retrieved from the store in Redux
        paginatedList.render(htmlNodes.employeesList, state.employees, {
            elementDrawer: function (employee) {
                return '<li class="list-group-item"><a class="reset" href="/employees/details?id=' + employee.Id + '">' + employee.Name +
                '<span class="badge floating">' + employee.Skills.length + '</span></a></li>';
            },
            noResultsHtml: '<i>No employees found</i>'
        });
        paginatedList.render(htmlNodes.skillsList, state.skills, {
            elementDrawer: function (skill) {
                return '<li class="list-group-item"><a class="reset" href="/skills/details?id=' + skill.Id + '">' + skill.Name +
                '<span class="badge floating">' + skill.Employees.length + '</span></a></li>';
            },
            noResultsHtml: '<i>No skills found</i>'
        });
    }

    //Actions
    function initialize(state) {
        state.employees.loadPhase = 'loading';
        state.skills.loadPhase = 'loading';
        render();

        js.stallPromise(ajax.get('/api/employee/getMostSkilled', {}, []), 1000)
        .then(function(employees) {
            state.employees.loadPhase = 'loaded';
            state.employees.results = employees;
            render();
        });

        js.stallPromise(ajax.get('/api/skill/getRearest', {}, []), 1000)
        .then(function(skills) {
            state.skills.loadPhase = 'loaded';
            state.skills.results = skills;
            render();
        });
    }

    $().ready(function(event) {
        initialize(state);
    });

})(JsCommons, Ajax, PaginatedList);
